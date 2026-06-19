import { z } from "zod";

export const addressCreateSchema = z.object({
  alias: z.string().max(120).optional().nullable(),
  recipient: z.string().min(3),
  zipCode: z.string().min(8).max(16),
  street: z.string().min(3),
  number: z.string().min(1).max(32),
  complement: z.string().max(191).optional().nullable(),
  district: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  reference: z.string().max(500).optional().nullable(),
  mainDelivery: z.boolean().optional(),
  mainBilling: z.boolean().optional()
});
