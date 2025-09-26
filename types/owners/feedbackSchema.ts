// import { date, object, string } from "zod";

// export const FeedbackSchema = object({
//     nextFollowUpDate: date({ message: "Please select a valid date" }).optional(),
//     remarks: string({ message: "Description is required" }),
//     internalFollowUpTypeId: string({ 
//         required_error: "Follow-up type is required" 
//     }).min(1, "Please select a follow-up type"),
//     userId:string()
// });

import { z } from "zod";

export const FeedbackSchema = z.object({
    nextFollowUpDate: z
        .date({ 
            message: "Please select a valid date" 
        })
        .refine((date) => {
            // Ensure the date is today or in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(date);
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