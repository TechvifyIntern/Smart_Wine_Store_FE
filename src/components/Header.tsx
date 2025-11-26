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
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { Category } from "@/types/category";
import { getParentCategory, getChildrenCategory } from "@/services/header/api";

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childrenCategories, setChildrenCategories] = useState<
    Record<number, Category[]>
  >({});

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
  const { user, logout, authOpen, authMode, setAuthOpen, setAuthMode } =
    useAppStore();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAuthModeChange = (mode: "signin" | "signup" | "forgot") =>
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

  if (!mounted) return null;

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-background/95 dark:backdrop-blur-md dark:border-b dark:border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/">
                <div className="text-xl font-bold md:hidden dark:md:hidden">
                  WINE
                </div>
                <img
                  src="/logo-light.svg"
                  alt="Logo"
                  className="block dark:hidden h-8 w-auto"
                />
                <img
                  src="/logo-dark.svg"
                  alt="Logo"
                  className="hidden dark:block h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationLinks.map((link) => {
                const children =
                  link.label === "Products" ? parentCategories : [];
                const hasDropdown = children.length > 0;

                return (
                  <div key={link.label} className="relative group">
                    <div className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground flex items-center transition">
                      {link.label}
                      {hasDropdown && (
                        <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </div>

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
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <div className="relative flex items-center">
                {isSearchOpen && (
                  <form className="top-1/2 w-48 sm:w-64 animate-in slide-in-from-right-10 fade-in duration-200">
                    <input
                      value={searchText}
                      onChange={handleChange}
                      onKeyDown={handleSearchSubmit}
                      type="text"
                      placeholder="Search..."
                      className="w-full px-3 py-1.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm dark:border-white/20"
                      autoFocus
                    />
                  </form>
                )}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 ml-4 hover:bg-muted rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <button className="p-2 hover:bg-muted rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Auth */}
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full ml-1"
                    >
                      <Avatar className="h-9 w-9 border border-border">
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
                        <p className="font-medium">User</p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
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
