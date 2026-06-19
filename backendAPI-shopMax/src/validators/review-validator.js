import { z } from "zod";

export const reviewCreateSchema = z.object({
  productId: z.coerce.number().int().positive(),
  orderId: z.coerce.number().int().positive().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(3).max(191).optional().nullable(),
  comment: z.string().min(3).max(5000).optional().nullable()
});
