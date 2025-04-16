import { coerce, object, string, z } from "zod";

export const invoiceSchema = object({
    owner: z.union([z.string(), z.object({}).passthrough()]),
    device: z.union([z.string(), z.object({}).passthrough()]),
    quantity: coerce.number().int("Quantity must be an integer").nonnegative("Quantity cannot be negative"),
    due_date: string().min(1, "Due date is required"),
    invoice_date: string().min(1, "Invoice date is required"),
    note: string().min(1, "Note is required"),
  });
  