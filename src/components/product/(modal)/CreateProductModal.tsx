"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect, useState } from "react";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
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
import { Product } from "@/data/products";
import { mockCategories } from "@/data/categories";
import {
    createProductSchema,
    type CreateProductFormData,
} from "@/validations/products/productSchema";

interface CreateProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (product: Omit<Product, "ProductID">) => void | Promise<void>;
}

export function CreateProductModal({
    open,
    onOpenChange,
    onCreate,
}: CreateProductModalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            if (scrollRef.current) {
                scrollRef.current.focus();
            }
        } else {
            document.body.style.overflow = 'unset';
            setUploadedImageUrl(""); // Reset image when modal closes
        }
    }, [open]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<CreateProductFormData>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            ProductName: "",
            CategoryID: 1,
            ImageURL: "",
            CostPrice: 0,
            SalePrice: 0,
            isActive: true,
        },
    });

    const categoryID = watch("CategoryID");
    const isActive = watch("isActive");

    const onSubmit = async (data: CreateProductFormData) => {
        try {
            const imageUrl = uploadedImageUrl || data.ImageURL;
            await onCreate({
                ...data,
                ImageURL: imageUrl,
                CategoryID: data.CategoryID.toString(),
            });
            onOpenChange(false);
            reset();
            setUploadedImageUrl("");
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[100vh] bg-white! border-gray-200! flex flex-col [&>[data-radix-dialog-body]]:px-6 [&>[data-radix-dialog-body]]:py-4">
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">Create New Product</DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        Fill in the product details to add a new product.
                    </DialogDescription>
                </DialogHeader>

                <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-behavior-smooth focus:outline-none scrollbar-hide" tabIndex={-1}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pr-1 pb-4">
                        <div className="space-y-4">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="ProductName" className="text-sm font-medium text-gray-900!">
                                    Product Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ProductName"
                                    placeholder="Enter product name"
                                    {...register("ProductName")}
                                    className={`bg-white! border-gray-300! text-gray-900! ${errors.ProductName ? "border-red-500!" : ""}`}
                                />
                                {errors.ProductName && (
                                    <p className="text-sm text-red-500">{errors.ProductName.message}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={categoryID.toString()}
                                    onValueChange={(value) => setValue("CategoryID", parseInt(value))}
                                >
                                    <SelectTrigger className="bg-white! border-gray-300! text-gray-900!">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white! border-gray-200!">
                                        {mockCategories.map((category) => (
                                            <SelectItem key={category.CategoryID} value={category.CategoryID.toString()}>
                                                {category.CategoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.CategoryID && (
                                    <p className="text-sm text-red-500">{errors.CategoryID.message}</p>
                                )}
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="CostPrice" className="text-sm font-medium text-gray-900!">
                                        Cost Price (VND) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="CostPrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="0"
                                        {...register("CostPrice", { valueAsNumber: true })}
                                        className={`bg-white! border-gray-300! text-gray-900! ${errors.CostPrice ? "border-red-500!" : ""}`}
                                    />
                                    {errors.CostPrice && (
                                        <p className="text-sm text-red-500">{errors.CostPrice.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="SalePrice" className="text-sm font-medium text-gray-900!">
                                        Sale Price (VND) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="SalePrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="0"
                                        {...register("SalePrice", { valueAsNumber: true })}
                                        className={`bg-white! border-gray-300! text-gray-900! ${errors.SalePrice ? "border-red-500!" : ""}`}
                                    />
                                    {errors.SalePrice && (
                                        <p className="text-sm text-red-500">{errors.SalePrice.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Product Image (Optional)
                                </Label>

                                {/* Cloudinary Upload Widget */}
                                <CldUploadWidget
                                    uploadPreset="wine_store_products" // You may need to create this preset in Cloudinary
                                    onSuccess={(result: any) => {
                                        if (result?.info?.secure_url) {
                                            setUploadedImageUrl(result.info.secure_url);
                                        }
                                    }}
                                    options={{
                                        maxFiles: 1,
                                        resourceType: "image",
                                        folder: "wine-store/products",
                                    }}
                                >
                                    {({ open }: { open: () => void }) => (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => open()}
                                            className="w-full bg-white! border-gray-300! text-gray-700! hover:bg-gray-50!"
                                        >
                                            Choose Image
                                        </Button>
                                    )}
                                </CldUploadWidget>

                                {/* Display uploaded image */}
                                {uploadedImageUrl && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                        <img
                                            src={uploadedImageUrl}
                                            alt="Product preview"
                                            className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setUploadedImageUrl("")}
                                            className="ml-2 mt-2 bg-red-50! border-red-300! text-red-600! hover:bg-red-100!"
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900!">
                                    Status
                                </Label>
                                <Select
                                    value={isActive ? "true" : "false"}
                                    onValueChange={(value) => setValue("isActive", value === "true")}
                                >
                                    <SelectTrigger className="bg-white! border-gray-300! text-gray-900!">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white! border-gray-200!">
                                        <SelectItem value="true">Active</SelectItem>
                                        <SelectItem value="false">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                    >
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
