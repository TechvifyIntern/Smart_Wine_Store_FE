"use client";

import Link from "next/link";
import { Product } from "@/types/product-detail";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.ProductID, 1);
    toast.success(`${product.ProductName} has been added to your cart.`);
  };

  return (
    <Link key={product.ProductID} href={`/product-detail/${product.ProductID}`}>
      <div className="group relative cursor-pointer border border-gray-200 dark:border-white/20 dark:border-t-0 dark:bg-[#121212] transition-all duration-300 hover:shadow-lg w-72 h-104 hover:h-114 rounded-lg">
        {/* Image Section */}
        <div className="relative h-72 overflow-hidden flex items-center justify-center bg-white">
          <img
            src={product.ImageURL}
            alt={product.ProductName}
            className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 rounded-lg"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 text-center space-y-2">
          {/* Category */}
          <p className="text-sm font-extralight">{product.CategoryName}</p>

          {/* Product Name */}
          <h3 className="text-base font-medium">{product.ProductName}</h3>

          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-lg dark:text-white">
              {formatCurrency(product.SalePrice)}
            </span>
            {Number(product.CostPrice) < Number(product.SalePrice) && (
              <span className="line-through text-sm dark:text-gray-500 ml-2">
                {formatCurrency(product.CostPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Overlay at bottom on hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              className="w-full py-3 px-4 bg-primary text-white text-sm font-medium rounded hover:bg-primary-dark transition-colors"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
