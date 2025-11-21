import { z } from "zod";

// Base schema for creating discount products
export const discountProductSchema = z.object({
    ProductName: z
        .string()
        .min(1, "Product name is required")
        .min(3, "Product name must be at least 3 characters")
        .max(200, "Product name must not exceed 200 characters"),
    DiscountValue: z
        .number({
            required_error: "Discount value is required",
            invalid_type_error: "Discount value must be a number",
        })
        .min(1, "Discount must be at least 1%")
        .max(100, "Discount cannot exceed 100%")
        .int("Discount value must be a whole number"),
    TimeStart: z
        .string()
        .min(1, "Start date is required")
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, "Invalid start date"),
    TimeEnd: z
        .string()
        .min(1, "End date is required")
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, "Invalid end date"),
}).refine(
    (data) => {
        const start = new Date(data.TimeStart);
        const end = new Date(data.TimeEnd);
        return end > start;
    },
    {
        message: "End date must be after start date",
        path: ["TimeEnd"],
    }
);

// Schema for editing active discount products (only TimeEnd can be modified)
export const discountProductEditActiveSchema = z.object({
    ProductName: z.string(),
    DiscountValue: z.number(),
    TimeStart: z.string(),
    TimeEnd: z
        .string()
        .min(1, "End date is required")
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, "Invalid end date")
        .refine((val) => {
            const date = new Date(val);
            const now = new Date();
            return date > now;
        }, "End date must be in the future"),
}).refine(
    (data) => {
        const start = new Date(data.TimeStart);
        const end = new Date(data.TimeEnd);
        return end > start;
    },
    {
        message: "End date must be after start date",
        path: ["TimeEnd"],
    }
);

// Type exports
export type DiscountProductFormData = z.infer<typeof discountProductSchema>;
export type DiscountProductEditActiveFormData = z.infer<typeof discountProductEditActiveSchema>;
