"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import DiscountProductTable from "@/components/discount-products/DiscountProductTable";
import DiscountProductToolbar from "@/components/discount-products/DiscountProductToolbar";
import AddDiscountModal from "@/components/discount-products/(modal)/AddDiscountModal";
import EditDiscountModal from "@/components/discount-products/(modal)/EditDiscountModal";
import { Product } from "@/types/product-detail";
import {
  getProductsForDiscount,
  searchProductsForDiscount,
  addDiscountToProducts,
  updateProductDiscount,
  removeProductDiscount,
} from "@/services/discount-products/api";
import Pagination from "@/components/admin/pagination/Pagination";

export default function DiscountProductManagement() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchTerm.trim()) {
        console.log("Searching products with term:", searchTerm);
        response = await searchProductsForDiscount({
          name: searchTerm,
          page: currentPage,
          size: itemsPerPage,
        });
      } else {
        console.log("Fetching products, page:", currentPage - 1);
        response = await getProductsForDiscount({
          page: currentPage - 1,
          size: itemsPerPage,
        });
      }
      console.log("API Response:", response);

      if (response.success && response.data) {
        // Check if data is nested or direct array
        const productsData = Array.isArray(response.data)
          ? response.data
          : (response.data.data || []);
        const total = Array.isArray(response.data)
          ? response.data.length
          : (response.data.total || 0);

        console.log("Fetched products:", productsData);
        console.log("Total products:", total);

        setProducts(productsData);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / itemsPerPage));
      } else {
        console.log("No data in response");
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentPage, itemsPerPage]);

  // Load products on mount and when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle product selection
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle select all - fetch all product IDs from all pages
  const handleSelectAll = async (selected: boolean) => {
    if (selected) {
      setIsSelectingAll(true);
      try {
        // Fetch all products without pagination
        let response;
        if (searchTerm.trim()) {
          response = await searchProductsForDiscount({
            name: searchTerm,
            page: 0,
            size: totalItems || 10000, // Large number to get all
          });
        } else {
          response = await getProductsForDiscount({
            page: 0,
            size: totalItems || 10000, // Large number to get all
          });
        }

        if (response.success && response.data) {
          const productsData = Array.isArray(response.data)
            ? response.data
            : (response.data.data || []);
          const allProductIds = productsData.map((p: Product) => p.ProductID);
          setSelectedProducts(allProductIds);
          toast.success(`Selected ${allProductIds.length} products from all pages`);
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
        toast.error("Failed to select all products");
      } finally {
        setIsSelectingAll(false);
      }
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle add discount
  const handleAddDiscount = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    setShowAddModal(true);
  };

  // Handle confirm add discount
  const handleConfirmAddDiscount = async (
    discountValue: number,
    discountTypeId: number
  ) => {
    setIsLoading(true);
    try {
      const response = await addDiscountToProducts({
        discountValue: discountValue,
        discountTypeId: discountTypeId,
        productIds: selectedProducts,
      });

      if (response.success) {
        toast.success(`Discount added to ${selectedProducts.length} product(s)`);
        setShowAddModal(false);
        setSelectedProducts([]);
        // Add small delay to ensure backend processes the update
        setTimeout(() => {
          fetchProducts();
        }, 300);
      } else {
        toast.error(response.message || "Failed to add discount");
      }
    } catch (error: any) {
      console.error("Error adding discount:", error);
      toast.error(error.response?.data?.message || "Failed to add discount");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit discount
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Handle confirm edit discount
  const handleConfirmEditDiscount = async (
    productId: number,
    discountValue: number,
    discountTypeId: number
  ) => {
    setIsLoading(true);
    try {
      const response = await updateProductDiscount(
        productId,
        discountValue,
        discountTypeId
      );

      if (response.success) {
        toast.success("Discount updated successfully");
        setShowEditModal(false);
        setEditingProduct(null);
        // Add small delay to ensure backend processes the update
        setTimeout(() => {
          fetchProducts();
        }, 300);
      } else {
        toast.error(response.message || "Failed to update discount");
      }
    } catch (error: any) {
      console.error("Error updating discount:", error);
      toast.error(error.response?.data?.message || "Failed to update discount");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove discount
  const handleRemoveDiscount = async (productId: number) => {
    setIsLoading(true);
    try {
      const response = await removeProductDiscount(productId);

      if (response.success) {
        toast.success("Discount removed successfully");
        setShowEditModal(false);
        setEditingProduct(null);
        // Add small delay to ensure backend processes the update
        setTimeout(() => {
          fetchProducts();
        }, 300);
      } else {
        toast.error(response.message || "Failed to remove discount");
      }
    } catch (error: any) {
      console.error("Error removing discount:", error);
      toast.error(error.response?.data?.message || "Failed to remove discount");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Discount Management
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Manage product discounts and pricing
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <DiscountProductToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedProducts.length}
        onAddDiscount={handleAddDiscount}
      />

      {/* Loading State */}
      {isLoading && products.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad8d5e]"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <DiscountProductTable
            products={products}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEdit={handleEditProduct}
            formatCurrency={formatCurrency}
            isSelectingAll={isSelectingAll}
            emptyMessage={
              searchTerm
                ? `No products found for "${searchTerm}"`
                : "No products available"
            }
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
      )}

      {/* Add Discount Modal */}
      <AddDiscountModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        selectedCount={selectedProducts.length}
        onConfirm={handleConfirmAddDiscount}
        isLoading={isLoading}
      />

      {/* Edit Discount Modal */}
      <EditDiscountModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        product={editingProduct}
        onConfirm={handleConfirmEditDiscount}
        onRemove={handleRemoveDiscount}
        isLoading={isLoading}
      />
    </div>
  );
}
