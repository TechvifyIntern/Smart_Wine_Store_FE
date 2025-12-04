import { api } from "@/services/api";
import { Product } from "@/types/product-detail";
import { ApiResponsePaging } from "@/types/responses";

export interface DiscountProductItem extends Product {
    DiscountProductID?: number;
    DiscountID?: number;
}

export interface AddDiscountRequest {
    discountValue: number;
    discountTypeId: number;
    productIds: number[];
}

export interface UpdateDiscountRequest {
    discountValue: number;
    discountTypeId: number;
    productIds: number[];
}

/**
 * Get all products for discount management with pagination and search
 */
export const getProductsForDiscount = async (params: {
    name?: string;
    categoryId?: number;
    page?: number;
    size?: number;
}): Promise<ApiResponsePaging<Product[]>> => {
    const response = await api.get("/products", {
        params: {
            size: params.size,
            page: params.page,
        },
    });
    return response.data;
};

/**
 * Search products by name for discount management
 */
export const searchProductsForDiscount = async (params: {
    name?: string;
    page?: number;
    size?: number;
}): Promise<ApiResponsePaging<Product[]>> => {
    const response = await api.get("/products/search", {
        params: {
            name: params.name,
            size: params.size,
            page: params.page !== undefined ? params.page - 1 : undefined,
        },
    });
    return response.data;
};/**
 * Add or update discount for multiple products
 * Uses the same endpoint for both create and update operations
 */
export const addDiscountToProducts = async (
    data: AddDiscountRequest
): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/products/discount", data);
    return response.data;
};

/**
 * Update discount for a single product or multiple products
 * Uses the same endpoint as addDiscountToProducts
 */
export const updateProductDiscount = async (
    productId: number,
    discountValue: number,
    discountTypeId: number = 1
): Promise<{ success: boolean; message: string; data: Product }> => {
    const response = await api.post("/products/discount", {
        discountValue,
        discountTypeId,
        productIds: [productId],
    });
    return response.data;
};

/**
 * Remove discount from a product
 * Send discountValue: 0 to remove discount
 */
export const removeProductDiscount = async (
    productId: number
): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/products/discount", {
        discountValue: 0,
        discountTypeId: 1,
        productIds: [productId],
    });
    return response.data;
};

/**
 * Get products with active discounts by discount event ID
 */
export const getProductsWithDiscounts = async (
    discountEventId: number,
    params?: {
        page?: number;
        size?: number;
    }
): Promise<ApiResponsePaging<Product[]>> => {
    const response = await api.get(`/products/discounts/${discountEventId}`, {
        params: {
            ...params,
            page: params?.page !== undefined ? params.page - 1 : undefined,
        },
    });
    return response.data;
};
