import BaseRepository from './baseRepository.js';

interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface DiscountEvent {
    EventID: number;
    EventName: string;
    DiscountPercentage: number;
    StartDate: string;
    EndDate: string;
    isActive?: boolean;
    Description?: string;
}

interface CreateDiscountEventData {
    EventName: string;
    DiscountPercentage: number;
    StartDate: string;
    EndDate: string;
    isActive?: boolean;
    Description?: string;
}

interface UpdateDiscountEventData {
    EventName?: string;
    DiscountPercentage?: number;
    StartDate?: string;
    EndDate?: string;
    isActive?: boolean;
    Description?: string;
}

class DiscountEventsRepository extends BaseRepository {
    constructor() {
        super('/discount-events');
    }

    /**
     * Get all discount events
     */
    async getDiscountEvents(params = {}): Promise<ApiResponse<DiscountEvent[]>> {
        return this.getAll(params);
    }

    /**
     * Create a new discount event
     */
    async createDiscountEvent(eventData: CreateDiscountEventData): Promise<ApiResponse<DiscountEvent>> {
        return this.create(eventData);
    }

    /**
     * Update a discount event
     */
    async updateDiscountEvent(id: number, eventData: UpdateDiscountEventData): Promise<ApiResponse<DiscountEvent>> {
        return this.update(id, eventData);
    }
}

// Export singleton instance
const discountEventsRepository = new DiscountEventsRepository();
export default discountEventsRepository;
