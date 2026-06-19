import { z } from "zod";

export const bannerCreateSchema = z.object({
  title: z.string().min(3).max(191),
  position: z.string().min(3).max(120),
  imageUrl: z.string().url(),
  linkUrl: z.string().min(1).max(255).optional().nullable(),
  status: z.enum(["ativo", "inativo"]).optional(),
  order: z.coerce.number().int().min(0).optional()
});

export const promotionCreateSchema = z
  .object({
    name: z.string().min(3).max(191),
    slug: z.string().min(3).optional(),
    type: z.enum(["produto", "categoria"]),
    value: z.coerce.number().nonnegative().optional().nullable(),
    percentage: z.coerce.number().min(0).max(100).optional().nullable(),
    startsAt: z.string().datetime().optional().nullable(),
    endsAt: z.string().datetime().optional().nullable(),
    status: z.enum(["ativa", "inativa"]).optional(),
    productId: z.coerce.number().int().positive().optional().nullable(),
    categoryId: z.coerce.number().int().positive().optional().nullable()
  })
  .refine(
    (payload) =>
      (payload.value !== null && payload.value !== undefined && payload.value > 0) ||
      (payload.percentage !== null && payload.percentage !== undefined && payload.percentage > 0),
    {
      message: "Promocao exige valor ou percentual positivo.",
      path: ["value"]
    }
  )
  .refine(
    (payload) =>
      (payload.type === "produto" && payload.productId) || (payload.type === "categoria" && payload.categoryId),
    {
      message: "Promocao exige alvo compativel com o tipo.",
      path: ["type"]
    }
  );
