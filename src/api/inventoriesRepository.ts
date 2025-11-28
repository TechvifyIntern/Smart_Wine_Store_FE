import { api } from '@/services/api';
import BaseRepository from './baseRepository';

interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface Inventory {
    InventoryID: number;
    ProductID: number;
    WarehouseID: number;
    Quantity: number;
    LastUpdated: string;
    ProductName?: string;
    WarehouseName?: string;
}

interface InventoryLog {
    LogID: number;
    ProductID: number;
    WarehouseID: number;
    ChangeQuantity: number;
    LogType: 'import' | 'export';
    LogDate: string;
    Notes?: string;
    CreatedBy?: string;
}

interface CreateInventoryData {
    ProductID: number;
    WarehouseID: number;
    Quantity: number;
}

interface ImportInventoryData {
    ProductID: number;
    WarehouseID: number;
    Quantity: number;
    Notes?: string;
}

interface ExportInventoryData {
    ProductID: number;
    WarehouseID: number;
    Quantity: number;
    Notes?: string;
}

interface GetInventoriesParams {
    page?: number;
    limit?: number;
    productId?: number;
    warehouseId?: number;
    minQuantity?: number;
    maxQuantity?: number;
    sortBy?: 'Quantity' | 'LastUpdated' | 'ProductID';
    sortOrder?: 'asc' | 'desc';
}

class InventoriesRepository extends BaseRepository {
    constructor() {
        super('/inventories');
    }

    /**
     * GET /inventories
     * Get all inventories with optional filters
     */
    async getInventories(params: GetInventoriesParams = {}): Promise<ApiResponse<Inventory[]>> {
        try {
            const response = await api.get(this.endpoint, { params });
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to get inventories: ${message}`);
        }
    }

    /**
     * POST /inventories
     * Create a new inventory record
     */
    async createInventory(inventoryData: CreateInventoryData): Promise<ApiResponse<Inventory>> {
        try {
            const response = await api.post(this.endpoint, inventoryData);
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to create inventory: ${message}`);
        }
    }

    /**
     * GET /inventories/product/{productId}
     * Get inventory by product ID
     */
    async getInventoryByProduct(productId: number): Promise<ApiResponse<Inventory[]>> {
        try {
            const response = await api.get(`${this.endpoint}/product/${productId}`);
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to get inventory for product ${productId}: ${message}`);
        }
    }

    /**
     * GET /inventories/warehouse/{warehouseId}/product/{productId}
     * Get inventory by warehouse and product
     */
    async getInventoryByWarehouseAndProduct(
        warehouseId: number,
        productId: number
    ): Promise<ApiResponse<Inventory>> {
        try {
            const response = await api.get(`${this.endpoint}/warehouse/${warehouseId}/product/${productId}`);
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to get inventory for warehouse ${warehouseId} and product ${productId}: ${message}`);
        }
    }

    /**
     * POST /inventories/import
     * Import inventory (increase stock)
     */
    async importInventory(importData: ImportInventoryData): Promise<ApiResponse<InventoryLog>> {
        try {
            const response = await api.post(`${this.endpoint}/import`, importData);
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to import inventory: ${message}`);
        }
    }

    /**
     * POST /inventories/export
     * Export inventory (decrease stock)
     */
    async exportInventory(exportData: ExportInventoryData): Promise<ApiResponse<InventoryLog>> {
        try {
            const response = await api.post(`${this.endpoint}/export`, exportData);
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to export inventory: ${message}`);
        }
    }

    /**
     * Batch import inventory for multiple products
     */
    async batchImportInventory(imports: ImportInventoryData[]): Promise<ApiResponse<InventoryLog[]>> {
        try {
            const response = await api.post(`${this.endpoint}/import/batch`, { imports });
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to batch import inventory: ${message}`);
        }
    }

    /**
     * Batch export inventory for multiple products
     */
    async batchExportInventory(exports: ExportInventoryData[]): Promise<ApiResponse<InventoryLog[]>> {
        try {
            const response = await api.post(`${this.endpoint}/export/batch`, { exports });
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to batch export inventory: ${message}`);
        }
    }

    /**
     * Get low stock items
     */
    async getLowStockItems(threshold: number = 10): Promise<ApiResponse<Inventory[]>> {
        try {
            const response = await api.get(`${this.endpoint}/low-stock`, {
                params: { threshold }
            });
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to get low stock items: ${message}`);
        }
    }

    /**
     * Get inventory logs/history
     */
    async getInventoryLogs(params: {
        productId?: number;
        warehouseId?: number;
        logType?: 'import' | 'export';
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<ApiResponse<InventoryLog[]>> {
        try {
            const response = await api.get(`${this.endpoint}/logs`, { params });
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to get inventory logs: ${message}`);
        }
    }
}

// Export singleton instance
const inventoriesRepository = new InventoriesRepository();
export default inventoriesRepository;

// Export types for use in components
export type {
    Inventory,
    InventoryLog,
    CreateInventoryData,
    ImportInventoryData,
    ExportInventoryData,
    GetInventoriesParams,
    ApiResponse
};
