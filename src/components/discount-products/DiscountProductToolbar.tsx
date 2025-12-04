"use client";

import { Search, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscountProductToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedCount: number;
    onAddDiscount: () => void;
    searchPlaceholder?: string;
}

export default function DiscountProductToolbar({
    searchTerm,
    onSearchChange,
    selectedCount,
    onAddDiscount,
    searchPlaceholder = "Search products by name...",
}: DiscountProductToolbarProps) {
    return (
        <div className="space-y-4 mb-6">
            {/* Main Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ad8d5e] focus:border-transparent dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                {selectedCount} product{selectedCount > 1 ? "s" : ""} selected
                            </span>
                        </div>
                    )}

                    <Button
                        onClick={onAddDiscount}
                        disabled={selectedCount === 0}
                        className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Tag className="w-4 h-4" />
                        Add Discount
                    </Button>
                </div>
            </div>

            {/* Info Message - Fixed height to prevent layout shift */}
            <div className="min-h-[52px]">
                {selectedCount === 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            <strong>Tip:</strong> Select one or more products to add or update discounts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
