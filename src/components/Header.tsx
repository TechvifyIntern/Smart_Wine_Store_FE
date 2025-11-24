"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  LucideUsers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";
import {
  navigationLinks,
  wineChildrenCates,
  whiskyChildrenCates,
} from "@/data/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { items } = useCartStore();

  const totalItems = items.reduce((total, item) => total + item.Quantity, 0);

  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout, authOpen, authMode, setAuthOpen, setAuthMode } =
    useAppStore();
  const isAuthenticated = !!user;

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleAuthModeChange = (mode: "signin" | "signup" | "forgot") =>
    setAuthMode(mode);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-background/95 dark:backdrop-blur-md dark:border-b dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationLinks.map((link) => {
                const children =
                  link.label === "Wine"
                    ? wineChildrenCates
                    : link.label === "Whisky"
                      ? whiskyChildrenCates
                      : [];
                const hasDropdown = children.length > 0;

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() =>
                      hasDropdown ? setDropdownOpen(link.href) : null
                    }
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition flex items-center cursor-pointer"
                    >
                      {link.label}
                      {hasDropdown && <ChevronDown className="ml-1 w-4 h-4" />}
                    </Link>

                    {hasDropdown && dropdownOpen === link.href && (
                      <div className="absolute top-full left-0 bg-background border rounded-md shadow-lg z-50 p-2 min-w-40">
                        {children.map((cat) => (
                          <Link
                            key={cat.CategoryID}
                            href={`/${link.label}?category=${cat.CategoryID}`}
                            className="block px-3 py-2 hover:bg-muted rounded text-sm"
                          >
                            {cat.CategoryName}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex items-center">
                {isSearchOpen && (
                  <form className="flex items-center border border-primary rounded-lg shadow-lg mx-4">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="px-3 py-1 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </form>
                )}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 hover:bg-muted rounded-lg transition"
                >
                  <Search className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Cart icon */}
              <Link href="/cart" className="relative">
                <button className="p-2 hover:bg-muted rounded-lg transition">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Auth buttons */}
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
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
                    className="bg-primary hover:bg-primary/90"
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
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={user.email}
                        />
                        <AvatarFallback>
                          {user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    align="start"
                    forceMount
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <LucideUsers className="hover:text-black" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4 hover:text-black" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 hover:bg-muted rounded-lg transition"
                  title="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-2">
              {navigationLinks.map((link) => {
                const children =
                  link.href === "wine"
                    ? wineChildrenCates
                    : link.href === "whisky"
                      ? whiskyChildrenCates
                      : [];
                return (
                  <div key={link.label}>
                    <Link
                      href={children.length > 0 ? "#" : link.href}
                      className="font-medium text-sm block py-2"
                    >
                      {link.label}
                    </Link>

                    {children.length > 0 &&
                      children.map((cat) => (
                        <Link
                          key={cat.CategoryID}
                          href={`/category/${cat.CategoryID}`}
                          className="block ml-4 mt-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {cat.CategoryName}
                        </Link>
                      ))}
                  </div>
                );
              })}

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAuthMode("signin");
                      setAuthOpen(true);
                      setIsOpen(false);
                    }}
                    className="justify-start"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      <AuthDialog
        open={authOpen}
        onOpenChange={(open) => {
          setAuthOpen(open);
          if (!open) setIsOpen(false);
        }}
        mode={authMode}
        onModeChange={handleAuthModeChange}
      />
    </>
  );
}
