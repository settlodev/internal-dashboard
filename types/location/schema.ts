import { number, object, string } from "zod";

export const RequestSubscriptionSchema = object({
    reference: string({message: "Name is required"}).optional(),
    quantity: number({message: "Quantity is required"}).min(1, 'Quantity must be greater than 1'),
    description: string({message: "Description is required"}),
    phone: string({message: "Phone number is required"}).min(8, 'Phone number must be more than 8 characters').max(20, 'Phone number can not be more than 20 characters'),
    email: string({message: "Email is required"}).email("Invalid email"),
    packageId: string({message: "Package is required"}),
    payment_type: string({message: "Payment type is required"}),
    location: string({message: "Location is required"}),
    location_name: string({message: "Location name is required"}),
})