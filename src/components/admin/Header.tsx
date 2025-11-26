"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
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

        {/* Right side - Theme toggle + User Profile */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle theme"
            suppressHydrationWarning={true}
            variant="ghost"
            size="icon"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium ">Admin User</p>
              <p className="text-xs ">admin@winestore.com</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
