import { Edit, Trash2, Eye, Percent, Edit2 } from "lucide-react";
import { DiscountEvent } from "@/data/discount_event";
import StatusBadge from "./StatusBadge";

interface EventRowProps {
    event: DiscountEvent;
    status: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    formatDate: (dateString: string) => string;
}

export default function EventRow({
    event,
    status,
    onEdit,
    onDelete,
    formatDate,
}: EventRowProps) {
    const getDiscountColor = (discount: number) => {
        if (discount >= 25) return "text-pink-400";
        if (discount >= 20) return "text-purple-400";
        if (discount >= 10) return "text-blue-400";
        return "text-cyan-400";
    };

    const isExpired = status === "Expired";
    const isActive = status === "Active";
    const canDelete = status === "Scheduled"; // Only Scheduled events can be deleted

    const getDeleteTooltip = () => {
        if (isActive) return "Cannot delete active events";
        if (isExpired) return "Cannot delete expired events";
        return "Delete event";
    };

    return (
        <tr className="dark:hover:bg-slate-800/30 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular ">
                    #{event.DiscountEventID}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium ">
                    {event.EventName}
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="dark:text-slate-400 text-sm max-w-xs">{event.Description}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-medium ${getDiscountColor(event.DiscountValue)}`}>
                    {event.DiscountValue}%
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm ">
                    {formatDate(event.TimeStart)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm ">
                    {formatDate(event.TimeEnd)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(event.DiscountEventID)}
                        disabled={isExpired}
                        title={isExpired ? "Cannot edit expired events" : "Edit event"}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isExpired
                                ? "opacity-40 cursor-not-allowed dark:bg-slate-800/30 dark:border dark:border-slate-700/30 dark:text-slate-600"
                                : "text-[#eb883b] dark:bg-slate-800/50 dark:hover:bg-orange-500/20 dark:border dark:border-slate-700/50 dark:hover:border-orange-500/50 dark:text-slate-400 dark:hover:text-orange-400"
                            }`}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(event.DiscountEventID)}
                        disabled={!canDelete}
                        title={getDeleteTooltip()}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${!canDelete
                                ? "opacity-40 cursor-not-allowed dark:bg-slate-800/30 dark:border dark:border-slate-700/30 dark:text-slate-600"
                                : "text-red-500 dark:bg-slate-800/50 dark:hover:bg-red-500/20 dark:border dark:border-slate-700/50 dark:hover:border-red-500/50 dark:text-slate-400 dark:hover:text-red-400"
                            }`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
