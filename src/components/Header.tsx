"use client";

import { useEffect, useState } from "react";
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
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useLocale } from "@/contexts/LocaleContext";
import { Category } from "@/types/category";
import { getParentCategory, getChildrenCategory } from "@/services/header/api";
import notificationsRepository, { Notification } from "@/api/notificationsRepository";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, authOpen, authMode, setAuthOpen, setAuthMode } =
    useAppStore();
  const isAuthenticated = !!user;
  const { locale, setLocale, t } = useLocale();

  // Kiểm tra role: admin (roleId: 1), seller (roleId: 2), user (roleId: 3)
  const userRoleId = user?.roleId ? parseInt(user.roleId) : undefined;
  const isAdmin = userRoleId === 1;
  const isSeller = userRoleId === 2;
  const isInAdminPage = pathname?.startsWith("/admin");

  const handleLogout = () => {
    logout();
    router.push("/");
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

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        const response = await notificationsRepository.getNotifications();
        if (response.success && response.data) {
          // Ensure response.data is an array
          const notificationsArray = Array.isArray(response.data)
            ? response.data
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
    // Optionally, set up polling or WebSocket for real-time updates
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

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
                      <div
                        className={`text-sm font-medium cursor-pointer flex items-center transition relative ${isActive
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
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm font-medium flex items-center transition relative ${isActive
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
                                href={`/products?category=${cat.CategoryName}`}
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
                                      href={`/products?category=${sub.CategoryName}`}
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
              <div className="relative flex items-center">
                {isSearchOpen && (
                  <form className="absolute right-0 top-1/2 -translate-y-1/2 w-40 sm:w-48 md:w-64 animate-in slide-in-from-right-10 fade-in duration-200">
                    <input
                      value={searchText}
                      onChange={handleChange}
                      onKeyDown={handleSearchSubmit}
                      type="text"
                      placeholder={t("navigation.search")}
                      className="w-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm dark:border-white/20"
                      autoFocus
                    />
                  </form>
                )}
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
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
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
                                              `/products?category=${sub.CategoryName}`
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
                                    `/products?category=${cat.CategoryName}`
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
                  className={`w-full text-left py-3 px-2 rounded-md text-sm transition ${isActive
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
                      className={`w-full text-left py-2 px-2 text-sm hover:bg-muted rounded-md flex items-center justify-between ${locale === "vi" ? "text-primary font-semibold" : ""
                        }`}
                    >
                      <span>{t("languages.vi")}</span>
                      {locale === "vi" && <Check className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setLocale("en")}
                      className={`w-full text-left py-2 px-2 text-sm hover:bg-muted rounded-md flex items-center justify-between ${locale === "en" ? "text-primary font-semibold" : ""
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
