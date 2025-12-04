import { UUID } from "crypto";

export declare interface User{
    id:UUID,
    email:string,
    role:role,
    roleName:string,
    phone:string,
    referralCode:string,
    firstName:string,
    lastName:string,
    password:string,
    status:string,
    canDeleted:boolean,
    isArchived:boolean
    userType:string

}
export interface role {
    id:UUID,
    name:string
}

export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    role:string,
    businesses_registered?: number;
    commission_earned?: number;
    referral_code?: string;
    businesses?: Business[];
    email:string,
    phone:string,
    password:string,
    status:string,
    canDeleted:boolean,
    isArchived:boolean
    created_at:string,
    updated_at:string
    user_type:string
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