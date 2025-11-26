import { z } from "zod";

export const categorySchema = z.object({
    CategoryName: z
        .string()
        .min(1, "Category name is required")
        .max(100, "Category name must be less than 100 characters"),
    Description: z
        .string()
        .min(1, "Description is required")
        .max(500, "Description must be less than 500 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
