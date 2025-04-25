'use server'
import { Payment } from "@/types/location/type";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { ApiResponse } from "@/types/types";

export const getAllSubscriptions = async (): Promise<Payment[]> => {
    try {
        const apiClient = new ApiClient();
        const payload ={
            "page": 0,
            "size": 10000
        }
        const data = await apiClient.post<ApiResponse<Payment[]>, {}>("/api/subscription-payments", payload);
        // console.log("The subscription records", data)
        return parseStringify(data.content);
    } catch (error) {
        throw error;
    }
}
