"use client";

import { useState } from "react";
import SearchBar from "@/components/discounts/SearchBar";
import CreateOrderButton from "./CreateOrderButton";
import { CreateDiscountOrder } from "./(modal)/CreateDiscountOrder";
import { DiscountOrder } from "@/data/discount_order";

interface OrdersToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateOrder?: (data: Omit<DiscountOrder, "DiscountOrderID">) => void | Promise<void>;
    createButtonLabel?: string;
}

export default function OrdersToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search discount orders...",
    onCreateOrder,
    createButtonLabel = "Create Order Discount",
}: OrdersToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Use external state if provided, otherwise use internal state
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
    const handleSearchChange = externalOnSearchChange || setInternalSearchTerm;

    const handleCreateOrder = async (
        data: Omit<DiscountOrder, "DiscountOrderID">
    ) => {
        if (onCreateOrder) {
            await onCreateOrder(data);
        } else {
            console.log("Creating order discount:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Order discount created successfully!");
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

                <CreateOrderButton
                    onClick={() => setIsCreateModalOpen(true)}
                    label={createButtonLabel}
                />
            </div>

            <CreateDiscountOrder
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                mode="create"
                onCreate={handleCreateOrder}
            />
        </>
    );
}
