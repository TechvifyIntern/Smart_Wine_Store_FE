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
import { DiscountOrder } from "@/data/discount_order";
import {
    discountOrderSchema,
    type DiscountOrderFormData
} from "@/validations/discounts/discountOrderSchema";

export interface CreateDiscountOrderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    order?: DiscountOrder | null;
    onCreate?: (data: Omit<DiscountOrder, "DiscountOrderID">) => void | Promise<void>;
    onUpdate?: (id: number, data: Omit<DiscountOrder, "DiscountOrderID">) => void | Promise<void>;
}

export function CreateDiscountOrder({
    open,
    onOpenChange,
    mode,
    order,
    onCreate,
    onUpdate,
}: CreateDiscountOrderProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<DiscountOrderFormData>({
        resolver: zodResolver(discountOrderSchema),
        defaultValues: {
            DiscountValue: 5,
            MinimumOrderValue: 100000,
        },
    });

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (mode === "edit" && order) {
            setValue("DiscountValue", order.DiscountValue);
            setValue("MinimumOrderValue", order.MinimumOrderValue);
        } else if (mode === "create") {
            reset({
                DiscountValue: 5,
                MinimumOrderValue: 100000,
            });
        }
    }, [mode, order, setValue, reset]);

    const onSubmit = async (data: DiscountOrderFormData) => {
        try {
            const formattedData = {
                DiscountValue: data.DiscountValue,
                MinimumOrderValue: data.MinimumOrderValue,
                UpdatedAt: new Date().toISOString(),
            };

            if (mode === "create" && onCreate) {
                await onCreate(formattedData);
            } else if (mode === "edit" && onUpdate && order) {
                await onUpdate(order.DiscountOrderID, formattedData);
            }

            // Close modal and reset form on success
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error (you can add toast notification here)
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white! border-gray-200!">
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">
                        {mode === "create" ? "Create New Order Discount" : "Edit Order Discount"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        {mode === "create"
                            ? "Fill in the details to create a new order discount tier."
                            : "Update the details of the order discount tier."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Discount Value */}
                        <div className="space-y-2">
                            <Label htmlFor="DiscountValue" className="text-sm font-medium text-gray-900!">
                                Discount Value (%) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="DiscountValue"
                                type="number"
                                min="1"
                                max="100"
                                step="1"
                                placeholder="e.g., 10"
                                {...register("DiscountValue", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! ${errors.DiscountValue ? "border-red-500!" : ""}`}
                            />
                            {errors.DiscountValue && (
                                <p className="text-sm text-red-500">{errors.DiscountValue.message}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                The percentage discount applied to orders meeting the minimum value
                            </p>
                        </div>

                        {/* Minimum Order Value */}
                        <div className="space-y-2">
                            <Label htmlFor="MinimumOrderValue" className="text-sm font-medium text-gray-900!">
                                Minimum Order Value (VND) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="MinimumOrderValue"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="e.g., 500000"
                                {...register("MinimumOrderValue", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! ${errors.MinimumOrderValue ? "border-red-500!" : ""}`}
                            />
                            {errors.MinimumOrderValue && (
                                <p className="text-sm text-red-500">{errors.MinimumOrderValue.message}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                The minimum order value required to qualify for this discount
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Order Discount Tier</p>
                                    <p className="text-blue-700">
                                        Customers will automatically receive this discount when their order total reaches or exceeds the minimum order value.
                                    </p>
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
                            className="bg-[#eb883b] hover:bg-[#d97730] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Updating..."
                                : mode === "create"
                                    ? "Create Discount"
                                    : "Update Discount"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
