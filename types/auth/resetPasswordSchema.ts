import { object, string } from "zod";

export const resetPasswordSchema =object({
    email:string().email().optional(),
    password:string({ required_error: "Password is required"}).min(6, "Password must be at least 6 characters"),
    confirmPassword: string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
