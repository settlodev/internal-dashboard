
'use server'
import ApiClient from "@/lib/api-client";
import {parseStringify} from "@/lib/utils";
import {SubscriberData} from "@/types/subscription/type";

export const subscribersReport = async (month: number, year: number):Promise<SubscriberData> => {
    const formattedMonth = month.toString().padStart(2, '0');

    const queryParams = {
        month: parseInt(formattedMonth, 10),
        year: year,
    }

    try {

        const apiClient = new ApiClient();

        const queryString = new URLSearchParams({
            month: queryParams.month.toString(),
            year: queryParams.year.toString()
        }).toString();

        const url = `/api/internal/reports/subscriptions/summary?${queryString}`;

        const data = await apiClient.get(url);

        // console.log("The subscriber report is", data);
        return parseStringify(data);
    } catch (error) {
        console.error("Error in subscribersReport:", error);
        throw error;
    }
}

export const financialReconciliationReport = async (startDate: string, endDate: string):Promise<any> => {

    const queryParams = {
        startDate: startDate,
        endDate: endDate,
    }

    try {

        const apiClient = new ApiClient();

        const queryString = new URLSearchParams({
            startDate: queryParams.startDate.toString(),
            endDate: queryParams.endDate.toString()
        }).toString();


        const url = `/api/internal/reports/invoice-payments/summary?${queryString}`;

        const data = await apiClient.get(url);

        return parseStringify(data);
    } catch (error) {
        console.error("Error in financilaReconcialiationReport:", error);
        throw error;
    }
}