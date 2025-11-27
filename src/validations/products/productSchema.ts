import { z } from "zod";

export const productDetailSchema = z.object({
    Size: z
        .number({ invalid_type_error: "Size must be a number" })
        .positive("Size must be greater than 0")
        .max(10000, "Size must be less than 10000 ml")
        .optional()
        .or(z.literal(0)),
    ABV: z
        .number({ invalid_type_error: "ABV must be a number" })
        .min(0, "ABV cannot be negative")
        .max(100, "ABV must be between 0 and 100")
        .optional()
        .or(z.literal(0)),
    Producer: z
        .string()
        .max(255, "Producer name must be less than 255 characters")
        .optional()
        .or(z.literal("")),
    Origin: z
        .string()
        .max(255, "Origin must be less than 255 characters")
        .optional()
        .or(z.literal("")),
    Varietal: z
        .string()
        .max(255, "Varietal must be less than 255 characters")
        .optional()
        .or(z.literal("")),
    DescriptionTitle: z
        .string()
        .max(255, "Description title must be less than 255 characters")
        .optional()
        .or(z.literal("")),
    DescriptionContents: z
        .string()
        .max(2000, "Description must be less than 2000 characters")
        .optional()
        .or(z.literal("")),
});

export const createProductSchema = z.object({
    ProductName: z
        .string()
        .min(1, "Product name is required")
        .max(255, "Product name must be less than 255 characters")
        .trim(),
    CategoryID: z
        .number({ invalid_type_error: "Please select a category" })
        .int("Category ID must be an integer")
        .positive("Please select a valid category"),
    ImageURL: z
        .string()
        .url("Invalid image URL format")
        .optional()
        .or(z.literal("")),
    CostPrice: z
        .number({ invalid_type_error: "Cost price must be a number" })
        .nonnegative("Cost price cannot be negative")
        .max(999999999, "Cost price is too large"),
    SalePrice: z
        .number({ invalid_type_error: "Sale price must be a number" })
        .positive("Sale price must be greater than 0")
        .max(999999999, "Sale price is too large"),
    isActive: z
        .boolean()
        .optional()
        .default(true),
    detail: productDetailSchema.optional(),
}).refine(
    (data) => data.SalePrice >= data.CostPrice,
    {
        message: "Sale price must be greater than or equal to cost price",
        path: ["SalePrice"],
    }
);

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
