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
    firstName: string;
    lastName: string;
    avatar_url?: string;
    role:string,
    businesses_registered?: number;
    commission_earned?: number;
    referralCode?: string;
    businesses?: Business[];
    email:string,
    phone:string,
    password:string,
    status:string,
    canDeleted:boolean,
    isArchived:boolean
    created_at:string,
    updated_at:string
    userType:string
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