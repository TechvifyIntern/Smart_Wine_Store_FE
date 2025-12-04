"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { NotificationData, SSEConnectionStatus } from "@/types/notification";
import { useSSENotifications } from "@/hooks/useSSENotifications";
import notificationsRepository, {
  Notification,
} from "@/api/notificationsRepository";
import { useAppStore } from "@/store/auth";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sseStatus: SSEConnectionStatus;
  hasMore: boolean;
  isLoading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
  reconnect: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setHasMore(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await notificationsRepository.getNotifications(LIMIT, 0);
      if (result && Array.isArray(result)) {
        setNotifications(result);
        setOffset(result.length);
        setHasMore(result.length >= LIMIT);
        // Check both isRead and IsRead for compatibility
        setUnreadCount(result.filter((n) => !(n.IsRead ?? n.isRead)).length);
      } else {
        console.warn("Invalid notifications response:", result);
        setNotifications([]);
        setUnreadCount(0);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, LIMIT]);

  // Handle new notification from SSE
  const handleNewNotification = useCallback(
    async (notification: NotificationData) => {
      // Convert SSE notification format to our Notification format
      const newNotification: Notification = {
        NotificationID: notification.id,
        UserID: 0, // Will be filled by backend
        Title: notification.title,
        Message: notification.content,
        IsRead: notification.isRead || false,
        CreatedAt: notification.createdAt,
        Type: notification.type,
        Content: notification.content,
        isRead: notification.isRead || false,
      };

      // Prepend new notification to the top of the list
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => (newNotification.IsRead ? prev : prev + 1));

      // Show toast notification
      toast.success(notification.title, {
        description: notification.content,
        action: notification.linkUrl
          ? {
              label: "View",
              onClick: () => {
                if (notification.linkUrl) {
                  window.location.href = notification.linkUrl;
                }
              },
            }
          : undefined,
      });

      // Acknowledge notification to backend
      try {
        // Validate notification ID before sending
        const notificationId = Number(notification.id);
        if (
          notificationId &&
          notificationId > 0 &&
          Number.isInteger(notificationId)
        ) {
          await notificationsRepository.acknowledgeNotification(notificationId);
        } else {
          console.warn("Invalid notification ID for ACK:", notification.id);
        }
      } catch (error) {
        console.error("Failed to acknowledge notification:", error);
      }
    },
    []
  );

  // SSE connection
  const { status: sseStatus, reconnect } = useSSENotifications({
    onNotification: handleNewNotification,
    onConnected: (connectionId) => {},
    onError: (error) => {
      console.error("SSE Error:", error);
    },
  });

  // Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationsRepository.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.NotificationID === id ? { ...n, IsRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsRepository.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, IsRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }, []);

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!user || isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const result = await notificationsRepository.getNotifications(
        LIMIT,
        offset
      );
      if (result && Array.isArray(result)) {
        setNotifications((prev) => [...prev, ...result]);
        setOffset((prev) => prev + result.length);
        setHasMore(result.length >= LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more notifications:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading, hasMore, offset, LIMIT]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    sseStatus,
    hasMore,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
    loadMore,
    reconnect,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
