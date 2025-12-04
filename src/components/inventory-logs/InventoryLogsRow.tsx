"use client";

import { InventoryLog } from "@/services/inventory-log/api";

interface InventoryLogsRowProps {
    log: InventoryLog;
    formatDate: (dateString: string) => string;
    getTransactionTypeName: (typeId: number) => string;
    getTransactionTypeColor: (typeId: number) => string;
}

export default function InventoryLogsRow({
    log,
    formatDate,
    getTransactionTypeName,
    getTransactionTypeColor,
}: InventoryLogsRowProps) {
    return (
        <tr className="dark:hover:bg-slate-800/30 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular">
                    #{log.InventoryLogID}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium max-w-xs">
                    {log.ProductName}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-600 dark:text-slate-400">
                    {log.Location}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(log.TransactionTypeID)}`}>
                    {getTransactionTypeName(log.TransactionTypeID)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium dark:text-slate-300">
                    {log.Quantity}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium dark:text-slate-300">
                    <div>{log.Username}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{log.Email}</div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-xs text-gray-500 dark:text-slate-400">
                    {formatDate(log.Date)}
                </div>
            </td>
        </tr>
    );
}
