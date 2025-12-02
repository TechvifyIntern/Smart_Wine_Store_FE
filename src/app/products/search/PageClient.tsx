"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductsGrid from "@/components/shop/ProductsGrid";
import { Spinner } from "@/components/ui/spinner";
import { getSearchedProducts } from "@/services/products/api";
import ShopPagination from "@/components/shop/Pagination";
import { Products } from "@/types/products";

const pageSize = 12;

export default function PageClient() {
  const searchParams = useSearchParams();
  const keywords = searchParams.get("keywords") || undefined;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchProducts", keywords, currentPage],
    queryFn: () =>
      getSearchedProducts({
        name: keywords,
        page: currentPage,
        size: pageSize,
      }),
    enabled: !!keywords,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const products: Products[] = response?.data || [];
  const totalItems = response?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <main className="flex flex-col mt-20 min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-6">
        <h1 className="font-bold text-3xl mb-2">Search Results</h1>
        <p className="mb-4">
          Found {totalItems} results for: <b>{keywords}</b>
        </p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load products.</p>
        ) : (
          <ProductsGrid products={products} />
        )}

        {products.length > 0 && totalPages > 1 && (
          <ShopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
}
