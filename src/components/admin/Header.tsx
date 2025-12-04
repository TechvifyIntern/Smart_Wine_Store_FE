"use client";

import { Moon, Sun, User, Home, Languages, LogOut, Check, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useState, useEffect } from "react";
import notificationsRepository, { Notification } from "@/api/notificationsRepository";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, logout } = useAppStore();
  const { locale, setLocale, t } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        const notifications = await notificationsRepository.getNotifications();
        if (notifications) {
          const notificationsArray = Array.isArray(notifications)
            ? notifications
            : [];
          setNotifications(notificationsArray);
          setUnreadCount(notificationsArray.filter((n) => !n.IsRead).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className=" border-b border-[#F2F2F2] dark:bg-background dark:border-b dark:border-[#2c2c2c] px-4 py-2 md:px-8">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Logo */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/">
              <img
                src="/logo-light.svg"
                alt="Logo"
                width="70%"
                className="block dark:hidden"
              />
            </Link>
            <Link href="/">
              <img
                src="/logo-dark.svg"
                alt="Logo"
                width="70%"
                className="hidden dark:block"
              />
            </Link>
          </div>
        </div>

        {/* Right side - Notifications + Theme toggle + User Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="font-semibold text-sm">{t("header.notifications") || "Notifications"}</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {unreadCount} {t("header.unread") || "unread"}
                  </span>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {t("header.noNotifications") || "No notifications"}
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.NotificationID}
                      className={`px-4 py-3 border-b hover:bg-muted cursor-pointer transition-colors ${!notification.IsRead ? "bg-blue-50 dark:bg-blue-950/20" : ""
                        }`}
                      onClick={async () => {
                        if (!notification.IsRead) {
                          try {
                            await notificationsRepository.markAsRead(notification.NotificationID);
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.NotificationID === notification.NotificationID
                                  ? { ...n, IsRead: true }
                                  : n
                              )
                            );
                            setUnreadCount((prev) => Math.max(0, prev - 1));
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
                            {notification.Message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.CreatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle theme"
            variant="ghost"
            size="icon"
          >
            {mounted && (
              theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )
            )}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage
                    src={user?.photoURL || "/placeholder-user.jpg"}
                    alt={user?.email || "User"}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">{t("header.user")}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {user?.email || "admin@winestore.com"}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Trang người dùng */}
              <DropdownMenuItem
                onClick={() => router.push("/")}
                className="flex items-center cursor-pointer"
              >
                <Home className="mr-2 h-4 w-4" />
                {t("header.userPage")}
              </DropdownMenuItem>

              {/* Quản lý tài khoản cá nhân */}
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="flex items-center cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                {t("header.accountManagement")}
              </DropdownMenuItem>

              {/* Ngôn ngữ - Sub Menu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                  <Languages className="mr-2 h-4 w-4" />
                  {t("header.language")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => setLocale("vi")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{t("languages.vi")}</span>
                    {locale === "vi" && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLocale("en")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{t("languages.en")}</span>
                    {locale === "en" && <Check className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("header.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
