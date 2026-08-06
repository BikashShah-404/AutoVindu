import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

export const createUserSchema = z.object({
  username: z.string().trim().min(1, "Username is Required.").max(255),
  email: z.string().trim().email("Invalid Email Address."),
  password: strongPassword,
  phone: z
    .string()
    .trim()
    .refine((num) => isValidPhoneNumber(num), {
      message: "Invalid Phone Number.",
    })
    .optional()
    .nullable()
    .transform((v) => v ?? null),
});

export const loginUserSchema = z.object({
  identifier: z.string().trim().min(1, "Username or Email is required"),
  password: z.string().trim().min(1, "Password is required."),
});

export type createUserInput = z.infer<typeof createUserSchema>;
export type loginUserInput = z.infer<typeof loginUserSchema>;
