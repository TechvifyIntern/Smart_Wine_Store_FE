"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8">
            <div className="flex items-center justify-between">
                {/* Left side - Menu button (mobile) + Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Logo */}
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                        <span className="text-xl sm:text-2xl md:text-3xl mr-2">🍷</span>
                        <span className="bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                            WINE STORE
                        </span>
                    </h1>
                </div>
                

                {/* Right side - User Profile */}
                <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-700">Admin User</p>
                        <p className="text-xs text-gray-500">admin@winestore.com</p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                </div>
            </div>
        </div>
    );
}