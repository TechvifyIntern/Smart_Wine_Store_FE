"use client";

import { useState } from "react";
import { Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/discount-events/SearchBar";

interface InventoryLogsToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    selectedAction?: string;
    onActionFilter?: (action: string) => void;
    onExportLogs?: () => void;
}

export default function InventoryLogsToolbar({
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search by product name...",
    selectedAction = "",
    onActionFilter,
    onExportLogs,
}: InventoryLogsToolbarProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const actions = [
        { value: "", label: "All Actions" },
        { value: "IMPORT", label: "Import" },
        { value: "EXPORT", label: "Export" },
        { value: "SALE", label: "Sale" },
    ];

    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                placeholder={searchPlaceholder}
            />

            {/* Action Filter and Export */}
            <div className="flex items-center gap-2">
                {onActionFilter && (
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <Filter className="w-4 h-4" />
                        </Button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                                {actions.map((action) => (
                                    <button
                                        key={action.value}
                                        onClick={() => {
                                            onActionFilter(action.value);
                                            setIsFilterOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {onExportLogs && (
                    <Button
                        variant="outline"
                        onClick={onExportLogs}
                        className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white border-[#ad8d5e] dark:bg-[#ad8d5e] dark:hover:bg-[#8c6b3e] dark:text-white dark:border-[#ad8d5e]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                )}
            </div>
        </div>
    );
}
