"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InventoryProduct } from "@/app/admin/inventory/products/page";
import { PackageMinus, AlertTriangle } from "lucide-react";
import { exportStockSchema, ExportStockFormData } from "@/validations/inventories/inventoryProductSchema";

export interface InventoryExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: InventoryProduct | null;
    onExport?: (productId: string, quantity: number, reason: string) => void | Promise<void>;
}

export function InventoryExportModal({
    open,
    onOpenChange,
    product,
    onExport,
}: InventoryExportModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setError,
    } = useForm<ExportStockFormData>({
        resolver: zodResolver(exportStockSchema),
        defaultValues: {
            exportQuantity: 1,
            reason: "",
        },
    });

    const exportQuantity = watch("exportQuantity");

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = async (data: ExportStockFormData) => {
        if (!product) return;

        // Validate export quantity doesn't exceed available stock
        if (data.exportQuantity > product.Quantity) {
            setError("exportQuantity", {
                type: "manual",
                message: `Cannot export more than available stock (${product.Quantity} units)`,
            });
            return;
        }

        try {
            if (onExport) {
                await onExport(product.ProductID, data.exportQuantity, data.reason);
            }
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error exporting stock:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    if (!product) return null;

    const newQuantity = product.Quantity - (exportQuantity || 0);
    const isOverExport = (exportQuantity || 0) > product.Quantity;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white! border-gray-200!">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                            <PackageMinus className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-gray-900!">Export Stock</DialogTitle>
                            <DialogDescription className="text-gray-600!">
                                Remove inventory for {product.ProductName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Product Info Card */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                            <img
                                src={product.ImageURL}
                                alt={product.ProductName}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{product.ProductName}</p>
                                <p className="text-sm text-gray-500">ID: {product.ProductID}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Available Stock: <span className="font-medium">{product.Quantity} units</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Export Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="exportQuantity" className="text-sm font-medium text-gray-900!">
                                Export Quantity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="exportQuantity"
                                type="number"
                                min="1"
                                max={product.Quantity}
                                step="1"
                                placeholder="e.g., 20"
                                {...register("exportQuantity", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-purple-500! ${errors.exportQuantity ? "border-red-500!" : ""}`}
                            />
                            {errors.exportQuantity && (
                                <p className="text-sm text-red-500">{errors.exportQuantity.message}</p>
                            )}
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium text-gray-900!">
                                Reason for Export <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="reason"
                                rows={3}
                                placeholder="e.g., Damaged goods, Product recall, Customer order..."
                                {...register("reason")}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-purple-500! resize-none ${errors.reason ? "border-red-500!" : ""}`}
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-500">{errors.reason.message}</p>
                            )}
                        </div>

                        {/* Summary Card */}
                        {isOverExport ? (
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-900">Insufficient Stock</p>
                                        <p className="text-sm text-red-700 mt-1">
                                            You cannot export {exportQuantity || 0} units. Only {product.Quantity} units available.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm font-medium text-gray-900 mb-2">Export Summary</p>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Stock:</span>
                                        <span className="font-medium text-gray-900">{product.Quantity} units</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Export Quantity:</span>
                                        <span className="font-medium text-purple-600">-{exportQuantity || 0} units</span>
                                    </div>
                                    <div className="h-px bg-purple-200 my-2" />
                                    <div className="flex justify-between">
                                        <span className="text-gray-900 font-medium">Remaining Stock:</span>
                                        <span className={`font-bold ${newQuantity < 50 ? "text-orange-600" : "text-purple-600"}`}>
                                            {newQuantity} units
                                        </span>
                                    </div>
                                </div>
                                {newQuantity < 50 && newQuantity > 0 && (
                                    <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                                        <p className="text-xs text-orange-700 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            Low stock warning: Consider restocking soon
                                        </p>
                                    </div>
                                )}
                                {newQuantity === 0 && (
                                    <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                                        <p className="text-xs text-red-700 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            This will deplete all stock for this product
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100! disabled:opacity-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isOverExport}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Exporting..." : "Confirm Export"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
