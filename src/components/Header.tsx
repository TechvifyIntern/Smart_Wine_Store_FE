"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingCart,
  Search,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  User,
  Store,
  Home,
  Languages,
  Check,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { navigationLinks } from "@/data/navigation";
import { useTheme } from "next-themes";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useLocale } from "@/contexts/LocaleContext";
import { Category } from "@/types/category";
import { getParentCategory, getChildrenCategory } from "@/services/header/api";
import { Notification } from "@/api/notificationsRepository";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childrenCategories, setChildrenCategories] = useState<
    Record<number, Category[]>
  >({});

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, authOpen, authMode, setAuthOpen, setAuthMode } =
    useAppStore();
  const isAuthenticated = !!user;
  const { locale, setLocale, t } = useLocale();

  // Use NotificationContext for notifications and SSE
  const {
    notifications,
    unreadCount,
    sseStatus,
    hasMore,
    isLoading,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useNotifications();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      router.push(
        `/products/search?keywords=${encodeURIComponent(searchText.trim())}`
      );
      setIsSearchOpen(false);
    }
  };

  const { items } = useCartStore();
  const totalItems = mounted
    ? items.reduce((total, item) => total + item.Quantity, 0)
    : 0;

  // Kiểm tra role: admin (roleId: 1), seller (roleId: 2), user (roleId: 3)
  const userRoleId = user?.roleId ? parseInt(user.roleId) : undefined;
  const isAdmin = userRoleId === 1;
  const isSeller = userRoleId === 2;
  const isInAdminPage = pathname?.startsWith("/admin");

  const handleLogout = () => {
    router.push("/");
    logout();
  };

  const handleAuthModeChange = (mode: "signin" | "signup" | "forgot" | "otp") =>
    setAuthMode(mode);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const parentRes = await getParentCategory();
        const parents = parentRes.data;

        // Fetch children song song
        const childrenPromises = parents.map((p) =>
          getChildrenCategory(p.CategoryID)
        );

        const childrenResults = await Promise.all(childrenPromises);

        // Gom children theo parentId để lookup nhanh
        const childrenMap: Record<number, Category[]> = {};

        parents.forEach((p, index) => {
          const childData = childrenResults[index].data;
          childrenMap[p.CategoryID] = childData;
        });

        setParentCategories(parents);
        setChildrenCategories(childrenMap);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Format notification time
  const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("vi-VN");
  };

  if (!mounted) return null;

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-background/95 dark:backdrop-blur-md dark:border-b dark:border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] sm:w-[320px] overflow-y-auto"
                >
                  <MobileMenu
                    navigationLinks={navigationLinks}
                    parentCategories={parentCategories}
                    childrenCategories={childrenCategories}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    isAdmin={isAdmin}
                    isSeller={isSeller}
                    isInAdminPage={isInAdminPage}
                    locale={locale}
                    t={t}
                    setLocale={setLocale}
                    handleLogout={handleLogout}
                    setAuthMode={setAuthMode}
                    setAuthOpen={setAuthOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    router={router}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/">
                <div className="text-lg sm:text-xl font-bold md:hidden dark:md:hidden">
                  WINE
                </div>
                <img
                  src="/logo-light.svg"
                  alt="Logo"
                  className="hidden md:block dark:hidden h-6 md:h-8 w-auto"
                />
                <img
                  src="/logo-dark.svg"
                  alt="Logo"
                  className="hidden dark:md:block h-6 md:h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationLinks.map((link) => {
                const children =
                  link.label === "Products" ? parentCategories : [];
                const hasDropdown = children.length > 0;
                const isActive =
                  pathname === link.href ||
                  pathname?.startsWith(link.href + "/");

                return (
                  <div key={link.label} className="relative group">
                    {hasDropdown ? (
                      <Link href={link.href}>
                        <div
                          className={`text-sm font-medium cursor-pointer flex items-center transition relative ${
                            isActive
                              ? "text-primary font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t(`navigation.${link.key}`)}
                          <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                          {isActive && (
                            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
                          )}
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm font-medium flex items-center transition relative ${
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t(`navigation.${link.key}`)}
                        {isActive && (
                          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </Link>
                    )}

                    {/* Level 1 dropdown */}
                    {hasDropdown && (
                      <div
                        className="
                          absolute top-full left-0 mt-2 w-56 bg-background border rounded-md shadow-lg py-1 z-50
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible
                          transition-all duration-200
                        "
                      >
                        {children.map((cat) => {
                          const subChildren =
                            childrenCategories[cat.CategoryID] || [];
                          const hasSub = subChildren.length > 0;

                          return (
                            <div
                              key={cat.CategoryID}
                              className="relative group/sub"
                            >
                              <Link
                                href={`/products?category=${cat.CategoryID}`}
                                className="flex items-center justify-between px-4 py-2 hover:bg-muted text-sm text-foreground transition-colors"
                              >
                                {cat.CategoryName}
                                {hasSub && (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                              </Link>

                              {hasSub && (
                                <div
                                  className="
            absolute left-full top-0 w-48 bg-background border rounded-md shadow-lg ml-1
            opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible
            transition-all duration-200
          "
                                >
                                  {subChildren.map((sub) => (
                                    <Link
                                      key={sub.CategoryID}
                                      href={`/products?category=${sub.CategoryID}`}
                                      className="block px-4 py-2 hover:bg-muted text-sm text-foreground transition-colors"
                                    >
                                      {sub.CategoryName}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {/* Search */}
              <div className="flex items-center transition-all duration-300">
                {/* Ô tìm kiếm mở rộng khi bấm */}
                <input
                  value={searchText}
                  onChange={handleChange}
                  onKeyDown={handleSearchSubmit}
                  type="text"
                  placeholder={t("navigation.search")}
                  className={`mr-2 
      bg-background border border-input rounded-md shadow-sm dark:border-white/20
      px-2 sm:px-3 py-1.5 text-xs sm:text-sm
      transition-all duration-300
      ${isSearchOpen ? "w-40 sm:w-48 md:w-64 opacity-100 ml-2" : "w-0 opacity-0 ml-0 p-0 border-0"}
    `}
                />

                {/* Icon search */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Notifications */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                      {/* {sseStatus.isConnected && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background" />
                      )} */}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 sm:w-96" align="end">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">
                          {t("header.notifications") || "Notifications"}
                        </h3>
                        {unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 px-1.5 text-xs"
                          >
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={async () => {
                            try {
                              await markAllAsRead();
                              toast.success("All notifications marked as read");
                            } catch (error) {
                              toast.error("Failed to mark all as read");
                            }
                          }}
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>

                    {/* SSE Status */}
                    {!sseStatus.isConnected &&
                      sseStatus.reconnectAttempts > 0 && (
                        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b text-xs">
                          <p className="text-yellow-800 dark:text-yellow-300">
                            Reconnecting... (Attempt{" "}
                            {sseStatus.reconnectAttempts})
                          </p>
                        </div>
                      )}

                    {/* Notifications List */}
                    {notifications.length === 0 ? (
                      <div className="px-4 py-12 text-center">
                        <Bell className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {t("header.noNotifications") ||
                            "No notifications yet"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col max-h-[400px]">
                        <ScrollArea className="max-h-[400px]">
                          <div className="divide-y">
                            {notifications.map((notification) => (
                              <div
                                key={notification.NotificationID}
                                className={`px-4 py-3 hover:bg-muted cursor-pointer transition-colors ${
                                  !(notification.IsRead ?? notification.isRead)
                                    ? "bg-blue-50 dark:bg-blue-950/20"
                                    : ""
                                }`}
                                onClick={async () => {
                                  if (
                                    !(
                                      notification.IsRead ?? notification.isRead
                                    )
                                  ) {
                                    try {
                                      await markAsRead(
                                        notification.NotificationID
                                      );
                                    } catch (error) {
                                      console.error(
                                        "Failed to mark as read:",
                                        error
                                      );
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  {!(
                                    notification.IsRead ?? notification.isRead
                                  ) && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="text-sm font-medium text-foreground line-clamp-1">
                                        {notification.Title}
                                      </p>
                                      {notification.Type && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs shrink-0"
                                        >
                                          {notification.Type}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {notification.Message ||
                                        notification.Content}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-1.5">
                                      {formatNotificationTime(
                                        notification.CreatedAt
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {/* Footer - Fixed at bottom */}
                          </div>
                          {hasMore && (
                            <div className="sticky px-4 py-2 mt-3 border-t bg-primary bottom-0 w-full">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs"
                                onClick={async () => {
                                  try {
                                    await loadMore();
                                  } catch (error) {
                                    toast.error(
                                      "Failed to load more notifications"
                                    );
                                  }
                                }}
                                disabled={isLoading}
                              >
                                {isLoading
                                  ? "Loading..."
                                  : "Load more notifications"}
                              </Button>
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <button className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Auth */}
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                    }}
                  >
                    {t("header.signIn")}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                    }}
                  >
                    {t("header.signUp")}
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-7 w-7 sm:h-9 sm:w-9 rounded-full ml-1"
                    >
                      <Avatar className="h-7 w-7 sm:h-9 sm:w-9 border border-border">
                        <AvatarImage
                          src={user?.photoURL || "/placeholder-user.jpg"}
                          alt={user.email}
                        />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm">
                          {t("header.user")}
                        </p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Quản lý hệ thống - chỉ dành cho admin (roleId: 1) */}
                    {isAdmin && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(isInAdminPage ? "/" : "/admin")
                        }
                        className="flex items-center cursor-pointer"
                      >
                        {isInAdminPage ? (
                          <>
                            <Home className="mr-2 h-4 w-4" />
                            {t("header.userPage")}
                          </>
                        ) : (
                          <>
                            <Store className="mr-2 h-4 w-4" />
                            {t("header.systemManagement")}
                          </>
                        )}
                      </DropdownMenuItem>
                    )}

                    {/* Quản lý cửa hàng - dành cho seller (roleId: 2) */}
                    {!isAdmin && isSeller && (
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(isInAdminPage ? "/" : "/admin/products")
                        }
                        className="flex items-center cursor-pointer"
                      >
                        {isInAdminPage ? (
                          <>
                            <Home className="mr-2 h-4 w-4" />
                            {t("header.userPage")}
                          </>
                        ) : (
                          <>
                            <Store className="mr-2 h-4 w-4" />
                            {t("header.storeManagement")}
                          </>
                        )}
                      </DropdownMenuItem>
                    )}

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
                          {locale === "vi" && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setLocale("en")}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <span>{t("languages.en")}</span>
                          {locale === "en" && (
                            <Check className="h-4 w-4 ml-2" />
                          )}
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
              )}

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-1.5 sm:p-2 hover:bg-muted rounded-full transition-colors"
                  title="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog
        open={authOpen}
        onOpenChange={(open) => setAuthOpen(open)}
        mode={authMode}
        onModeChange={handleAuthModeChange}
      />
    </>
  );
}

// Mobile Menu Component
type Locale = "vi" | "en";

interface MobileMenuProps {
  navigationLinks: any[];
  parentCategories: Category[];
  childrenCategories: Record<number, Category[]>;
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  isSeller: boolean;
  isInAdminPage: boolean;
  locale: Locale;
  t: any;
  setLocale: (locale: Locale) => void;
  handleLogout: () => void;
  setAuthMode: (mode: "signin" | "signup" | "forgot" | "otp") => void;
  setAuthOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  router: any;
}

function MobileMenu({
  navigationLinks,
  parentCategories,
  childrenCategories,
  isAuthenticated,
  user,
  isAdmin,
  isSeller,
  isInAdminPage,
  locale,
  t,
  setLocale,
  handleLogout,
  setAuthMode,
  setAuthOpen,
  setIsMobileMenuOpen,
  router,
}: MobileMenuProps) {
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="text-left mb-4">
        <SheetTitle className="text-xl font-bold text-primary">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto">
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navigationLinks.map((link) => {
            const children = link.label === "Products" ? parentCategories : [];
            const hasDropdown = children.length > 0;
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + "/");

            if (hasDropdown) {
              return (
                <Accordion key={link.label} type="single" collapsible>
                  <AccordionItem value={link.label} className="border-none">
                    <AccordionTrigger
                      className={`py-3 px-2 hover:no-underline hover:bg-muted rounded-md text-sm ${isActive ? "text-primary font-semibold" : ""}`}
                    >
                      {t(`navigation.${link.key}`)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-1">
                        {children.map((cat) => {
                          const subChildren =
                            childrenCategories[cat.CategoryID] || [];
                          const hasSub = subChildren.length > 0;

                          if (hasSub) {
                            return (
                              <Accordion
                                key={cat.CategoryID}
                                type="single"
                                collapsible
                              >
                                <AccordionItem
                                  value={cat.CategoryName}
                                  className="border-none"
                                >
                                  <AccordionTrigger className="py-2 px-2 text-sm hover:no-underline hover:bg-muted rounded-md">
                                    {cat.CategoryName}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pl-4 space-y-1">
                                      {subChildren.map((sub) => (
                                        <button
                                          key={sub.CategoryID}
                                          onClick={() =>
                                            handleNavigation(
                                              `/products?category=${sub.CategoryID}`
                                            )
                                          }
                                          className="w-full text-left py-2 px-2 text-sm hover:bg-muted rounded-md"
                                        >
                                          {sub.CategoryName}
                                        </button>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          } else {
                            return (
                              <button
                                key={cat.CategoryID}
                                onClick={() =>
                                  handleNavigation(
                                    `/products?category=${cat.CategoryID}`
                                  )
                                }
                                className="w-full text-left py-2 px-2 text-sm hover:bg-muted rounded-md"
                              >
                                {cat.CategoryName}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            } else {
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link.href)}
                  className={`w-full text-left py-3 px-2 rounded-md text-sm transition ${
                    isActive
                      ? "text-primary font-semibold bg-muted"
                      : "hover:bg-muted"
                  }`}
                >
                  {t(`navigation.${link.key}`)}
                </button>
              );
            }
          })}
        </nav>

        <div className="h-px bg-border my-4" />

        {/* User Section */}
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoURL || "/placeholder-user.jpg"} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sm">{t("header.user")}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Quản lý hệ thống - chỉ dành cho admin (roleId: 1) */}
            {isAdmin && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  handleNavigation(isInAdminPage ? "/" : "/admin");
                }}
              >
                {isInAdminPage ? (
                  <>
                    <Home className="mr-2 h-4 w-4" />
                    {t("header.userPage")}
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-4 w-4" />
                    {t("header.systemManagement")}
                  </>
                )}
              </Button>
            )}

            {/* Quản lý cửa hàng - dành cho seller (roleId: 2) */}
            {!isAdmin && isSeller && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  handleNavigation(isInAdminPage ? "/" : "/admin/products");
                }}
              >
                {isInAdminPage ? (
                  <>
                    <Home className="mr-2 h-4 w-4" />
                    {t("header.userPage")}
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-4 w-4" />
                    {t("header.storeManagement")}
                  </>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              {t("header.accountManagement")}
            </Button>

            <Accordion type="single" collapsible>
              <AccordionItem value="language" className="border-none">
                <AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-muted rounded-md text-sm">
                  <div className="flex items-center">
                    <Languages className="mr-2 h-4 w-4" />
                    {t("header.language")}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-1">
                    <button
                      onClick={() => setLocale("vi")}
                      className={`w-full text-left py-2 px-2 text-sm hover:bg-muted rounded-md flex items-center justify-between ${
                        locale === "vi" ? "text-primary font-semibold" : ""
                      }`}
                    >
                      <span>{t("languages.vi")}</span>
                      {locale === "vi" && <Check className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setLocale("en")}
                      className={`w-full text-left py-2 px-2 text-sm hover:bg-muted rounded-md flex items-center justify-between ${
                        locale === "en" ? "text-primary font-semibold" : ""
                      }`}
                    >
                      <span>{t("languages.en")}</span>
                      {locale === "en" && <Check className="h-4 w-4" />}
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("header.logout")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                setAuthMode("signin");
                setAuthOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              {t("header.signIn")}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setAuthMode("signup");
                setAuthOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              {t("header.signUp")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
