import { ApiResponse, PaginatedData } from "./responses";
import { Product } from "./product-detail";

// Product API response types
export type GetProductsResponse = PaginatedData<Product[]>;
export type GetProductByIdResponse = ApiResponse<Product>;
export type CreateProductResponse = ApiResponse<Product>;
export type UpdateProductResponse = ApiResponse<Product>;
export type DeleteProductResponse = ApiResponse<null>;
export type SearchProductsResponse = PaginatedData<Product[]>;
export type FilterProductsResponse = PaginatedData<Product[]>;
export type UpdateProductStatusResponse = ApiResponse<Product>;
