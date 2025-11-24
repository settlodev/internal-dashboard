'use server'
import { FeedbackSchema } from "@/types/owners/feedbackSchema";
import ApiClient from "../api-client";
import { parseStringify } from "../utils";
import { Owner } from "@/types/owners/type";
import { z } from "zod";
import { FormResponse } from "@/types/types";
import { getAuthenticatedUser } from "./auth/signIn";
import { revalidatePath } from "next/cache";

interface SearchBusinessOwnersParams {
    q?: string;
    page?: number;
    size?: number;
    startDate?: string;
    endDate?: string;
}

export const searchBusinessOwners = async (
  page: number,
  pageSize: number,
  startDate?: Date,
  endDate?: Date
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };

   
    if (startDate && endDate) {
      query.creationDateFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/all", query,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    // console.log("User with no order",data)

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    console.error("Error in getting unverified business owners :", error);
    throw error;
  }
}



export const searchUnverifiedBusinessOwners = async (
    params: SearchBusinessOwnersParams = {}
): Promise<{ content: Owner[]; totalElements: number; totalPages: number }> => {
    try {
        const apiClient = new ApiClient();

        const query: any = {
            filters: [],
            sorts: [
                {
                    key: "dateCreated",
                    direction: "DESC"
                }
            ],
            page: params.page ?? 0,
            size: params.size ?? 10,
        };

        // Add creationDateFilter only if both dates are provided
        if (params.startDate && params.endDate) {
            query.creationDateFilter = {
                startDate: params.startDate,
                endDate: params.endDate
            };
        }

        const response = await apiClient.post<any, {}>("/api/internal/users/unverified", query,{
            headers: {
                "INTERNAL-DASHBOARD-API-KEY":
                    "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
            },
        });

        const data = response.content || response.data || response;

        if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
        }

        return {
            content: parseStringify(data),
            totalElements: response.totalElements || data.length,
            totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
        };
    } catch (error) {
        console.error("Error in getting unverified business owners:", error);
        throw error;
    }
}



export const usersWithIncompleteBusinessSetup = async (
  page: number,
  pageSize: number
): Promise<any> => {
  try {

    const apiClient = new ApiClient();
    const query = {
      filters: [

      ],
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10

    };

    const response = await apiClient.post<any, {}>("/api/internal/users/with-incomplete-setup", query,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;


    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {

    console.error("Error in getting unverified business owners :", error);
    throw error;
  }
}

export const businessOwnersWithNoOrder = async (
  page: number,
  pageSize: number,
  startDate?: Date,
  endDate?: Date
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };

   
    if (startDate && endDate) {
      query.creationDateFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/with-no-orders", query,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    // console.log("User with no order",data)

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    console.error("Error in getting unverified business owners :", error);
    throw error;
  }
}


export const businessOwnersWithLastOrderPlacedInXDays = async (
  page: number,
  pageSize: number,
  daysSinceLastOrder?: number
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };

    const days = daysSinceLastOrder ?? 5;

    const payload = {
      ...query,
      daysSinceLastOrder: days
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/with-last-order-placed-in-x-days", payload,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    // console.error("Error in getting user with expired location :", error);
    throw error;
  }
}

export const subscriptionExpiresInXDays = async (
  page: number,
  pageSize: number,
  daysBeforeExpiry?: number
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };


    const days = daysBeforeExpiry ?? 5;

    const payload = {
      ...query,
      daysBeforeExpiry: days
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/with-expiring-locations-in-x-days", payload,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    // console.error("Error in getting user with expired location :", error);
    throw error;
  }
}


export const trialSubscriptionExpiresInXDays = async (
  page: number,
  pageSize: number,
  daysBeforeExpiry?: number
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };

    const days = daysBeforeExpiry ?? 5;

    const payload = {
      ...query,
      daysBeforeExpiry: days
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/with-expiring-trial-locations-in-x-days", payload,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    // console.error("Error in getting user with expired location :", error);
    throw error;
  }
}

