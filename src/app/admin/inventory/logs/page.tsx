"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/discount-events/PageHeader";
import InventoryLogsTable from "@/components/inventory-logs/InventoryLogsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import { getInventoryLogs, InventoryLog } from "@/services/inventory-log/api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { createInventoryLogPdf, downloadInventoryLogPdf } from "@/utils/inventory-log-pdf-utils";

export default function InventoryLogsPage() {
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState<number[]>([]);

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

    const handleSelectLog = (logId: number, checked: boolean) => {
        if (checked) {
            setSelectedLogs((prev) => [...prev, logId]);
        } else {
            setSelectedLogs((prev) => prev.filter((id) => id !== logId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedLogs(logs.map((log) => log.InventoryLogID));
        } else {
            setSelectedLogs([]);
        }
    };

    const handleExportPDF = async () => {
        try {
            const logsToExport = selectedLogs.length > 0
                ? logs.filter((log) => selectedLogs.includes(log.InventoryLogID))
                : logs;

            if (logsToExport.length === 0) {
                toast.error("No logs to export");
                return;
            }

            for (const log of logsToExport) {
                const pdfBytes = await createInventoryLogPdf(log);
                const filename = `inventory-log-${log.InventoryLogID}.pdf`;
                downloadInventoryLogPdf(pdfBytes, filename);
            }

            toast.success(`Exported ${logsToExport.length} log(s) to PDF`);
        } catch (error) {
            console.error("Error exporting PDF:", error);
            toast.error("Failed to export PDF");
        }
    };

    return (
        <div>
            <PageHeader
                title="Inventory Logs"
                icon={FileText}
                iconColor="text-black"
            />

            {/* Export Button */}
            <div className="flex justify-end mb-6">
                <Button
                    onClick={handleExportPDF}
                    className="dark:bg-[#7C653E] flex items-center justify-center gap-2 h-10 px-4 py-2 text-white font-medium rounded-full"
                    disabled={isLoading}
                >
                    <Download className="w-4 h-4" />
                    Export PDF {selectedLogs.length > 0 && `(${selectedLogs.length})`}
                </Button>
            </div>

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
                        selectedLogs={selectedLogs}
                        onSelectLog={handleSelectLog}
                        onSelectAll={handleSelectAll}
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