"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import productsRepository from "@/api/productsRepository";
import categoriesRepository from "@/api/categoriesRepository";
import { Category } from "@/types/category";
import PageHeader from "@/components/discount-events/PageHeader";
import ProductTable from "@/components/product/ProductTable";
import ProductToolbar from "@/components/product/ProductToolbar";
import Pagination from "@/components/admin/pagination/Pagination";
import { CreateProductModal } from "@/components/product/(modal)/CreateProductModal";
import { Spinner } from "@/components/ui/spinner";
import { Product } from "@/types/product-detail";

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 260000000,
  ]); // Default range

  const maxPrice =
    products.length > 0
      ? Math.max(...products.map((p) => p.SalePrice))
      : 260000000;

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesRepository.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage - 1,
          size: itemsPerPage,
          category:
            selectedCategoryId !== "all" ? selectedCategoryId : undefined,
          minSalePrice: priceRange[0],
          maxSalePrice: priceRange[1],
        };

        let response;
        if (searchTerm.trim()) {
          response = await productsRepository.searchProducts({
            name: searchTerm,
            ...params,
          });
        } else {
          response = await productsRepository.filterProducts(params);
        }

        setProducts(response.data);
        setTotalItems(response.total);
      } catch (err) {
        console.error("Error loading products:", err);
        toast({ title: "Failed to load products", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(loadProducts, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, currentPage, itemsPerPage, selectedCategoryId, priceRange]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleView = (id: number) => {
    router.push(`/admin/products/${id}`);
  };

  const handleEdit = (id: number) => {
    const product = products.find((p) => p.ProductID === id);
    if (product) {
      alert(`Editing product: ${product.ProductName}`);
    }
  };

  const handleDelete = async (id: number) => {
    const product = products.find((p) => p.ProductID === id);
    if (
      product &&
      window.confirm(
        `Are you sure you want to delete "${product.ProductName}"?`
      )
    ) {
      try {
        await productsRepository.deleteProduct(id);
        const response = await productsRepository.getProducts();
        if (response.data) {
          setProducts(response.data);
        }
        toast({
          title: `Product "${product.ProductName}" deleted successfully!`,
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    const product = products.find((p) => p.ProductID === id);

    if (!product) {
      toast({
        title: `Product with ID ${id} not found`,
        variant: "destructive",
      });
      console.error(
        "Product not found. ID:",
        id,
        "Available IDs:",
        products.map((p) => p.ProductID)
      );
      return;
    }

    try {
      // If CategoryID is missing but CategoryName exists, try to find it from categories
      let categoryId = product.CategoryID;
      if (!categoryId && product.CategoryName) {
        const category = categories.find(
          (cat) => cat.CategoryName === product.CategoryName
        );
        if (category) {
          categoryId = category.CategoryID;
        }
      }

      // Validate required fields
      if (!categoryId) {
        toast({
          title:
            "Cannot update product: CategoryID is missing and could not be determined from CategoryName",
          variant: "destructive",
        });
        console.error(
          "Product missing CategoryID:",
          JSON.stringify(product, null, 2)
        );
        return;
      }

      // Use PATCH /products/{id}/status/{isActive} to update product status
      const updateResponse = await productsRepository.updateProductStatus(
        id,
        isActive
      );
      if (updateResponse.success) {
        // Reload products to get updated data
        const response = await productsRepository.getProducts();
        if (response.data) {
          setProducts(response.data);
        }

        const statusText = isActive ? "activated" : "deactivated";
        toast({
          title: `Product "${product.ProductName}" ${statusText} successfully!`,
          variant: "success",
        });
      } else {
        toast({
          title: `Failed to update product status: ${updateResponse.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating product status:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast({
        title: `Failed to update product status: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreate = async (
    data: Omit<Product, "ProductID" | "CreatedAt" | "UpdatedAt">
  ) => {
    try {
      const productData = {
        ...data,
        CategoryID:
          typeof data.CategoryID === "string"
            ? parseInt(data.CategoryID)
            : data.CategoryID,
      };

      const createdProductResponse =
        await productsRepository.createProduct(productData);
      if (createdProductResponse.success && createdProductResponse.data) {
        toast({
          title: `Sản phẩm "${createdProductResponse.data.ProductName}" đã được tạo thành công!`,
          variant: "success",
        });
        // Auto refresh page after successful creation
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast({ title: "Không thể tạo sản phẩm", variant: "destructive" });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
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
        createButtonLabel="Thêm Product"
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        maxPrice={maxPrice}
      />

      {/* Products Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <ProductTable
          products={products}
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
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
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
