'use server'
import { ProfileData, User } from "@/types/users/type"
import { parseStringify } from "../utils"
import { createClient } from "../supabase/server"

export const userWithInSession = async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
export const fetchAllUsers = async (): Promise<User[]> => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('internal_profiles')  
    .select(`
        id,
        first_name,
        last_name,
        phone,
        role:internal_roles (name),
        user_type
      `);
      console.log(data)
    if (error) {
        console.log(error)
    }
    return parseStringify(data)
}

export const searchUsers = async (q: string): Promise<User[]> => {
    const supabase = await createClient()
    
     // Calculate start and end index based on page and pageLimit
    //  const start = (page - 1) * pageLimit;
    //  const end = start + pageLimit - 1;
 
     const { data, error } = await supabase
         .from('internal_profiles')
         .select()
         .textSearch('first_name', `%${q}%`);
 
     if (error) {
         console.error(error);
         return [];
     }
 
     return parseStringify(data);
}

export async function fetchProfileData(): Promise<ProfileData> {
  const supabase = await createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) {
      return { profile: null, error: new Error('User not authenticated') };
    }

    const { data: profile, error: profileError } = await supabase
      .from('internal_profiles')
      .select(`
        *,
        role:internal_roles(name)
      `)
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    return { profile, error: null };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return { 
      profile: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
}

export async function fetchProfileDataById(id: string): Promise<User | undefined> {
  const supabase = await createClient();

  try {
    const { data: profile, error: profileError } = await supabase
      .from('internal_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) throw profileError;

    return parseStringify(profile);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    
  }
}



