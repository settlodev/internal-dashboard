export interface FormResponse<T = unknown> {
    responseType: "success" | "error";
    message: string;
    error?: Error | null;
    status?:number;
    redirectTo?:string;
    data?: T;
}