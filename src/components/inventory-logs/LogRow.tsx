import { InventoryLog } from "@/data/inventory_log";
import { PackagePlus, PackageMinus } from "lucide-react";

interface LogRowProps {
    log: InventoryLog;
    formatDate: (date: string) => string;
}

export default function LogRow({ log, formatDate }: LogRowProps) {
    const getTypeBadge = (type: "Import" | "Export") => {
        if (type === "Import") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <PackagePlus className="w-3.5 h-3.5" />
                    Import
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    <PackageMinus className="w-3.5 h-3.5" />
                    Export
                </span>
            );
        }
    };

    const getQuantityDisplay = (type: "Import" | "Export", quantity: number) => {
        if (type === "Import") {
            return (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                    +{quantity}
                </span>
            );
        } else {
            return (
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    -{quantity}
                </span>
            );
        }
    };

    return (
        <tr className="dark:hover:bg-slate-800/30 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium dark:text-slate-300">
                    #{log.LogID}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm dark:text-slate-400">
                    {log.ProductID}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium dark:text-slate-200 max-w-xs">
                    {log.ProductName}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getTypeBadge("Import")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getQuantityDisplay("Import", log.Quantity)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm dark:text-slate-300">{log.PerformedBy}</div>
                <div className="text-xs text-gray-500 dark:text-slate-500">{log.PerformedBy}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm dark:text-slate-400">
                    {formatDate(log.Timestamp)}
                </div>
            </td>
        </tr>
    );
}
