'use server'
import { BusinessType } from "@/types/business/types";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { BusinessTypeSchema } from "@/types/business/schema";
import { z } from "zod";
import { FormResponse } from "@/types/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getBusinessTypes = async (): Promise<BusinessType[]> => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get("/api/business-types");
        return parseStringify(data);
    } catch (error) {

        throw error;
    }
}

export const searchBusinessTypes = async (query: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/business-types/search?query=${query}`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const createBusinessType = async (
    businessType: z.infer<typeof BusinessTypeSchema>
): Promise<FormResponse | void> => {
    let formResponse: FormResponse| null = null;
    const validData = BusinessTypeSchema.safeParse(businessType);

    if (!validData.success) {
        formResponse = {
            responseType: "error",
            message: validData.error.issues[0].message,
            error: validData.error,
            status: 400
        }
        return parseStringify(formResponse);
    }
    const payload = {
        name: businessType.name,
        status: businessType.status
    }
    try {
        const apiClient = new ApiClient();
        await apiClient.post("/api/business-types/create", payload);

        formResponse={
            responseType: "success",
            message: "Business type created successfully",
            status: 200
        }
    } catch (error) {
        throw error;
    }
    revalidatePath("/business-types")
    return parseStringify(formResponse);
}

export const updateBusinessType = async (
    businessType: z.infer<typeof BusinessTypeSchema>
): Promise<FormResponse | void> => {
    let formResponse: FormResponse| null = null;
    const validData = BusinessTypeSchema.safeParse(businessType);
    if (!validData.success) {
        formResponse = {
            responseType: "error",
            message: validData.error.issues[0].message,
            error: validData.error,
            status: 400
        }
        return parseStringify(formResponse);
    }
    const payload = {
        name: businessType.name,
        status: businessType.status
    }
    try {
        const apiClient = new ApiClient();
        await apiClient.put("/api/business-types/update", payload);

        formResponse={
            responseType: "success",
            message: "Business type updated successfully",
            status: 200
        }
    } catch (error) {
        throw error;
    }
    revalidatePath("/business-types")
    return parseStringify(formResponse);
}

export const deleteBusinessType = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        await apiClient.delete(`/api/business-types/delete?id=${id}`);
    } catch (error) {
        throw error;
    }
    revalidatePath("/business-types")
    redirect("/business-types")
}

export const getBusinessType = async (id: string) => {
    try {
        const apiClient = new ApiClient();
        const data = await apiClient.get(`/api/business-types/${id}`);
        return parseStringify(data);
    } catch (error) {
        throw error;
    }
}