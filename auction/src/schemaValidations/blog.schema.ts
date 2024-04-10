import { z } from "zod";

export const BlogInput = z
  .object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    keyImage: z.string(),
  })
  .strict();

export type BlogInputType = z.infer<typeof BlogInput>;
