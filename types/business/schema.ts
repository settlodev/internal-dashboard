import { boolean, object, string } from "zod";

export const BusinessTypeSchema = object({
    name: string({message: "Business type is required"}),
    status:boolean().optional()
})