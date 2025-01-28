'use server'
import { Business } from "@/types/business/types";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { Location } from "@/types/location/type";

export const fetchAllLocation = async (): Promise<Location[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/locations/all");
        console.log(data)
        return parseStringify(data);

    } catch (error) {

        throw error;
    }
}

export const getLocation = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/locations/all/${id}`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}   