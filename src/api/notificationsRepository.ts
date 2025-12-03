import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    acknowledgeNotification,
    checkSSEStatus,
} from '@/services/notification/api';

export interface Notification {
    NotificationID: number;
    UserID: number;
    Title: string;
    Content: string; // Backend uses 'Content' not 'Message'
    Message?: string; // Keep for backward compatibility
    isRead: boolean; // Backend uses 'isRead' (lowercase)
    IsRead?: boolean; // Keep for backward compatibility
    CreatedAt: string;
    LinkURL?: string;
    Type?: string;
    NotificationTypeID?: number;
    ReadAt?: string;
}

export interface GetNotificationsResponse {
    success: boolean;
    data: Notification[];
    message?: string;
}

export interface AckNotificationRequest {
    notificationId: number;
}

class NotificationsRepository {
    /**
     * Get all notifications for the current user
     */
    async getNotifications(limit: number = 10, offset: number = 0) {
        const notifications = await getNotifications(limit, offset);
        console.log("Notifications fetched:", notifications);
        return notifications;
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(id: number): Promise<any> {
        return await markNotificationAsRead(id);
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<any> {
        return await markAllNotificationsAsRead();
    }

    /**
     * Acknowledge notification receipt (SSE)
     */
    async acknowledgeNotification(notificationId: number): Promise<void> {
        await acknowledgeNotification(notificationId);
    }

    /**
     * Check SSE connection status
     */
    async checkSSEStatus(): Promise<any> {
        return await checkSSEStatus();
    }
}

const notificationsRepository = new NotificationsRepository();
export default notificationsRepository;
