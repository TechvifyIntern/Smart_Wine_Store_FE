"use client";

import { useState, useMemo } from "react";
import { Package } from "lucide-react";
import { discountProducts, DiscountProduct } from "@/data/discount_product";
import PageHeader from "@/components/discount-events/PageHeader";
import ProductsTable from "@/components/discount-products/ProductsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import ProductsToolbar from "@/components/discount-products/ProductsToolbar";
import { CreateDiscountProduct } from "@/components/discount-products/(modal)/CreateDiscountProduct";
import { DeleteConfirmDialog } from "@/components/discount-products/(modal)/DeleteConfirmDialog";

export default function DiscountProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<DiscountProduct | null>(null);
    const [selectedProductStatus, setSelectedProductStatus] = useState<string>("");
    const [productToDelete, setProductToDelete] = useState<DiscountProduct | null>(null);

    // Get status based on dates
    const getProductStatus = (timeStart: string, timeEnd: string) => {
        const now = new Date();
        const start = new Date(timeStart);
        const end = new Date(timeEnd);

        if (now < start) return "Scheduled";
        if (now > end) return "Expired";
        return "Active";
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Filter products based on search term (ProductName only)
    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) {
            return discountProducts;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        // TODO: Replace with API call when ready
        // Example:
        // const response = await fetch(`/api/discount-products/search?name=${encodeURIComponent(searchTerm)}`);
        // return await response.json();

        return discountProducts.filter((product) =>
            product.ProductName.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Action handlers
    const handleView = (id: number) => {
        console.log("View product:", id);
        // TODO: Implement view logic
    };

    const handleEdit = (id: number) => {
        const product = discountProducts.find((p) => p.DiscountProductID === id);
        if (product) {
            const status = getProductStatus(product.TimeStart, product.TimeEnd);

            // Only allow edit for Scheduled and Active products
            if (status === "Expired") {
                alert("Cannot edit expired product discounts!");
                return;
            }

            setSelectedProduct(product);
            setSelectedProductStatus(status);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = (id: number) => {
        const product = discountProducts.find((p) => p.DiscountProductID === id);
        if (product) {
            const status = getProductStatus(product.TimeStart, product.TimeEnd);

            // Prevent deletion of Active products
            if (status === "Active") {
                alert("Cannot delete active product discounts! Please wait until the discount expires or edit the end date.");
                return;
            }

            // Prevent deletion of Expired products
            if (status === "Expired") {
                alert("Cannot delete expired product discounts!");
                return;
            }

            // Only Scheduled products can be deleted - show confirmation dialog
            if (status === "Scheduled") {
                setProductToDelete(product);
                setIsDeleteDialogOpen(true);
            }
        }
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            console.log("Delete product:", productToDelete.DiscountProductID);
            // TODO: Implement API call to delete product
            // Example:
            // await fetch(`/api/discount-products/${productToDelete.DiscountProductID}`, {
            //   method: 'DELETE',
            // });

            alert(`Product discount "${productToDelete.ProductName}" deleted successfully!`);
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
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

    const handleCreateProduct = async (data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">) => {
        console.log("Creating new product discount:", data);
        // TODO: Implement API call to create product discount
        // Example:
        // await fetch('/api/discount-products', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert("Product discount created successfully!");
    };

    const handleUpdateProduct = async (id: number, data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">) => {
        console.log(`Updating product discount ${id}:`, data);
        // TODO: Implement API call to update product discount
        // Example:
        // await fetch(`/api/discount-products/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        alert(`Product discount ${id} updated successfully!`);
    };

    return (
        <div>
            <PageHeader
                title="Discount Products"
                icon={Package}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            <ProductsToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by product name..."
                onCreateProduct={handleCreateProduct}
                createButtonLabel="Create Product Discount"
            />

            {/* Products Table */}
            <ProductsTable
                products={currentProducts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getProductStatus={getProductStatus}
                formatDate={formatDate}
                emptyMessage={searchTerm ? `No products found matching "${searchTerm}"` : "No product discounts found"}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
            />

            {/* Edit Product Modal */}
            <CreateDiscountProduct
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                mode="edit"
                product={selectedProduct}
                productStatus={selectedProductStatus}
                onUpdate={handleUpdateProduct}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                product={productToDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}