import BaseRepository from './baseRepository';

interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface DiscountOrder {
    DiscountOrderID: number;
    DiscountID: number;
    OrderID: number;
    DiscountAmount: number;
    AppliedAt: string;
    CreatedAt: string;
    UpdatedAt: string;
}

interface CreateDiscountOrderData {
    DiscountValue: number;
    MinimumOrderValue: number;
}

interface UpdateDiscountOrderData {
    DiscountValue?: number;
    MinimumOrderValue?: number;
}

class DiscountOrdersRepository extends BaseRepository {
    constructor() {
        super('/discount-orders');
    }

    /**
     * Get all discount orders
     * @param params - Query parameters (optional)
     * @returns Promise with API response containing discount orders array
     */
    async getDiscountOrders(params = {}): Promise<ApiResponse<DiscountOrder[]>> {
        return this.getAll(params);
    }

    /**
     * Get a specific discount order by ID
     * @param id - The discount order ID
     * @returns Promise with API response containing discount order details
     */
    async getDiscountOrderById(id: number): Promise<ApiResponse<DiscountOrder>> {
        return this.get(id);
    }

    /**
     * Create a new discount order
     * @param orderData - The discount order data to create
     * @returns Promise with API response containing the created discount order
     */
    async createDiscountOrder(orderData: CreateDiscountOrderData): Promise<ApiResponse<DiscountOrder>> {
        return this.create(orderData);
    }

    /**
     * Update a discount order
     * @param id - The discount order ID to update
     * @param orderData - The discount order data to update
     * @returns Promise with API response containing the updated discount order
     */
    async updateDiscountOrder(id: number, orderData: UpdateDiscountOrderData): Promise<ApiResponse<DiscountOrder>> {
        return this.update(id, orderData);
    }

    /**
     * Delete a discount order
     * @param id - The discount order ID to delete
     * @returns Promise with API response
     */
    async deleteDiscountOrder(id: number): Promise<ApiResponse<void>> {
        return this.delete(id);
    }
}

// Export singleton instance
const discountOrdersRepository = new DiscountOrdersRepository();
export default discountOrdersRepository;
