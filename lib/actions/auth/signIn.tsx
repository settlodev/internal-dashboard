'use server'
import { createClient } from "@/lib/supabase/server";
import { parseStringify } from "@/lib/utils";
import { signInSchema } from "@/types/auth/signInSchema";
import { FormResponse } from "@/types/types";
import { UserSchema } from "@/types/users/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { inviteStaff } from "../email/send";
import { resetPasswordSchema } from "@/types/auth/resetPasswordSchema";
import { cache } from 'react';

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
      console.log("The error", error)

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

    if (role === 'staff') {
      return parseStringify({
        responseType: "success",
        message: "Signed in successfully",
        redirectTo: "/profile"
      });
    } else {
      return parseStringify({
        responseType: "success",
        message: "Signed in successfully",
        redirectTo: "/dashboard"
      });
    }

    // return { redirectTo: "/dashboard" };

  } catch (error) {
    console.log(error)
    throw error
  }
}

export const signUp = async (values: z.infer<typeof UserSchema>) => {
  const validatedData = UserSchema.safeParse(values);
  if (!validatedData.success) {
    return { error: "Invalid data provided", status: 400 };
  }

  try {
    const supabase = await createClient();
    const { email,first_name, last_name, phone, role, user_type} = validatedData.data;
    const password = `${first_name.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

    // Sign up with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      console.error("Sign up error:", error);
      return { error: error.message };
    }

    const user = data.user;
    const code = `${first_name.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`; 
    // console.log("The user code is", code)
    if (user) {
      const { error: profileError } = await supabase
        .from('internal_profiles')
        .insert([
          {
            id: user.id,
            first_name: first_name,
            last_name: last_name,
            phone,
            role,
            user_type,
            referral_code: code
          },
        ]);

      if (profileError) {
        console.error("Error inserting profile:", profileError);
        // delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(user.id);
        return { error: "Profile creation failed" };
      }

      await supabase.from('internal_user_roles').insert([
        {
          user_id: user.id,
          role_id: role,
        },
      ]);
      await inviteStaff(email,first_name, last_name, code, password)

      return { redirectTo: "/users" };
    }
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return { error: "Unexpected error", status: 500 };
  }
};

// Using cache to prevent redundant fetches within the same request
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

    // console.log("The user", user)
    
    if (error || !user) {
      return { user: null, error: error?.message };
    }

    return { user, error: null };
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
    const { data, error: permError } = await supabase
      .from('internal_user_roles')
      .select(`
        role:internal_roles (
          permissions:internal_role_permissions (
            permission:internal_permissions (
              slug
            )
          )
        )
      `)
      .eq('user_id', user.id);
  

      console.log("The data has this role", data )

    if (permError) {
      return { permissions: [], error: permError.message };
    }

    // Flatten permissions from all roles
    const permissions = new Set<string>();
    data?.forEach(({ role }:any) => {
      role.permissions.forEach(({ permission }: { permission: { slug: string } }) => {
        permissions.add(permission.slug);
      });
    });

    return { permissions: Array.from(permissions), error: null };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return { permissions: [], error: 'Failed to check permissions' };
  }
}


export async function deleteUser(userId: string) {
  try {
      const supabase = await createClient();

      const { data: user, error: fetchError } = await supabase.auth.admin.getUserById(userId);
      if (fetchError || !user) {
          return { error: "User not found in authentication system." };
      }

      // Delete the user profile from the database 
      const { error: profileError } = await supabase
          .from("internal_profiles") 
          .delete()
          .eq("id", userId); 

      if (profileError) {
          console.error("Error deleting user profile:", profileError);
          return { error: "Failed to delete user profile." };
      }

      // Delete the user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
          console.error("Error deleting user from auth:", authError);
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
