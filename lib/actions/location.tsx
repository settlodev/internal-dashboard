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
import { RequestSubscriptionEmail } from "./email/send";


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

        const query = {
            filters: [],
            sorts: [
                {
                    key: "dateCreated",
                    direction: "DESC",
                },
            ],
            page: page ? page - 1 : 0,
            size: size ? size : 10,
        };

        const data = await apiClient.post(`/api/subscription-payments/${id}`, query);
       
        
      
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}

export const getActiveSubscription = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/location-subscriptions/${id}/last-active`);
        console.log("The active subscription", data )
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

    // console.log("The valid request", validRequest )

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

     

       
        
        const { error } = await supabase
        .from('internal_location_subscriptions')
        .insert([subscriptionData]);

        if (error) {
            console.error("Request subscription error:", error);
            // Check if it's a unique constraint violation
            if (error.code === '23505' && error.message.includes('reference')) {
                throw new Error(`Reference number ${validRequest.data.reference} has already been used. Please use a different reference number.`);
            }
            throw new Error(error.message);
        }

        const emailPayload = {
            quantity: validRequest.data.quantity,
            description: validRequest.data.description,
            payment_type: validRequest.data.payment_type,
            location_name: validRequest.data.location_name,
            phone: validRequest.data.phone,
            email: validRequest.data.email,
            packageId: validRequest.data.packageId,
            packageName: validRequest.data.packageName,
            user
        };

        // console.log("The email payload", emailPayload)

        await RequestSubscriptionEmail(emailPayload)

        return parseStringify({
            responseType:"success",
            message:"Subscription request sent successfully",
            status:200
        })
    } catch (error) {
        throw error;
    }
}



export const fetchAllRequestSubscription = async (
    userId: string, 
    role: string
  ): Promise<RequestSubscription[]> => {
      const supabase = await createClient();
      
      // Start with the query builder
      let query = supabase
          .from('internal_location_subscriptions')
          .select('*')
          .order('created_at', { ascending: false });
      
      // Filter by user_id if the user is not an admin
      if (role !== 'admin') {
          query = query.eq('user_id', userId);
      }
      
      // Execute the query
      const { data: requests, error } = await query;
  
      if (error) {
          console.error(error);
          throw error;
      }
  
      if (!requests || requests.length === 0) {
          return parseStringify([]);
      }
  
      // Fetch all unique user IDs from the requests
      const userIds = requests.map(request => request.user_id).filter((id, index, self) => self.indexOf(id) === index);
      
      // Fetch user data for all users at once
      const { data: usersData, error: usersError } = await supabase
          .from('internal_profiles')
          .select(`
              id,
              first_name,
              last_name
          `)
          .in('id', userIds);
  
      if (usersError) {
          console.error(usersError);
          throw usersError;
      }
  
      // Combine requests with user data
      const result = requests.map(request => {
          const userData = usersData.find(user => user.id === request.user_id);
          return {
              ...request,
              userData
          };
      });
  
      return parseStringify(result);
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



