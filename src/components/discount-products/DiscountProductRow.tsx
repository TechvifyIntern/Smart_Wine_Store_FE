"use client";

import { Wine, Edit2 } from "lucide-react";
import { Product } from "@/types/product-detail";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface DiscountProductRowProps {
    product: Product;
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    formatCurrency: (amount: number) => string;
}

export default function DiscountProductRow({
    product,
    isSelected,
    onSelect,
    onEdit,
    formatCurrency,
}: DiscountProductRowProps) {
    const hasDiscount = product.DiscountValue && product.DiscountValue > 0;

    return (
        <tr
            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group"
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {product.ImageURL ? (
                    <img
                        src={product.ImageURL}
                        alt={product.ProductName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                        <Wine className="w-6 h-6 text-gray-400 dark:text-slate-500" />
                    </div>
                )}
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
                {product.CategoryName && (
                    <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                        {product.CategoryName}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="dark:text-slate-400 text-sm font-medium">
                    {formatCurrency(Number(product.CostPrice))}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(product.SalePrice)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                {hasDiscount ? (
                    <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    >
                        {product.DiscountTypeID === 1
                            ? `${product.DiscountValue}%`
                            : `${formatCurrency(product.DiscountValue)}`}
                    </Badge>
                ) : (
                    <span className="text-sm text-gray-400 dark:text-slate-500">-</span>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        title="Edit discount"
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-[#ad8d5e]/10 text-[#ad8d5e] dark:bg-slate-800/50 dark:hover:bg-[#ad8d5e]/20 dark:border dark:border-slate-700/50 dark:hover:border-[#ad8d5e]/50 dark:text-slate-400 dark:hover:text-[#ad8d5e]"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
