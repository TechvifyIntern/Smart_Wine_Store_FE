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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProductCategory } from "@/data/product_categories";
import {
    categorySchema,
    type CategoryFormData,
} from "@/validations/categories/categorySchema";

export interface CreateCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    category?: ProductCategory | null;
    onCreate?: (data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => void | Promise<void>;
    onUpdate?: (id: number, data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => void | Promise<void>;
}

export function CreateCategory({
    open,
    onOpenChange,
    mode,
    category,
    onCreate,
    onUpdate,
}: CreateCategoryProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            CategoryName: "",
            Description: "",
        },
    });

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (mode === "edit" && category) {
            setValue("CategoryName", category.CategoryName);
            setValue("Description", category.Description);
        } else if (mode === "create") {
            reset({
                CategoryName: "",
                Description: "",
            });
        }
    }, [mode, category, setValue, reset]);

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const formattedData = {
                CategoryName: data.CategoryName,
                Description: data.Description,
                ParentCategoryID: null,
                ParentCategoryName: null,
            };

            if (mode === "create" && onCreate) {
                await onCreate(formattedData);
            } else if (mode === "edit" && onUpdate && category) {
                await onUpdate(category.CategoryID, formattedData);
            }

            // Close modal and reset form on success
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
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
                        {mode === "create" ? "Create New Category" : "Edit Category"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        {mode === "create"
                            ? "Fill in the details to create a new product category."
                            : "Update the details of the product category."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Category Name */}
                        <div className="space-y-2">
                            <Label htmlFor="CategoryName" className="text-sm font-medium text-gray-900!">
                                Category Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="CategoryName"
                                placeholder="e.g., Red Wine"
                                {...register("CategoryName")}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! ${errors.CategoryName ? "border-red-500!" : ""}`}
                            />
                            {errors.CategoryName && (
                                <p className="text-sm text-red-500">{errors.CategoryName.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="Description" className="text-sm font-medium text-gray-900!">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="Description"
                                placeholder="Describe the category..."
                                rows={4}
                                {...register("Description")}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! resize-none ${errors.Description ? "border-red-500!" : ""}`}
                            />
                            {errors.Description && (
                                <p className="text-sm text-red-500">{errors.Description.message}</p>
                            )}
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
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Updating..."
                                : mode === "create"
                                    ? "Create Category"
                                    : "Update Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
