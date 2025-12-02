"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package } from "lucide-react";
import { Product } from "@/types/product-detail";

export interface AddProductToCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number;
  categoryName: string;
  currentProducts: Product[];
  onAddProducts: (productIds: number[]) => void;
}

export function AddProductToCategory({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  currentProducts,
  onAddProducts,
}: AddProductToCategoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(
    new Set()
  );

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return currentProducts;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return currentProducts.filter(
      (product) =>
        product.ProductName.toLowerCase().includes(lowerSearchTerm) ||
        product.ProductID.toString().includes(searchTerm)
    );
  }, [currentProducts, searchTerm]);

  const handleProductToggle = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedProductIds);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProductIds(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(new Set(filteredProducts.map((p) => p.ProductID)));
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleAddProducts = () => {
    if (selectedProductIds.size > 0) {
      onAddProducts(Array.from(selectedProductIds));
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedProductIds(new Set());
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-white! border-gray-200!">
        <DialogHeader>
          <DialogTitle className="text-gray-900!">
            Thêm sản phẩm vào danh mục
          </DialogTitle>
          <DialogDescription className="text-gray-600!">
            Chọn sản phẩm để thêm vào danh mục{" "}
            <strong className="text-gray-900">{categoryName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#ad8d5e]!"
            />
          </div>

          {/* Select All */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={
                  selectedProductIds.size === filteredProducts.length &&
                  filteredProducts.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Chọn tất cả ({filteredProducts.length} sản phẩm)
              </label>
            </div>
          )}

          {/* Product List */}
          <ScrollArea className="h-[400px] border border-gray-200 rounded-lg">
            {filteredProducts.length > 0 ? (
              <div className="p-4 space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.ProductID}
                    className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`product-${product.ProductID}`}
                      checked={selectedProductIds.has(product.ProductID)}
                      onCheckedChange={(checked) =>
                        handleProductToggle(
                          product.ProductID,
                          checked as boolean
                        )
                      }
                    />
                    <div className="flex-shrink-0">
                      <img
                        src={
                          product.ImageURL ||
                          "https://picsum.photos/seed/placeholder/50/50"
                        }
                        alt={product.ProductName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.ProductName}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        ID: #{product.ProductID}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">
                        {formatCurrency(product.SalePrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Package className="w-12 h-12 text-gray-300 mb-2" />
                <p>Không tìm thấy sản phẩm nào</p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-1">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Selection Summary */}
          {selectedProductIds.size > 0 && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              Đã chọn <strong>{selectedProductIds.size}</strong> sản phẩm
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100!"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleAddProducts}
            disabled={selectedProductIds.size === 0}
            className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thêm{" "}
            {selectedProductIds.size > 0 ? `(${selectedProductIds.size})` : ""}{" "}
            sản phẩm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
