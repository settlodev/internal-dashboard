import { boolean, coerce, object, string, z } from "zod";

export const invoiceSchema = object({
    owner: z.union([z.string(), z.object({}).passthrough()]),
    devices: z.array(
      z.object({
        device: z.union([
          z.string().min(1, "Device is required"),
          z.object({ id: z.string().uuid() }).passthrough(),
        ]),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    ).min(1, "At least one device is required"),
    
    due_date: string().min(1, "Due date is required"),
    invoice_date: string().min(1, "Invoice date is required"),
    note: string().min(1, "Note is required"),
    discount: coerce.number().optional().refine(value => value !== undefined && value >= 0, {
      message: "Discount must be a positive number",
    }).refine(value => value !== undefined).optional(),
    vat_inclusive:boolean().optional(),
  });

