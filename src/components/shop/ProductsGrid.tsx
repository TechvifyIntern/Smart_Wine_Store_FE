import React from "react";
import ProductCard from "./ProductCard";
import { products as defaultProducts } from "@/data/shop";

interface ProductsGridProps {
  currentPage?: number;
  pageSize?: number;
  products?: Array<{
    ProductID: number;
    ProductName: string;
    CategoryID: number;
    ImageURL?: string;
    CostPrice: number;
    SalePrice: number;
    isActive: boolean;
    detail: {
      ProductDetailID: number;
      ProductID: number;
      Size: number;
      ABV: number;
      Producer: string;
      Origin: string;
      Varietal: string;
      DescriptionTitle: string;
      DescriptionContents: string;
    };
  }>;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {pageProducts.map((product) => (
          <ProductCard key={product.ProductID} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
