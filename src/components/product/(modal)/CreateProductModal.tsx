"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect, useState } from "react";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { toast } from "sonner";
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
            detail: {
                Size: 750,
                ABV: 0,
                Producer: "",
                Origin: "",
                Varietal: "",
                DescriptionTitle: "",
                DescriptionContents: "",
            },
        },
    });

    const categoryID = watch("CategoryID");

    const onSubmit = async (data: CreateProductFormData) => {
        try {
            const imageUrl = uploadedImageUrl || data.ImageURL;
            const productData: any = {
                ProductName: data.ProductName,
                CategoryID: data.CategoryID,
                ImageURL: imageUrl,
                CostPrice: data.CostPrice,
                SalePrice: data.SalePrice,
                isActive: data.isActive,
            };

            // Only include detail if at least one field is provided
            if (data.detail) {
                const hasDetailData = Object.values(data.detail).some(val =>
                    val !== undefined && val !== "" && val !== 0
                );
                if (hasDetailData) {
                    productData.detail = data.detail;
                }
            }

            await onCreate(productData);
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
            <DialogContent
                className="sm:max-w-[650px] max-h-[90vh] bg-white! border-gray-200! flex flex-col"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">Create New Product</DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        Fill in the product details to add a new product.
                    </DialogDescription>
                </DialogHeader>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-6 py-4"
                    onWheel={(e) => e.stopPropagation()}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                            {/* Category & Image Upload */}
                            <div className="grid grid-cols-2 gap-4">
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

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-900!">
                                        Product Image (Optional)
                                    </Label>

                                    {/* Cloudinary Upload Widget */}
                                    <CldUploadWidget
                                        uploadPreset="wine_store_products"
                                        onSuccess={(result: any) => {
                                            if (result?.info?.secure_url) {
                                                setUploadedImageUrl(result.info.secure_url);
                                            }
                                        }}
                                        onError={(error: any) => {
                                            console.error('Cloudinary upload error:', error);
                                            toast.error('Failed to upload image');
                                        }}
                                        options={{
                                            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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
                                </div>
                            </div>

                            {/* Display uploaded image */}
                            {uploadedImageUrl && (
                                <div className="mt-2">
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

                            {/* Product Detail Section */}
                            <div className="space-y-4 border-t pt-4 mt-4">
                                <h3 className="text-sm font-semibold text-gray-900">Product Details (Optional)</h3>

                                {/* Size & ABV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="detail.Size" className="text-sm font-medium text-gray-900!">
                                            Size (ml)
                                        </Label>
                                        <Input
                                            id="detail.Size"
                                            type="number"
                                            step="1"
                                            placeholder="750"
                                            {...register("detail.Size", { valueAsNumber: true })}
                                            className={`bg-white! border-gray-300! text-gray-900! ${errors.detail?.Size ? "border-red-500!" : ""}`}
                                        />
                                        {errors.detail?.Size && (
                                            <p className="text-sm text-red-500">{errors.detail.Size.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="detail.ABV" className="text-sm font-medium text-gray-900!">
                                            ABV (%)
                                        </Label>
                                        <Input
                                            id="detail.ABV"
                                            type="number"
                                            step="0.1"
                                            placeholder="13.5"
                                            {...register("detail.ABV", { valueAsNumber: true })}
                                            className={`bg-white! border-gray-300! text-gray-900! ${errors.detail?.ABV ? "border-red-500!" : ""}`}
                                        />
                                        {errors.detail?.ABV && (
                                            <p className="text-sm text-red-500">{errors.detail.ABV.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Producer & Origin */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="detail.Producer" className="text-sm font-medium text-gray-900!">
                                            Producer
                                        </Label>
                                        <Input
                                            id="detail.Producer"
                                            placeholder="e.g., Chateau Margaux"
                                            {...register("detail.Producer")}
                                            className={`bg-white! border-gray-300! text-gray-900! ${errors.detail?.Producer ? "border-red-500!" : ""}`}
                                        />
                                        {errors.detail?.Producer && (
                                            <p className="text-sm text-red-500">{errors.detail.Producer.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="detail.Origin" className="text-sm font-medium text-gray-900!">
                                            Origin
                                        </Label>
                                        <Input
                                            id="detail.Origin"
                                            placeholder="e.g., France, Bordeaux"
                                            {...register("detail.Origin")}
                                            className={`bg-white! border-gray-300! text-gray-900! ${errors.detail?.Origin ? "border-red-500!" : ""}`}
                                        />
                                        {errors.detail?.Origin && (
                                            <p className="text-sm text-red-500">{errors.detail.Origin.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Varietal */}
                                <div className="space-y-2">
                                    <Label htmlFor="detail.Varietal" className="text-sm font-medium text-gray-900!">
                                        Varietal
                                    </Label>
                                    <Input
                                        id="detail.Varietal"
                                        placeholder="e.g., Cabernet Sauvignon"
                                        {...register("detail.Varietal")}
                                        className={`bg-white! border-gray-300! text-gray-900! ${errors.detail?.Varietal ? "border-red-500!" : ""}`}
                                    />
                                    {errors.detail?.Varietal && (
                                        <p className="text-sm text-red-500">{errors.detail.Varietal.message}</p>
                                    )}
                                </div>

                                {/* Description Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="detail.DescriptionTitle" className="text-sm font-medium text-gray-900!">
                                        Description Title
                                    </Label>
                                    <Input
                                        id="detail.DescriptionTitle"
                                        placeholder="e.g., Tasting Notes"
                                        {...register("detail.DescriptionTitle")}
                                        className={`bg-white! border-gray-300! text-gray-900! ${errors.detail?.DescriptionTitle ? "border-red-500!" : ""}`}
                                    />
                                    {errors.detail?.DescriptionTitle && (
                                        <p className="text-sm text-red-500">{errors.detail.DescriptionTitle.message}</p>
                                    )}
                                </div>

                                {/* Description Contents */}
                                <div className="space-y-2">
                                    <Label htmlFor="detail.DescriptionContents" className="text-sm font-medium text-gray-900!">
                                        Description
                                    </Label>
                                    <textarea
                                        id="detail.DescriptionContents"
                                        placeholder="Enter detailed description..."
                                        {...register("detail.DescriptionContents")}
                                        rows={4}
                                        className={`w-full px-3 py-2 bg-white border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ad8d5e] focus:border-transparent resize-none ${errors.detail?.DescriptionContents ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.detail?.DescriptionContents && (
                                        <p className="text-sm text-red-500">{errors.detail.DescriptionContents.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter className="gap-2 sm:gap-2 px-6 py-4 border-t">
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
                        type="button"
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
