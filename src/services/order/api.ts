// services/order/api.ts
import { api } from "@/services/api";
import { ApiResponse } from "@/types/responses";
import { Order } from "@/api/ordersRepository";

/**
 * Update order status
 */
export const updateOrderStatus = async (
    orderId: number,
    statusId: number
): Promise<ApiResponse<Order>> => {
    try {
        const response = await api.patch<ApiResponse<Order>>(
            `/orders/${orderId}/status?statusId=${statusId}`
        );
        return response.data;
    } catch (error) {
        console.error("API Error - updateOrderStatus:", error);
        throw error;
    }
};
