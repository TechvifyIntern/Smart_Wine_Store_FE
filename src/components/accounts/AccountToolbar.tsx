"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import SearchBar from "@/components/discount-events/SearchBar";
import CreateAccountButton from "./CreateAccountButton";
import { CreateAccountModal } from "./(modal)/CreateAccountModal";
import { FilterDialog } from "./(modal)/FilterDialog";
import { Account } from "@/data/accounts";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AccountToolbarProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onCreateAccount?: (data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "StatusName">) => void | Promise<void>;
    createButtonLabel?: string;
    selectedRoles?: number[];
    selectedTiers?: number[];
    selectedStatuses?: number[];
    onApplyFilters?: (filters: { roles: number[]; tiers: number[]; statuses: number[] }) => void;
}

export default function AccountToolbar({
    searchTerm: externalSearchTerm,
    onSearchChange: externalOnSearchChange,
    searchPlaceholder = "Search accounts...",
    onCreateAccount,
    createButtonLabel = "Add Account",
    selectedRoles = [],
    selectedTiers = [],
    selectedStatuses = [],
    onApplyFilters,
}: AccountToolbarProps) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    // Use external state if provided, otherwise use internal state
    const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
    const handleSearchChange = externalOnSearchChange || setInternalSearchTerm;

    const handleCreateAccount = async (
        data: Omit<Account, "UserID" | "RoleName" | "TierName" | "MinimumPoint" | "StatusName">
    ) => {
        if (onCreateAccount) {
            await onCreateAccount(data);
        } else {
            console.log("Creating account:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Account created successfully!");
        }
    };

    const hasActiveFilters = selectedRoles.length > 0 || selectedTiers.length > 0 || selectedStatuses.length > 0;

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
                                            {selectedRoles.length + selectedTiers.length + selectedStatuses.length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 bg-white border-gray-200" align="end">
                                <div className="p-4 h-80 overflow-y-auto scrollbar-hide scroll-behavior-smooth" onWheel={(e) => {
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
                                        selectedRoles={selectedRoles}
                                        selectedTiers={selectedTiers}
                                        selectedStatuses={selectedStatuses}
                                        onApplyFilters={onApplyFilters}
                                        onClose={() => setFilterOpen(false)}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    <CreateAccountButton
                        onClick={() => setIsCreateModalOpen(true)}
                        label={createButtonLabel}
                    />
                </div>
            </div>

            <CreateAccountModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onCreate={handleCreateAccount}
            />
        </>
    );
}
