import { z } from "zod";

export const brandCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  logoUrl: z.string().url().optional().nullable(),
  status: z.enum(["ativo", "inativo"]).optional()
});
