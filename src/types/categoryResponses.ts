import { ApiResponse } from './responses';
import { Category } from './category';
import { Products } from './products';

// Category API response types
export type GetCategoriesResponse = ApiResponse<Category[]>;
export type GetCategoryByIdResponse = ApiResponse<Category>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type DeleteCategoryResponse = ApiResponse<null>;

export type GetParentCategoriesResponse = ApiResponse<Category[]>;
export type GetChildrenCategoriesResponse = ApiResponse<Category[]>;
export type GetProductsByCategoryResponse = ApiResponse<Products[]>;
export type GetParentCategoryByIdResponse = ApiResponse<Category | null>;
