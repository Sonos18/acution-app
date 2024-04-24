import { z } from "zod";

export const BlogInput = z
  .object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    keyImage: z.string(),
    hashtags: z.array(z.string()),
  })
  .strict();

export type BlogInputType = z.infer<typeof BlogInput>;

export const lastKey = z
  .object({
    blogId: z.string(),
    userId: z.string(),
  })
  .strict();
export type LastKeyType = z.infer<typeof lastKey>;

export const BlogsResponse = z
  .object({
    data: z.array(
      z.object({
        blogId: z.string(),
        title: z.string(),
        content: z.string(),
        hashtags: z.array(z.string()),
        image: z.string(),
        user: z.object({
          userId: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          avatar: z.string(),
        }),
        createdAt: z.string(),
        updatedAt: z.string(),
        likes: z.number(),
        isLiked: z.boolean(),
      })
    ),
    lastKey: z.object({
      blogId: z.string(),
      userId: z.string(),
    }),
  })
  .strict();
export type BlogsReponseType = z.infer<typeof BlogsResponse>;

export const BlogRes = z
  .object({
    blogId: z.string(),
    title: z.string(),
    content: z.string(),
    hashtags: z.array(z.string()),
    image: z.string(),
    user: z.object({
      userId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      avatar: z.string(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    likes: z.number(),
    isLiked: z.boolean(),
  })
  .strict();

export type BlogResType = z.infer<typeof BlogRes>;

export interface UpdateBlogInput {
  title: string;
  content: string;
  hashtags: string[];
  image?: string;
  keyImage: string[];
}
