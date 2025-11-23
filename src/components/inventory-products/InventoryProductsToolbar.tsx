"use client";

import SearchBar from "../discount-events/SearchBar";
import { Plus } from "lucide-react";

interface InventoryProductsToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateProduct?: () => void;
    createButtonLabel?: string;
}

export default function InventoryProductsToolbar({
    searchTerm = "",
    onSearchChange,
    searchPlaceholder = "Search products...",
    onCreateProduct,
    createButtonLabel = "Add Product",
}: InventoryProductsToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange || (() => { })}
                placeholder={searchPlaceholder}
            />

            <button
                onClick={onCreateProduct}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#ad8d5e] hover:bg-[#9c7a4c] text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
                <Plus className="w-4 h-4" />
                {createButtonLabel}
            </button>
        </div>
    );
}
