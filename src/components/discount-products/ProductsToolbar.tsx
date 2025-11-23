"use client";

import { useState } from "react";
import SearchBar from "@/components/discount-events/SearchBar";
import CreateProductButton from "./CreateProductButton";
import { CreateDiscountProduct } from "./(modal)/CreateDiscountProduct";
import { DiscountProduct } from "@/data/discount_product";

interface ProductsToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateProduct?: (data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
    createButtonLabel?: string;
}

export default function ProductsToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search discount products...",
    onCreateProduct,
    createButtonLabel = "Create Product Discount",
}: ProductsToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Use external state if provided, otherwise use internal state
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
    const handleSearchChange = externalOnSearchChange || setInternalSearchTerm;

    const handleCreateProduct = async (
        data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">
    ) => {
        if (onCreateProduct) {
            await onCreateProduct(data);
        } else {
            console.log("Creating product discount:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Product discount created successfully!");
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

                <CreateProductButton
                    onClick={() => setIsCreateModalOpen(true)}
                    label={createButtonLabel}
                />
            </div>

            <CreateDiscountProduct
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                mode="create"
                onCreate={handleCreateProduct}
            />
        </>
    );
}
