"use client";

import { useState, useCallback } from "react";
import ProductRow from "./ProductRow";
import { Product } from "@/data/products";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductTableProps {
    products: Product[];
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, isActive: boolean) => void;
    formatCurrency: (amount: number) => string;
    emptyMessage?: string;
}

export default function ProductTable({
    products,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
    formatCurrency,
    emptyMessage = "No products found",
}: ProductTableProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingProductId, setPendingProductId] = useState<number | null>(null);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

    const handleStatusChangePending = useCallback((id: number, newIsActive: boolean) => {
        setPendingProductId(id);
        setPendingStatus(newIsActive);
        setShowConfirmDialog(true);
    }, []);

    const handleConfirmStatusChange = useCallback(() => {
        if (pendingProductId !== null && pendingStatus !== null) {
            onToggleStatus(pendingProductId, pendingStatus);
            setShowConfirmDialog(false);
            setPendingProductId(null);
            setPendingStatus(null);
        }
    }, [pendingProductId, pendingStatus, onToggleStatus]);

    const handleCancelStatusChange = useCallback(() => {
        setShowConfirmDialog(false);
        setPendingProductId(null);
        setPendingStatus(null);
    }, []);

    return (
        <div className="dark:bg-slate-900/50 dark:backdrop-blur-sm border border-[#F2F2F2] dark:border-slate-800/50 rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="dark:bg-slate-800/50 dark:border-b dark:border-slate-700/50 border-b border-[#F2F2F2]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-regular tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Cost Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-regular tracking-wider">
                                Sale Price
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-regular tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F2F2] dark:divide-slate-800/50">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductRow
                                    key={product.ProductID}
                                    product={product}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggleStatus={onToggleStatus}
                                    formatCurrency={formatCurrency}
                                    onStatusChangePending={handleStatusChangePending}
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

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {pendingStatus ? "activate" : "deactivate"} this product?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelStatusChange}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
