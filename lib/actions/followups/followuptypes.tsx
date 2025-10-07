'use server'
import ApiClient from "@/lib/api-client";
import { parseStringify } from "@/lib/utils";

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
  
      const response = await apiClient.post<any, {}>("/api/internal/user-follow-up-types", query,);
  
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