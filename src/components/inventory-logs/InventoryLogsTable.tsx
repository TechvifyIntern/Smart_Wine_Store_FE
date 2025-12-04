"use client";

import InventoryLogsRow from "./InventoryLogsRow";
import { InventoryLog } from "@/services/inventory-log/api";

interface InventoryLogsTableProps {
    logs: InventoryLog[];
    formatDate: (dateString: string) => string;
    emptyMessage?: string;
}

export default function InventoryLogsTable({
    logs,
    formatDate,
    emptyMessage = "No inventory logs found",
}: InventoryLogsTableProps) {
    const getTransactionTypeName = (typeId: number): string => {
        switch (typeId) {
            case 1:
                return "Import";
            case 2:
                return "Export";
            case 3:
                return "Sale";
            default:
                return "Unknown";
        }
    };

    const getTransactionTypeColor = (typeId: number): string => {
        switch (typeId) {
            case 1:
                return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
            case 2:
                return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
            case 3:
                return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
            default:
                return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
        }
    };

    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Log ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Transaction Type
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Performed By
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <InventoryLogsRow
                                    key={log.InventoryLogID}
                                    log={log}
                                    formatDate={formatDate}
                                    getTransactionTypeName={getTransactionTypeName}
                                    getTransactionTypeColor={getTransactionTypeColor}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg
                                            className="w-16 h-16 dark:text-slate-700 text-gray-300 mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <p className="dark:text-slate-400 text-gray-500 font-medium">
                                            {emptyMessage}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
