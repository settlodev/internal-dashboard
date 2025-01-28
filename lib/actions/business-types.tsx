'use server'
import { BusinessType } from "@/types/business/types";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";

export const getBusinessTypes = async (): Promise<BusinessType[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/business-types");
        return parseStringify(data);
    } catch (error) {

        throw error;
    }
}

export const searchBusinessTypes = async (query: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/business-types/search?query=${query}`);
        return data;
    } catch (error) {
        throw error;
    }
}