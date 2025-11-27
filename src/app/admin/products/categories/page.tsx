"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import productCategories, { ProductCategory } from "@/data/product_categories";
import categoriesRepository from "@/api/categoriesRepository";
import { Category } from "@/types/category";
import PageHeader from "@/components/discount-events/PageHeader";
import ProductCategoriesTable from "@/components/categories/ProductCategoriesTable";
import Pagination from "@/components/admin/pagination/Pagination";
import ProductCategoriesToolbar from "@/components/categories/ProductCategoriesToolbar";
import { CreateCategory } from "@/components/categories/(modal)/CreateCategory";
import { DeleteCategoryDialog } from "@/components/categories/(modal)/DeleteCategoryDialog";
import { useToast } from "@/hooks/use-toast";

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

    // Function to transform Category to ProductCategory
    const transformCategory = async (category: Category): Promise<ProductCategory> => {
        try {
            // Get parent category name if CategoryParentID exists
            let parentCategoryName: string | null = null;
            if (category.CategoryParentID) {
                try {
                    const parentResponse = await categoriesRepository.getParentCategoryById(category.CategoryID);
                    if (parentResponse.data) {
                        parentCategoryName = parentResponse.data.CategoryName;
                    }
                } catch (err) {
                    console.warn(`Failed to get parent category for ${category.CategoryID}`);
                }
            }

            // Get product count for this category
            let productCount = 0;
            try {
                const productsResponse = await categoriesRepository.getProductsByCategory(category.CategoryID);
                productCount = productsResponse.data.length;
            } catch (err) {
                console.warn(`Failed to get product count for ${category.CategoryID}`);
            }

            return {
                CategoryID: category.CategoryID,
                CategoryName: category.CategoryName,
                Description: category.Description,
                ParentCategoryID: category.CategoryParentID,
                ParentCategoryName: parentCategoryName,
                ProductCount: productCount
            };
        } catch (error) {
            console.error('Error transforming category:', category, error);
            return {
                CategoryID: category.CategoryID,
                CategoryName: category.CategoryName,
                Description: category.Description,
                ParentCategoryID: category.CategoryParentID,
                ParentCategoryName: null,
                ProductCount: 0
            };
        }
    };

    // Function to fetch categories from API
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await categoriesRepository.getCategories();

            // Transform each Category to ProductCategory
            const transformedCategories = await Promise.all(
                response.data.map(transformCategory)
            );

            setCategories(transformedCategories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setError('Failed to load categories');

            // Fallback to static data
            setCategories(productCategories);
            toast({
                title: "Warning",
                description: "Using cached categories due to API error",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Load categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter categories based on search term (CategoryName only)
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) {
            return categories;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        return categories.filter((category) =>
            category.CategoryName.toLowerCase().includes(lowerSearchTerm)
        );
    }, [categories, searchTerm]);

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
        const category = categories.find((c) => c.CategoryID === id);
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
                // Refresh categories
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
            await categoriesRepository.createCategory({
                CategoryName: data.CategoryName,
                Description: data.Description,
                CategoryParentID: data.ParentCategoryID || null
            });
            toast({
                title: "Success",
                description: "Category created successfully!",
            });
            // Refresh categories
            await fetchCategories();
        } catch (error) {
            console.error('Failed to create category:', error);
            toast({
                title: "Error",
                description: "Failed to create category. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateCategory = async (id: number, data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => {
        try {
            await categoriesRepository.updateCategory(id, {
                CategoryName: data.CategoryName,
                Description: data.Description,
                CategoryParentID: data.ParentCategoryID || null
            });
            toast({
                title: "Success",
                description: `Category ${id} updated successfully!`,
            });
            // Refresh categories
            await fetchCategories();
        } catch (error) {
            console.error('Failed to update category:', error);
            toast({
                title: "Error",
                description: "Failed to update category. Please try again.",
                variant: "destructive",
            });
        }
    };

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

            {/* Loading state */}
            {loading && (
                <div className="mt-4 p-4 text-center text-gray-500 dark:text-gray-400">
                    Loading categories...
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="mt-4 p-4 text-center text-red-500 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Categories Table */}
            {!loading && !error && (
                <ProductCategoriesTable
                    categories={currentCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    emptyMessage={searchTerm ? `No categories found matching "${searchTerm}"` : "No categories found"}
                />
            )}

            {/* Pagination */}
            {!loading && !error && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredCategories.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}

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
