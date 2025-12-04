import { useEffect, useRef, useState, useCallback } from "react";
import { NotificationData, SSEConnectionStatus } from "@/types/notification";
import { useAppStore } from "@/store/auth";
import { createSSEUrl } from "@/services/notification/api";

interface UseSSENotificationsOptions {
  onNotification?: (notification: NotificationData) => void;
  onConnected?: (connectionId: string) => void;
  onError?: (error: string) => void;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export function useSSENotifications(options: UseSSENotificationsOptions = {}) {
  const {
    onNotification,
    onConnected,
    onError,
    maxReconnectAttempts = 5,
    reconnectDelay = 3000,
  } = options;

  const { user, accessToken } = useAppStore();
  const [status, setStatus] = useState<SSEConnectionStatus>({
    isConnected: false,
    connectionId: null,
    reconnectAttempts: 0,
    lastError: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!accessToken || !user) {
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    try {
      // Create SSE URL with token from service API
      const url = createSSEUrl(accessToken);

      // Create EventSource with authorization via URL parameter
      // Note: withCredentials requires backend to set specific origin, not wildcard '*'
      const eventSource = new EventSource(url, {
        withCredentials: true,
      });

      eventSourceRef.current = eventSource;

      // Handle connection open
      eventSource.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setStatus((prev) => ({
          ...prev,
          isConnected: true,
          reconnectAttempts: 0,
          lastError: null,
        }));
      };

      // Handle connected event
      eventSource.addEventListener("connected", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setStatus((prev) => ({
          ...prev,
          connectionId: data.connectionId,
        }));
        onConnected?.(data.connectionId);
      });

      // Handle heartbeat event
      eventSource.addEventListener("heartbeat", () => {
        // Silent heartbeat - just keeps connection alive
      });

      // Handle notification event
      eventSource.addEventListener("notification", (event: MessageEvent) => {
        const notification: NotificationData = JSON.parse(event.data);
        onNotification?.(notification);
      });

      // Handle message event
      eventSource.addEventListener("message", (event: MessageEvent) => {});

      // Handle error event from server
      eventSource.addEventListener("error", (event: MessageEvent) => {
        try {
          if (event.data) {
            const data = JSON.parse(event.data);
            console.error("SSE: Error event from server", data);
            setStatus((prev) => ({
              ...prev,
              lastError: data.message || "Server error",
            }));
            onError?.(data.message);
          }
        } catch (parseError) {
          console.error("SSE: Could not parse error event data", event);
        }
      });

      // Handle connection error
      eventSource.onerror = (error) => {
        console.error("SSE: Connection error", {
          readyState: eventSource.readyState,
          url: eventSource.url,
          error,
        });

        // Only close if connection is truly broken
        if (eventSource.readyState === EventSource.CLOSED) {
        }

        eventSource.close();

        const errorMessage =
          eventSource.readyState === EventSource.CONNECTING
            ? "Reconnecting..."
            : "Connection error";

        setStatus((prev) => ({
          ...prev,
          isConnected: false,
          lastError: errorMessage,
        }));

        // Attempt to reconnect only if not at max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay =
            reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);

          setStatus((prev) => ({
            ...prev,
            reconnectAttempts: reconnectAttemptsRef.current,
          }));

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          const maxErrorMsg = "Max reconnection attempts reached";
          console.error("SSE:", maxErrorMsg);
          setStatus((prev) => ({
            ...prev,
            lastError: maxErrorMsg,
          }));
          onError?.(maxErrorMsg);
        }
      };
    } catch (error) {
      console.error("SSE: Failed to create connection", error);
      setStatus((prev) => ({
        ...prev,
        lastError: "Failed to create connection",
      }));
      onError?.("Failed to create connection");
    }
  }, [
    accessToken,
    user,
    onNotification,
    onConnected,
    onError,
    maxReconnectAttempts,
    reconnectDelay,
  ]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setStatus({
      isConnected: false,
      connectionId: null,
      reconnectAttempts: 0,
      lastError: null,
    });
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (accessToken && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, user]);

  return {
    status,
    connect,
    disconnect,
    reconnect,
  };
}
