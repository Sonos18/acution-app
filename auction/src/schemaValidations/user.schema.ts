import { z } from "zod";

export const UserRes = z
  .object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.string(),
    avatar: z.string(),
  })
  .strict();

export type UserResType = z.infer<typeof UserRes>;
export const UserUpdateSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
});
export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>;
