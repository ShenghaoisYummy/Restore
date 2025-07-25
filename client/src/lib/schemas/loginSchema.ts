import { z } from "zod";

// Zod schema for login form
export const loginSchema = z.object({
  // Email field with email validation
  email: z.string().email(),
  // Password field with minimum length validation
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;