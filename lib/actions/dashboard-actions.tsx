'use server'
import ApiClient from "../api-client";

export const getDashboardSummaries = async () => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/reports/overview/summary");
        return data;
    } catch (error) {
        throw error;
    }
}