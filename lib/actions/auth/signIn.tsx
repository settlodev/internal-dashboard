'use server'
import { createClient } from "@/lib/supabase/server";
import { generatePassword, parseStringify } from "@/lib/utils";
import { signInSchema } from "@/types/auth/signInSchema";
import { FormResponse } from "@/types/types";
import { UserSchema } from "@/types/users/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { resetPasswordSchema } from "@/types/auth/resetPasswordSchema";
import { cache } from 'react';
import { cookies } from "next/headers";
import ApiClient from "@/lib/api-client";
import {inviteStaff} from "@/lib/actions/email/send";

export interface CreateProfileData {
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    userType: string;
    email: string;
    user_id: string;
}

export const createAuthUser = async (email: string, password?: string) => {
    try {
        const supabase = await createClient();
        const userPassword = password || generatePassword();

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password: userPassword,
            email_confirm: true
        });

        if (error) {
            console.error("Auth user creation error:", error);
            return { error: error.message, user: null };
        }

        return {
            user: data.user,
            password: userPassword,
            error: null
        };
    } catch (error) {
        console.error("Unexpected error creating auth user:", error);
        return { error: "Failed to create user account", user: null };
    }
};

export const deleteAuthUser = async (userId: string) => {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
            console.error("Failed to delete auth user:", error);
            return { error: error.message };
        }

        return { error: null };
    } catch (error) {
        console.error("Unexpected error deleting auth user:", error);
        return { error: "Failed to delete user" };
    }
};

export const signUp = async (values: z.infer<typeof UserSchema>) => {
    const validatedData = UserSchema.safeParse(values);
    if (!validatedData.success) {
        return {
            error: "Invalid data provided",
            status: 400,
            success: false
        };
    }

    const { email, firstName, lastName, phone, role, userType } = validatedData.data;
    let authUserId: string | null = null;

    try {
        // 1. Create auth user in Supabase
        const authResult = await createAuthUser(email);

        if (authResult.error || !authResult.user) {
            return {
                error: authResult.error || "Failed to create user account",
                status: 500,
                success: false
            };
        }

        authUserId = authResult.user.id;
        const generatedPassword = authResult.password;

        // 3. Create user profile via external API
        const profileData: CreateProfileData = {
            firstName,
            lastName,
            phone,
            role,
            userType,
            email,
            user_id: authUserId,
        };

        const profileResult = await createUserProfile(profileData);
        console.log("Profile result:", profileResult);

        if (!profileResult.success) {
            // Rollback: Delete auth user if profile creation fails
            await deleteAuthUser(authUserId);
            return {
                error: profileResult.error || "Profile creation failed",
                status: 500,
                success: false
            };
        }


        // 5. Send invitation email
        await inviteStaff(email, firstName, lastName, profileResult.data.referralCode, generatedPassword);

        return {
            redirectTo: "/users",
            success: true,
            message: "User created successfully"
        };

    } catch (error) {
        console.error("Unexpected error during sign up:", error);

        // Cleanup on unexpected error
        if (authUserId) {
            await deleteAuthUser(authUserId);
        }

        return {
            error: "An unexpected error occurred",
            status: 500,
            success: false
        };
    }
};

export const createUserProfile = async (profileData: CreateProfileData) => {
    const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        role: profileData.role,
        user_type: profileData.userType,
        email: profileData.email,
        id: profileData.user_id
    };

    try {
        const apiClient = new ApiClient();
        const response = await apiClient.post(
            '/api/internal/internal-profiles/create',
            payload
        );

        console.log("Response after creating profile:", response);
        return {
            success: true,
            data: parseStringify(response),
            error: null
        };
    } catch (error) {
        console.error("Error creating user profile:", error);
        return {
            success: false,
            data: null,
            error: "Failed to create user profile"
        };
    }
};

export const SignIn = async (
    credentials: z.infer<typeof signInSchema>
): Promise<FormResponse> => {
    const validCredentials = signInSchema.safeParse(credentials)
    if (!validCredentials.success) {
        return parseStringify({
            responseType: "error",
            message: "Please fill all the fields before submitting",
            error: new Error(validCredentials.error.message),
            status: 400
        })
    }
    try {
        const supabase = await createClient()

        const { error, data } = await supabase.auth.signInWithPassword(credentials)
        if (error) {
            console.log("The error occuring while signing is", error)

            return parseStringify({
                responseType: "error",
                message: "Invalid email or password",
                error: new Error(error.message),
                status: 400
            })
        }
        const user = data.user;

        // console.log("The user", user)

        const { data: internal_profile, error: profileError } = await supabase
            .from('internal_profiles')
            .select(`
        *,
        role:internal_roles!role(name)
      `)
            .eq('id', user.id)
            .single();

        const cookieStore = await cookies()
        cookieStore.set({
            name:"authenticatedUser",
            value:JSON.stringify(internal_profile),
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"
        })


        // console.log("The profile", internal_profile)

        if (profileError) {
            console.log("The error", profileError)
            return ({
                responseType: "error",
                message: profileError.message,
                error: new Error(profileError.message), status: 400
            })
        }

        const role = internal_profile?.role?.name

        if (role === 'staff') {
            return parseStringify({
                responseType: "success",
                message: "Signed in successfully",
                redirectTo: `/profile/${internal_profile?.id}`
            });
        } else {
            return parseStringify({
                responseType: "success",
                message: "Signed in successfully",
                redirectTo: "/subscribers"
            });
        }

        // return { redirectTo: "/dashboard" };

    } catch (error) {
        console.log("Failed to sign in", error)
        throw error
    }
}

