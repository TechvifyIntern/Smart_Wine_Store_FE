"use client";

import InventoryLogsRow from "./InventoryLogsRow";
import { InventoryLog } from "@/data/inventory_log";

interface InventoryLogsTableProps {
    logs: InventoryLog[];
    formatCurrency: (amount: number) => string;
    formatDate: (dateString: string) => string;
    selectedLogs: Set<number>;
    onSelectLog: (logId: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    emptyMessage?: string;
}

export default function InventoryLogsTable({
    logs,
    formatCurrency,
    formatDate,
    selectedLogs,
    onSelectLog,
    onSelectAll,
    emptyMessage = "No inventory logs found",
}: InventoryLogsTableProps) {
    const allSelected = logs.length > 0 && logs.every(log => selectedLogs.has(log.LogID));
    const someSelected = logs.some(log => selectedLogs.has(log.LogID));

    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="rounded border-gray-300 text-[#ad8d5e] focus:ring-[#ad8d5e] dark:bg-slate-700 dark:border-slate-600"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Log ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Action
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Unit Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Total Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Reason
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Performed By
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Timestamp
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <InventoryLogsRow
                                    key={log.LogID}
                                    log={log}
                                    formatCurrency={formatCurrency}
                                    formatDate={formatDate}
                                    isSelected={selectedLogs.has(log.LogID)}
                                    onSelect={(checked) => onSelectLog(log.LogID, checked)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="px-6 py-16 text-center">
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
