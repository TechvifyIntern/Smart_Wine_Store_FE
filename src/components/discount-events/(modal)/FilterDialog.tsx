"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FilterPopoverContentProps {
    selectedStatuses: number[];
    dateFrom: string;
    dateTo: string;
    onApplyFilters: (filters: { statuses: number[]; dateFrom: string; dateTo: string }) => void;
    onClose: () => void;
}

const statuses = [
    { id: 1, name: "Active" },
    { id: 2, name: "Upcoming" },
    { id: 3, name: "Expired" },
];

export function FilterDialog({
    selectedStatuses,
    dateFrom,
    dateTo,
    onApplyFilters,
    onClose,
}: FilterPopoverContentProps) {
    const [localStatuses, setLocalStatuses] = useState<number[]>(selectedStatuses);
    const [localDateFrom, setLocalDateFrom] = useState<string>(dateFrom);
    const [localDateTo, setLocalDateTo] = useState<string>(dateTo);

    // Sync local state with props when component mounts/updates
    useEffect(() => {
        setLocalStatuses(selectedStatuses);
        setLocalDateFrom(dateFrom);
        setLocalDateTo(dateTo);
    }, [selectedStatuses, dateFrom, dateTo]);

    const handleStatusChange = (statusId: number, checked: boolean) => {
        const newStatuses = checked
            ? [...localStatuses, statusId]
            : localStatuses.filter((id) => id !== statusId);

        setLocalStatuses(newStatuses);
        onApplyFilters({
            statuses: newStatuses,
            dateFrom: localDateFrom,
            dateTo: localDateTo,
        });
    };

    const handleDateFromChange = (value: string) => {
        setLocalDateFrom(value);
        onApplyFilters({
            statuses: localStatuses,
            dateFrom: value,
            dateTo: localDateTo,
        });
    };

    const handleDateToChange = (value: string) => {
        setLocalDateTo(value);
        onApplyFilters({
            statuses: localStatuses,
            dateFrom: localDateFrom,
            dateTo: value,
        });
    };

    const handleClearAll = () => {
        setLocalStatuses([]);
        setLocalDateFrom("");
        setLocalDateTo("");
        onApplyFilters({
            statuses: [],
            dateFrom: "",
            dateTo: "",
        });
        onClose();
    };

    return (
        <div className="space-y-4">
            <div className="font-medium text-gray-900">Filter Events</div>

            {/* Date Range Filter */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">Date Range (Time Start)</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Input
                            type="date"
                            value={localDateFrom}
                            onChange={(e) => handleDateFromChange(e.target.value)}
                            placeholder="From"
                            className="text-sm"
                            max={localDateTo || ""}
                        />
                    </div>
                    <div>
                        <Input
                            type="date"
                            value={localDateTo}
                            onChange={(e) => handleDateToChange(e.target.value)}
                            placeholder="To"
                            className="text-sm"
                            min={localDateFrom || ""}
                        />
                    </div>
                </div>
            </div>

            {/* Statuses Filter */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">Status</Label>
                <div className="flex flex-wrap gap-3">
                    {statuses.map((status) => (
                        <div key={status.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`status-${status.id}`}
                                checked={localStatuses.includes(status.id)}
                                onCheckedChange={(checked) =>
                                    handleStatusChange(status.id, checked as boolean)
                                }
                            />
                            <Label
                                htmlFor={`status-${status.id}`}
                                className="text-sm font-normal text-gray-700"
                            >
                                {status.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clear button */}
            <div className="pt-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    Clear All
                </Button>
            </div>
        </div>
    );
}
