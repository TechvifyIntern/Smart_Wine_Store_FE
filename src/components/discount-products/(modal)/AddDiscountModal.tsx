"use client";

import { useState } from "react";
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
import { Tag } from "lucide-react";

interface AddDiscountModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onConfirm: (discountValue: number, discountTypeId: number) => void;
    isLoading?: boolean;
}

export default function AddDiscountModal({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
    isLoading = false,
}: AddDiscountModalProps) {
    const [discountValue, setDiscountValue] = useState<string>("");
    const [discountTypeId, setDiscountTypeId] = useState<string>("1"); // 1 = Percentage, 2 = Fixed Amount
    const [error, setError] = useState<string>("");

    const handleConfirm = () => {
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
        onConfirm(value, parseInt(discountTypeId));

        // Reset form
        setDiscountValue("");
        setDiscountTypeId("1");
    };

    const handleCancel = () => {
        setDiscountValue("");
        setDiscountTypeId("1");
        setError("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-[#ad8d5e]" />
                        Add Discount to Products
                    </DialogTitle>
                    <DialogDescription>
                        Add discount to {selectedCount} selected product{selectedCount > 1 ? "s" : ""}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Discount Type */}
                    <div className="space-y-2">
                        <Label htmlFor="discountType">Discount Type</Label>
                        <Select value={discountTypeId} onValueChange={setDiscountTypeId}>
                            <SelectTrigger id="discountType">
                                <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Percentage (%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Discount Value */}
                    <div className="space-y-2">
                        <Label htmlFor="discountValue">
                            Discount Value {discountTypeId === "1" ? "(%)" : "(VND)"}
                        </Label>
                        <Input
                            id="discountValue"
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
                    {discountValue && !isNaN(parseFloat(discountValue)) && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                <strong>Preview:</strong> This will apply{" "}
                                <span className="font-semibold">
                                    {discountTypeId === "1"
                                        ? `${discountValue}% discount`
                                        : `${parseFloat(discountValue).toLocaleString()} VND discount`}
                                </span>{" "}
                                to {selectedCount} product{selectedCount > 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
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
                        disabled={isLoading || !discountValue}
                        className="bg-[#ad8d5e] hover:bg-[#8c6b3e]"
                    >
                        {isLoading ? "Adding..." : "Add Discount"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
