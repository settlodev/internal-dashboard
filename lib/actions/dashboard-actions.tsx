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
        return data;
    } catch (error) {
        throw error;
    }
}

// const getDashboardSummaries = async (startDate?: Date, endDate?: Date) => {

//     const apiClient = new ApiClient();
//     // Example API call with date parameters
//     const startDateParam = startDate ? `startDate=${startDate.toISOString().split('T')[0]}` : '';
//     const endDateParam = endDate ? `endDate=${endDate.toISOString().split('T')[0]}` : '';
//     const queryParams = [startDateParam, endDateParam].filter(Boolean).join('&');
    
//     const url = `/api/reports/overview/summary${queryParams ? `?${queryParams}` : ''}`;
    
//     const data = await apiClient.get(url);
//     if (!data.ok) {
//       throw new Error('Failed to fetch dashboard data');
//     }
//     return await data.json();
//   };