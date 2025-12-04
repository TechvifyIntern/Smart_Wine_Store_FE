// services/notification/api.ts
import { api } from "@/services/api";
import { ApiResponse } from "@/types/responses";
import { CreateNotificationFormData } from "@/validations/notifications/notificationSchema";

/**
 * Get notifications for the current user
 */
export const getNotifications = async (limit = 10, offset = 0) => {
  try {
    const response = await api.get(
      `/notifications?limit=${limit}&offset=${offset}`
    );

    const list = response.data.data?.notifications || [];

    // Normalized mapping
    return list.map((n: any) => ({
      ...n,
      Message: n.Content || n.Message,
      IsRead: n.isRead ?? n.IsRead,
    }));
  } catch (error) {
    console.error("API Error - getNotifications:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post<ApiResponse<void>>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    console.error("API Error - markNotificationAsRead:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<
  ApiResponse<void>
> => {
  try {
    const response = await api.post<ApiResponse<void>>(
      "/notifications/read-all"
    );
    return response.data;
  } catch (error) {
    console.error("API Error - markAllNotificationsAsRead:", error);
    throw error;
  }
};

/**
 * Acknowledge notification receipt (SSE)
 */
export const acknowledgeNotification = async (
  notificationId: number
): Promise<ApiResponse<void>> => {
  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    throw new Error(`Invalid notificationId: ${notificationId}`);
  }

  try {
    const response = await api.post<ApiResponse<void>>("/sse/stream/ack", {
      notificationId,
    });
    return response.data;
  } catch (error) {
    console.error("API Error - acknowledgeNotification:", error);
    throw error;
  }
};

/**
 * Check SSE status
 */
export const checkSSEStatus = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>("/sse/status");
    return response.data;
  } catch (error) {
    console.error("API Error - checkSSEStatus:", error);
    throw error;
  }
};

/**
 * Create SSE URL
 */
export const createSSEUrl = (token: string): string => {
  if (!token) throw new Error("Token is required for SSE connection");

  const baseURL = process.env.NEXT_PUBLIC_BE_API_URL || "http://localhost:3000";

  return `${baseURL}/sse/stream?token=${encodeURIComponent(token)}`;
};

export const createNotification = async (data: CreateNotificationFormData) => {
  try {
    const response = await api.post("/notifications/admin-create", data);
    return response.data;
  } catch (error) {
    console.error("API Error - createNotification:", error);
    throw error;
  }
};
