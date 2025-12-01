"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductsGrid from "@/components/shop/ProductsGrid";
import { Spinner } from "@/components/ui/spinner";
import { getFilteredProducts } from "@/services/products/api";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Products } from "@/types/products";

export default function PageClient() {
  const [cursor, setCursor] = useState<number>(0);
  const [cursorHistory, setCursorHistory] = useState<number[]>([0]);

  const searchParams = useSearchParams();

  const category = searchParams.get("category") || undefined;
  const origin = searchParams.get("origin") || undefined;
  const minAbv = Number(searchParams.get("minAbv")) || undefined;
  const maxAbv = Number(searchParams.get("maxAbv")) || undefined;
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

  const pageSize = 12;

  const {
    data: response,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "products",
      category,
      origin,
      minAbv,
      maxAbv,
      minPrice,
      maxPrice,
      cursor,
    ],
    queryFn: () =>
      getFilteredProducts({
        category,
        origin,
        minAbv,
        maxAbv,
        minSalePrice: minPrice,
        maxSalePrice: maxPrice,
        Cursor: cursor,
        Size: pageSize,
      }),
    placeholderData: (prev) => prev,
  });

  const products: Products[] = response?.data || [];
  const nextCursor =
    products.length === pageSize
      ? products[products.length - 1].ProductID
      : null;

  useEffect(() => {
    setCursor(0);
    setCursorHistory([0]);
  }, [category, origin, minAbv, maxAbv, minPrice, maxPrice]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cursor]);

  const handleNextPage = () => {
    if (nextCursor !== null) {
      setCursorHistory([...cursorHistory, nextCursor]);
      setCursor(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 1) {
      const newHistory = [...cursorHistory];
      newHistory.pop();
      const previousCursor = newHistory[newHistory.length - 1];
      setCursor(previousCursor);
      setCursorHistory(newHistory);
    }
  };

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
            Browse our collection of premium product.
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProductsGrid products={products} />
        )}

        {products.length > 0 && (
          <div className="flex justify-center items-center my-8">
            <Button
              onClick={handlePrevPage}
              disabled={cursorHistory.length <= 1 || isFetching}
              className="mr-4"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={nextCursor === null || isFetching}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
