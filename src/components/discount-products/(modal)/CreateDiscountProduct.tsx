"use client";

import { useEffect, useMemo } from "react";
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
import { DiscountProduct } from "@/data/discount_product";
import {
    discountProductSchema,
    discountProductEditActiveSchema,
    type DiscountProductFormData
} from "@/validations/discounts/discountProductSchema";

export interface CreateDiscountProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    product?: DiscountProduct | null;
    productStatus?: string;
    onCreate?: (data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
    onUpdate?: (id: number, data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
}

// Helper function to convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
const toDatetimeLocalFormat = (isoString: string): string => {
    if (!isoString) return "";
    try {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
        return "";
    }
};

// Helper function to convert datetime-local format to ISO string
const toISOString = (datetimeLocal: string): string => {
    if (!datetimeLocal) return "";
    try {
        return new Date(datetimeLocal).toISOString();
    } catch (error) {
        return "";
    }
};

// Get current datetime in datetime-local format for min attribute
const getCurrentDatetimeLocal = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function CreateDiscountProduct({
    open,
    onOpenChange,
    mode,
    product,
    productStatus,
    onCreate,
    onUpdate,
}: CreateDiscountProductProps) {
    // Determine if product is Active
    const isActiveProduct = mode === "edit" && productStatus === "Active";

    // Use different schema based on product status
    const validationSchema = isActiveProduct ? discountProductEditActiveSchema : discountProductSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<DiscountProductFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            ProductName: "",
            DiscountValue: 10,
            TimeStart: "",
            TimeEnd: "",
        },
    });

    // Watch TimeStart to set min for TimeEnd
    const timeStart = watch("TimeStart");

    // Get minimum datetime (current time for create, or allow past for edit)
    const minDateTime = useMemo(() => {
        if (mode === "edit") {
            return "";
        }
        return getCurrentDatetimeLocal();
    }, [mode]);

    // Get minimum datetime for TimeEnd when product is Active
    const minEndDateTime = useMemo(() => {
        if (isActiveProduct) {
            return getCurrentDatetimeLocal(); // Must be in future
        }
        return timeStart || minDateTime;
    }, [isActiveProduct, timeStart, minDateTime]);

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (mode === "edit" && product) {
            setValue("ProductName", product.ProductName);
            setValue("DiscountValue", product.DiscountValue);
            setValue("TimeStart", toDatetimeLocalFormat(product.TimeStart));
            setValue("TimeEnd", toDatetimeLocalFormat(product.TimeEnd));
        } else if (mode === "create") {
            reset({
                ProductName: "",
                DiscountValue: 10,
                TimeStart: "",
                TimeEnd: "",
            });
        }
    }, [mode, product, setValue, reset]);

    const onSubmit = async (data: DiscountProductFormData) => {
        try {
            const formattedData = {
                ProductName: data.ProductName,
                DiscountValue: data.DiscountValue,
                TimeStart: toISOString(data.TimeStart),
                TimeEnd: toISOString(data.TimeEnd),
            };

            if (mode === "create" && onCreate) {
                await onCreate(formattedData);
            } else if (mode === "edit" && onUpdate && product) {
                await onUpdate(product.DiscountProductID, formattedData);
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
                        {mode === "create" ? "Create New Product Discount" : "Edit Product Discount"}
                        {isActiveProduct && <span className="text-sm font-normal text-orange-500 ml-2">(Active Discount)</span>}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        {mode === "create"
                            ? "Fill in the details to create a new product discount."
                            : isActiveProduct
                                ? "For active discounts, you can only modify the end date to extend the discount."
                                : "Update the details of the product discount."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <Label htmlFor="ProductName" className="text-sm font-medium text-gray-900!">
                                Product Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="ProductName"
                                placeholder="e.g., Château Margaux 2015"
                                {...register("ProductName")}
                                disabled={isActiveProduct}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! ${isActiveProduct ? "opacity-60 cursor-not-allowed" : ""} ${errors.ProductName ? "border-red-500!" : ""}`}
                            />
                            {errors.ProductName && (
                                <p className="text-sm text-red-500">{errors.ProductName.message}</p>
                            )}
                        </div>

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
                                placeholder="e.g., 25"
                                {...register("DiscountValue", { valueAsNumber: true })}
                                disabled={isActiveProduct}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! ${isActiveProduct ? "opacity-60 cursor-not-allowed" : ""} ${errors.DiscountValue ? "border-red-500!" : ""}`}
                            />
                            {errors.DiscountValue && (
                                <p className="text-sm text-red-500">{errors.DiscountValue.message}</p>
                            )}
                        </div>

                        {/* Time Start */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="TimeStart" className="text-sm font-medium text-gray-900!">
                                    Start Date & Time <span className="text-red-500">*</span>
                                </Label>
                                {errors.TimeStart && (
                                    <p className="text-xs text-red-500 font-medium">{errors.TimeStart.message}</p>
                                )}
                            </div>
                            <Input
                                id="TimeStart"
                                type="datetime-local"
                                min={minDateTime}
                                {...register("TimeStart")}
                                disabled={isActiveProduct}
                                className={`bg-white! border-gray-300! text-gray-900! focus:ring-2 focus:ring-[#eb883b]! ${isActiveProduct ? "opacity-60 cursor-not-allowed" : ""} ${errors.TimeStart ? "border-red-500!" : ""}`}
                            />
                        </div>

                        {/* Time End */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="TimeEnd" className="text-sm font-medium text-gray-900!">
                                    End Date & Time <span className="text-red-500">*</span>
                                </Label>
                                {errors.TimeEnd && (
                                    <p className="text-xs text-red-500 font-medium">{errors.TimeEnd.message}</p>
                                )}
                            </div>
                            <Input
                                id="TimeEnd"
                                type="datetime-local"
                                min={minEndDateTime}
                                {...register("TimeEnd")}
                                className={`bg-white! border-gray-300! text-gray-900! focus:ring-2 focus:ring-[#eb883b]! ${isActiveProduct ? "border-orange-300! focus:ring-orange-500!" : ""} ${errors.TimeEnd ? "border-red-500!" : ""}`}
                            />
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