export const trialExpired = async (
  page: number,
  pageSize: number,
  startDate?: Date,
  endDate?: Date,
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };


    if (startDate && endDate) {
      query.creationDateFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    }

    const payload = {
      ...query,
      
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/expired-trial", payload,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    // console.error("Error in getting user with expired location :", error);
    throw error;
  }
}

export const expiredSubscription = async (
  page: number,
  pageSize: number,
  startDate?: Date,
  endDate?: Date,
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };


    if (startDate && endDate) {
      query.creationDateFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    }

    const payload = {
      ...query,
      
    }

    const response = await apiClient.post<any, {}>("/api/internal/users/with-expired-locations", payload,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;

    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    // console.error("Error in getting user with expired location :", error);
    throw error;
  }
}

export const followUpsOnCustomerFeedbacks = async (
  page: number,
  pageSize: number,
  startDate?: Date,
  endDate?: Date,
  
): Promise<any> => {
  try {
    const apiClient = new ApiClient();

    const query: any = {
      sorts: [
        {
          key: "dateCreated",
          direction: "DESC"
        }
      ],
      page: page ? page - 1 : 0,
      size: pageSize ? pageSize : 10
    };


    if (startDate && endDate) {
      query.creationDateFilter = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    }

    const payload = {
      ...query,
    }

    const response = await apiClient.post<any, {}>("/api/internal/user-follow-up-feedbacks", payload,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    });

    const data = response.content || response.data || response;


    if (!Array.isArray(data)) {
      throw new Error('Expected array but got: ' + typeof data);
    }

    return {
      content: parseStringify(data),
      totalElements: response.totalElements || data.length,
      totalPages: response.totalPages || Math.ceil((response.totalElements || data.length) / query.size)
    };
  } catch (error) {
    // console.error("Error in getting user with expired location :", error);
    throw error;
  }
}
export const getBusinessOwner = async (id: string) => {
  try {
    const apiClient = new ApiClient();
    const data = await apiClient.get(`/api/users/${id}`);
    return parseStringify(data);
  } catch (error) {
    throw error;
  }
}

export const recordFeedback = async (
  value: z.infer<typeof FeedbackSchema>
): Promise<FormResponse | void> => {
  let formResponse: FormResponse | null = null;
  const validFeedback = FeedbackSchema.safeParse(value)

  if (!validFeedback.success) {
    formResponse = {
      responseType: "error",
      message: "Please fill all the required fields",
      error: new Error(validFeedback.error.message)
    }
    return parseStringify(formResponse);
  }
  const activeUser = await getAuthenticatedUser();

  const payload = {
    ...validFeedback.data,
    internalProfileId: activeUser?.id,
      ...(validFeedback.data.archiveAccountOptions?.archiveAccount && {
          archiveAccountOptions: {
              archiveAccount: true
          }
      })
  }

  try {
    const apiClient = new ApiClient();


    await apiClient.post(
      '/api/internal/user-follow-up-feedbacks/create',
      payload,{
            headers: {
                "INTERNAL-DASHBOARD-API-KEY":
                    "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
            },
        }
    );
    formResponse = {
      responseType: "success",
      message: "User Feedback created successfully",
    };
  }
  catch (error: any) {
    const formattedError = await error;

    formResponse = {
      responseType: "error",
      message: formattedError.message,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }

  revalidatePath("/owners");
  return parseStringify(formResponse)
}

export const getBusinessOwnerSummary = async (id: string) => {
  try {
    const apiClient = new ApiClient();

    const data = await apiClient.post(`/api/internal/users/summary/${id}`,{
        headers: {
            "INTERNAL-DASHBOARD-API-KEY":
                "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
        },
    } );
    return parseStringify(data);
    console.log("user summary summary",data);
  } catch (error) {
      console.error("Error occurring while getting user details is",error);
    throw error;
  }
}