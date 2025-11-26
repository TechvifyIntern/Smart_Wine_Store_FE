import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const activeSubscriptions = new Set<string>(); // Keep track of active subscriptions
type ConnectionStatusCallback = (isConnected: boolean) => void;
let connectionStatusChangeCallback: ConnectionStatusCallback | null = null;

const _emitSubscribe = (room: string) => {
  if (socket?.connected) {
    socket.emit("subscribe", room);
  }
};

export const onConnectStatusChange = (callback: ConnectionStatusCallback) => {
  connectionStatusChangeCallback = callback;
  // Immediately report current status if socket already exists
  if (socket) {
    connectionStatusChangeCallback(socket.connected);
  }
};

export const getSocket = (backendUrl: string): Socket => {
  if (!socket) {
    socket = io(`${backendUrl}/iot`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      activeSubscriptions.forEach(_emitSubscribe); // Re-subscribe to all known rooms
      connectionStatusChangeCallback?.(true);
    });

    socket.on("disconnect", () => {
      connectionStatusChangeCallback?.(false);
      // Disconnected from IoT Gateway
    });
    socket.on("connect_error", (err) => {
      console.error("IoT Gateway Connection Error:", err);
      connectionStatusChangeCallback?.(false);
    });
  }
  return socket;
};

export const subscribeToRoom = (room: string) => {
  if (socket) {
    if (!activeSubscriptions.has(room)) {
      activeSubscriptions.add(room);
      _emitSubscribe(room);
    }
  } else {
    console.warn("Socket not initialized. Call getSocket first.");
  }
};

export const unsubscribeFromRoom = (room: string) => {
  if (socket) {
    if (activeSubscriptions.has(room)) {
      activeSubscriptions.delete(room);
      if (socket.connected) {
        socket.emit("unsubscribe", room);
      }
    }
  } else {
    console.warn("Socket not initialized. Call getSocket first.");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    activeSubscriptions.clear();
    connectionStatusChangeCallback?.(false);
  }
};
