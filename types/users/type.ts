import { UUID } from "crypto";

export declare interface User{
    id:UUID,
    email:string,
    roles:role,
    phone:string,
    first_name:string,
    last_name:string,
    password:string,
    status:string,
    canDeleted:boolean,
    isArchived:boolean

}
interface role {
    id:UUID,
    name:string
}

export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    role: { name: string };
    businesses_registered?: number;
    commission_earned?: number;
    referral_code?: string;
    businesses?: Business[];
  }
  
  export interface Business {
    id: string;
    name: string;
    registered_on: string;
    referred_by?: string;
  }
  
  export interface ProfileData {
    profile: Profile | null;
    error: Error | null;
  }