import { z } from "zod";

const passwordValidation = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{6,16}$'
);

// Zod schema for register form
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(passwordValidation, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character and be 6-16 characters long",
  }),
});

// Typescript type for register form
export type RegisterSchema = z.infer<typeof registerSchema>;
