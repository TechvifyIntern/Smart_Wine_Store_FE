import { Edit2, PackagePlus, PackageMinus } from "lucide-react";
import { InventoryProduct } from "@/app/admin/inventory/products/page";

interface ProductRowProps {
    product: InventoryProduct;
    onEdit: (id: string) => void;
    onImport: (id: string) => void;
    onExport: (id: string) => void;
    formatCurrency: (amount: number) => string;
}

export default function ProductRow({
    product,
    onEdit,
    onImport,
    onExport,
    formatCurrency,
}: ProductRowProps) {
    const getQuantityColor = (quantity: number) => {
        if (quantity === 0) return "text-red-500";
        if (quantity < 50) return "text-orange-500";
        if (quantity < 100) return "text-yellow-500";
        return "text-green-500";
    };

    const getQuantityBadgeColor = (quantity: number) => {
        if (quantity === 0) return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
        if (quantity < 50) return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
        if (quantity < 100) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    };

    const canExport = product.Quantity > 0;

    return (
        <tr className="dark:hover:bg-slate-800/30 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap">
                <img
                    src={product.ImageURL}
                    alt={product.ProductName}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="dark:text-slate-400 text-sm font-regular">
                    #{product.ProductID}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-medium max-w-xs">
                    {product.ProductName}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getQuantityBadgeColor(product.Quantity)}`}>
                    {product.Quantity}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="dark:text-slate-400 text-sm font-medium">
                    {formatCurrency(product.CostPrice)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(product.SalePrice)}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(product.ProductID)}
                        title="Edit product"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-[#ad8d5e]/20 dark:border dark:border-slate-700/50 dark:hover:border-[#ad8d5e]/50 dark:text-slate-400 dark:hover:text-[#ad8d5e]"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Import Button */}
                    <button
                        onClick={() => onImport(product.ProductID)}
                        title="Import stock"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-green-600 dark:bg-slate-800/50 dark:hover:bg-green-500/20 dark:border dark:border-slate-700/50 dark:hover:border-green-500/50 dark:text-slate-400 dark:hover:text-green-400"
                    >
                        <PackagePlus className="w-4 h-4" />
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={() => onExport(product.ProductID)}
                        disabled={!canExport}
                        title={canExport ? "Export stock" : "No stock available"}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${!canExport
                                ? "opacity-40 cursor-not-allowed dark:bg-slate-800/30 dark:border dark:border-slate-700/30 dark:text-slate-600"
                                : "text-purple-600 dark:bg-slate-800/50 dark:hover:bg-purple-500/20 dark:border dark:border-slate-700/50 dark:hover:border-purple-500/50 dark:text-slate-400 dark:hover:text-purple-400"
                            }`}
                    >
                        <PackageMinus className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
