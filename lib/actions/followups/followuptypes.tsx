'use server'
import ApiClient from "@/lib/api-client";
import { parseStringify } from "@/lib/utils";
import {UUID} from "node:crypto";
import {getAuthenticatedUser} from "@/lib/actions/auth/signIn";

export const searchFollowUpTypes = async (
    
  ): Promise<any> => {

    const page = 0;
    const pageSize = 500;
    try {
  
      const apiClient = new ApiClient();
      const query = {
        filters:[
  
        ],
        sorts:[
            {
                key:"dateCreated",
                direction:"DESC"
            }
        ],
        page:page ? page - 1:0,
        size:pageSize ? pageSize : 500
        
      };
  
      const response = await apiClient.post<any, {}>("/api/internal/user-follow-up-types", query,
          {
              headers: {
                  "INTERNAL-DASHBOARD-API-KEY":
                      "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
              },
          });
  
      const data = response.content || response.data || response;

    
      if (!Array.isArray(data)) {
        throw new Error('Expected array but got: ' + typeof data);
      }
  
      return parseStringify(data)
      
    } catch (error) {
  
      console.error("Error in getting unverified business owners :", error);
      throw error;
    }
  }

export const userFollowUpThreads = async (
    userId:UUID,
): Promise<any> => {

    const activeUser = await getAuthenticatedUser();
    const page = 0;
    const pageSize = 500;
    try {

        const apiClient = new ApiClient();
        const query = {
            sorts:[
                {
                    key:"dateCreated",
                    direction:"DESC"
                }
            ],
            page:page ? page - 1:0,
            size:pageSize ? pageSize : 500,
            userIdFilter:userId,
            internalProfileIdFilter:activeUser?.id

        };


        const response = await apiClient.post<any, {}>("/api/internal/user-follow-up-feedbacks", query,{
            headers: {
                "INTERNAL-DASHBOARD-API-KEY":
                    "CbQQHb1GZ2IbVREPp3lNzPFil8pg0eoa",
            },
        });

        const data = response.content || response.data || response;

        if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
        }

        // console.log("customer follow ups threads :", data);
        return parseStringify(data)

    } catch (error) {

        console.error("Error in getting unverified business owners :", error);
        throw error;
    }
}