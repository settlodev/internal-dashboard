
export interface FormResponse<T = unknown> {
    responseType: "success" | "error";
    message: string;
    error?: Error | null;
    status?:number;
    code?:string;
    redirectTo?:string;
    data?: T;
}