export const getUserEmailById = cache(async (userId: string) => {
  try {
    if (!userId) {
      return { error: "User ID is required", email: null };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error) {
      console.error("Error fetching user by ID:", error);
      return { error: error.message, email: null };
    }
    
    if (!data.user) {
      return { error: "User not found", email: null };
    }
    
    return { email: data.user.email, error: null };
  } catch (error) {
    console.error("Unexpected error getting user email:", error);
    return { error: "An unexpected error occurred", email: null };
  }
});

export const resetPassword = async (userId: string, passwordData: z.infer<typeof resetPasswordSchema>) => {
  // Validate the incoming data
  const validatedData = resetPasswordSchema.safeParse(passwordData);
  if (!validatedData.success) {
    return {
      responseType: "error",
      message: "Please fill all the fields correctly",
      error: validatedData.error.message,
      status: 400
    };
  }
  
  try {
    // Get user by ID first to verify they exist
    const userData = await getUserEmailById(userId);

    if (userData.error) {
      return {
        responseType: "error",
        message: userData.error,
        error: userData.error,
        status: 400
      };
    }

    // Initialize Supabase client
    const supabase = await createClient();

    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: validatedData.data.password }
    );

    if (error) {
      console.error("Admin password update error:", error);
      return {
        responseType: "error",
        message: error.message || "Failed to update user password",
        error: error.message,
        status: 400
      };
    }


    return { redirectTo: "/users" };
  } catch (error: any) {
    console.error("Unexpected error in resetPassword:", error);
    return {
      responseType: "error",
      message: error.message || "An unexpected error occurred",
      error: error.message,
      status: 500 
    };
  }
};

export const signOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

  
    if (error || !user) {
      return { user: null, error: error?.message };
    }

    
    // console.log("The user", user)
    const { data: internal_profile, error: profileError } = await supabase
      .from('internal_profiles')
      .select(`
        *,
        role:internal_roles(name)
      `)
      .eq('id', user.id)
      .single();

 
      // console.log("The profile", internal_profile)
    if (profileError) {
      console.log("The error", profileError)
      return ({
        responseType: "error",
        message: profileError.message,
        error: new Error(profileError.message), status: 400
      })
    }

    const role = internal_profile?.role?.name

    return { user, error: null, role };
  } catch (error) {
    console.error('Error getting user:', error);
    return { user: null, error: 'Failed to get user' };
  }
}

export async function checkUserPermissions() {
  try {
    const { user, error } = await getCurrentUser();
    
    if (error || !user) {
      return { permissions: [], error: error || 'No user found' };
    }

    const supabase = await createClient();
    
    // You can create this RPC function in Supabase
    const { data, error: rpcError } = await supabase
      .rpc('get_user_permissions', { user_id: user.id });

    if (rpcError) {
      // console.log("❌ RPC Error:", rpcError);
      return { permissions: [], error: rpcError.message };
    }

    
    return { permissions: data || [], error: null };

  } catch (error) {
    console.error('💥 Error in RPC permission check:', error);
    return { permissions: [], error: 'Failed to check permissions via RPC' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient();

    const { data: user, error: fetchError } = await supabase.auth.admin.getUserById(userId);
    if (fetchError || !user) {
      return { error: "User not found in authentication system." };
    }

    // Step 1: Delete from internal_user_role
    const { error: roleError } = await supabase
      .from("internal_user_roles")
      .delete()
      .eq("user_id", userId);

    if (roleError) {
      console.error("Error deleting user role:", roleError);
      return { error: "Failed to delete user role." };
    }

    // Step 2: Delete the user profile
    const { error: profileError } = await supabase
      .from("internal_profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return { error: "Failed to delete user profile." };
    }

    // Step 3: Delete the user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Error deleting user from auth:", authError.message);
      return { error: "Failed to delete user from authentication." };
    }

    return { error: null }; // Success
  } catch (error) {
    console.error("Unexpected error deleting user:", error);
    return { error: "An unexpected error occurred while deleting the user." };
  }
}

export async function updateUserProfile(userId: string, data: any) {
 
  try {
    const supabase = await createClient();

    const payload = {
      last_name: data.last_name,
      first_name: data.first_name,
      phone: data.phone,
      role: data.role
    };

    const { error } = await supabase
      .from('internal_profiles')
      .update(payload)
      .eq('id', userId);
    if (error) {
      console.error("Error updating user profile:", error);
      return { error: error.message };
    }
    return { redirectTo: "/users" };
  } catch (error) {
    console.error("Unexpected error updating user:", error);
    return { error: "An unexpected error occurred while updating the user.", status: 500 };
  }
}

export const getAuthenticatedUser = async (): Promise<any> => {
  const cookieStore = await cookies();
  const authUserCookie = cookieStore.get("authenticatedUser");

  if (!authUserCookie) return undefined;

  try {
    return JSON.parse(authUserCookie.value);
  } catch (error) {
    console.error("Failed to parse authenticated user cookie:", error);
    return undefined;
  }
};
