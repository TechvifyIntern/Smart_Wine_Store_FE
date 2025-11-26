import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import { DiscountProduct } from "@/data/discount_product";
import StatusBadge from "@/components/discount-events/StatusBadge";

interface ProductRowProps {
    product: DiscountProduct;
    status: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    formatDate: (dateString: string) => string;
}

export default function ProductRow({
    product,
    status,
    onEdit,
    onDelete,
    formatDate,
}: ProductRowProps) {
    const router = useRouter();
    const getDiscountColor = (discount: number) => {
        if (discount >= 25) return "text-pink-400";
        if (discount >= 20) return "text-purple-400";
        if (discount >= 10) return "text-blue-400";
        return "text-cyan-400";
    };

    const isExpired = status === "Expired";
    const isActive = status === "Active";
    const canDelete = status === "Scheduled"; // Only Scheduled products can be deleted

    const getDeleteTooltip = () => {
        if (isActive) return "Cannot delete active product discounts";
        if (isExpired) return "Cannot delete expired product discounts";
        return "Delete product discount";
    };

    return (
        <tr
            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
            onClick={() => router.push(`/admin/discounts/products/${product.DiscountProductID}`)}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular">
                    #{product.DiscountProductID}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium max-w-xs">
                    {product.ProductName}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-medium ${getDiscountColor(product.DiscountValue)}`}>
                    {product.DiscountValue}%
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm">
                    {formatDate(product.TimeStart)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm">
                    {formatDate(product.TimeEnd)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(product.DiscountProductID)}
                        disabled={isExpired}
                        title={isExpired ? "Cannot edit expired product discounts" : "Edit product discount"}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isExpired
                            ? "opacity-40 cursor-not-allowed dark:bg-slate-800/30 dark:border dark:border-slate-700/30 dark:text-slate-600"
                            : "text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-[#8c6b3e]/20 dark:border dark:border-slate-700/50 dark:hover:border-[#8c6b3e]/50 dark:text-slate-400 dark:hover:text-[#8c6b3e]"
                        }`}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(product.DiscountProductID)}
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
