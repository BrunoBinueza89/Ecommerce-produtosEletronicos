import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().max(5000).optional().nullable(),
  parentCategoryId: z.coerce.number().int().positive().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  status: z.enum(["ativo", "inativo"]).optional()
});
