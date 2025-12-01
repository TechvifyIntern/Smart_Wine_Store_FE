import { api } from '@/services/api';
import BaseRepository from './baseRepository';
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
   * Update product status using PATCH (legacy)
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

  /**
   * Update product using PUT /products/{id}
   */
  async updateProductPut(id: number, productData: Partial<Product>): Promise<UpdateProductResponse> {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, productData);
      return response.data;
    } catch (error: any) {
      console.error('Full error object:', error);

      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.message;
        const statusCode = error.response.status;
        const errorData = error.response.data;
        console.error('Failed to update product (server error):', {
          statusCode,
          message: errorMessage,
          data: errorData,
          sentData: productData
        });
        throw new Error(`Failed to update product: ${errorMessage} (Status: ${statusCode})`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Failed to update product (no response):', {
          request: error.request,
          message: error.message,
          sentData: productData
        });
        throw new Error(`Failed to update product: No response from server`);
      } else {
        // Something else happened
        console.error('Failed to update product (unknown error):', {
          message: error.message,
          error: error,
          sentData: productData
        });
        throw new Error(`Failed to update product: ${error.message}`);
      }
    }
  }
}

// Export singleton instance
const productsRepository = new ProductsRepository();
export default productsRepository;
