import { RefreshCcw } from "lucide-react";
import { z } from "zod";

export const SignInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
  })
  .strict();

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(255, { message: "First name is too long" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(255, { message: "Last name is too long" }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Not a valid email",
      }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, {
        message: "Password too short - should be 8 chars minimum",
      })
      .max(16, {
        message: "Password too long - should be 16 chars maximum",
      }),
    confirmPassword: z.string().min(8).max(16),
  })
  .strict()
  .superRefine((data, issue) => {
    const { password, confirmPassword } = data;
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      issue.addIssue({
        code: "custom",
        message: "password does not meet complexity requirements",
        path: ["password"],
      });
    }
    if (password !== confirmPassword) {
      issue.addIssue({
        code: "custom",
        message: "passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignInResSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: z.object({
      userId: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      role: z.string(),
      avatar: z.string(),
    }),
  })
  .strict();

export type SignInResSchemaType = z.infer<typeof SignInResSchema>;
