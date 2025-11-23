"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.ProductName} has been added to your cart.`);
  };
  return (
    <div
      className="
        group
        bg-white/5
        backdrop-blur-xl 
        border border-secondary dark:border-white/20 
        rounded-2xl 
        p-4 
        shadow-[0_8px_32px_0_rgba(255,255,255,0.20)]
        transition-all duration-300 
        hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.20)]
        hover:scale-[1.03]
        dark:hover:border-white/40
      "
    >
      {/* LINK CHỈ BAO QUANH PHẦN HIỂN THỊ */}
      <Link href={`/product/${product.ProductID}`} className="block">
        <img
          src={product.ImageURL || "/placeholder-image.jpg"}
          alt={product.ProductName}
          className="mx-auto w-full h-64 object-cover rounded-xl"
        />

        <h5 className="mt-3 font-medium tracking-wide text-xl dark:text-white">
          {product.ProductName}
        </h5>

        <p className="text-sm dark:text-gray-200 opacity-90">
          {product.Product_Detail?.Producer}
        </p>

        <p className="text-xs dark:text-gray-300 opacity-80 mb-2">
          {product.Product_Detail?.Origin} • {product.Product_Detail?.Size}ml •{" "}
          {product.Product_Detail?.ABV}% ABV
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg dark:text-white">
              {Number(product.SalePrice).toFixed(2)} VND
            </span>
            {Number(product.CostPrice) < Number(product.SalePrice) && (
              <span className="line-through text-sm dark:text-gray-500 ml-2">
                {Number(product.CostPrice).toFixed(2)} VND
              </span>
            )}
          </div>
        </div>

        <p className="mt-2 text-xs dark:text-gray-200 line-clamp-2 flex-1">
          {product.Product_Detail?.DescriptionTitle}
        </p>
      </Link>

      {/* BUTTON ADD TO CART TÁCH RIÊNG → KHÔNG GÂY HYDRATION ERROR */}
      <div className="mt-3 flex justify-end">
        <Button
          onClick={handleAddToCart}
          className="
            flex items-center justify-center
            bg-primary
            backdrop-blur-md 
            px-4 py-2 
            rounded-xl 
            hover:scale-110
            transition-all
          "
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
