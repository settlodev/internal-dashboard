"use server";

import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import https from 'https';
import { errorHandler } from "./errorHandler";

class ApiClient {
    private instance: AxiosInstance;
    private readonly baseURL: string;
    public isPlain: boolean;

    constructor() {
        this.baseURL = process.env.SERVICE_URL || "";
        this.isPlain = true;

        this.instance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: true
            })
        });

        this.instance.interceptors.request.use(async (config) => {
            if (!config.url?.startsWith("http")) {
                config.url = this.baseURL + config.url;
            }

            // Set default Content-Type if not already set
            if (!config.headers["Content-Type"]) {
                config.headers["Content-Type"] = "application/json";
            }

            // IMPORTANT: Check if the API key is already in headers
            // Only add from environment if not already provided in config
            if (process.env["INTERNAL-DASHBOARD-API-KEY"] && !config.headers["INTERNAL-DASHBOARD-API-KEY"]) {
                config.headers["INTERNAL-DASHBOARD-API-KEY"] = process.env["INTERNAL-DASHBOARD-API-KEY"];
            }

            // Only add external API key if not already provided
            if (process.env.EXTERNAL_API_KEY && !config.headers["EXTERNAL-API-KEY"]) {
                config.headers["EXTERNAL-API-KEY"] = process.env.EXTERNAL_API_KEY;
            }

            return config;
        });
    }

    // Method to set API key dynamically if needed
    public setApiKey(keyName: string, keyValue: string): void {
        this.instance.defaults.headers.common[keyName] = keyValue;
    }

    // Method to remove API key
    public removeApiKey(keyName: string): void {
        delete this.instance.defaults.headers.common[keyName];
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.instance.get<T>(url, config);
            return response.data;
        } catch (error: any) {
            console.error("Error in get:", error);
            throw await errorHandler(error);
        }
    }

    public async post<T, U>(
        url: string,
        data: U,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        try {
            const response = await this.instance.post<T>(url, data, config);
            return response.data;
        } catch (error: any) {
            console.error("Error in post:", error);
            throw await errorHandler(error);
        }
    }

    public async put<T, U>(
        url: string,
        data: U,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        try {
            const response = await this.instance.put<T>(url, data, config);
            return response.data;
        } catch (error: any) {
            throw await errorHandler(error);
        }
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.instance.delete<T>(url, config);
            return response.data;
        } catch (error: any) {
            throw await errorHandler(error);
        }
    }
}

export default ApiClient;

//prod
// "use server";
//
// import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
// import https from 'https';
// import { errorHandler } from "./errorHandler";
//
// class ApiClient {
//     private instance: AxiosInstance;
//     private readonly baseURL: string;
//     public isPlain: boolean;
//
//     constructor() {
//         this.baseURL = process.env.SERVICE_URL || "";
//         this.isPlain = true;
//
//         this.instance = axios.create({
//             httpsAgent: new https.Agent({
//                 rejectUnauthorized: true
//             })
//         });
//
//         this.instance.interceptors.request.use(async (config) => {
//             if (!config.url?.startsWith("http")) {
//                 config.url = this.baseURL + config.url;
//             }
//
//             // Set default headers
//             config.headers["Content-Type"] = "application/json";
//
//             // Add API key headers if available in environment variables
//             if (process.env.INTERNAL_DASHBOARD_API_KEY) {
//                 config.headers["INTERNAL-DASHBOARD-API-KEY"] = process.env.INTERNAL_DASHBOARD_API_KEY;
//             }
//
//             // You can add more API keys as needed
//             if (process.env.EXTERNAL_API_KEY) {
//                 config.headers["EXTERNAL-API-KEY"] = process.env.EXTERNAL_API_KEY;
//             }
//
//             return config;
//         });
//     }
//
//     // Method to set API key dynamically if needed
//     public setApiKey(keyName: string, keyValue: string): void {
//         this.instance.defaults.headers.common[keyName] = keyValue;
//     }
//
//     // Method to remove API key
//     public removeApiKey(keyName: string): void {
//         delete this.instance.defaults.headers.common[keyName];
//     }
//
//     public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//         try {
//             const response = await this.instance.get<T>(url, config);
//             return response.data;
//         } catch (error: any) {
//             console.error("Error in get:", error);
//             throw await errorHandler(error);
//         }
//     }
//
//     public async post<T, U>(
//         url: string,
//         data: U,
//         config?: AxiosRequestConfig,
//     ): Promise<T> {
//         try {
//             const response = await this.instance.post<T>(url, data, config);
//             return response.data;
//         } catch (error: any) {
//             console.error("Error in post:", error);
//             throw await errorHandler(error);
//         }
//     }
//
//     public async put<T, U>(
//         url: string,
//         data: U,
//         config?: AxiosRequestConfig,
//     ): Promise<T> {
//         try {
//             const response = await this.instance.put<T>(url, data, config);
//             return response.data;
//         } catch (error: any) {
//             throw await errorHandler(error);
//         }
//     }
//
//     public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//         try {
//             const response = await this.instance.delete<T>(url, config);
//             return response.data;
//         } catch (error: any) {
//             throw await errorHandler(error);
//         }
//     }
// }
//
// export default ApiClient;