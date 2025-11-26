import { api } from "@/services/api";
import { Product } from "@/types/product-detail";
import { Products } from "@/types/products";
import { ApiResponse } from "@/types/responses";

export const getAllProducts = async (
  Cursor: number,
  Size: number
): Promise<ApiResponse<Product[]>> => {
  const response = await api.get("/products", {
    params: {
      Cursor,
      Size,
    },
  });
  return response.data;
};

export const getFilteredProducts = async (params: {
  category?: string;
  origin?: string;
  minAbv?: number;
  maxAbv?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
}): Promise<ApiResponse<Products[]>> => {
  const response = await api.get("/products/filter", { params });
  return response.data;
};

export const getSearchedProducts = async (params: {
  name?: string;
}): Promise<ApiResponse<Products[]>> => {
  const response = await api.get("/products/search", { params });
  return response.data;
};
