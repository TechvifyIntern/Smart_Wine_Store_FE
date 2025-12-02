import { ApiResponse } from "./responses";
import { Category } from "./category";
import { Product } from "./product-detail";

// Category API response types
export type GetCategoriesResponse = ApiResponse<Category[]>;
export type GetCategoryByIdResponse = ApiResponse<Category>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type DeleteCategoryResponse = ApiResponse<null>;
export type GetChildrenCategoriesResponse = ApiResponse<Category[]>;
export type GetProductsByCategoryResponse = ApiResponse<Product[]>;
export type GetParentCategoryByIdResponse = ApiResponse<Category>;
