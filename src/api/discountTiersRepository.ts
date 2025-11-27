import BaseRepository from './baseRepository.js';

interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface DiscountTier {
    DiscountTierID: number;
    TierName: string;
    MinSpend: number;
    DiscountPercentage: number;
    Description?: string;
    isActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

interface CreateDiscountTierData {
    TierName: string;
    MinSpend: number;
    DiscountPercentage: number;
    Description?: string;
    isActive?: boolean;
}

interface UpdateDiscountTierData {
    TierName?: string;
    MinSpend?: number;
    DiscountPercentage?: number;
    Description?: string;
    isActive?: boolean;
}

class DiscountTiersRepository extends BaseRepository {
    constructor() {
        super('/discount-tiers');
    }

    /**
     * Get all discount tiers
     * @param params - Query parameters (optional)
     * @returns Promise with API response containing discount tiers array
     */
    async getDiscountTiers(params = {}): Promise<ApiResponse<DiscountTier[]>> {
        return this.getAll(params);
    }

    /**
     * Get a specific discount tier by ID
     * @param id - The discount tier ID
     * @returns Promise with API response containing discount tier details
     */
    async getDiscountTierById(id: number): Promise<ApiResponse<DiscountTier>> {
        return this.get(id);
    }

    /**
     * Create a new discount tier
     * @param tierData - The discount tier data to create
     * @returns Promise with API response containing the created discount tier
     */
    async createDiscountTier(tierData: CreateDiscountTierData): Promise<ApiResponse<DiscountTier>> {
        return this.create(tierData);
    }

    /**
     * Update a discount tier
     * @param id - The discount tier ID to update
     * @param tierData - The discount tier data to update
     * @returns Promise with API response containing the updated discount tier
     */
    async updateDiscountTier(id: number, tierData: UpdateDiscountTierData): Promise<ApiResponse<DiscountTier>> {
        return this.update(id, tierData);
    }

    /**
     * Delete a discount tier
     * @param id - The discount tier ID to delete
     * @returns Promise with API response
     */
    async deleteDiscountTier(id: number): Promise<ApiResponse<void>> {
        return this.delete(id);
    }
}

// Export singleton instance
const discountTiersRepository = new DiscountTiersRepository();
export default discountTiersRepository;
