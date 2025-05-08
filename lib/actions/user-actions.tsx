'use server'
import { Profile, ProfileData, User } from "@/types/users/type"
import { parseStringify } from "../utils"
import { createClient } from "../supabase/server"
import { fetchAllBusiness } from "./business"
import { fetchAllBusinessOwners } from "./business-owners"
import { Business } from "@/types/business/types"

export const getUserWithProfile = async () => {
  const supabase = await createClient()
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user is authenticated, return null
  if (!user) {
      return null
  }
  
  // Fetch the user's profile from the internal_profile table
  const { data: profile, error } = await supabase
      .from('internal_profiles')
      .select(`
        id,
        first_name,
        last_name,
        phone,
        role:internal_roles (name),
        user_type
      `)
      .eq('id', user.id)
      .single()
  
  // Handle potential errors
  if (error) {
      console.error('Error fetching user profile:', error)
      return null
  }
  
  // Combine user authentication data with profile data
  return {
      user: user,
      profile: profile
  }
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
   
    if (error) {
        console.log(error)
    }
    return parseStringify(data)
}

export const searchUsers = async (q: string): Promise<User[]> => {
    const supabase = await createClient()
  
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



export async function fetchProfileDataById(id: string): Promise<Profile | null> {
  const supabase = await createClient();

  try {
    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
    .from('internal_profiles')
          .select('*')
          .eq('id', id)
          .single();

    if (profileError) {
      console.error('Supabase error:', profileError);
      return null;
    }

    if (!profile) {
      return null;
    }

    // Fetch role information to include role name
    if (profile.role) {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('name')
        .eq('id', profile.role)
        .single();
        
      if (!roleError && roleData) {
        profile.role = {
          id: profile.role,
          name: roleData.name
        };
      }
    }

    return parseStringify(profile);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
}

export const fetchBusinessesByReferralCode = async (referralCode: string): Promise<Business[]> => {
  try {
    // Get all business owners and businesses
    const owners = await fetchAllBusinessOwners();
    const businesses = await fetchAllBusiness();
    
    // Find owners who used this referral code
    const ownersWithReferralCode = owners.filter(owner => 
      owner.referredByCode === referralCode
    );
    
    // If no owners used this code, return empty array
    if (ownersWithReferralCode.length === 0) {
      return [];
    }
    
    // Get the IDs of owners who used this referral code
    const ownerIds = ownersWithReferralCode.map(owner => owner.id);
    
    // Find businesses owned by these owners
    const referredBusinesses = businesses.filter(business => 
      ownerIds.includes(business.owner)
    );
    
    return referredBusinesses;
  } catch (error) {
    console.error("Error fetching businesses by referral code:", error);
    throw error;
  }
}

export const getOwnerDetails = async (ownerId: string): Promise<string> => {
  try {
    const owners = await fetchAllBusinessOwners();
    const owner = owners.find(o => o.id === ownerId);
    
    if (owner) {
      return `${owner.firstName} ${owner.lastName}`;
    }
    
    return "Not Available";
  } catch (error) {
    console.error("Error fetching owner details:", error);
    return "Not Available";
  }
}



