"use client";

import { useState, useCallback } from "react";
import DiscountProductRow from "./DiscountProductRow";
import { Product } from "@/types/product-detail";
import { Checkbox } from "@/components/ui/checkbox";

interface DiscountProductTableProps {
    products: Product[];
    selectedProducts: number[];
    onSelectProduct: (productId: number) => void;
    onSelectAll: (selected: boolean) => void;
    onEdit: (product: Product) => void;
    formatCurrency: (amount: number) => string;
    isSelectingAll?: boolean;
    emptyMessage?: string;
}

export default function DiscountProductTable({
    products,
    selectedProducts,
    onSelectProduct,
    onSelectAll,
    onEdit,
    formatCurrency,
    isSelectingAll = false,
    emptyMessage = "No products found",
}: DiscountProductTableProps) {
    // Check if all products on current page are selected
    const allCurrentPageSelected = products.length > 0 &&
        products.every(p => selectedProducts.includes(p.ProductID));
    const someSelected = selectedProducts.length > 0 && !allCurrentPageSelected;

    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider w-12">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={allCurrentPageSelected}
                                        onCheckedChange={(checked) => onSelectAll(!!checked)}
                                        className={someSelected ? "data-[state=checked]:bg-gray-400" : ""}
                                    />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Cost Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Sale Price
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Discount Value
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <DiscountProductRow
                                    key={product.ProductID}
                                    product={product}
                                    isSelected={selectedProducts.includes(product.ProductID)}
                                    onSelect={() => onSelectProduct(product.ProductID)}
                                    onEdit={() => onEdit(product)}
                                    formatCurrency={formatCurrency}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg
                                            className="w-16 h-16 dark:text-slate-700 text-gray-300 mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                        <p className="dark:text-slate-400 text-gray-500 font-medium">
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
