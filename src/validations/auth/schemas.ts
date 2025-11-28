import { z } from "zod";

// Sign In Schema
export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
        .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
        .regex(/(?=.*\d)/, "Password must contain at least one number"),
    rememberMe: z.boolean().optional().default(false),
});

// Sign Up Schema
export const signUpSchema = z
    .object({
        UserName: z
            .string()
            .min(1, "Full name is required")
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),
        Email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),
        Password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
            .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
            .regex(/(?=.*\d)/, "Password must contain at least one number"),
        ConfirmPassword: z
            .string()
            .min(1, "Please confirm your password"),
        PhoneNumber: z
            .string()
            .min(1, "Phone number is required")
            .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number")
            .refine((val) => {
                const digitsOnly = val.replace(/\D/g, "");
                return digitsOnly.length >= 10;
            }, "Phone number must be at least 10 digits"),
        Birthday: z
            .string()
            .min(1, "Birthday is required")
            .refine((val) => {
                const birthDate = new Date(val);
                const today = new Date();
                return birthDate <= today;
            }, "Birthday cannot be in the future")
            .refine((val) => {
                const birthDate = new Date(val);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();

                if (age > 18) return true;
                if (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0))) return true;
                return false;
            }, "You must be at least 18 years old")
            .refine((val) => {
                const birthDate = new Date(val);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age <= 120;
            }, "Please enter a valid birthday"),
        ImageURL: z.string().url().optional(),
        RoleID: z.number().optional(),
    })
    .refine((data) => data.Password === data.ConfirmPassword, {
        message: "Passwords do not match",
        path: ["ConfirmPassword"],
    });

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

// OTP Schema
export const otpSchema = z.object({
    otp: z.string().min(1, "OTP is required").max(6, "OTP must be 6 characters"),
});

// Type exports
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
