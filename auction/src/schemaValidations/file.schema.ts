import { z } from "zod";

export const GetSignedUrlRes = z
  .object({
    url: z.string(),
    key: z.string(),
  })
  .strict();

export type GetSignedUrlResType = z.infer<typeof GetSignedUrlRes>;
