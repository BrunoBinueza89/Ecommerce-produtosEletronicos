import { z } from "zod";

export const orderCancelSchema = z.object({
  reason: z.string().min(3).max(500).optional().nullable()
});
