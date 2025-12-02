import { api } from '@/services/api';
import BaseRepository from './baseRepository';

export interface Notification {
    NotificationID: number;
    UserID: number;
    Title: string;
    Message: string;
    IsRead: boolean;
    CreatedAt: string;
    Type?: string;
}

export interface GetNotificationsResponse {
    success: boolean;
    data: Notification[];
    message?: string;
}

class NotificationsRepository extends BaseRepository {
    constructor() {
        super('/notifications');
    }

    /**
     * Get all notifications for the current user
     */
    async getNotifications(): Promise<GetNotificationsResponse> {
        return this.getAll();
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(id: number): Promise<any> {
        try {
            const response = await api.put(`${this.endpoint}/${id}/read`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to mark notification as read: ${error.message}`);
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<any> {
        try {
            const response = await api.put(`${this.endpoint}/read-all`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to mark all notifications as read: ${error.message}`);
        }
    }
}

const notificationsRepository = new NotificationsRepository();
export default notificationsRepository;
