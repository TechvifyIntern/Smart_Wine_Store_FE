"use client";

import { useState, useMemo } from "react";
import { Boxes } from "lucide-react";
import inventoryProducts from "@/data/inventory_product";
import PageHeader from "@/components/discount-events/PageHeader";
import InventoryProductsTable from "@/components/inventory-products/InventoryProductsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import InventoryProductsToolbar from "@/components/inventory-products/InventoryProductsToolbar";
import { CreateInventoryProduct } from "@/components/inventory-products/(modal)/CreateInventoryProduct";
import { UpdateInventoryProduct } from "@/components/inventory-products/(modal)/UpdateInventoryProduct";
import { InventoryImportModal } from "@/components/inventory-products/(modal)/InventoryImportModal";
import { InventoryExportModal } from "@/components/inventory-products/(modal)/InventoryExportModal";

export interface InventoryProduct {
    ProductID: string;
    ProductName: string;
    ImageURL: string;
    Quantity: number;
    CostPrice: number;
    SalePrice: number;
}

export default function InventoryProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Filter products based on search term (ProductName only)
    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) {
            return inventoryProducts;
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        // TODO: Replace with API call when ready
        return inventoryProducts.filter((product) =>
            product.ProductName.toLowerCase().includes(lowerSearchTerm)
        );
    }, [searchTerm]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Action handlers
    const handleEdit = (id: string) => {
        const product = inventoryProducts.find((p) => p.ProductID === id);
        if (product) {
            setSelectedProduct(product);
            setIsUpdateModalOpen(true);
        }
    };

    const handleImport = (id: string) => {
        const product = inventoryProducts.find((p) => p.ProductID === id);
        if (product) {
            setSelectedProduct(product);
            setIsImportModalOpen(true);
        }
    };

    const handleExport = (id: string) => {
        const product = inventoryProducts.find((p) => p.ProductID === id);
        if (product) {
            setSelectedProduct(product);
            setIsExportModalOpen(true);
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

    const handleCreateProduct = async (data: Omit<InventoryProduct, "ProductID">) => {
        console.log("Creating new product:", data);
        // TODO: Implement API call to create product
        alert("Product created successfully!");
    };

    const handleUpdateProduct = async (id: string, data: Omit<InventoryProduct, "ProductID">) => {
        console.log(`Updating product ${id}:`, data);
        // TODO: Implement API call to update product
        alert(`Product ${id} updated successfully!`);
    };

    const handleImportStock = async (productId: string, quantity: number, costPrice: number) => {
        console.log(`Importing stock for product ${productId}:`, { quantity, costPrice });
        // TODO: Implement API call to import stock
        alert(`Imported ${quantity} units successfully!`);
    };

    const handleExportStock = async (productId: string, quantity: number, reason: string) => {
        console.log(`Exporting stock for product ${productId}:`, { quantity, reason });
        // TODO: Implement API call to export stock
        alert(`Exported ${quantity} units successfully!`);
    };

    return (
        <div>
            <PageHeader
                title="Inventory Products"
                icon={Boxes}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            <InventoryProductsToolbar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search by product name..."
                onCreateProduct={() => setIsCreateModalOpen(true)}
                createButtonLabel="Add Product"
            />

            {/* Products Table */}
            <InventoryProductsTable
                products={currentProducts}
                onEdit={handleEdit}
                onImport={handleImport}
                onExport={handleExport}
                formatCurrency={formatCurrency}
                emptyMessage={searchTerm ? `No products found matching "${searchTerm}"` : "No products found"}
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
            <CreateInventoryProduct
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onCreate={handleCreateProduct}
            />

            {/* Update Product Modal */}
            <UpdateInventoryProduct
                open={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
                product={selectedProduct}
                onUpdate={handleUpdateProduct}
            />

            {/* Import Stock Modal */}
            <InventoryImportModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                product={selectedProduct}
                onImport={handleImportStock}
            />

            {/* Export Stock Modal */}
            <InventoryExportModal
                open={isExportModalOpen}
                onOpenChange={setIsExportModalOpen}
                product={selectedProduct}
                onExport={handleExportStock}
            />
        </div>
    );
}