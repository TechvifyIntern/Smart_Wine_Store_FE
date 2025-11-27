import { api } from '@/services/api';
import BaseRepository from './baseRepository.js';
import type {
  GetProductsResponse,
  GetProductByIdResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  SearchProductsResponse,
  FilterProductsResponse,
  UpdateProductStatusResponse,
} from '@/types/productResponses';
import type { Product } from '@/data/products';

class ProductsRepository extends BaseRepository {
  constructor() {
    super('/products');
  }

  /**
   * Get all products
   */
  async getProducts(params = {}): Promise<GetProductsResponse> {
    return this.getAll(params);
  }

  /**
   * Get a product by ID
   */
  async getProductById(id: number): Promise<GetProductByIdResponse> {
    return this.get(id);
  }

  /**
   * Create a new product
   */
  async createProduct(productData: Omit<Product, 'ProductID'>): Promise<CreateProductResponse> {
    return this.create(productData);
  }

  /**
   * Update a product
   */
  async updateProduct(id: number, productData: Partial<Product>): Promise<UpdateProductResponse> {
    return this.update(id, productData);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<DeleteProductResponse> {
    return this.delete(id);
  }

  /**
   * Search products
   */
  async searchProducts(params: { name: string } & Record<string, unknown>): Promise<SearchProductsResponse> {
    try {
      const response = await api.get(`${this.endpoint}/search`, { params });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to search products: ${message}`);
    }
  }

  /**
   * Filter products
   */
  async filterProducts(params: Record<string, unknown>): Promise<FilterProductsResponse> {
    try {
      const response = await api.get(`${this.endpoint}/filter`, { params });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to filter products: ${message}`);
    }
  }

  /**
   * Update product status
   */
  async updateProductStatus(id: number, isActive: boolean): Promise<UpdateProductStatusResponse> {
    try {
      const response = await api.patch(`${this.endpoint}/${id}/status/${isActive}`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update product status: ${message}`);
    }
  }
}

// Export singleton instance
const productsRepository = new ProductsRepository();
export default productsRepository;
