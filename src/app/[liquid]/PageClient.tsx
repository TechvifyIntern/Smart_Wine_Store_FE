"use client";

import { useState } from "react";
import SidebarFilters from "@/components/shop/SidebarFilters";
import Subcategories from "@/components/shop/Subcategories";
import ProductsGrid from "@/components/shop/ProductsGrid";
import Pagination from "@/components/shop/Pagination";
import { products as defaultProducts } from "@/data/shop";

export default function PageClient({ liquid }: { liquid: string }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 9;
  const totalItems = defaultProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <main className="mx-30 flex mt-16 min-h-screen">
      <SidebarFilters category={liquid} />
      <div className="flex-1 flex flex-col">
        <div className="px-10">
          <h1 className="font-bold text-xl mb-2 capitalize">{liquid}</h1>
          <p className="mb-4 text-gray-700 text-sm">
            Browse our collection of premium {liquid}.
          </p>
          <Subcategories category={liquid} />
        </div>
        <ProductsGrid currentPage={currentPage} pageSize={pageSize} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
        />
      </div>
    </main>
  );
}
