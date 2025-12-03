import { api } from "@/services/api";
import { ApiResponse } from "@/types/responses";
import { Notification } from "@/api/notificationsRepository";

/**
 * Get all notifications for the current user
 * @param limit - Number of notifications to fetch (default: 10)
 * @param offset - Number of notifications to skip (default: 0)
 */
export const getNotifications = async (
    limit: number = 10,
    offset: number = 0
) => {
    try {
        const response = await api.get(
            `/notifications?limit=${limit}&offset=${offset}`
        );
        console.log("API Response - getNotifications:", response.data);

        // Backend returns { success, data: { notifications: [], total, limit, offset, hasMore } }
        const notifications = response.data.data?.notifications || [];

        // Map backend format to frontend format for backward compatibility
        const mappedNotifications = notifications.map((n: any) => ({
            ...n,
            Message: n.Content || n.Message, // Map Content to Message
            IsRead: n.isRead ?? n.IsRead, // Map isRead to IsRead
        }));

        console.log(`Mapped ${mappedNotifications.length} notifications`);
        return mappedNotifications;
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
export const markAllNotificationsAsRead = async (): Promise<ApiResponse<void>> => {
    try {
        const response = await api.post<ApiResponse<void>>("/notifications/read-all");
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
    // Validate notificationId
    if (!notificationId || notificationId <= 0 || !Number.isInteger(notificationId)) {
        console.error("Invalid notificationId:", notificationId);
        throw new Error(`Invalid notificationId: ${notificationId}. Must be a positive integer.`);
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
};/**
 * Check SSE connection status
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
 * Create SSE connection URL with token
 * EventSource doesn't support custom headers, so we pass token as query parameter
 */
export const createSSEUrl = (token: string): string => {
    if (!token) {
        console.error("SSE URL: No token provided");
        throw new Error("Token is required for SSE connection");
    }

    const baseURL = process.env.NEXT_PUBLIC_BE_API_URL || "http://localhost:3000";
    const url = `${baseURL}/sse/stream?token=${encodeURIComponent(token)}`;

    console.log("SSE URL created:", {
        baseURL,
        hasToken: !!token,
        tokenLength: token.length,
    });

    return url;
};
