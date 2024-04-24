import { z } from "zod";

export const GetSignedUrlRes = z
  .object({
    urls: z.array(z.string()),
    keys: z.array(z.string()),
  })
  .strict();

export type GetSignedUrlResType = z.infer<typeof GetSignedUrlRes>;
