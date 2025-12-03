"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductsGrid from "@/components/shop/ProductsGrid";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { getFilteredProducts } from "@/services/products/api";
import { Products } from "@/types/products";

import ShopPagination from "@/components/shop/Pagination";

export default function PageClient() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const category = searchParams.get("category") || undefined;
  const origin = searchParams.get("origin") || undefined;
  const minAbv = searchParams.get("minAbv")
    ? Number(searchParams.get("minAbv"))
    : undefined;
  const maxAbv = searchParams.get("maxAbv")
    ? Number(searchParams.get("maxAbv"))
    : undefined;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  // Reset về page 1 mỗi khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [category, origin, minAbv, maxAbv, minPrice, maxPrice]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "products",
      category,
      origin,
      minAbv,
      maxAbv,
      minPrice,
      maxPrice,
      page,
    ],
    queryFn: () =>
      getFilteredProducts({
        category,
        origin,
        minAbv,
        maxAbv,
        minSalePrice: minPrice,
        maxSalePrice: maxPrice,
        page,
        size: pageSize,
      }),
  });

  const products = data?.data.data || [];
  const totalItems = data?.data.total || 0;

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <main className="flex flex-col md:flex-row mt-16 sm:mt-20 md:mt-28 min-h-screen">
      <div className="hidden md:block md:w-64 lg:w-72">
        <SidebarFilters category={category} />
      </div>

      <div className="md:hidden px-4 py-3 border-b">
        <button className="text-sm font-medium text-primary">
          Filters & Sort
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6">
          <h1 className="font-bold text-2xl sm:text-3xl mb-2 capitalize text-primary tracking-widest">
            Product
          </h1>
          <p className="mb-3 sm:mb-4 dark:text-gray-400 text-xs sm:text-sm">
            Browse our collection of premium products.
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProductsGrid products={products} />
        )}

        {/* Pagination */}
        {totalItems > 0 && totalPages > 1 && (
          <ShopPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </main>
  );
}
