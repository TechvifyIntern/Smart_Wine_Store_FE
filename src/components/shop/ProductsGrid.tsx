import React from "react";
import ProductCard from "./ProductCard";
import { Products } from "@/types/products";

interface ProductsGridProps {
  products: Products[];
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products = [] }) => {
  return (
    <div className="w-full px-3 sm:px-6 md:px-8 lg:px-10 mb-6 sm:mb-8 md:mb-10">
      {products.length === 0 ? (
        <div className="text-center">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {products.map((product) => (
            <ProductCard key={product.ProductID} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
