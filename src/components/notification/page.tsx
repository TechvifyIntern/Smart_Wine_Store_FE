"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Check, CheckCheck, RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function NotificationPage() {
    const { notifications, unreadCount, sseStatus, markAsRead, markAllAsRead, reconnect } =
        useNotifications();

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-sm text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread notification(s)` : "All caught up!"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* SSE Status Indicator */}
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${sseStatus.isConnected
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                    >
                        {sseStatus.isConnected ? (
                            <>
                                <Wifi className="w-3 h-3" />
                                <span>Live</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3" />
                                <span>Disconnected</span>
                            </>
                        )}
                    </div>

                    {!sseStatus.isConnected && (
                        <Button variant="outline" size="sm" onClick={reconnect}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reconnect
                        </Button>
                    )}

                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>
            </div>

            {/* Connection Status Details */}
            {sseStatus.reconnectAttempts > 0 && (
                <Card className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Reconnecting... Attempt {sseStatus.reconnectAttempts}
                    </p>
                </Card>
            )}

            {sseStatus.lastError && !sseStatus.isConnected && (
                <Card className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">Error: {sseStatus.lastError}</p>
                </Card>
            )}

            {/* Notifications List */}
            <div className="space-y-2">
                {notifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            We&apos;ll notify you when something important happens
                        </p>
                    </Card>
                ) : (
                    notifications.map((notification) => (
                        <Card
                            key={notification.NotificationID}
                            className={`p-4 cursor-pointer transition-all hover:shadow-md ${!(notification.IsRead ?? notification.isRead)
                                ? "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
                                : ""
                                }`}
                            onClick={async () => {
                                if (!(notification.IsRead ?? notification.isRead)) {
                                    try {
                                        await markAsRead(notification.NotificationID);
                                    } catch (error) {
                                        console.error("Error marking notification as read:", error);
                                    }
                                }
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`p-2 rounded-full ${!(notification.IsRead ?? notification.isRead)
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-foreground">{notification.Title}</h3>
                                        {!(notification.IsRead ?? notification.isRead) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                        await markAsRead(notification.NotificationID);
                                                    } catch (error) {
                                                        console.error("Error marking notification as read:", error);
                                                    }
                                                }}
                                            >
                                                <Check className="w-3 h-3 mr-1" />
                                                Mark as read
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.Message || notification.Content}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(notification.CreatedAt).toLocaleString()}
                                        </p>
                                        {notification.Type && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {notification.Type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
