'use server'
import ApiClient from "../api-client";


export const getDashboardSummaries = async (startDate?: Date, endDate?: Date) => {
    // Format dates as full ISO strings with time set to midnight UTC
    const formatDateToISO = (date?: Date): string | undefined => {
        if (!date) return undefined;
        
        // Create a new date at midnight UTC
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        // Create date at midnight UTC
        const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
        
        // Return full ISO string
        return utcDate.toISOString();
    };

    const startDateParam = startDate ? `startDate=${formatDateToISO(startDate)}` : '';
    const endDateParam = endDate ? `endDate=${formatDateToISO(endDate)}` : '';
    const queryParams = [startDateParam, endDateParam].filter(Boolean).join('&');

    try {
        const apiClient = new ApiClient();
        const url = `/api/reports/overview/summary${queryParams ? `?${queryParams}` : ''}`;
        const data = await apiClient.get(url);
        // console.log("The dashboard data is", data)
        return data;
    } catch (error) {
        throw error;
    }
}

// export const getDashboardSummaries = async (startDate: string, endDate: string):Promise<any> => {
//
//     const queryParams = {
//         startDate: startDate,
//         endDate: endDate,
//     }
//
//     try {
//
//         const apiClient = new ApiClient();
//
//         const queryString = new URLSearchParams({
//             startDate: queryParams.startDate.toString(),
//             endDate: queryParams.endDate.toString()
//         }).toString();
//
//
//         const url = `/api/reports/overview/summary?${queryString}`;
//
//         const data = await apiClient.get(url);
//         console.log("summary report from api:-",data);
//
//         return parseStringify(data);
//     } catch (error) {
//         console.error("Error fetching contributions from each package:", error);
//         throw error;
//     }
// }

