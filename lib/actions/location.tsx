'use server'
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { Location, RequestSubscription } from "@/types/location/type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RequestSubscriptionSchema } from "@/types/location/schema";
import { z } from "zod";
import { FormResponse } from "@/types/types";
import { createClient } from "../supabase/server";

// interface Profiles {
//     id: string;
//     email: string;
//     first_name?: string;
//     last_name?: string;
//     phone?: string;
// }
// interface RequestSubscriptionWithUser extends RequestSubscription {
//     profile: Profiles;
// }
export const fetchAllLocation = async (): Promise<Location[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/locations/all");
        return parseStringify(data);

    } catch (error) {

        throw error;
    }
}

export const getLocation = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/locations/all/${id}`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}   

export const deleteLocation = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        await apiClient.delete(`/api/locations/delete?id=${id}`);
    } catch (error) {
        throw error;
    }
    revalidatePath("/locations")
    redirect("/locations")
}

export const getLocationSubscriptionPayments = async (id: string, page:number = 0, size:number = 10) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.post(`/api/subscription-payments/${id}`, {page,size});
      
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}

export const getActiveSubscription = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/location-subscriptions/${id}/active`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}

export const getLocationSummary = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/reports/${id}/statistics`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}

export const getLocationActivityLogs = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/reports/${id}/latest-creation-dates`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}

export const requestSubscription = async (
    request: z.infer<typeof RequestSubscriptionSchema>,
): Promise<FormResponse> => {
    const validRequest = RequestSubscriptionSchema.safeParse(request);
    console.log("The valid request", validRequest )
    if (!validRequest.success) {
        return parseStringify({
            responseType:"error",
            message:"Please fill all the fields before submitting",
            error: new Error(validRequest.error.message),
            status:400
        })
    }
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("User not found");
        }
        const authUserId = user.id;
        const subscriptionData = {
            reference: validRequest.data.reference,
            quantity: validRequest.data.quantity,
            description: validRequest.data.description,
            payment_type: validRequest.data.payment_type,
            location: validRequest.data.location,
            location_name: validRequest.data.location_name,
            phone: validRequest.data.phone,
            email: validRequest.data.email,
            packageId: validRequest.data.packageId,
            user_id: authUserId,
            status: "pending",
        };

        console.log("The subscription data", subscriptionData)
        
        const { error } = await supabase
        .from('internal_location_subscriptions')
        .insert([subscriptionData]);

        if (error) {
            console.error("Request subscription error:", error );
            return parseStringify({
                responseType:"error",
                message:"Subscription request failed",
                error: new Error(error.message),
                status:400
            })
        }

        return parseStringify({
            responseType:"success",
            message:"Subscription request sent successfully",
            status:200
        })
    } catch (error) {
        throw error;
    }
}

export const fetchAllRequestSubscription = async (): Promise<RequestSubscription[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('internal_location_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
    }
    return parseStringify(data)
}

export const getRequestSubscriptionById = async (id: string): Promise<RequestSubscription> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('internal_location_subscriptions')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        console.error(error);
    }
    return parseStringify(data)
}

// In @/lib/actions/location.ts
export const approveSubscriptionRequest = async (id: string, request: RequestSubscription): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
    // Input validation
    if (!id) throw new Error('Subscription request ID is required');
    if (!request?.location || !request?.packageId) throw new Error('Invalid subscription request data');
  
    const supabase = await createClient();
    const apiClient = new ApiClient();
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Authentication failed');
      
      // Prepare API payload
      const payload = {
        packageId: request.packageId,
        phone: request.phone,
        email: request.email,
        quantity: request.quantity || 1, 
        locationId: request.location,
      };
      
      // Make API call first to create the subscription
      const response = await apiClient.post(
        `/api/subscription-payments/${request.location}/manually-subscribe`, 
        payload
      ) as { status: string; statusText?: string };

   
      
      // Check if API call was successful
      if (!response || response.status !== 'SUCCESS') {
        throw new Error(`API call failed: ${response?.statusText || 'Unknown error'}`);
      }
      
      // If API call succeeded, update the database record
      const { error: updateError } = await supabase
        .from('internal_location_subscriptions')
        .update({ 
          status: 'approved', 
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Return success with subscription details
      return { 
        success: true,  
      };
      
    } catch (error) {
      console.error('Failed to approve subscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  };

export const rejectSubscriptionRequest = async (id: string) => {
    const supabase = await createClient();
    const { error } = await supabase
        .from('location_subscriptions')
        .update({ 
            status: 'rejected', 
            approved_by: 'current-user-id' 
        })
        .eq('id', id);

    if (error) throw error;
};



