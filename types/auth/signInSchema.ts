import { object, string } from "zod";

export const signInSchema =object({
    email:string({ required_error: "Email is required"}).min(6, "Please enter a valid email address").email("Please enter a valid email address"),
    password:string()
})