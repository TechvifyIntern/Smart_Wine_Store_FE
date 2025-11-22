"use client";

import SearchBar from "@/components/discount-events/SearchBar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface InventoryLogsToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    logTypeFilter: string;
    onLogTypeFilterChange: (value: string) => void;
}

export default function InventoryLogsToolbar({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search logs...",
    logTypeFilter,
    onLogTypeFilterChange,
}: InventoryLogsToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                placeholder={searchPlaceholder}
            />

            <Select value={logTypeFilter} onValueChange={onLogTypeFilterChange}>
                <SelectTrigger className="w-[180px] dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectItem value="All" className="dark:text-slate-200 dark:focus:bg-slate-700">
                        All Types
                    </SelectItem>
                    <SelectItem value="Import" className="dark:text-slate-200 dark:focus:bg-slate-700">
                        Import
                    </SelectItem>
                    <SelectItem value="Export" className="dark:text-slate-200 dark:focus:bg-slate-700">
                        Export
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
