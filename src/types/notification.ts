export interface NotificationData {
  id: number;
  title: string;
  content: string;
  type: string; // "discount-event" | "promotion" | ...
  linkUrl?: string;
  isRead?: boolean;
  createdAt: string;
}

export interface SSEEvent {
  type: 'connected' | 'heartbeat' | 'notification' | 'message' | 'error';
  data: any;
}

export interface SSEConnectionStatus {
  isConnected: boolean;
  connectionId: string | null;
  reconnectAttempts: number;
  lastError: string | null;
}
