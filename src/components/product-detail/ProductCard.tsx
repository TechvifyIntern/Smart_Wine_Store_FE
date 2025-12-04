"use client";

import type { Product } from "@/types/product-detail";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    addToCart(product.ProductID, 1);
    toast({ title: "Added to cart!", variant: "success" });
  };

  return (
    <div
      className="bg-white/5
        backdrop-blur-xl 
        border border-secondary dark:border-white/20 
        rounded-2xl 
        p-4 
        shadow-[0_8px_32px_0_rgba(255,255,255,0.20)]
        transition-all duration-300 
        hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.20)]
        hover:scale-y-[1.03]
        dark:hover:border-white/40"
    >
      <div className="relative bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={product.ImageURL || "/placeholder.svg"}
          alt={product.ProductName}
          className="mx-auto w-full h-96 object-cover rounded-xl"
        />
      </div>
      <h3 className="font-semibold mb-2">{product.ProductName}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {product.detail?.Producer}
      </p>{" "}
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {formatCurrency(product.SalePrice)}
        </span>
        {Number(product.CostPrice) > product.SalePrice && (
          <span className="line-through text-sm text-muted-foreground ml-2">
            {formatCurrency(product.CostPrice)}
          </span>
        )}
        <Button
          onClick={handleAddToCart}
          size="sm"
          className=" flex items-center justify-center
           bg-primary
            backdrop-blur-md 
            px-4 py-2 
            rounded-xl 
            hover:scale-130
            transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
