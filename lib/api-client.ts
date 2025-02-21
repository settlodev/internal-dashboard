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

           

            config.headers["Content-Type"] = "application/json";

            return config;
        });
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
        } catch (error:any) {
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
        } catch (error:any) {
            throw await errorHandler(error);
        }
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.instance.delete<T>(url, config);

            return response.data;
        } catch (error:any) {
            throw await errorHandler(error);
        }
    }
}

export default ApiClient;
