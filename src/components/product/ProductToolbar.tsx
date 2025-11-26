"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    onCreateProduct?: () => void;
    createButtonLabel?: string;
}

export default function ProductToolbar({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search products...",
    onCreateProduct,
    createButtonLabel = "Add Product",
}: ProductToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
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

            <Button
                onClick={onCreateProduct}
                className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                <Plus className="w-4 h-4" />
                {createButtonLabel}
            </Button>
        </div>
    );
}
