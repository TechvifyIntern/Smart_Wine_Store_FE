"use client";

import { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2 } from "lucide-react";
import { Product } from "@/types/product-detail";

interface EditDiscountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onConfirm: (productId: number, discountValue: number, discountTypeId: number) => void;
    onRemove?: (productId: number) => void;
    isLoading?: boolean;
}

export default function EditDiscountModal({
    open,
    onOpenChange,
    product,
    onConfirm,
    onRemove,
    isLoading = false,
}: EditDiscountModalProps) {
    const [discountValue, setDiscountValue] = useState<string>("");
    const [discountTypeId, setDiscountTypeId] = useState<string>("1");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (product) {
            setDiscountValue(product.DiscountValue?.toString() || "");
            setDiscountTypeId(product.DiscountTypeID?.toString() || "1");
            setError("");
        }
    }, [product]);

    const handleConfirm = () => {
        if (!product) return;

        // Validation
        const value = parseFloat(discountValue);
        if (isNaN(value) || value <= 0) {
            setError("Please enter a valid discount value");
            return;
        }

        if (discountTypeId === "1" && value > 100) {
            setError("Percentage discount cannot exceed 100%");
            return;
        }

        setError("");
        onConfirm(product.ProductID, value, parseInt(discountTypeId));
    };

    const handleRemove = () => {
        if (!product || !onRemove) return;
        onRemove(product.ProductID);
    };

    const handleCancel = () => {
        setError("");
        onOpenChange(false);
    };

    if (!product) return null;

    const hasDiscount = product.DiscountValue && product.DiscountValue > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-[#ad8d5e]" />
                        Edit Product Discount
                    </DialogTitle>
                    <DialogDescription>
                        Update discount for <strong>{product.ProductName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Product Info */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-slate-400">Product ID:</span>
                            <span className="font-medium">#{product.ProductID}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-slate-400">Sale Price:</span>
                            <span className="font-medium">{product.SalePrice.toLocaleString()} VND</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-slate-400">Current Discount:</span>
                            {hasDiscount ? (
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {product.DiscountValue}%
                                </span>
                            ) : (
                                <span className="font-medium text-gray-500 dark:text-slate-500">
                                    No discount
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Discount Type */}
                    <div className="space-y-2">
                        <Label htmlFor="editDiscountType">Discount Type</Label>
                        <Select value={discountTypeId} onValueChange={setDiscountTypeId}>
                            <SelectTrigger id="editDiscountType">
                                <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Percentage (%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Discount Value */}
                    <div className="space-y-2">
                        <Label htmlFor="editDiscountValue">
                            Discount Value {discountTypeId === "1" ? "(%)" : "(VND)"}
                        </Label>
                        <Input
                            id="editDiscountValue"
                            type="number"
                            min="0"
                            max={discountTypeId === "1" ? "100" : undefined}
                            step={discountTypeId === "1" ? "0.01" : "1000"}
                            value={discountValue}
                            onChange={(e) => {
                                setDiscountValue(e.target.value);
                                setError("");
                            }}
                            placeholder={
                                discountTypeId === "1"
                                    ? "e.g., 10 for 10% off"
                                    : "e.g., 50000 for 50,000 VND off"
                            }
                            className="w-full"
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    {/* Preview */}
                    {discountValue && !isNaN(parseFloat(discountValue)) && parseFloat(discountValue) > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                <strong>New discount:</strong>{" "}
                                <span className="font-semibold">
                                    {discountTypeId === "1"
                                        ? `${discountValue}% off`
                                        : `${parseFloat(discountValue).toLocaleString()} VND off`}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex justify-start">
                        {onRemove && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleRemove}
                                disabled={isLoading || !hasDiscount}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove Discount
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading || !discountValue || parseFloat(discountValue) <= 0}
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e]"
                        >
                            {isLoading ? "Updating..." : "Update Discount"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
