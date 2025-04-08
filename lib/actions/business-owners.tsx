'use server'
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { Owner } from "@/types/owners/type";

export const fetchAllBusinessOwners = async (): Promise<Owner[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/users");
        // console.log("The data is", data)
        return parseStringify(data);

    } catch (error) {

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