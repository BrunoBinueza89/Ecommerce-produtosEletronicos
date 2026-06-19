import { z } from "zod";

export const favoriteCreateSchema = z.object({
  productId: z.coerce.number().int().positive()
});
