import { Edit, Trash2, Eye, Percent } from "lucide-react";
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
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    #{event.DiscountEventID}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                    {event.EventName}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-600 max-w-xs truncate">
                    {event.Description}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm font-bold text-purple-600">
                    {event.DiscountValue}%
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {formatDate(event.TimeStart)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {formatDate(event.TimeEnd)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(event.DiscountEventID)}
                        className="text-amber-600 hover:text-amber-900 p-1 hover:bg-amber-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(event.DiscountEventID)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
