"use client";

import { useEffect, useState } from "react";
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
import { createInventoryProductSchema, CreateInventoryProductFormData } from "@/validations/inventories/inventoryProductSchema";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export interface CreateInventoryProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate?: (data: Omit<InventoryProduct, "ProductID">) => void | Promise<void>;
}

export function CreateInventoryProduct({
    open,
    onOpenChange,
    onCreate,
}: CreateInventoryProductProps) {
    const [imagePreview, setImagePreview] = useState<string>("");
    const [uploadMethod, setUploadMethod] = useState<"url" | "upload">("url");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<CreateInventoryProductFormData>({
        resolver: zodResolver(createInventoryProductSchema),
        defaultValues: {
            ProductName: "",
            ImageURL: "",
            Quantity: 0,
            CostPrice: 0,
            SalePrice: 0,
        },
    });

    const imageURL = watch("ImageURL");

    useEffect(() => {
        if (!open) {
            reset();
            setImagePreview("");
            setUploadMethod("url");
        }
    }, [open, reset]);

    useEffect(() => {
        if (uploadMethod === "url" && imageURL) {
            setImagePreview(imageURL);
        }
    }, [imageURL, uploadMethod]);

    const onSubmit = async (data: CreateInventoryProductFormData) => {
        try {
            if (onCreate) {
                await onCreate(data);
            }
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
        setImagePreview("");
        setUploadMethod("url");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setValue("ImageURL", base64String, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview("");
        setValue("ImageURL", "", { shouldValidate: true });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white! border-gray-200!">
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">Create New Product</DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        Fill in the details to create a new inventory product.
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
                                placeholder="e.g., Chardonnay Reserve"
                                {...register("ProductName")}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! ${errors.ProductName ? "border-red-500!" : ""}`}
                            />
                            {errors.ProductName && (
                                <p className="text-sm text-red-500">{errors.ProductName.message}</p>
                            )}
                        </div>

                        {/* Image Upload/URL */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900!">
                                Product Image <span className="text-red-500">*</span>
                            </Label>

                            {/* Upload Method Toggle */}
                            <div className="flex gap-2 mb-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setUploadMethod("url");
                                        setImagePreview("");
                                        setValue("ImageURL", "");
                                    }}
                                    className={`flex-1 ${uploadMethod === "url" ? "bg-[#ad8d5e] text-white hover:bg-[#7c653e] border-[#ad8d5e]" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                                >
                                    URL
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setUploadMethod("upload");
                                        setImagePreview("");
                                        setValue("ImageURL", "");
                                    }}
                                    className={`flex-1 ${uploadMethod === "upload" ? "bg-[#ad8d5e] text-white hover:bg-[#7c653e] border-[#ad8d5e]" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                                >
                                    <Upload className="w-4 h-4 mr-1" />
                                    Upload
                                </Button>
                            </div>

                            {uploadMethod === "url" ? (
                                <Input
                                    id="ImageURL"
                                    type="url"
                                    {...register("ImageURL")}
                                    className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! ${errors.ImageURL ? "border-red-500!" : ""}`}
                                />
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="imageUpload"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRemoveImage();
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WEBP up to 10MB</p>
                                            </div>
                                        )}
                                    </Label>
                                </div>
                            )}

                            {errors.ImageURL && (
                                <p className="text-sm text-red-500">{errors.ImageURL.message}</p>
                            )}

                            {/* Image Preview for URL method */}
                            {uploadMethod === "url" && imagePreview && (
                                <div className="mt-2 relative w-full h-32 border border-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                        onError={() => setImagePreview("")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="Quantity" className="text-sm font-medium text-gray-900!">
                                Initial Quantity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="Quantity"
                                type="number"
                                min="0"
                                step="1"
                                placeholder="e.g., 100"
                                {...register("Quantity", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! ${errors.Quantity ? "border-red-500!" : ""}`}
                            />
                            {errors.Quantity && (
                                <p className="text-sm text-red-500">{errors.Quantity.message}</p>
                            )}
                        </div>

                        {/* Cost Price */}
                        <div className="space-y-2">
                            <Label htmlFor="CostPrice" className="text-sm font-medium text-gray-900!">
                                Cost Price (VND) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="CostPrice"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="e.g., 150000"
                                {...register("CostPrice", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! ${errors.CostPrice ? "border-red-500!" : ""}`}
                            />
                            {errors.CostPrice && (
                                <p className="text-sm text-red-500">{errors.CostPrice.message}</p>
                            )}
                        </div>

                        {/* Sale Price */}
                        <div className="space-y-2">
                            <Label htmlFor="SalePrice" className="text-sm font-medium text-gray-900!">
                                Sale Price (VND) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="SalePrice"
                                type="number"
                                min="0"
                                step="1000"
                                placeholder="e.g., 250000"
                                {...register("SalePrice", { valueAsNumber: true })}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]! ${errors.SalePrice ? "border-red-500!" : ""}`}
                            />
                            {errors.SalePrice && (
                                <p className="text-sm text-red-500">{errors.SalePrice.message}</p>
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
                            className="bg-[#ad8d5e] hover:bg-[#7c653e] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
