export interface FormResponse<T = unknown>{
    responseType:"success" | "error";
    message:string;
    error?:Error | null;
    data?:T

}