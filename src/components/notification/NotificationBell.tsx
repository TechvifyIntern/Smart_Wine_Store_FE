"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";

interface NotificationBellProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  translations?: {
    notifications?: string;
    unread?: string;
    noNotifications?: string;
    markAllAsRead?: string;
    viewAll?: string;
  };
}

export function NotificationBell({
  size = "md",
  className = "",
  translations = {},
}: NotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();

  const {
    notifications: notificationsText = "Notifications",
    unread: unreadText = "unread",
    noNotifications: noNotificationsText = "No notifications",
    markAllAsRead: markAllAsReadText = "Mark all as read",
    viewAll: viewAllText = "View all",
  } = translations;

  const sizeClasses = {
    sm: "w-4 h-4 sm:w-5 sm:h-5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const badgeSizeClasses = {
    sm: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[9px] sm:text-[10px]",
    md: "h-5 w-5 text-[10px]",
    lg: "h-6 w-6 text-xs",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`relative p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors ${className}`}
        >
          <Bell className={`${sizeClasses[size]} text-muted-foreground`} />
          {unreadCount > 0 && (
            <span
              className={`absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 ${badgeSizeClasses[size]} rounded-full bg-red-500 text-white font-bold flex items-center justify-center`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold text-sm">{notificationsText}</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <>
                <span className="text-xs text-muted-foreground">
                  {unreadCount} {unreadText}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await markAllAsRead();
                    } catch (error) {
                      console.error("Failed to mark all as read:", error);
                    }
                  }}
                >
                  {markAllAsReadText}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {noNotificationsText}
            </div>
          ) : (
            <>
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.NotificationID}
                  className={`px-4 py-3 border-b hover:bg-muted cursor-pointer transition-colors ${!notification.IsRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    }`}
                  onClick={async () => {
                    if (!notification.IsRead) {
                      try {
                        await markAsRead(notification.NotificationID);
                      } catch (error) {
                        console.error("Error marking notification as read:", error);
                      }
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    {!notification.IsRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.Title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.Message || notification.Content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.CreatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {notifications.length > 5 && (
          <div className="px-4 py-3 border-t bg-background">
            <Button
              variant="ghost"
              size="sm"
              className="w-full hover:bg-muted"
              onClick={() => router.push("/notifications")}
            >
              {viewAllText}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
