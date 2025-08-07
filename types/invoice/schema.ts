
import { boolean, coerce, object, string, z } from "zod";

export const invoiceSchema = object({
    owner: z.union([z.string(), z.object({}).passthrough()]),
    devices: z.array(
      z.object({
        device: z.union([
          z.string(),
          z.object({ id: z.string().uuid() }).passthrough(),
        ]).optional(),
        quantity: z.number().min(1, "Quantity must be at least 1").optional()
      })
    ).optional().default([]),
    subscriptions: z.array(
      z.object({
        subscription: z.union([
          z.string(),
          z.object({ id: z.string().uuid() }).passthrough(),
        ]).optional(),
        quantity: z.number().min(1, "Quantity must be at least 1 month").optional(),
      })
    ).optional().default([]),
    
    due_date: string().min(1, "Due date is required"),
    invoice_date: string().min(1, "Invoice date is required"),
    note: string().min(1, "Note is required"),
    discount: coerce.number().optional().refine(value => value !== undefined && value >= 0, {
      message: "Discount must be a positive number",
    }).refine(value => value !== undefined).optional(),
    vat_inclusive: boolean().optional(),
}).refine(
  (data) => {
    // Helper function to check if a value is truly empty
    const isEmpty = (value: any) => {
      if (!value) return true;
      if (typeof value === 'string') return value.trim() === '';
      if (typeof value === 'object' && !value.id) return true;
      return false;
    };

    // Filter out empty devices
    const validDevices = (data.devices || []).filter(d => 
      d.device && !isEmpty(d.device) && d.quantity && d.quantity > 0
    );
    
    // Filter out empty subscriptions
    const validSubscriptions = (data.subscriptions || []).filter(s => 
      s.subscription && !isEmpty(s.subscription) && s.quantity && s.quantity > 0
    );
    
    // At least one valid device or subscription must exist
    return validDevices.length > 0 || validSubscriptions.length > 0;
  },
  {
    message: "At least one device or subscription is required",
    path: ["root"],
  }
);