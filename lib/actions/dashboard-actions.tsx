'use server'
import ApiClient from "../api-client";

export const getDashboardSummaries = async () => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/reports/overview/summary");
        console.log("The summary data", data);
        return data;
    } catch (error) {
        console.log("The error", error );
        throw error;
    }
}