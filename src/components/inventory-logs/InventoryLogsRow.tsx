"use client";

import { InventoryLog } from "@/data/inventory_log";

interface InventoryLogsRowProps {
    log: InventoryLog;
    formatCurrency: (amount: number) => string;
    formatDate: (dateString: string) => string;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
}

export default function InventoryLogsRow({
    log,
    formatCurrency,
    formatDate,
    isSelected,
    onSelect,
}: InventoryLogsRowProps) {
    const getActionBadgeColor = (action: string) => {
        switch (action) {
            case 'IMPORT':
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
            case 'EXPORT':
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
            case 'SALE':
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300";
        }
    };

    return (
        <tr className="dark:hover:bg-slate-800/30 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                    className="rounded border-gray-300 text-[#ad8d5e] focus:ring-[#ad8d5e] dark:bg-slate-700 dark:border-slate-600"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular">
                    #{log.LogID}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium max-w-xs">
                    {log.ProductName}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getActionBadgeColor(log.Action)}`}>
                    {log.Action}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-semibold">
                    {log.Quantity}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="dark:text-slate-400 text-sm font-medium">
                    {formatCurrency(log.UnitPrice)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(log.TotalAmount)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 dark:text-slate-400 max-w-xs truncate">
                    {log.Reason || "N/A"}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium dark:text-slate-300">
                    {log.PerformedBy}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-xs text-gray-500 dark:text-slate-400">
                    {formatDate(log.Timestamp)}
                </div>
                {log.Notes && (
                    <div className="text-xs text-gray-400 dark:text-slate-500 mt-1 max-w-xs truncate" title={log.Notes}>
                        {log.Notes}
                    </div>
                )}
            </td>
        </tr>
    );
}
