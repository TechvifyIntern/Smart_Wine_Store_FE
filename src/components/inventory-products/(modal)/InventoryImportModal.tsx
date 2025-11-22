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
import { InventoryProduct } from "@/app/admin/inventory/products/page";
import { PackagePlus } from "lucide-react";
import { importStockSchema, ImportStockFormData } from "@/validations/inventories/inventoryProductSchema";

export interface InventoryImportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: InventoryProduct | null;
    onImport?: (productId: string, quantity: number, batchCostPrice: number) => void | Promise<void>;
}

export function InventoryImportModal({
    open,
    onOpenChange,
    product,
    onImport,
}: InventoryImportModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<ImportStockFormData>({
        resolver: zodResolver(importStockSchema),
        defaultValues: {
            importQuantity: 1,
            batchCostPrice: 0,
        },
    });

    const importQuantity = watch("importQuantity");

    useEffect(() => {
        if (product && open) {
            reset({
                importQuantity: 1,
                batchCostPrice: product.CostPrice,
            });
        } else if (!open) {
            reset();
        }
    }, [product, open, reset]);

    const onSubmit = async (data: ImportStockFormData) => {
        if (!product) return;

        try {
            if (onImport) {
                await onImport(product.ProductID, data.importQuantity, data.batchCostPrice);
            }
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error importing stock:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    if (!product) return null;

    const newQuantity = product.Quantity + (importQuantity || 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white! border-gray-200!">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                            <PackagePlus className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-gray-900!">Import Stock</DialogTitle>
                            <DialogDescription className="text-gray-600!">
                                Add inventory for {product.ProductName}
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
                                    Current Stock: <span className="font-medium">{product.Quantity} units</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Import Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="importQuantity" className="text-sm font-medium text-gray-900!">
                                Import Quantity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="importQuantity"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="e.g., 50"
                                {...register("importQuantity", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-green-500! ${errors.importQuantity ? "border-red-500!" : ""}`}
                            />
                            {errors.importQuantity && (
                                <p className="text-sm text-red-500">{errors.importQuantity.message}</p>
                            )}
                        </div>

                        {/* Batch Cost Price */}
                        <div className="space-y-2">
                            <Label htmlFor="batchCostPrice" className="text-sm font-medium text-gray-900!">
                                Batch Cost Price (VND) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="batchCostPrice"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="e.g., 150000"
                                {...register("batchCostPrice", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-green-500! ${errors.batchCostPrice ? "border-red-500!" : ""}`}
                            />
                            {errors.batchCostPrice && (
                                <p className="text-sm text-red-500">{errors.batchCostPrice.message}</p>
                            )}
                            <p className="text-xs text-gray-500">Cost price for this import batch</p>
                        </div>

                        {/* Summary Card */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm font-medium text-gray-900 mb-2">Import Summary</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Current Stock:</span>
                                    <span className="font-medium text-gray-900">{product.Quantity} units</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Import Quantity:</span>
                                    <span className="font-medium text-green-600">+{importQuantity || 0} units</span>
                                </div>
                                <div className="h-px bg-green-200 my-2" />
                                <div className="flex justify-between">
                                    <span className="text-gray-900 font-medium">New Stock:</span>
                                    <span className="font-bold text-green-600">{newQuantity} units</span>
                                </div>
                            </div>
                        </div>
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
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Importing..." : "Confirm Import"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
