"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/discount-events/PageHeader";
import InventoryLogsTable from "@/components/inventory-logs/InventoryLogsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import { getInventoryLogs, InventoryLog } from "@/services/inventory-log/api";
import { Spinner } from "@/components/ui/spinner";

export default function InventoryLogsPage() {
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Fetch logs from API
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getInventoryLogs({
                page: currentPage,
                size: itemsPerPage,
            });

            if (response.success && response.data) {
                const logsData = response.data.data || [];
                const total = response.data.total || 0;

                setLogs(logsData);
                setTotalItems(total);
                setTotalPages(Math.ceil(total / itemsPerPage));
            } else {
                setLogs([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching inventory logs:", error);
            toast.error("Failed to load inventory logs");
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    // Load logs on mount and when dependencies change
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Handler functions
    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <div>
            <PageHeader
                title="Inventory Logs"
                icon={FileText}
                iconColor="text-black"
            />

            {/* Loading State */}
            {isLoading && logs.length === 0 ? (
                <Spinner className="flex justify-center" size="lg" />
                ) : (
                <>
                    {/* Logs Table */}
                    <InventoryLogsTable
                        logs={logs}
                        formatDate={formatDate}
                        emptyMessage="No inventory logs found"
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </>
            )}
        </div>
    );
}