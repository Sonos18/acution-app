import { z } from "zod";
export const Payment = z
  .object({
    paymentId: z.string(),
    userId: z.string(),
    total: z.number(),
    createdAt: z.string(),
    status: z.string(),
    aucitonId: z.string(),
  })
  .strict();
export type PaymentType = z.infer<typeof Payment>;
