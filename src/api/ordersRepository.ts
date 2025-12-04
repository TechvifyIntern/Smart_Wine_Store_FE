import { ApiResponsePaging } from "@/types/responses";
import BaseRepository from "./baseRepository";

// Interface for Order
export interface Order {
  OrderID: number;
  UserID: number;
  UserName?: string;
  Email?: string;
  PhoneNumber?: string;
  OrderStreetAddress?: string;
  OrderWard?: string;
  OrderProvince?: string;
  CreatedAt: string;
  Subtotal: number;
  DiscountTierValue?: number;
  DiscountEventValue?: number;
  FinalTotal: number;
  StatusID: number;
  DiscountID?: number;
  Details?: OrderDetail[];
}

// Interface for Order Detail
export interface OrderDetail {
  DetailID: number;
  OrderID: number;
  ProductID: number;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
  DiscountValue: number;
  FinalItemPrice: number;
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
    super("/orders");
  }

  // Get all orders with optional params
  async getOrders(params = {}): Promise<ApiResponsePaging<Order[]>> {
    return this.getAll(params) as Promise<ApiResponsePaging<Order[]>>;
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
  async updateOrder(
    id: number,
    data: Partial<Order>
  ): Promise<ApiResponse<Order>> {
    return this.update(id, data) as Promise<ApiResponse<Order>>;
  }

  // Delete order
  async deleteOrder(id: number): Promise<ApiResponse<void>> {
    return this.delete(id) as Promise<ApiResponse<void>>;
  }
}

const ordersRepository = new OrdersRepository();
export default ordersRepository;
