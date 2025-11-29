import { api } from "@/services/api";
import type { Product } from "@/types/product-detail";

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);

    // Transform the API response to match our Product type
    const apiData = response.data.data;
    const transformedProduct: Product = {
      ...apiData,
      CategoryID: apiData.CategoryID || 0, // Provide default if missing
      detail: apiData.ProductDetail ? {
        ...apiData.ProductDetail,
        ABV: parseFloat(apiData.ProductDetail.ABV) || 0,
      } : undefined,
    };

    return {
      ...response.data,
      data: transformedProduct,
    };
  } catch (error) {
    throw error;
  }
};
