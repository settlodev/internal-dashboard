'use server'
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/types/auth/signInSchema";
import { UserSchema } from "@/types/users/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const SignIn = async (
    credentials: z.infer<typeof signInSchema>
): Promise<any> => {
    const validCredentials = signInSchema.safeParse(credentials)

    if (!validCredentials.success) {
        return { error: "Invalid credentials", status: 400 }
    }
    try {
        const supabase = await createClient()

        const { error,data} = await supabase.auth.signInWithPassword(credentials)
        if (error) {
            console.log("The error", error)

            return { error: error.message, status: 400 }
        }
        const user = data.user;
        const { data: profile, error: profileError } = await supabase
                                        .from('profiles')
                                        .select('role')
                                        .eq('id', user.id)
                                        .single();
        // if (profileError) {
            // console.log("The profile error", profileError)
            // if(profileError.code === 'PGRST116'){
            //     const { error: profileError } = await supabase
            //     .from('profiles')
            //     .insert([
            //       {
            //         id: user.id,  // Link the profile to the user ID
            //         first_name: "PATRICK",
            //         last_name: "KING",
            //         phone: "+255694230173",
            //         role:'cad2f085-ac72-498d-bb04-38598c851345'
            //       },
            //     ]); 
            // }
            // return { error: profileError.message, status: 400 }
        // }

        // const role = profile?.role
        // if(role==='staff'){
        //     return { redirectTo: "/users" };
        // }else{
        // return { redirectTo: "/dashboard" };
        // }

        return { redirectTo: "/dashboard" };

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
      const { email, password, firstName, lastName, phone, role } = validatedData.data;
  
      // Sign up with email and password
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        phone,
        email_confirm: false,
      });
  
      if (error) {
        console.error("Sign up error:", error);
        return { error: error.message };
      }
  
      const user = data.user;
      if (user) {
        // Insert additional fields into the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,  // Link the profile to the user ID
              first_name: firstName,
              last_name: lastName,
              phone,
              role,
            },
          ]);
  
        if (profileError) {
          console.error("Error inserting profile:", profileError);
          return { error: "Profile creation failed" };
        }
  
        // Insert role association (optional)
        await supabase.from('user_roles').insert([
          {
            user_id: user.id,
            role_id: role,
          },
        ]);
  
        // Redirect to the user list or dashboard
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

export const userSession = async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}