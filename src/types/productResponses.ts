import { ApiResponse } from './responses';
import { Product } from '../data/products';

// Product API response types
export type GetProductsResponse = ApiResponse<Product[]>;
export type GetProductByIdResponse = ApiResponse<Product>;
export type CreateProductResponse = ApiResponse<Product>;
export type UpdateProductResponse = ApiResponse<Product>;
export type DeleteProductResponse = ApiResponse<null>;
export type SearchProductsResponse = ApiResponse<Product[]>;
export type FilterProductsResponse = ApiResponse<Product[]>;
export type UpdateProductStatusResponse = ApiResponse<Product>;
