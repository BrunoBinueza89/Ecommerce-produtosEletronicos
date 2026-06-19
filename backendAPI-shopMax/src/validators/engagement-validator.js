import { z } from "zod";

export const abandonedCartProcessSchema = z.object({
  thresholdHours: z.coerce.number().int().min(1).max(720).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  dryRun: z.boolean().optional().default(false)
});
