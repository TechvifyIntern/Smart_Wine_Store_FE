"use client";

import { useState } from "react";
import SearchBar from "@/components/discount-events/SearchBar";
import CreateCategoryButton from "./CreateCategoryButton";
import { CreateCategory } from "./(modal)/CreateCategory";
import { ProductCategory } from "@/data/product_categories";
import { useAppStore } from "@/store/auth";
import { getCategoryPermissions } from "@/lib/permissions";

interface ProductCategoriesToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateCategory?: (data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => void | Promise<void>;
    createButtonLabel?: string;
}

export default function ProductCategoriesToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search categories...",
    onCreateCategory,
    createButtonLabel = "Add Category",
}: ProductCategoriesToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { user } = useAppStore();
    const permissions = getCategoryPermissions(user?.roleId);

    // Use external state if provided, otherwise use internal state
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
    const handleSearchChange = externalOnSearchChange || setInternalSearchTerm;

    const handleCreateCategory = async (
        data: Omit<ProductCategory, "CategoryID" | "ProductCount">
    ) => {
        if (onCreateCategory) {
            await onCreateCategory(data);
        } else {
            console.log("Creating category:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Category created successfully!");
        }
    };

    return (
        <>
            {/* Toolbar with padding matching the table (px-6) */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                />

                {permissions.canCreate && (
                    <CreateCategoryButton
                        onClick={() => setIsCreateModalOpen(true)}
                        label={createButtonLabel}
                    />
                )}
            </div>

            <CreateCategory
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                mode="create"
                onCreate={handleCreateCategory}
            />
        </>
    );
}
