"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product-detail";
import { useCartStore } from "@/store/cart";
import { useAppStore } from "@/store/auth"; // Import useAppStore
import { formatCurrency } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isUpdating } = useCartStore();
  const { setAuthOpen, setAuthMode } = useAppStore(); // Get auth actions

  const handleAddToCart = async () => {
    try {
      await addToCart(product.ProductID, quantity);
      // Toast on success is handled by the store
    } catch (error: any) {
      if (error.message === "AUTH_REQUIRED") {
        setAuthMode("signin");
        setAuthOpen(true);
        // Toast for auth required is handled by the store
      } else {
        // Generic error toast is handled by the store, but if you want specific component toast, uncomment below
        // toast.error("Failed to add to cart. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {product.ProductName}
        </h1>
        <p className="text-muted-foreground text-lg">
          {product.detail?.Producer}
        </p>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y">
        <div>
          <p className="text-sm text-muted-foreground">Origin</p>
          <p className="font-semibold">{product.detail?.Origin}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Size</p>
          <p className="font-semibold">{product.detail?.Size}ml</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Varietal</p>
          <p className="font-semibold">{product.detail?.Varietal}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ABV</p>
          <p className="font-semibold">{product.detail?.ABV}%</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 text-3xl">
        <span className="font-bold dark:text-white">
          {formatCurrency(
            product.SalePrice * (1 - (product.DiscountValue ?? 0) / 100)
          )}
        </span>
        <span className="line-through text-xs sm:text-sm dark:text-gray-500 ml-1 sm:ml-2">
          {formatCurrency(product.SalePrice)}
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 ">
        <div className="flex items-center rounded-lg ">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 w-10 text-muted-foreground hover:bg-primary dark:hover:text-white rounded-l-lg border border-primary"
          >
            -
          </button>
          <span className="px-4 py-2 font-semibold dark:bg-white/5 border border-y-primary">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 w-10 text-muted-foreground hover:bg-primary dark:hover:text-white rounded-r-lg border border-primary"
          >
            +
          </button>
        </div>
        <span className="text-sm text-muted-foreground">In stock</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-primary hover:opacity-90 text-primary-foreground text-lg py-6 hover:shadow-[0_8px_32px_0_#ad8d5e]"
          onClick={handleAddToCart}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-2" />
          )}
          Add to Cart
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-sm text-muted-foreground">
            100% Authentic Wines
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Safe and Secure Shipping
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Customer Satisfaction Guaranteed
          </span>
        </div>
      </div>
    </div>
  );
}
