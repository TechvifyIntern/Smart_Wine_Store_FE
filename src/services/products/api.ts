import { api } from "@/services/api";
import { Product } from "@/types/product-detail";
import { Products } from "@/types/products";
import { PaginatedData } from "@/types/responses";

export const getAllProducts = async (
  page?: number,
  size?: number
): Promise<PaginatedData<Product[]>> => {
  const response = await api.get("/products", {
    params:
      page !== undefined && size !== undefined
        ? { size, page: page - 1 } // subtract 1 here
        : undefined,
  });
  return response.data.data;
};

export const getFilteredProducts = async (params: {
  category?: string;
  origin?: string;
  minAbv?: number;
  maxAbv?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
  page?: number;
  size?: number;
}): Promise<PaginatedData<Products[]>> => {
  const response = await api.get("/products/filter", {
    params: {
      ...params,
      page: params.page !== undefined ? params.page - 1 : undefined,
    },
  });
  return response.data.data;
};

export const getSearchedProducts = async (params: {
  name?: string;
  page?: number;
  size?: number;
}): Promise<PaginatedData<Products[]>> => {
  const response = await api.get("/products/search", {
    params: {
      ...params,
      page: params.page !== undefined ? params.page - 1 : undefined,
    },
  });
  return response.data.data;
};
