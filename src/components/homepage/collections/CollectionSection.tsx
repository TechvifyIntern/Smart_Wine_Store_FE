"use client";

import { Product } from "@/types/product-detail";
import { CategoryHeader } from "./CategoryHeader";
import { ProductCarousel } from "./ProductCarousel";
interface CollectionSectionProps {
  products: Product[];
}

export function CollectionSection({ products }: CollectionSectionProps) {
  return (
    <div className="space-y-8">
      <CategoryHeader categoryName={"Wine"} />
      <ProductCarousel products={products} />
    </div>
  );
}
