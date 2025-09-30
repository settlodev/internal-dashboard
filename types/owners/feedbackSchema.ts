

import { z } from "zod";

export const FeedbackSchema = z.object({
    nextFollowUpDate: z
        .string()
        .min(1, "Please select a date")
        .refine((dateStr) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(dateStr);
            selectedDate.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }, {
            message: "Follow-up date must be today or in the future"
        })
        .optional(),
    
    remarks: z
        .string({ 
            message: "Description is required" 
        })
        .min(1, "Remarks is required"),
    
    internalFollowUpTypeId: z
        .string({ 
            required_error: "Follow-up type is required" 
        })
        .min(1, "Please select a follow-up type"),
    
    userId: z.string()
});