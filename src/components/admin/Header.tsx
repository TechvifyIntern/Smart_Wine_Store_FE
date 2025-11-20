"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

interface HeaderProps {
    onMenuClick?: () => void;
}


export default function Header({ onMenuClick }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    return (
        <div className=" border-b border-[#F2F2F2]  px-4 py-2 md:px-8">
            <div className="flex items-center justify-between">
                {/* Left side - Menu button (mobile) + Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
                        <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                            WINE STORE
                        </span>
                    </h1>
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
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}