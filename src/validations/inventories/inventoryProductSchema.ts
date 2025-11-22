import { z } from "zod";

export const createInventoryProductSchema = z.object({
    ProductName: z.string().min(1, "Product name is required").max(200, "Product name is too long"),
    ImageURL: z.string().min(1, "Image is required").refine((value) => {
        // Allow both URLs and base64 data URLs
        return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/");
    }, "Invalid image URL or file"),
    Quantity: z.number().int().min(0, "Quantity must be at least 0"),
    CostPrice: z.number().min(0, "Cost price must be at least 0"),
    SalePrice: z.number().min(0, "Sale price must be at least 0"),
}).refine((data) => data.SalePrice >= data.CostPrice, {
    message: "Sale price must be greater than or equal to cost price",
    path: ["SalePrice"],
});

export const updateInventoryProductSchema = z.object({
    ProductName: z.string().min(1, "Product name is required").max(200, "Product name is too long"),
    ImageURL: z.string().min(1, "Image is required").refine((value) => {
        // Allow both URLs and base64 data URLs
        return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/");
    }, "Invalid image URL or file"),
    Quantity: z.number().int().min(0, "Quantity must be at least 0"),
    CostPrice: z.number().min(0, "Cost price must be at least 0"),
    SalePrice: z.number().min(0, "Sale price must be at least 0"),
}).refine((data) => data.SalePrice >= data.CostPrice, {
    message: "Sale price must be greater than or equal to cost price",
    path: ["SalePrice"],
});

export const importStockSchema = z.object({
    importQuantity: z.number().int().min(1, "Import quantity must be at least 1"),
    batchCostPrice: z.number().min(0, "Batch cost price must be at least 0"),
});

export const exportStockSchema = z.object({
    exportQuantity: z.number().int().min(1, "Export quantity must be at least 1"),
    reason: z.string().min(1, "Reason is required").max(500, "Reason is too long"),
});

export type CreateInventoryProductFormData = z.infer<typeof createInventoryProductSchema>;
export type UpdateInventoryProductFormData = z.infer<typeof updateInventoryProductSchema>;
export type ImportStockFormData = z.infer<typeof importStockSchema>;
export type ExportStockFormData = z.infer<typeof exportStockSchema>;
