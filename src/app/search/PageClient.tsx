"use client";

import { useState } from "react";
import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductsGrid from "@/components/shop/ProductsGrid";
import Pagination from "@/components/shop/Pagination";
import { products as defaultProducts } from "@/data/shop";

export default function PageClient() {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 9;
  const totalItems = defaultProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <main className="mx-30 flex mt-28 min-h-screen">
      <SidebarFilters />
      <div className="flex-1 flex flex-col">
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
