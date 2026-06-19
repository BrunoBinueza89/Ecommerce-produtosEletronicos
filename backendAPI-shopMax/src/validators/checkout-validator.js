import { z } from "zod";
import { addressCreateSchema } from "./customer-validator.js";

export const checkoutFinalizeSchema = z
  .object({
    sessionToken: z.string().uuid(),
    couponCode: z.string().min(3).max(120).optional().nullable(),
    addressId: z.coerce.number().int().positive().optional().nullable(),
    address: addressCreateSchema.optional(),
    shippingMethod: z.enum(["standard", "express"]),
    shippingPrice: z.coerce.number().nonnegative(),
    shippingEtaDays: z.coerce.number().int().positive().optional(),
    shippingCarrier: z.string().min(2).optional(),
    paymentMethod: z.enum(["pix", "cartao"]),
    installments: z.coerce.number().int().positive().optional().nullable(),
    notes: z.string().max(1000).optional().nullable()
  })
  .refine((payload) => payload.addressId || payload.address, {
    message: "Endereco existente ou novo endereco obrigatorio para checkout.",
    path: ["addressId"]
  });
