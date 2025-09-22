'use server'
import { ApiResponse } from "@/types/types";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { Owner } from "@/types/owners/type";

export const fetchAllBusinessOwners = async (): Promise<Owner[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/users");
        console.log("The business owners are",data)
        return parseStringify(data);

    } catch (error) {
    
        console.log("The error received while fetching ownres is",error);
        throw error;
    }
}


export const searchBusinessOwners = async (): Promise<Owner[]> => {
   
    try {
        const apiClient = new ApiClient();
        const payload = {
            "page": 0,
            "size": 100000
        }
        const response = await apiClient.post<any, {}>("/api/users", payload,
            {
                headers: {
                    "INTERNAL-DASHBOARD-API-KEY": "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa"
                }
            }
        );
        
        // Handle different response structures
        const data = response.content || response.data || response;
        
        console.log("List of business owner records", data)
        
        if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
        }
        
        return parseStringify(data);
    } catch (error) {
        console.error("Error in searchBusinessOwners:", error);
        throw error;
    }
}



export const getBusinessOwner = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/users/${id}`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}   