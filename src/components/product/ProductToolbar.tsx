"use client";

import { useState } from "react";
import { Search, Plus, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import { useAppStore } from "@/store/auth";
import { getProductPermissions } from "@/lib/permissions";

interface ProductToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    onCreateProduct?: () => void;
    createButtonLabel?: string;
    categories: Category[];
    selectedCategoryId: string;
    onCategoryChange: (categoryId: string) => void;
    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
    maxPrice: number;
}

export default function ProductToolbar({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search products...",
    onCreateProduct,
    createButtonLabel = "Add Product",
    categories,
    selectedCategoryId,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    maxPrice,
}: ProductToolbarProps) {
    const [showFilters, setShowFilters] = useState(false);
    const { user } = useAppStore();
    const permissions = getProductPermissions(user?.roleId);

    const activeFiltersCount = (selectedCategoryId !== "all" ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

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
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        className="relative"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                            >
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>

                    <Button
                        onClick={onCreateProduct}
                        className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {createButtonLabel}
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Category
                            </label>
                            <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px] overflow-y-auto">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.CategoryID} value={category.CategoryID.toString()}>
                                            {category.CategoryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Price Range: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} VND
                            </label>
                            <div className="px-2">
                                <Slider
                                    value={priceRange}
                                    onValueChange={onPriceRangeChange}
                                    max={maxPrice}
                                    min={0}
                                    step={10000}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mt-1">
                                <span>0 VND</span>
                                <span>{maxPrice.toLocaleString()} VND</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters and Clear Button */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            {selectedCategoryId !== "all" && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Category: {categories.find(c => c.CategoryID.toString() === selectedCategoryId)?.CategoryName}
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => onCategoryChange("all")}
                                    />
                                </Badge>
                            )}
                            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Price: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} VND
                                    <X
                                        className="w-3 h-3 cursor-pointer"
                                        onClick={() => onPriceRangeChange([0, maxPrice])}
                                    />
                                </Badge>
                            )}
                        </div>

                        {activeFiltersCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onCategoryChange("all");
                                    onPriceRangeChange([0, maxPrice]);
                                }}
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
