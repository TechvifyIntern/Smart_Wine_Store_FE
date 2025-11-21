import React from "react";
import ProductCard from "./ProductCard";
import { products as defaultProducts } from "@/data/shop";
import Link from "next/link";

import { Product } from "@/types/product";

interface ProductsGridProps {
  currentPage?: number;
  pageSize?: number;
  products?: Product[];
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  currentPage = 1,
  pageSize = 9,
}) => {
  const productsToShow = products || defaultProducts;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageProducts = productsToShow.slice(start, end);

  return (
    <div className="w-full px-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
        {pageProducts.map((product) => (
          <Link key={product.ProductID} href={`/product/${product.ProductID}`}>
            <ProductCard key={product.ProductID} product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
