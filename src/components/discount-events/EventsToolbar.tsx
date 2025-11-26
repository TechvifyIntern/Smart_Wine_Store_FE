"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import SearchBar from "./SearchBar";
import CreateEventButton from "./CreateEventButton";
import { CreateDiscountEvent } from "./(modal)/CreateDiscountEvent";
import { FilterDialog } from "./(modal)/FilterDialog";
import { DiscountEvent } from "@/data/discount_event";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EventsToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateEvent?: (data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
    createButtonLabel?: string;
    selectedStatuses?: number[];
    dateFrom?: string;
    dateTo?: string;
    onApplyFilters?: (filters: { statuses: number[]; dateFrom: string; dateTo: string }) => void;
}

export default function EventsToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search discount events...",
    onCreateEvent,
    createButtonLabel = "Create Event",
    selectedStatuses = [],
    dateFrom = "",
    dateTo = "",
    onApplyFilters,
}: EventsToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

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

    const hasActiveFilters = selectedStatuses.length > 0 || dateFrom !== "" || dateTo !== "";

    useEffect(() => {
        if (filterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [filterOpen]);

    return (
        <>
            {/* Toolbar with padding matching the table (px-6) */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                />

                <div className="flex items-center gap-2">
                    {onApplyFilters && (
                        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${hasActiveFilters ? 'bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white border-[#ad8d5e]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <Filter className="w-4 h-4" />
                                    {hasActiveFilters && (
                                        <span className="ml-1 bg-white text-[#ad8d5e] text-xs px-1.5 py-0.5 rounded-full">
                                            {selectedStatuses.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 bg-white border-gray-200" align="end">
                                <div className="p-4 h-70 overflow-y-auto scrollbar-hide scroll-behavior-smooth" onWheel={(e) => {
                                    e.preventDefault();
                                    const delta = e.deltaY;
                                    const target = e.currentTarget as HTMLElement;
                                    const newScroll = target.scrollTop + delta;
                                    const maxScroll = target.scrollHeight - target.clientHeight;
                                    if (newScroll >= 0 && newScroll <= maxScroll) {
                                        target.scrollTop = newScroll;
                                    }
                                }}>
                                    <FilterDialog
                                        selectedStatuses={selectedStatuses}
                                        dateFrom={dateFrom}
                                        dateTo={dateTo}
                                        onApplyFilters={onApplyFilters}
                                        onClose={() => setFilterOpen(false)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    <CreateEventButton
                        onClick={() => setIsCreateModalOpen(true)}
                        label={createButtonLabel}
                    />
                </div>
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
