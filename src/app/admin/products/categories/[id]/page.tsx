"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Edit, Save, X, Wine, FolderOpen, Star, ShoppingBag } from "lucide-react";
import productCategories from "@/data/product_categories";
import products from "@/data/products";
import categoriesRepository from "@/api/categoriesRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import { Button } from "@/components/ui/button";
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
import type { Category } from "@/types/category";
import type { Product } from "@/data/products";

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = parseInt(params.id as string);

    const { toast } = useToast();

    // Check if we should start in edit mode
    const shouldStartEditing = searchParams.get('edit') === '1';

    // State management
    const [category, setCategory] = useState<Category | null>(null);
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(shouldStartEditing);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showInactiveDialog, setShowInactiveDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch category data from API
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await categoriesRepository.getCategoryById(categoryId);
                setCategory(response.data);
            } catch (error) {
                console.error('Failed to fetch category:', error);
                setError('Failed to load category details');

                // Fallback to static data
                const staticCategory = productCategories.find(c => c.CategoryID === categoryId);
                if (staticCategory) {
                    // Transform ProductCategory to Category
                    setCategory({
                        CategoryID: staticCategory.CategoryID,
                        CategoryName: staticCategory.CategoryName,
                        Description: staticCategory.Description,
                        CategoryParentID: staticCategory.ParentCategoryID || null
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    // Fetch products for this category from API
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                const response = await categoriesRepository.getProductsByCategory(categoryId);
                setCategoryProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products for category:', error);
                // Fallback to static filtering if API fails
                const fallbackProducts = products.filter(product => product.CategoryID === categoryId);
                setCategoryProducts(fallbackProducts as Product[]);
            }
        };

        if (category) {
            fetchCategoryProducts();
        }
    }, [categoryId, category]);

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
        if (!category) return;

        try {
            const updateData = {
                CategoryName: category.CategoryName,
                Description: category.Description,
                CategoryParentID: category.CategoryParentID === 0 || !category.CategoryParentID ? null : category.CategoryParentID
            };

            await categoriesRepository.updateCategory(category.CategoryID, updateData);

            toast({
                title: "Category Updated",
                description: `The category ${category.CategoryName} has been successfully updated.`,
            });

            setIsEditing(false);
            setShowSaveDialog(false);
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleSaveCancel = () => {
        setShowSaveDialog(false);
    };

    const handleInactiveClick = () => {
        setShowInactiveDialog(true);
    };

    const handleInactiveConfirm = async () => {
        if (!category) return;

        try {
            // Double-check that the category has no products (safety check)
            if (categoryProducts.length > 0) {
                toast({
                    title: "Cannot Delete Category",
                    description: `The category "${category.CategoryName}" contains ${categoryProducts.length} products. Please move or delete all products first.`,
                    variant: "destructive",
                });
                setShowInactiveDialog(false);
                return;
            }

            await categoriesRepository.deleteCategory(category.CategoryID);

            toast({
                title: "Category Deleted",
                description: `The category "${category.CategoryName}" has been successfully deleted.`,
            });

            setShowInactiveDialog(false);
            // Navigate back to categories list
            router.push('/admin/products/categories');
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                title: "Error",
                description: "Failed to delete category. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleInactiveCancel = () => {
        setShowInactiveDialog(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Format currency function
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-600 border-t-[#ad8d5e] rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading category...</h2>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Category</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The requested category could not be found.</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Category Detail"
                icon={Wine}
                iconColor="text-black"
            />

            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#ad8d5e] to-[#8b735e] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <Wine className="w-8 h-8 text-[#ad8d5e]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Category Details
                                </h1>
                                <p className="text-white/90">
                                    Detailed information for <span className="font-medium">{category.CategoryName}</span>
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
                            <Button
                                onClick={handleInactiveClick}
                                disabled={isEditing || categoryProducts.length > 0}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Xóa
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-8">
                        {/* Category Info Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Category Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">#</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Category ID</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">#{category.CategoryID}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                        <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Category Name</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{category.CategoryName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600 md:col-span-2">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                        <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">Description</p>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">{category.Description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products in Category Card */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-green-100 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-6">
                                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                                    Products in Category ({categoryProducts.length})
                                </h3>
                            </div>

                            {categoryProducts.length > 0 ? (
                                <div className="bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Product ID</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Image</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Name</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                                                {categoryProducts.map((product) => (
                                                    <tr key={product.ProductID} className="hover:bg-gray-50 dark:hover:bg-slate-600/50">
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-slate-100">
                                                            #{product.ProductID}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <img
                                                                src={product.ImageURL || "https://picsum.photos/seed/placeholder/50/50"}
                                                                alt={product.ProductName}
                                                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-slate-600"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-slate-100 max-w-xs truncate">
                                                                {product.ProductName}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                            {formatCurrency(product.SalePrice)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                                    <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-slate-400">No products found in this category</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Confirmation Dialog */}
            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            Xác nhận lưu thay đổi
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Bạn có muốn lưu thông tin thay đổi không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleSaveCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Huỷ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSaveConfirm}
                            disabled={isEditing}
                            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
                        >
                            Đồng ý
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showInactiveDialog} onOpenChange={setShowInactiveDialog}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
                            Xóa danh mục
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
                            Bạn có chắc chắn muốn xóa danh mục <strong className="text-gray-900 dark:text-slate-100">{category?.CategoryName}</strong> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleInactiveCancel}
                            className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
                        >
                            Huỷ
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleInactiveConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
