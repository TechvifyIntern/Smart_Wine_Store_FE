"use client";

import { useState, useMemo, useEffect } from "react";
import { Boxes } from "lucide-react";
import inventoriesRepository from "@/api/inventoriesRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import InventoryProductsTable from "@/components/inventory-products/InventoryProductsTable";
import Pagination from "@/components/admin/pagination/Pagination";
import InventoryProductsToolbar from "@/components/inventory-products/InventoryProductsToolbar";
import { CreateInventoryProduct } from "@/components/inventory-products/(modal)/CreateInventoryProduct";
import { UpdateInventoryProduct } from "@/components/inventory-products/(modal)/UpdateInventoryProduct";
import { InventoryImportModal } from "@/components/inventory-products/(modal)/InventoryImportModal";
import { InventoryExportModal } from "@/components/inventory-products/(modal)/InventoryExportModal";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Inventory } from "@/api/inventoriesRepository";

export interface InventoryProduct {
  ProductID: string;
  ProductName: string;
  ImageURL: string;
  Quantity: number;
  CostPrice: number;
  SalePrice: number;
  WarehouseID?: number;
  WarehouseName?: string;
  LastUpdated?: string;
}

export default function InventoryProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);
  const [inventories, setInventories] = useState<InventoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'Quantity' | 'LastUpdated' | 'ProductID'>('ProductID');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadInventories = async (filters?: {
    minQuantity?: number;
    maxQuantity?: number;
    productId?: number;
    warehouseId?: number;
  }) => {
    try {
      setIsLoading(true);
      const response = await inventoriesRepository.getInventories({
        sortBy,
        sortOrder,
        ...filters
      });

      if (response.success && response.data) {
        // Map API response to InventoryProduct format
        const mappedData: InventoryProduct[] = response.data.map((item: Inventory) => ({
          ProductID: item.ProductID.toString(),
          ProductName: item.ProductName || `Product ${item.ProductID}`,
          ImageURL: '', // Add image URL if available from API
          Quantity: item.Quantity,
          CostPrice: 0, // Add cost price if available from API
          SalePrice: 0, // Add sale price if available from API
          WarehouseID: item.WarehouseID,
          WarehouseName: item.WarehouseName,
          LastUpdated: item.LastUpdated
        }));

        setInventories(mappedData);
        toast.success(`Loaded ${mappedData.length} inventory items`);
      } else {
        console.error('Failed to load inventories:', response.message);
        toast.error(response.message || 'Failed to load inventories');
        setInventories([]);
      }
    } catch (err) {
      console.error('Error loading inventories:', err);
      toast.error('An error occurred while loading inventories');
      setInventories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch inventories data from API
  useEffect(() => {
    loadInventories();
  }, []);

  // Reload when sort changes
  useEffect(() => {
    if (!isLoading) {
      loadInventories();
    }
  }, [sortBy, sortOrder]);

  // Filter products based on search term (ProductName only)
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return inventories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return inventories.filter((product) =>
      product.ProductName.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, inventories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Action handlers
  const handleEdit = (id: string) => {
    const product = inventories.find((p) => p.ProductID === id);
    if (product) {
      setSelectedProduct(product);
      setIsUpdateModalOpen(true);
    }
  };

  const handleImport = (id: string) => {
    const product = inventories.find((p) => p.ProductID === id);
    if (product) {
      setSelectedProduct(product);
      setIsImportModalOpen(true);
    }
  };

  const handleExport = (id: string) => {
    const product = inventories.find((p) => p.ProductID === id);
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

  const handleCreateProduct = async (
    data: Omit<InventoryProduct, "ProductID">
  ) => {
    try {
      // Validate product ID if it exists
      if (!data.Quantity || data.Quantity < 0) {
        toast.error("Please enter a valid quantity");
        return;
      }

      const response = await inventoriesRepository.createInventory({
        ProductID: parseInt(data.ProductID || '0'),
        WarehouseID: data.WarehouseID || 1,
        Quantity: data.Quantity
      });

      if (response.success) {
        toast.success("Inventory created successfully!");
        setIsCreateModalOpen(false);
        await loadInventories();
      } else {
        toast.error(response.message || "Failed to create inventory");
      }
    } catch (error) {
      console.error('Error creating inventory:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleUpdateProduct = async (
    id: string,
    data: Omit<InventoryProduct, "ProductID">
  ) => {
    console.log(`Updating product ${id}:`, data);
    // TODO: Implement API call to update product
    alert(`Product ${id} updated successfully!`);
  };

  const handleImportStock = async (
    productId: string,
    quantity: number,
    costPrice: number
  ) => {
    try {
      if (quantity <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      const product = inventories.find(p => p.ProductID === productId);
      const warehouseId = product?.WarehouseID || 1;

      const response = await inventoriesRepository.importInventory({
        ProductID: parseInt(productId),
        WarehouseID: warehouseId,
        Quantity: quantity,
        Notes: `Import stock - Cost: ${formatCurrency(costPrice)}`
      });

      if (response.success) {
        toast.success(`✅ Imported ${quantity} units successfully!`);
        setIsImportModalOpen(false);
        setSelectedProduct(null);
        await loadInventories();
      } else {
        toast.error(response.message || "Failed to import stock");
      }
    } catch (error) {
      console.error('Error importing stock:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleExportStock = async (
    productId: string,
    quantity: number,
    reason: string
  ) => {
    try {
      if (quantity <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      const product = inventories.find(p => p.ProductID === productId);

      if (product && quantity > product.Quantity) {
        toast.error(`Cannot export ${quantity} units. Only ${product.Quantity} available in stock.`);
        return;
      }

      const warehouseId = product?.WarehouseID || 1;

      const response = await inventoriesRepository.exportInventory({
        ProductID: parseInt(productId),
        WarehouseID: warehouseId,
        Quantity: quantity,
        Notes: reason || 'Stock export'
      });

      if (response.success) {
        toast.success(`✅ Exported ${quantity} units successfully!`);
        setIsExportModalOpen(false);
        setSelectedProduct(null);
        await loadInventories();
      } else {
        toast.error(response.message || "Failed to export stock");
      }
    } catch (error) {
      console.error('Error exporting stock:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Inventory Products"
          icon={Boxes}
          iconColor="text-black"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading inventories...</p>
          </div>
        </div>
      </div>
    );
  }

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
        emptyMessage={
          searchTerm
            ? `No products found matching "${searchTerm}"`
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
