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
        redirectTo: "/users"
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
    const { email, password, first_name, last_name, phone, role, user_type} = validatedData.data;

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
    console.log("The user code is", code)
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
      // await inviteStaff(email)

      return { redirectTo: "/users" };
    }
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    return { error: "Unexpected error", status: 500 };
  }
};

//First, create a function to request password reset
export const requestPasswordReset = async (email: string) => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?email=${email}`, // Adjust this URL as needed
    });

    if (error) {
      return parseStringify({
        responseType: "error",
        message: error.message,
        error: new Error(error.message),
        status: 400
      });
    }

    return parseStringify({
      responseType: "success",
      message: "Password reset instructions sent to your email",
      status: 200
    });
  } catch (error: any) {
    return parseStringify({
      responseType: "error",
      message: error.message,
      error: new Error(error.message),
      status: 400
    });
  }
};

//Then, update the password reset function to use the reset token
export const resetPassword = async (password: z.infer<typeof resetPasswordSchema>) => {
  const validatedData = resetPasswordSchema.safeParse(password);
  if (!validatedData.success) {
    return parseStringify({ 
      responseType: "error",
      message: "Please fill all the fields before submitting",
      error: new Error(validatedData.error.message),
      status: 400
    });
  }
  
  try {
    const supabase = await createClient();

    // Get the session from the URL if this is a password reset flow
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return parseStringify({
        responseType: "error",
        message: "Invalid or expired reset link. Please request a new password reset.",
        error: new Error("Invalid session"),
        status: 401
      });
    }

    const { error } = await supabase.auth.updateUser({
      password: validatedData.data.password
    });

    if (error) {
      console.log(error);
      return parseStringify({
        responseType: "error",
        message: error.message,
        error: new Error(error.message),
        status: 400
      });
    }

    revalidatePath("/");
    return parseStringify({
      responseType: "success",
      message: "Password updated successfully",
      status: 200
    });
  } catch (error: any) {
    console.log(error);
    return parseStringify({
      responseType: "error",
      message: error.message,
      error: new Error(error.message),
      status: 400
    });
  }
};



export const signOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}

