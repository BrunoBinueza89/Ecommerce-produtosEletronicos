import { z } from "zod";

export const productCreateSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  brandId: z.coerce.number().int().positive(),
  name: z.string().min(3),
  slug: z.string().min(3).optional(),
  sku: z.string().min(3),
  price: z.coerce.number().nonnegative(),
  promotionalPrice: z.coerce.number().nonnegative().optional().nullable(),
  shortDescription: z.string().max(1000).optional().nullable(),
  description: z.string().max(10000).optional().nullable(),
  technicalSheet: z.record(z.string(), z.any()).optional().nullable(),
  status: z.enum(["ativo", "inativo", "sem_estoque", "estoque_baixo", "rascunho"]).optional(),
  weight: z.coerce.number().nonnegative().optional().nullable(),
  height: z.coerce.number().nonnegative().optional().nullable(),
  width: z.coerce.number().nonnegative().optional().nullable(),
  length: z.coerce.number().nonnegative().optional().nullable(),
  warrantyMonths: z.coerce.number().int().nonnegative().optional().nullable(),
  mainImageUrl: z.string().url().optional().nullable(),
  stockInitial: z.coerce.number().int().nonnegative(),
  stockMinimum: z.coerce.number().int().nonnegative().optional()
});

export const productMediaMutationSchema = z.object({
  mainImageUrl: z.string().url().optional().nullable()
});
