import BaseRepository from './baseRepository';

// Interface for Order
export interface Order {
    OrderID: number;
    UserID: number;
    TotalAmount: number;
    Status: string;
    ShippingAddress: string;
    PaymentMethod: string;
    CreatedAt: string;
    UpdatedAt: string;
}

// Interface for API response
export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

class OrdersRepository extends BaseRepository {
    constructor() {
        super('/orders');
    }

    // Get all orders with optional params
    async getOrders(params = {}): Promise<ApiResponse<{ data: Order[]; total: number }>> {
        return this.getAll(params) as Promise<ApiResponse<{ data: Order[]; total: number }>>;
    }

    // Get order by ID
    async getOrderById(id: number): Promise<ApiResponse<Order>> {
        return this.get(id) as Promise<ApiResponse<Order>>;
    }

    // Create new order
    async createOrder(data: Partial<Order>): Promise<ApiResponse<Order>> {
        return this.create(data) as Promise<ApiResponse<Order>>;
    }

    // Update order
    async updateOrder(id: number, data: Partial<Order>): Promise<ApiResponse<Order>> {
        return this.update(id, data) as Promise<ApiResponse<Order>>;
    }

    // Delete order
    async deleteOrder(id: number): Promise<ApiResponse<void>> {
        return this.delete(id) as Promise<ApiResponse<void>>;
    }
}

const ordersRepository = new OrdersRepository();
export default ordersRepository;
