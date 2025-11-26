import { z } from "zod";

export const createProductSchema = z.object({
    ProductName: z
        .string()
        .min(1, "Product name is required")
        .max(255, "Product name must be less than 255 characters"),
    CategoryID: z
        .number()
        .min(1, "Category is required"),
    ImageURL: z
        .string()
        .url("Invalid image URL")
        .optional()
        .or(z.literal("")),
    CostPrice: z
        .number()
        .min(0, "Cost price must be non-negative"),
    SalePrice: z
        .number()
        .min(0, "Sale price must be non-negative"),
    isActive: z
        .boolean()
        .optional()
        .default(true),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
