"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Added to cart!");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {product.ProductName}
        </h1>
        <p className="text-muted-foreground text-lg">
          {product.Product_Detail?.Producer}
        </p>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y">
        <div>
          <p className="text-sm text-muted-foreground">Origin</p>
          <p className="font-semibold">{product.Product_Detail?.Origin}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Size</p>
          <p className="font-semibold">{product.Product_Detail?.Size}ml</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Varietal</p>
          <p className="font-semibold">{product.Product_Detail?.Varietal}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ABV</p>
          <p className="font-semibold">{product.Product_Detail?.ABV}%</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          {product.SalePrice.toFixed(2)} VND
        </span>
        {Number(product.CostPrice) > product.SalePrice && (
          <span className="line-through text-muted-foreground text-lg">
            {Number(product.CostPrice).toFixed(2)}VND
          </span>
        )}
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
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-sm text-muted-foreground">
            100% Authentic Wines
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Safe and Secure Shipping
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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
