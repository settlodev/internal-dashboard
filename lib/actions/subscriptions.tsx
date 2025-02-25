'use server'
import { Payment } from "@/types/location/type";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { ApiResponse } from "@/types/types";

export const getAllSubscriptions = async (): Promise<Payment[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.post<ApiResponse<Payment[]>, {}>("/api/subscription-payments", {});
        return parseStringify(data.content);
    } catch (error) {
        throw error;
    }
}