import { api } from '@/services/api';
import BaseRepository from './baseRepository.js';
import type {
  GetCategoriesResponse,
  GetCategoryByIdResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  GetChildrenCategoriesResponse,
  GetProductsByCategoryResponse,
  GetParentCategoryByIdResponse,
} from '@/types/categoryResponses';
import type { Category } from '@/types/category';

class CategoriesRepository extends BaseRepository {
  constructor() {
    super('/categories');
  }

  /**
   * Get all categories
   */
  async getCategories(params = {}): Promise<GetCategoriesResponse> {
    return this.getAll(params);
  }

  /**
   * Get a category by ID
   */
  async getCategoryById(id: number): Promise<GetCategoryByIdResponse> {
    return this.get(id);
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData: Omit<Category, 'CategoryID'>): Promise<CreateCategoryResponse> {
    return this.create(categoryData);
  }

  /**
   * Update a category
   */
  async updateCategory(id: number, categoryData: Partial<Category>): Promise<UpdateCategoryResponse> {
    return this.update(id, categoryData);
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<DeleteCategoryResponse> {
    return this.delete(id);
  }



  /**
   * Get children categories by parent ID
   */
  async getChildrenCategories(parentId: number): Promise<GetChildrenCategoriesResponse> {
    try {
      const response = await api.get(`${this.endpoint}/${parentId}/children`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch children categories: ${message}`);
    }
  }

  /**
   * Get products by category ID
   */
  async getProductsByCategory(categoryId: number): Promise<GetProductsByCategoryResponse> {
    try {
      const response = await api.get(`${this.endpoint}/${categoryId}/products`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch products for category: ${message}`);
    }
  }

  /**
   * Get parent category by category ID
   */
  async getParentCategoryById(categoryId: number): Promise<GetParentCategoryByIdResponse> {
    try {
      const response = await api.get(`${this.endpoint}/${categoryId}/parent`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch parent category: ${message}`);
    }
  }
}


// Export singleton instance
const categoriesRepository = new CategoriesRepository();
export default categoriesRepository;
