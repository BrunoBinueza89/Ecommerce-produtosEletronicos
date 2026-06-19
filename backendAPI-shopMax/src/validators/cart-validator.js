import { z } from "zod";

export const addCartItemSchema = z.object({
  sessionToken: z.string().uuid(),
  productId: z.coerce.number().int().positive(),
  productVariationId: z.coerce.number().int().positive().optional().nullable(),
  quantity: z.coerce.number().int().positive()
});

export const updateCartItemSchema = z.object({
  sessionToken: z.string().uuid(),
  quantity: z.coerce.number().int()
});
