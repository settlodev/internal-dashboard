import { object, string } from "zod";

export const resetPasswordSchema =object({
    email:string().email().optional(),
    password:string({ required_error: "Password is required"}).min(6, "Please enter a valid password")
})