"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import productCategories, { ProductCategory } from "@/data/product_categories";
import categoriesRepository from "@/api/categoriesRepository";
import { Category } from "@/types/category";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/discount-events/PageHeader";
import ProductCategoriesTable from "@/components/categories/ProductCategoriesTable";
import Pagination from "@/components/admin/pagination/Pagination";
import ProductCategoriesToolbar from "@/components/categories/ProductCategoriesToolbar";
import { CreateCategory } from "@/components/categories/(modal)/CreateCategory";
import { DeleteCategoryDialog } from "@/components/categories/(modal)/DeleteCategoryDialog";

export default function ProductCategoriesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories from API
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await categoriesRepository.getCategories();
            const transformedCategories: ProductCategory[] = (response.data || []).map((category: Category) => ({
                CategoryID: category.CategoryID,
                CategoryName: category.CategoryName,
                Description: category.Description,
                ParentCategoryID: category.CategoryParentID,
                ParentCategoryName: null, // Could be fetched separately if needed
                ProductCount: 0, // Could be calculated from API if available
            }));

            setCategories(transformedCategories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
            setError(errorMessage);

            // Fallback to static data
            setCategories(productCategories);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch categories from API on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Filter categories based on search term (CategoryName only)
    const filteredCategories = useMemo(() => {
        const dataToFilter = categories.length > 0 ? categories : productCategories;

        if (!searchTerm.trim()) {
            return dataToFilter;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        return dataToFilter.filter((category) =>
            category.CategoryName.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm, categories]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, endIndex);

    // Action handlers
    const handleEdit = (id: number) => {
        // Navigate to the detail page in edit mode
        router.push(`/admin/products/categories/${id}?edit=1`);
    };

    const handleDelete = (id: number) => {
        const dataToSearch = categories.length > 0 ? categories : productCategories;
        const category = dataToSearch.find((c) => c.CategoryID === id);
        if (category) {
            setCategoryToDelete(category);
            setIsDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            // Double-check product count before deletion
            try {
                const productsResponse = await categoriesRepository.getProductsByCategory(categoryToDelete.CategoryID);
                if (productsResponse.data && productsResponse.data.length > 0) {
                    toast({
                        title: "Cannot Delete Category",
                        description: `Category "${categoryToDelete.CategoryName}" contains ${productsResponse.data.length} products. Please move or delete all products first.`,
                        variant: "destructive",
                    });
                    setIsDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                    return;
                }

                await categoriesRepository.deleteCategory(categoryToDelete.CategoryID);
                toast({
                    title: "Success",
                    description: `Category "${categoryToDelete.CategoryName}" deleted successfully!`,
                });
                // Refresh categories data from API
                await fetchCategories();
                setIsDeleteDialogOpen(false);
                setCategoryToDelete(null);
            } catch (error) {
                console.error('Failed to delete category:', error);
                toast({
                    title: "Error",
                    description: "Failed to delete category. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const handleCreateCategory = async (data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => {
        try {
            // Transform ProductCategory data to Category format for API
            const apiData = {
                CategoryName: data.CategoryName,
                Description: data.Description,
                CategoryParentID: data.ParentCategoryID ?? null
            };
            await categoriesRepository.createCategory(apiData);
            toast({
                title: "Success",
                description: `Category "${data.CategoryName}" created successfully!`,
            });
            // Refresh categories data from API
            await fetchCategories();
        } catch (error) {
            console.error("Error creating category:", error);
            toast({
                title: "Error",
                description: "Failed to create category. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateCategory = async (id: number, data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => {
        try {
            // Transform ProductCategory data to Category format for API
            const apiData = {
                CategoryName: data.CategoryName,
                Description: data.Description,
                CategoryParentID: data.ParentCategoryID ?? null
            };
            await categoriesRepository.updateCategory(id, apiData);
            toast({
                title: "Success",
                description: `Category "${data.CategoryName}" updated successfully!`,
            });
            // Refresh categories data from API
            await fetchCategories();
        } catch (error) {
            console.error("Error updating category:", error);
            toast({
                title: "Error",
                description: "Failed to update category. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-600 border-t-[#ad8d5e] rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading categories...</h2>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Categories</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchCategories}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Product Categories"
                icon={Tag}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            <ProductCategoriesToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by category name..."
                onCreateCategory={handleCreateCategory}
                createButtonLabel="Add Category"
            />

            {/* Categories Table */}
            <ProductCategoriesTable
                categories={currentCategories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage={searchTerm ? `No categories found matching "${searchTerm}"` : "No categories found"}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCategories.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Edit Category Modal */}
            <CreateCategory
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                mode="edit"
                category={selectedCategory}
                onUpdate={handleUpdateCategory}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteCategoryDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                category={categoryToDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
