import React from "react";
import ProductCard from "./ProductCard";
import { Products } from "@/types/products";

interface ProductsGridProps {
  currentPage?: number;
  pageSize?: number;
  products?: Products[];
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  currentPage = 1,
  pageSize = 9,
}) => {
  const productsToShow = products || [];
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageProducts = productsToShow.slice(start, end);

  return (
    <div className="w-full px-3 sm:px-6 md:px-8 lg:px-10 mb-6 sm:mb-8 md:mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        {pageProducts.map((product) => (
          <ProductCard key={product.ProductID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
