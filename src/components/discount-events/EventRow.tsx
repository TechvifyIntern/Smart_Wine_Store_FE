import { useRouter } from "next/navigation";
import { Trash2, Edit2 } from "lucide-react";
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
    const router = useRouter();
    const getDiscountColor = (discount: number) => {
        if (discount >= 25) return "text-pink-400";
        if (discount >= 20) return "text-purple-400";
        if (discount >= 10) return "text-blue-400";
        return "text-cyan-400";
    };

    const isExpired = status === "Expired";

    return (
        <tr
            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
            onClick={() => router.push(`/admin/discounts/events/${event.DiscountEventID}`)}
        >
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
                <span className={`text-sm font-medium ${getDiscountColor(event.DiscountValue || event.discountValue || 0)}`}>
                    {event.DiscountValue || event.discountValue || 0}%
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
                    {/* Edit Button - Disabled for Expired, enabled for others */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isExpired) {
                                onEdit(event.DiscountEventID);
                            }
                        }}
                        disabled={isExpired}
                        title={isExpired ? "Cannot edit expired events" : "Edit event"}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isExpired
                                ? "opacity-40 cursor-not-allowed text-gray-400 dark:bg-slate-800/30 dark:border dark:border-slate-700/30 dark:text-slate-600"
                                : "text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-orange-500/20 dark:border dark:border-slate-700/50 dark:hover:border-orange-500/50 dark:text-slate-400 dark:hover:text-orange-400"
                            }`}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button - Disabled for Active and Expired, enabled only for Scheduled */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (status === "Scheduled") {
                                onDelete(event.DiscountEventID);
                            }
                        }}
                        disabled={status !== "Scheduled"}
                        title={status === "Scheduled" ? "Delete event" : status === "Active" ? "Cannot delete active events" : "Cannot delete expired events"}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${status === "Scheduled"
                                ? "text-red-500 dark:bg-slate-800/50 dark:hover:bg-red-500/20 dark:border dark:border-slate-700/50 dark:hover:border-red-500/50 dark:text-slate-400 dark:hover:text-red-400"
                                : "opacity-40 cursor-not-allowed text-gray-400 dark:bg-slate-800/30 dark:border dark:border-slate-700/30 dark:text-slate-600"
                            }`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
