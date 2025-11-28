"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/data/products";
import productsRepository from "@/api/productsRepository";
import categoriesRepository from "@/api/categoriesRepository";
import { Category } from "@/types/category";
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
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoriesRepository.getCategories();
                if (response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Error loading categories:', err);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setIsSearching(true);
                let response;

                if (searchTerm.trim()) {
                    response = await productsRepository.searchProducts({ name: searchTerm });
                } else {
                    response = await productsRepository.getProducts();
                }

                if (response.success && response.data) {
                    setProducts(response.data);
                } else {
                    console.error('Failed to load products:', response.message);
                }
            } catch (err) {
                console.error('Error loading products:', err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            loadProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const filteredProducts = products;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handleView = (id: number) => {
        router.push(`/product/${id}`);
    };

    const handleEdit = (id: number) => {
        const product = products.find((p) => p.ProductID === id);
        if (product) {
            alert(`Editing product: ${product.ProductName}`);
        }
    };

    const handleDelete = async (id: number) => {
        const product = products.find((p) => p.ProductID === id);
        if (product && window.confirm(`Are you sure you want to delete "${product.ProductName}"?`)) {
            try {
                await productsRepository.deleteProduct(id);
                const response = await productsRepository.getProducts();
                if (response.success && response.data) {
                    setProducts(response.data);
                }
                toast.success(`Product "${product.ProductName}" deleted successfully!`);
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    const handleToggleStatus = async (id: number, isActive: boolean) => {
        console.log('handleToggleStatus called with:', { id, isActive, productsCount: products.length });
        console.log('All products:', products);

        const product = products.find((p) => p.ProductID === id);

        if (!product) {
            toast.error(`Product with ID ${id} not found`);
            console.error('Product not found. ID:', id, 'Available IDs:', products.map(p => p.ProductID));
            return;
        }

        console.log('Found product:', JSON.stringify(product, null, 2));

        try {
            // If CategoryID is missing but CategoryName exists, try to find it from categories
            let categoryId = product.CategoryID;
            if (!categoryId && product.CategoryName) {
                const category = categories.find(cat => cat.CategoryName === product.CategoryName);
                if (category) {
                    categoryId = category.CategoryID;
                    console.log(`Mapped CategoryName "${product.CategoryName}" to CategoryID ${categoryId}`);
                }
            }

            // Validate required fields
            if (!categoryId) {
                toast.error('Cannot update product: CategoryID is missing and could not be determined from CategoryName');
                console.error('Product missing CategoryID:', JSON.stringify(product, null, 2));
                return;
            }

            // Use PATCH /products/{id}/status/{isActive} to update product status
            console.log('Toggling product status:', { id, isActive });

            await productsRepository.updateProductStatus(id, isActive);
            const response = await productsRepository.getProducts();
            if (response.success && response.data) {
                setProducts(response.data);
            }
            const statusText = isActive ? "activated" : "deactivated";
            toast.success(`Product "${product.ProductName}" ${statusText} successfully!`);
        } catch (error: any) {
            console.error("Error updating product status:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(`Failed to update product status: ${error.message || 'Unknown error'}`);
        }
    };

    const handleCreateProduct = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreate = async (data: Omit<Product, 'ProductID' | 'CreatedAt' | 'UpdatedAt'>) => {
        try {
            const productData = {
                ...data,
                CategoryID: typeof data.CategoryID === 'string' ? parseInt(data.CategoryID) : data.CategoryID,
            };

            const createdProductResponse = await productsRepository.createProduct(productData);
            const response = await productsRepository.getProducts();
            if (response.success && response.data) {
                setProducts(response.data);
            }
            setIsCreateModalOpen(false);
            if (createdProductResponse.success && createdProductResponse.data) {
                toast.success(`Product "${createdProductResponse.data.ProductName}" created successfully!`);
            }
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Failed to create product");
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
