import { z } from "zod";

export const RoleSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    permissions: z.record(z.boolean()).default({})
  });