import { InventoryLog } from "@/data/inventory_log";
import LogRow from "./LogRow";
import { FileX } from "lucide-react";

interface InventoryLogsTableProps {
    logs: InventoryLog[];
    formatDate: (date: string) => string;
    emptyMessage?: string;
}

export default function InventoryLogsTable({
    logs,
    formatDate,
    emptyMessage = "No logs found",
}: InventoryLogsTableProps) {
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
                                Product ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <LogRow
                                    key={log.InventoryLogID}
                                    log={log}
                                    formatDate={formatDate}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <FileX className="w-12 h-12 text-gray-400 dark:text-slate-600" />
                                        <p className="text-gray-500 dark:text-slate-400 font-medium">
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
