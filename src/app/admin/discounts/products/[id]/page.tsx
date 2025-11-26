"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, ShoppingCart, Edit2, Save, Trash2 } from "lucide-react";
import { discountProducts, DiscountProduct } from "@/data/discount_product";
import PageHeader from "@/components/discount-events/PageHeader";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);
    const { toast } = useToast();

    const product = discountProducts.find((p) => p.DiscountProductID === productId);

    // State management
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Form management
    const {
        register,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        getValues,
    } = useForm<DiscountProduct>({
        defaultValues: {
            DiscountProductID: productId,
            ProductName: product?.ProductName || "",
            DiscountValue: product?.DiscountValue || 0,
            TimeStart: product?.TimeStart || "",
            TimeEnd: product?.TimeEnd || "",
        },
    });

    // Initialize form when product changes or edit mode toggles
    useEffect(() => {
        if (product && isEditing) {
            setValue("ProductName", product.ProductName);
            setValue("DiscountValue", product.DiscountValue);
            setValue("TimeStart", product.TimeStart);
            setValue("TimeEnd", product.TimeEnd);
        }
    }, [product, isEditing, setValue]);

    // Check product status and determine button visibility
    const currentDate = new Date();
    const isExpired = product ? new Date(product.TimeEnd) < currentDate : false;
    const isActive = product && !isExpired && currentDate >= new Date(product.TimeStart);
    const canEdit = product && !isExpired;
    const canDelete = product && !isExpired && !isActive; // Only show delete for scheduled products

    // Event handlers
    const handleEditToggle = () => {
        if (isEditing) {
            // Switching to save mode
            setShowSaveDialog(true);
        } else {
            // Switching to edit mode
            setIsEditing(true);
        }
    };

    const handleSaveConfirm = async () => {
        if (!product) return;

        try {
            const formData = getValues();
            console.log("Saving product data:", formData);

            // Update the local product data (in a real app, this would come from the API response)
            product.ProductName = formData.ProductName;
            product.DiscountValue = formData.DiscountValue;
            product.TimeStart = formData.TimeStart;
            product.TimeEnd = formData.TimeEnd;
            product.UpdatedAt = new Date().toISOString();

            setIsEditing(false);
            setShowSaveDialog(false);
            reset();

            toast({
                title: "Success",
                description: `Product "${product.ProductName}" has been updated successfully.`,
            });
        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Error",
                description: "Failed to update product. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleSaveCancel = () => {
        setShowSaveDialog(false);
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        if (!product || !canDelete) return;

        console.log("Deleting product:", product.DiscountProductID);
        // In a real app, this would be an API call to delete the product

        setShowDeleteDialog(false);

        toast({
            title: "Success",
            description: `Product "${product.ProductName}" has been deleted successfully.`,
        });

        // Navigate back to products page
        router.push("/admin/discounts/products");
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        reset();
    };

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The requested discount product could not be found.</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (isExpiredValue: boolean) => {
        return isExpiredValue
            ? "text-red-600 bg-red-50 border-red-200"
            : "text-green-600 bg-green-50 border-green-200";
    };

    return (
        <div>
            <PageHeader
                title="Product Detail"
                icon={ShoppingCart}
                iconColor="text-black"
            />

            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#ad8d5e] to-[#8b735e] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-[#ad8d5e]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Product Details
                                </h1>
                                <p className="text-white/90">
                                    Detailed information for <span className="font-medium">{product.ProductName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {canEdit && (
                                <Button
                                    onClick={handleEditToggle}
                                    disabled={isSubmitting}
                                    className="bg-white text-[#ad8d5e] hover:bg-gray-50 border border-white/20"
                                >
                                    {isEditing ? (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </>
                                    )}
                                </Button>
                            )}
                            {isEditing && (
                                <Button
                                    onClick={handleCancelEdit}
                                    variant="outline"
                                    disabled={isSubmitting}
                                    className="bg-transparent text-white border-white/20 hover:bg-white/10"
                                >
                                    Cancel
                                </Button>
                            )}
                            {canDelete && (
                                <Button
                                    onClick={handleDeleteClick}
                                    disabled={isSubmitting || isEditing}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-8">
                        {/* Product Info Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Product Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">#</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Product ID</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">#{product.DiscountProductID}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Product Name</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("ProductName")}
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.ProductName ? "border-red-500" : ""}`}
                                                />
                                                {errors.ProductName && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.ProductName.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{product.ProductName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Discount & Timing Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-green-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Discount & Timing</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Discount Value</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("DiscountValue", { valueAsNumber: true })}
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.DiscountValue ? "border-red-500" : ""}`}
                                                />
                                                {errors.DiscountValue && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.DiscountValue.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-bold text-orange-600 dark:text-orange-400 text-lg">{product.DiscountValue}%</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Start Time</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("TimeStart")}
                                                    type="datetime-local"
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.TimeStart ? "border-red-500" : ""}`}
                                                />
                                                {errors.TimeStart && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.TimeStart.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{formatDateTime(product.TimeStart)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">End Time</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("TimeEnd")}
                                                    type="datetime-local"
                                                    className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.TimeEnd ? "border-red-500" : ""}`}
                                                />
                                                {errors.TimeEnd && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.TimeEnd.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{formatDateTime(product.TimeEnd)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Status</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isExpired)}`}>
                                            {isExpired ? "Expired" : "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-slate-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Metadata</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Created At</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{formatDateTime(product.CreatedAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Updated At</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{product.UpdatedAt ? formatDateTime(product.UpdatedAt) : formatDateTime(product.CreatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Confirmation Dialog */}
            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            Confirm Save Changes
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Are you sure you want to save the changes to this discount product?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleSaveCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSaveConfirm}
                            disabled={isSubmitting}
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            Confirm Delete Product
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Are you sure you want to delete the discount product <strong className="text-gray-900 dark:text-slate-100">&ldquo;{product.ProductName}&rdquo;</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleDeleteCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete Product
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
