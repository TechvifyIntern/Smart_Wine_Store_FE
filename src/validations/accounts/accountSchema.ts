import { z } from "zod";

// Schema for creating new account (calls /auth/register API)
export const createAccountSchema = z.object({
    UserName: z
        .string()
        .min(1, "User name is required")
        .max(100, "User name must be less than 100 characters"),
    Email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    PhoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\+?[0-9\s\-\(\)\.]{7,15}$/, "Invalid phone number format"),
    Birthday: z
        .string()
        .min(1, "Birthday is required")
        .refine((val) => {
            const birthDate = new Date(val);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 18;
        }, "You must be at least 18 years old to register"),
    RoleID: z
        .number()
        .min(1, "Role is required"),
    Password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    ConfirmPassword: z
        .string()
        .min(8, "Confirm password is required"),
    ImageURL: z
        .string()
        .url("Please enter a valid image URL")
        .optional()
        .or(z.literal("")),
}).refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords don't match",
    path: ["ConfirmPassword"],
});

// Schema for editing existing account
export const editAccountSchema = z.object({
    UserName: z
        .string()
        .min(1, "User name is required")
        .max(100, "User name must be less than 100 characters"),
    Email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    PhoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\+?[0-9\s\-\(\)\.]{7,15}$/, "Invalid phone number format"),
    Birthday: z
        .string()
        .min(1, "Birthday is required"),
    RoleID: z
        .number()
        .min(1, "Role is required"),
    TierID: z
        .number()
        .min(1, "Tier is required"),
    StatusID: z
        .number()
        .min(1, "Status is required"),
    StreetAddress: z
        .string()
        .optional(),
    Ward: z
        .string()
        .optional(),
    Province: z
        .string()
        .optional(),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type EditAccountFormData = z.infer<typeof editAccountSchema>;
