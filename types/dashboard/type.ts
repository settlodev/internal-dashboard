export declare interface SummaryResponse {
    startDate: string;
    endDate: string;
    totalUsers: number;
    totalBusinesses: number;
    totalLocations: number;
    totalSubscriptions: number;
    totalActiveSubscriptions: number;
    totalInActiveSubscriptions: number;
    totalUsersWithActiveSubscriptions: number;
    totalUsersWithInActiveSubscriptions: number;
    monthlyLocationsCreated:LocationCreated[];
    monthlyBusinessesCreated:BusinessCreated[];
    monthlyUsersCreated:UserCreated[];
}

interface LocationCreated {
    endOfMonth: string;
    amount: number;
}
interface BusinessCreated {
    endOfMonth: string;
    amount: number;
}
interface UserCreated {
    endOfMonth: string;
    amount: number;
}