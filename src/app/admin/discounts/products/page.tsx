"use client";

import { useState, useMemo, useEffect } from "react";
import { Package } from "lucide-react";
import { DiscountProduct } from "@/data/discount_product";
import discountProductsRepository from "@/api/discountProductsRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import ProductsTable from "@/components/discount-products/ProductsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import ProductsToolbar from "@/components/discount-products/ProductsToolbar";
import { CreateDiscountProduct } from "@/components/discount-products/(modal)/CreateDiscountProduct";
import { DeleteConfirmDialog } from "@/components/discount-products/(modal)/DeleteConfirmDialog";
import { toast } from "sonner";

export default function DiscountProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<DiscountProduct | null>(null);
    const [selectedProductStatus, setSelectedProductStatus] = useState<string>("");
    const [productToDelete, setProductToDelete] = useState<DiscountProduct | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [discountProducts, setDiscountProducts] = useState<DiscountProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch discount products from API
    const loadDiscountProducts = async () => {
        try {
            setIsLoading(true);
            const response = await discountProductsRepository.getDiscountProducts();
            if (response.success && response.data) {
                setDiscountProducts(response.data as any);
            } else {
                console.error('Failed to load discount products:', response.message);
            }
        } catch (err) {
            console.error('Error loading discount products:', err);
            toast.error('Failed to load discount products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDiscountProducts();
    }, []);

    // Reload data when page becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadDiscountProducts();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

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

    // Filter products based on search term and filters
    const filteredProducts = useMemo(() => {
        let products = discountProducts;

        // Search filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            products = products.filter((product) =>
                product.ProductName.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // Status filter
        if (selectedStatuses.length > 0) {
            products = products.filter((product) => {
                const status = getProductStatus(product.TimeStart, product.TimeEnd);
                const statusId = status === "Active" ? 1 : status === "Scheduled" ? 2 : 3;
                return selectedStatuses.includes(statusId);
            });
        }

        // Date range filter (on TimeStart)
        if (dateFrom || dateTo) {
            products = products.filter((product) => {
                const productDate = new Date(product.TimeStart);
                const fromDate = dateFrom ? new Date(dateFrom) : null;
                const toDate = dateTo ? new Date(dateTo + "T23:59:59") : null; // Include end of day

                if (fromDate && productDate < fromDate) return false;
                if (toDate && productDate > toDate) return false;
                return true;
            });
        }

        return products;
    }, [searchTerm, selectedStatuses, dateFrom, dateTo, discountProducts]);

    // Handler for applying filters
    const handleApplyFilters = (filters: { statuses: number[]; dateFrom: string; dateTo: string }) => {
        setSelectedStatuses(filters.statuses);
        setDateFrom(filters.dateFrom);
        setDateTo(filters.dateTo);
        setCurrentPage(1); // Reset to first page when filtering
    };

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
        try {
            const response = await discountProductsRepository.createDiscountProduct({
                DiscountID: (data as any).DiscountID,
                ProductID: (data as any).ProductID
            });

            if (response.success) {
                toast.success("Product discount created successfully!");
                await loadDiscountProducts();
            } else {
                toast.error(response.message || "Failed to create product discount");
            }
        } catch (error) {
            console.error('Error creating product discount:', error);
            toast.error("An error occurred while creating the product discount");
        }
    };

    const handleUpdateProduct = async (id: number, data: Omit<DiscountProduct, "DiscountProductID" | "CreatedAt" | "UpdatedAt">) => {
        try {
            const response = await discountProductsRepository.updateDiscountProduct(id, {
                DiscountID: (data as any).DiscountID,
                ProductID: (data as any).ProductID
            });

            if (response.success) {
                toast.success(`Product discount updated successfully!`);
                await loadDiscountProducts();
            } else {
                toast.error(response.message || "Failed to update product discount");
            }
        } catch (error) {
            console.error('Error updating product discount:', error);
            toast.error("An error occurred while updating the product discount");
        }
    };

    return (
        <div>
            <PageHeader
                title="Discount Products"
                icon={Package}
                iconColor="text-black"
            />

            {/* Toolbar with Search and Create Button */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <>
                    <ProductsToolbar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        searchPlaceholder="Search by product name..."
                        onCreateProduct={handleCreateProduct}
                        createButtonLabel="Create Discount"
                        selectedStatuses={selectedStatuses}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onApplyFilters={handleApplyFilters}
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
                </>
            )}

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
