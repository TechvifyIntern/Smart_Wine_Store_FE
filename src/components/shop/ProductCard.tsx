"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { Products } from "@/types/products";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Products;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.ProductID, 1);
    toast.success(`${product.ProductName} has been added to your cart.`);
  };
  return (
    <div
      className="
        group
        bg-white/5
        backdrop-blur-xl 
        border border-secondary dark:border-white/20 
        rounded-xl sm:rounded-2xl
        p-3 sm:p-4 
        shadow-[0_8px_32px_0_rgba(255,255,255,0.20)]
        transition-all duration-300 
        hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.20)]
        hover:scale-[1.02] sm:hover:scale-[1.03]
        dark:hover:border-white/40
      "
    >
      {/* LINK CHỈ BAO QUANH PHẦN HIỂN THỊ */}
      <Link href={`/product-detail/${product.ProductID}`} className="block">
        <img
          src={product.ImageURL || "/placeholder-image.jpg"}
          alt={product.ProductName}
          className="mx-auto h-48 sm:h-60 md:h-72 lg:h-80 w-full object-cover rounded-lg sm:rounded-xl"
        />

        <h5 className="mt-2 sm:mt-3 font-medium tracking-wide text-base sm:text-lg md:text-xl dark:text-white line-clamp-2">
          {product.ProductName}
        </h5>

        <p className="text-[10px] sm:text-xs dark:text-gray-300 opacity-80 mb-1 sm:mb-2">
          {product.Size ?? 0}ml • {product.ABV ?? 0}% ABV
        </p>

        <div className="flex items-center justify-between flex-wrap gap-1">
          <div>
            <span className="font-bold text-sm sm:text-base md:text-lg dark:text-white">
              {formatCurrency(product.SalePrice)}
            </span>
            {Number(product.CostPrice) < Number(product.SalePrice) && (
              <span className="line-through text-xs sm:text-sm dark:text-gray-500 ml-1 sm:ml-2">
                {formatCurrency(product.CostPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* BUTTON ADD TO CART TÁCH RIÊNG → KHÔNG GÂY HYDRATION ERROR */}
      <div className="mt-2 sm:mt-3 flex justify-end">
        <Button
          onClick={handleAddToCart}
          className="
            flex items-center justify-center
            bg-primary
            backdrop-blur-md 
            px-3 py-2 sm:px-4 sm:py-2
            rounded-lg sm:rounded-xl
            hover:scale-105 sm:hover:scale-110
            transition-all
          "
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
