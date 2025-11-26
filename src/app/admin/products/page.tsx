"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import products, { Product } from "@/data/products";
import PageHeader from "@/components/discount-events/PageHeader";
import ProductTable from "@/components/product/ProductTable";
import ProductToolbar from "@/components/product/ProductToolbar";
import Pagination from "@/components/admin/pagination/Pagination";
import { CreateProductModal } from "@/components/product/(modal)/CreateProductModal";

export default function ProductsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Apply search term filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(
                (product) =>
                    product.ProductName.toLowerCase().includes(lowerSearchTerm) ||
                    product.ProductID.toString().includes(lowerSearchTerm)
            );
        }

        return filtered;
    }, [searchTerm]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Action handlers
    const handleView = (id: number) => {
        router.push(`/product/${id}`);
    };

    const handleEdit = (id: number) => {
        const product = products.find((p) => p.ProductID === id);
        if (product) {
            alert(`Editing product: ${product.ProductName}`);
        }
    };

    const handleDelete = (id: number) => {
        const product = products.find((p) => p.ProductID === id);
        if (product) {
            if (window.confirm(`Are you sure you want to delete "${product.ProductName}"?`)) {
                alert(`Product "${product.ProductName}" deleted successfully!`);
            }
        }
    };

    const handleToggleStatus = (id: number, isActive: boolean) => {
        const product = products.find((p) => p.ProductID === id);
        if (product) {
            const statusText = isActive ? "activated" : "deactivated";
            alert(`Product "${product.ProductName}" ${statusText}!`);
        }
    };

    const handleCreateProduct = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreate = (data: Omit<Product, "ProductID">) => {
        const newProduct: Product = {
            ...data,
            ProductID: Math.max(...products.map(p => p.ProductID)) + 1,
            CategoryID: data.CategoryID as number | string,
        };
        products.push(newProduct);
        alert(`Product "${newProduct.ProductName}" created successfully!`);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    // Currency formatter
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    return (
        <div>
            <PageHeader
                title="Product Management"
                icon={Package}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            <ProductToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by name or ID..."
                onCreateProduct={handleCreateProduct}
                createButtonLabel="Add Product"
            />

            {/* Products Table */}
            <ProductTable
                products={currentProducts}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                formatCurrency={formatCurrency}
                emptyMessage={
                    searchTerm
                        ? "No products found matching your search"
                        : "No products found"
                }
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

            {/* Create Product Modal */}
            <CreateProductModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onCreate={handleCreate}
            />
        </div>
    );
}
