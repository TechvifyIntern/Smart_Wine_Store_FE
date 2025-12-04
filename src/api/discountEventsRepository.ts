import BaseRepository from "./baseRepository";

interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface DiscountEvent {
  EventID: number;
  EventName: string;
  Description: string;
  DiscountValue?: number; // % (PascalCase for local data)
  discountValue?: number; // % (camelCase from API)
  TimeStart: string; // ISO string
  TimeEnd: string; // ISO string
  CreatedAt: string;
  UpdatedAt: string;
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
    super("/events");
  }

  /**
   * Get all discount events
   */
  async getDiscountEvents(
    params = {}
  ): Promise<ApiResponse<{ data: DiscountEvent[] }>> {
    return this.getAll(params);
  }

  /**
   * Create a new discount event
   */
  async createDiscountEvent(
    eventData: CreateDiscountEventData
  ): Promise<ApiResponse<DiscountEvent>> {
    return this.create(eventData);
  }

  /**
   * Update a discount event
   */
  async updateDiscountEvent(
    id: number,
    eventData: UpdateDiscountEventData
  ): Promise<ApiResponse<DiscountEvent>> {
    return this.update(id, eventData);
  }

  /**
   * Delete a discount event
   */
  async deleteDiscountEvent(id: number): Promise<ApiResponse<null>> {
    return this.delete(id);
  }
}

// Export singleton instance
const discountEventsRepository = new DiscountEventsRepository();
export default discountEventsRepository;
