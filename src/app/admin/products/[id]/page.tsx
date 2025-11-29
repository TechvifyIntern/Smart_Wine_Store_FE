"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Edit, Package, UserX, CheckCircle, Save } from "lucide-react";
import productsRepository from "@/api/productsRepository";
import { Product } from "@/data/products";
import PageHeader from "@/components/discount-events/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const editSchema = z.object({
    ProductName: z.string().min(1, "Product name is required"),
    CategoryID: z.number().min(1, "Category is required"),
    CostPrice: z.number().min(0, "Cost price must be non-negative"),
    SalePrice: z.number().min(0, "Sale price must be non-negative"),
});

type EditFormData = z.infer<typeof editSchema>;

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = parseInt(params.id as string);
    const { toast } = useToast();

    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);

    // State for dialogs
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showToggleDialog, setShowToggleDialog] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    // State for product data
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await productsRepository.getProductById(productId);
                if (response.success && response.data) {
                    setProduct(response.data);
                } else {
                    console.error('Failed to load product:', response.message);
                    toast({
                        title: "Error",
                        description: "Failed to load product details.",
                        variant: "destructive",
                    });
                }
            } catch (err) {
                console.error('Error loading product:', err);
                toast({
                    title: "Error",
                    description: "An error occurred while loading product details.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, toast]);

    // Check for edit query parameter
    useEffect(() => {
        if (searchParams.get("edit") === "true") {
            setIsEditing(true);
        }
    }, [searchParams]);

    const categories = [
        { id: 1, name: "Red Wines" },
        { id: 2, name: "White Wines" },
        { id: 3, name: "Sparkling Wines" },
        { id: 4, name: "Rosé Wines" },
    ];

    const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<EditFormData>({
        resolver: zodResolver(editSchema),
    });

    // Initialize form when editing starts
    useEffect(() => {
        if (product && isEditing) {
            setValue("ProductName", product.ProductName);
            setValue("CategoryID", Number(product.CategoryID));
            setValue("CostPrice", Number(product.CostPrice));
            setValue("SalePrice", product.SalePrice);
        }
    }, [product, isEditing, setValue]);

    // Event handlers
    const handleEditToggle = () => {
        if (isEditing) {
            // Show save confirmation
            setShowSaveDialog(true);
        } else {
            // Start edit
            setIsEditing(true);
        }
    };

    const handleSaveConfirm = async (data: EditFormData) => {
        if (!product) return;

        try {
            // Call API to update product
            const response = await productsRepository.updateProduct(product.ProductID, {
                ProductName: data.ProductName,
                CategoryID: data.CategoryID,
                CostPrice: data.CostPrice,
                SalePrice: data.SalePrice,
            });

            if (response.success) {
                // Update local state with new data
                setProduct({
                    ...product,
                    ProductName: data.ProductName,
                    CategoryID: data.CategoryID,
                    CostPrice: data.CostPrice,
                    SalePrice: data.SalePrice,
                });

                setIsEditing(false);
                setShowSaveDialog(false);

                toast({
                    title: "Product Updated",
                    description: `Product ${data.ProductName} has been successfully updated.`,
                });
            } else {
                toast({
                    title: "Update Failed",
                    description: response.message || "Failed to update product.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast({
                title: "Error",
                description: "An error occurred while updating the product.",
                variant: "destructive",
            });
        }
    };

    const handleSaveDialogConfirm = () => {
        handleSubmit(handleSaveConfirm)();
    };

    const handleSaveDialogCancel = () => {
        setShowSaveDialog(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setShowSaveDialog(false);
        reset();
    };

    const handleToggleClick = () => {
        if (!product) return;
        setIsActivating(!(product.isActive ?? false));
        setShowToggleDialog(true);
    };

    const handleToggleConfirm = async () => {
        if (!product) return;

        try {
            // Validate required fields
            if (!product.CategoryID) {
                toast({
                    title: "Error",
                    description: "Cannot update product: CategoryID is missing",
                    variant: "destructive",
                });
                console.error('Product missing CategoryID:', product);
                return;
            }

            // Call API to update product status using PUT /products/{id}
            // PUT requires full product data
            const updateData: any = {
                ProductName: product.ProductName,
                CategoryID: typeof product.CategoryID === 'string'
                    ? parseInt(product.CategoryID)
                    : product.CategoryID,
                CostPrice: Number(product.CostPrice),
                SalePrice: Number(product.SalePrice),
                isActive: isActivating
            };

            // Only include ImageURL if it exists
            if (product.ImageURL) {
                updateData.ImageURL = product.ImageURL;
            }

            console.log('Toggling product status:', { productId: product.ProductID, updateData });

            const response = await productsRepository.updateProductPut(
                product.ProductID,
                updateData
            );

            if (response.success) {
                // Update local state
                setProduct({
                    ...product,
                    isActive: isActivating,
                });

                setShowToggleDialog(false);

                if (isActivating) {
                    toast({
                        title: "Product Activated",
                        description: `The product ${product.ProductName} has been successfully activated.`,
                    });
                } else {
                    toast({
                        title: "Product Deactivated",
                        description: `The product ${product.ProductName} has been successfully deactivated.`,
                    });
                }
            } else {
                toast({
                    title: "Update Failed",
                    description: response.message || "Failed to update product status.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Error updating product status:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast({
                title: "Error",
                description: error.message || "An error occurred while updating product status.",
                variant: "destructive",
            });
        }
    };

    const handleToggleCancel = () => {
        setShowToggleDialog(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The requested product could not be found.</p>
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const getCategoryName = (categoryId: string | number): string => {
        const categoryMap: Record<number, string> = {
            1: "Red Wines",
            2: "White Wines",
            3: "Sparkling Wines",
            4: "Rosé Wines",
        };
        return categoryMap[Number(categoryId)] || `Category ${categoryId}`;
    };

    const getStatusColor = (status: boolean) => {
        return status ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200";
    };

    return (
        <div>
            <PageHeader
                title="Product Detail"
                icon={Package}
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
                            <img
                                src={product.ImageURL || "https://picsum.photos/seed/placeholder/200/200"}
                                alt={product.ProductName}
                                className="w-16 h-16 rounded-full object-cover"
                            />
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
                            <Button
                                onClick={handleEditToggle}
                                className="bg-white text-[#ad8d5e] hover:bg-gray-50 border border-white/20"
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Sửa
                                    </>
                                )}
                            </Button>
                            {isEditing && (
                                <Button
                                    onClick={handleCancelEdit}
                                    variant="outline"
                                    className="bg-transparent text-white border-white/20 hover:bg-white/10"
                                >
                                    Hủy
                                </Button>
                            )}
                            {product.isActive ? (
                                <Button
                                    onClick={handleToggleClick}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Deactivate
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleToggleClick}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Activate
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
                                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Product Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">#</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Product ID</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">#{product.ProductID}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Product Name</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    {...register("ProductName")}
                                                    className="bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500"
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
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400">Cat</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Category</p>
                                        {isEditing ? (
                                            <div>
                                                <Select
                                                    value={watch("CategoryID")?.toString()}
                                                    onValueChange={(value) => setValue("CategoryID", Number(value))}
                                                >
                                                    <SelectTrigger className="bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-600 border-gray-200 dark:border-slate-500">
                                                        {categories.map((cat) => (
                                                            <SelectItem
                                                                key={cat.id}
                                                                value={cat.id.toString()}
                                                                className="text-gray-900 dark:text-slate-100 dark:focus:bg-slate-700"
                                                            >
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.CategoryID && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.CategoryID.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{product.CategoryName || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">$</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Status</p>
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.isActive ?? false)}`}>
                                            {product.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-green-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-5 h-5 text-green-600 dark:text-green-400">$</span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Pricing Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-red-600 dark:text-red-400">Cost</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Cost Price</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    {...register("CostPrice", { valueAsNumber: true })}
                                                    className="bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500"
                                                />
                                                {errors.CostPrice && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.CostPrice.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-bold text-red-600 dark:text-red-400 text-lg">{formatCurrency(Number(product.CostPrice))} VND</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400">Sale</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Sale Price</p>
                                        {isEditing ? (
                                            <div>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    {...register("SalePrice", { valueAsNumber: true })}
                                                    className="bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500"
                                                />
                                                {errors.SalePrice && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.SalePrice.message}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-bold text-green-600 dark:text-green-400 text-lg">{formatCurrency(product.SalePrice)} VND</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Changes Dialog */}
            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            Xác nhận lưu thay đổi
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Bạn có muốn lưu các thay đổi đã thực hiện không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleSaveDialogCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSaveDialogConfirm}
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                        >
                            Đồng ý
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toggle Status Dialog */}
            <AlertDialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            {isActivating ? "Activate Product" : "Deactivate Product"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Are you sure you want to {isActivating ? "activate" : "deactivate"} the product <strong className="text-gray-900 dark:text-slate-100">{product?.ProductName}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleToggleCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleConfirm}
                            className={isActivating ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                        >
                            {isActivating ? "Activate" : "Deactivate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
