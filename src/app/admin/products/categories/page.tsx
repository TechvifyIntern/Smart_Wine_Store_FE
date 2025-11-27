"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import productCategories, { ProductCategory } from "@/data/product_categories";
import categoriesRepository from "@/api/categoriesRepository";
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

    // Filter categories based on search term (CategoryName only)
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) {
            return productCategories;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        // TODO: Replace with API call when ready
        // Example:
        // const response = await fetch(`/api/categories/search?name=${encodeURIComponent(searchTerm)}`);
        // return await response.json();

        return productCategories.filter((category) =>
            category.CategoryName.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm]);

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
        const category = productCategories.find((c) => c.CategoryID === id);
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
                // Refresh the page to show updated data
                router.refresh();
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
        console.log("Creating new category:", data);
        // TODO: Implement API call to create category
        // Example:
        // await fetch('/api/categories', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert("Category created successfully!");
    };

    const handleUpdateCategory = async (id: number, data: Omit<ProductCategory, "CategoryID" | "ProductCount">) => {
        console.log(`Updating category ${id}:`, data);
        // TODO: Implement API call to update category
        // Example:
        // await fetch(`/api/categories/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert(`Category ${id} updated successfully!`);
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
