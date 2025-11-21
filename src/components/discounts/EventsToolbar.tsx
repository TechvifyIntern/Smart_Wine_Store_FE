"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import CreateEventButton from "./CreateEventButton";
import { CreateDiscountEvent } from "./(modal)/CreateDiscountEvent";
import { DiscountEvent } from "@/data/discount_event";

interface EventsToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateEvent?: (data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
    createButtonLabel?: string;
}

export default function EventsToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search discount events...",
    onCreateEvent,
    createButtonLabel = "Create Event",
}: EventsToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Use external state if provided, otherwise use internal state
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
    const handleSearchChange = externalOnSearchChange || setInternalSearchTerm;

    const handleCreateEvent = async (
        data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">
    ) => {
        if (onCreateEvent) {
            await onCreateEvent(data);
        } else {
            console.log("Creating event:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Event created successfully!");
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

                <CreateEventButton
                    onClick={() => setIsCreateModalOpen(true)}
                    label={createButtonLabel}
                />
            </div>

            <CreateDiscountEvent
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                mode="create"
                onCreate={handleCreateEvent}
            />
        </>
    );
}
