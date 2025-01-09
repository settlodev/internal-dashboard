'use server'
import { createClient } from "@/lib/supabase/server";
import { parseStringify } from "@/lib/utils";
import { signInSchema } from "@/types/auth/signInSchema";
import { FormResponse } from "@/types/types";
import { UserSchema } from "@/types/users/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const SignIn = async (
    credentials: z.infer<typeof signInSchema>
): Promise<FormResponse> => {
    const validCredentials = signInSchema.safeParse(credentials)
    if (!validCredentials.success) {
        return parseStringify({
          responseType:"error",
          message:"Please fill all the fields before submitting",
          error: new Error(validCredentials.error.message),
          status:400
        })
    }
    try {
        const supabase = await createClient()

        const { error,data} = await supabase.auth.signInWithPassword(credentials)
        if (error) {
            console.log("The error", error)

            return parseStringify({
                responseType:"error",
                message:"Invalid email or password",
                error: new Error(error.message),
                status:400
            })
        }
        const user = data.user;
        console.log("The user", user)
        const { data: profile, error: profileError } = await supabase
                                        .from('profiles')
                                        .select(`role (name)`)
                                        .eq('id', user.id)
                                        .single();
        
        if (profileError) {
            console.log("The error", profileError)
            return ({ 
                responseType:"error", 
                message:profileError.message, 
                error: new Error(profileError.message), status: 400 })
        }

        const role = profile?.role[0]?.name
        
        if(role==='staff'){
            return parseStringify({
              responseType:"success",
              message:"Signed in successfully", 
              redirectTo: "/users" });
        }else{
        return parseStringify({ 
            responseType:"success", 
            message:"Signed in successfully", 
            redirectTo: "/dashboard" });
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
      const { email, password, first_name, last_name, phone, role } = validatedData.data;
  
      // Sign up with email and password
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
      })
  
      if (error) {
        console.error("Sign up error:", error);
        return { error: error.message };
      }
  
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id, 
              first_name: first_name,
              last_name: last_name,
              phone,
              role,
            },
          ]);
  
        if (profileError) {
          console.error("Error inserting profile:", profileError);
          return { error: "Profile creation failed" };
        }
  
        await supabase.from('user_roles').insert([
          {
            user_id: user.id,
            role_id: role,
          },
        ]);
  
        return { redirectTo: "/users" };
      }
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      return { error: "Unexpected error", status: 500 };
    }
  };
  


export const signOut = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/")
    redirect("/")
}

