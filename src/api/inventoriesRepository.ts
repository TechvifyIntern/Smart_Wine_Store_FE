import { api } from '@/services/api';
import BaseRepository from './baseRepository.js';

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
}

interface InventoryLog {
    LogID: number;
    ProductID: number;
    WarehouseID: number;
    ChangeQuantity: number;
    LogType: 'import' | 'export';
    LogDate: string;
    Notes?: string;
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

class InventoriesRepository extends BaseRepository {
    constructor() {
        super('/inventories');
    }

    /**
     * Get all inventories
     */
    async getInventories(params = {}): Promise<ApiResponse<Inventory[]>> {
        return this.getAll(params);
    }

    /**
     * Create a new inventory record
     */
    async createInventory(inventoryData: CreateInventoryData): Promise<ApiResponse<Inventory>> {
        return this.create(inventoryData);
    }

    /**
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
}

// Export singleton instance
const inventoriesRepository = new InventoriesRepository();
export default inventoriesRepository;
