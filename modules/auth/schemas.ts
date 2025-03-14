import { z } from "zod";

export const fullNameSchema = z.string().min(1).max(255);
export const emailSchema = z.string().email().min(1);
export const passwordSchema = z.string().min(8);

export const signupFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignupForm = z.infer<typeof signupFormSchema>;

export type LoginForm = z.infer<typeof loginFormSchema>;
