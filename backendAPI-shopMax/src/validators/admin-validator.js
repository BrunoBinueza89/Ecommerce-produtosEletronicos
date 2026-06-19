import { z } from "zod";

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "aguardando_pagamento",
    "pagamento_aprovado",
    "em_separacao",
    "enviado",
    "entregue",
    "cancelado",
    "reembolsado"
  ]),
  trackingCode: z.string().max(191).optional().nullable()
});

export const stockAdjustSchema = z.object({
  quantityDelta: z.coerce.number().int(),
  stockMinimum: z.coerce.number().int().nonnegative().optional().nullable(),
  reason: z.string().min(3).max(500)
});

export const couponCreateSchema = z.object({
  code: z.string().min(3).max(120),
  type: z.enum(["valor_fixo", "percentual"]),
  fixedValue: z.coerce.number().nonnegative().optional().nullable(),
  percentage: z.coerce.number().min(0).max(100).optional().nullable(),
  validFrom: z.string().datetime().optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  minimumValue: z.coerce.number().nonnegative().optional(),
  totalUsageLimit: z.coerce.number().int().positive().optional().nullable(),
  customerUsageLimit: z.coerce.number().int().positive().optional().nullable(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  active: z.boolean().optional().default(true)
});

export const trackingBatchSyncSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(20)
});

export const integrationEmailTestSchema = z.object({
  recipientEmail: z.string().email()
});

export const integrationTrackingTestSchema = z.object({
  trackingCode: z.string().min(3).max(191),
  orderCode: z.string().min(3).max(120).optional().default("TESTE-SHOPMAX")
});

export const integrationLiveValidationSchema = z.object({
  recipientEmail: z.string().email(),
  trackingCode: z.string().min(3).max(191),
  orderCode: z.string().min(3).max(120).optional().default("TESTE-SHOPMAX")
});
