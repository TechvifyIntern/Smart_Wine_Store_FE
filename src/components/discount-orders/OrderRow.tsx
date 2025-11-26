import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import { DiscountOrder } from "@/data/discount_order";

interface OrderRowProps {
    order: DiscountOrder;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    formatDate: (dateString: string | undefined) => string;
    formatCurrency: (value: number) => string;
}

export default function OrderRow({
    order,
    onEdit,
    onDelete,
    formatDate,
    formatCurrency,
}: OrderRowProps) {
    const router = useRouter();

    const getDiscountColor = (discount: number) => {
        if (discount >= 25) return "text-pink-400";
        if (discount >= 20) return "text-purple-400";
        if (discount >= 10) return "text-blue-400";
        return "text-cyan-400";
    };

    return (
        <tr
            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
            onClick={() => router.push(`/admin/discounts/orders/${order.DiscountOrderID}`)}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular ">
                    #{order.DiscountOrderID}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-medium ${getDiscountColor(order.DiscountValue)}`}>
                    {order.DiscountValue}%
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium">
                    {formatCurrency(order.MinimumOrderValue)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm ">
                    {formatDate(order.UpdatedAt)}
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(order.DiscountOrderID)}
                        title="Edit order discount"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-orange-500/20 dark:border dark:border-slate-700/50 dark:hover:border-orange-500/50 dark:text-slate-400 dark:hover:text-orange-400"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(order.DiscountOrderID)}
                        title="Delete order discount"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-red-500 dark:bg-slate-800/50 dark:hover:bg-red-500/20 dark:border dark:border-slate-700/50 dark:hover:border-red-500/50 dark:text-slate-400 dark:hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
