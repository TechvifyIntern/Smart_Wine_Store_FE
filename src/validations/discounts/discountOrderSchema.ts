import { z } from "zod";

// Schema for creating/editing discount orders
export const discountOrderSchema = z.object({
    DiscountValue: z
        .number({
            required_error: "Discount value is required",
            invalid_type_error: "Discount value must be a number",
        })
        .min(1, "Discount must be at least 1%")
        .max(100, "Discount cannot exceed 100%")
        .int("Discount value must be a whole number"),
    MinimumOrderValue: z
        .number({
            required_error: "Minimum order value is required",
            invalid_type_error: "Minimum order value must be a number",
        })
        .min(0, "Minimum order value cannot be negative")
        .int("Minimum order value must be a whole number"),
});

// Type exports
export type DiscountOrderFormData = z.infer<typeof discountOrderSchema>;
