import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { strongPassword } from "../auth/auth.validator.js";

export const updateUserInfoSchema = z
  .object({
    username: z.string().trim().max(255).optional(),
    email: z.string().trim().email().optional(),
    phone: z
      .string()
      .trim()
      .refine((num) => isValidPhoneNumber(num), {
        message: "Invalid Phone Number",
      })
      .optional()
      .nullable()
      .transform((v) => v ?? null),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field to update is required",
  });

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: strongPassword,
});

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export type updateUserInfoInput = z.infer<typeof updateUserInfoSchema>;
export type updateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;
export type idParamsType = z.infer<typeof idParamsSchema>;
