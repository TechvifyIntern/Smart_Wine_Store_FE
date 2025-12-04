import BaseRepository from './baseRepository';

interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface DiscountProduct {
    DiscountProductID: number;
    DiscountID: number;
    ProductID: number;
    ProductName?: string;
    DiscountPercentage?: number;
    StartDate?: string;
    EndDate?: string;
    CreatedAt: string;
    UpdatedAt: string;
}

interface CreateDiscountProductData {
    DiscountID: number;
    ProductID: number;
}

interface UpdateDiscountProductData {
    DiscountID?: number;
    ProductID?: number;
}

class DiscountProductsRepository extends BaseRepository {
    constructor() {
        super('/products');
    }

    /**
     * Get all discount products
     * @param params - Query parameters (optional)
     * @returns Promise with API response containing discount products array
     */
    async getDiscountProducts(params = {}): Promise<ApiResponse<DiscountProduct[]>> {
        return this.getAll(params);
    }

    /**
     * Get a specific discount product by ID
     * @param id - The discount product ID
     * @returns Promise with API response containing discount product details
     */
    async getDiscountProductById(id: number): Promise<ApiResponse<DiscountProduct>> {
        return this.get(id);
    }

    /**
     * Create a new discount product
     * @param productData - The discount product data to create
     * @returns Promise with API response containing the created discount product
     */
    async createDiscountProduct(productData: CreateDiscountProductData): Promise<ApiResponse<DiscountProduct>> {
        return this.create(productData);
    }

    /**
     * Update a discount product
     * @param id - The discount product ID to update
     * @param productData - The discount product data to update
     * @returns Promise with API response containing the updated discount product
     */
    async updateDiscountProduct(id: number, productData: UpdateDiscountProductData): Promise<ApiResponse<DiscountProduct>> {
        return this.update(id, productData);
    }

    /**
     * Delete a discount product
     * @param id - The discount product ID to delete
     * @returns Promise with API response
     */
    async deleteDiscountProduct(id: number): Promise<ApiResponse<void>> {
        return this.delete(id);
    }
}

// Export singleton instance
const discountProductsRepository = new DiscountProductsRepository();
export default discountProductsRepository;
