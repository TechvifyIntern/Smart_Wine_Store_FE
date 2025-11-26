import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters long."),
  confirmNewPassword: z.string().min(1, "Confirm new password is required."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New password and confirm password do not match.",
  path: ["confirmNewPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
