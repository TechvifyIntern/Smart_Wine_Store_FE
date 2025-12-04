import { api } from "@/services/api";

interface ApiResponsePaging<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        data: T[];
        total: number;
    };
}

export interface InventoryLog {
    InventoryLogID: number;
    TransactionTypeID: number;
    UserID: number;
    Username: string;
    Email: string;
    PhoneNumber: string;
    InventoryID: number;
    Location: string;
    ProductName: string;
    Quantity: number;
    Date: string;
}

interface GetInventoryLogsParams {
    page: number;
    size: number;
}

/**
 * Get inventory logs with pagination
 */
export const getInventoryLogs = async (
    params: GetInventoryLogsParams
): Promise<ApiResponsePaging<InventoryLog>> => {
    const response = await api.get<ApiResponsePaging<InventoryLog>>(
        "/inventory-logs",
        { params }
    );
    return response.data;
};
