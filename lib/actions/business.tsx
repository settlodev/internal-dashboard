'use server'
import { Business } from "@/types/business/types";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";

export const fetchAllBusiness = async (): Promise<Business[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/businesses/all");
        return parseStringify(data);

    } catch (error) {

        throw error;
    }
}

export const getBusiness = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/businesses/all/${id}`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}   