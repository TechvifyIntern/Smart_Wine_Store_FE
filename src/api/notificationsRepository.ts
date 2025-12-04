// notificationsRepository.ts
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  acknowledgeNotification,
  checkSSEStatus,
  createNotification,
} from "@/services/notification/api";

import { CreateNotificationFormData } from "@/validations/notifications/notificationSchema";

export interface Notification {
  NotificationID: number;
  UserID: number;
  Title: string;
  Content: string;
  Message?: string;
  isRead: boolean;
  IsRead?: boolean;
  CreatedAt: string;
  LinkURL?: string;
  Type?: string;
  NotificationTypeID?: number;
  ReadAt?: string;
}

export interface CreateNotificationResponse {
  success: boolean;
  notificationsCreated: number;
  scheduledJobId?: string;
  deliveryStatus: {
    sent: number;
    pendingOffline: number;
    failed: number;
  };
}

class NotificationsRepository {
  /**
   * Get notifications for the current user
   */
  async getNotifications(limit: number = 10, offset: number = 0) {
    return await getNotifications(limit, offset);
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: number) {
    return await markNotificationAsRead(id);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return await markAllNotificationsAsRead();
  }

  /**
   * Acknowledge SSE notification (client received)
   */
  async acknowledgeNotification(notificationId: number) {
    return await acknowledgeNotification(notificationId);
  }

  /**
   * Check SSE status
   */
  async checkSSEStatus() {
    return await checkSSEStatus();
  }

  /**
   * Create system notification (Admin)
   */
  async createNotification(data: CreateNotificationFormData) {
    return await createNotification(data);
  }
}

const notificationsRepository = new NotificationsRepository();
export default notificationsRepository;
