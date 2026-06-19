import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const customerRegisterSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    cpf: z.string().min(11).max(14),
    phone: z.string().min(8).max(32),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"]
  });
