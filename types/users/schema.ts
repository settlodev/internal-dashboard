
import { object, string } from "zod";

export const UserSchema = object({
    firstName: string({message: "First name is required"}),
    lastName: string({message: "Last name is required"}),
    email: string({message: "Email is required"}).email("Invalid email"),
    phone: string({message: "Phone number is required"})
        .min(8, 'Phone number must be more than 8 characters')
        .max(20, 'Phone number can not be more than 20 characters'),
    role: string({message: "Role is required"}).uuid("Role ID must be a valid UUID"),
    userType: string({message: "User type is required"}),
})

export const SignUpSchema = object({
    first_name: string({message: "First name is required"}),
    last_name: string({message: "Last name is required"}),
    email: string({message: "Email is required"}).email("Invalid email"),
    phone: string({message: "Phone number is required"})
        .min(8, 'Phone number must be more than 8 characters')
        .max(20, 'Phone number can not be more than 20 characters'),
    role: string({message: "Role is required"}).uuid("Role ID must be a valid UUID"),
    user_type: string({message: "User type is required"}),
})