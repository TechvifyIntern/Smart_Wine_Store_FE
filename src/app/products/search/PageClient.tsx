"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductsGrid from "@/components/shop/ProductsGrid";
import { Products } from "@/types/products";
import { getSearchedProducts } from "@/services/products/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const pageSize = 12;

export default function PageClient() {
  const searchParams = useSearchParams();
  const keywords = searchParams.get("keywords") || undefined;
  const category = searchParams.get("category") || undefined;

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: allProducts,
    isLoading,
    isError,
  } = useQuery<Products[], Error>({
    queryKey: ["products", keywords],
    queryFn: async () => {
      const response = await getSearchedProducts({
        name: keywords,
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch products");
    },
    enabled: !!keywords,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const totalPages = useMemo(() => {
    if (!allProducts) return 0;
    return Math.ceil(allProducts.length / pageSize);
  }, [allProducts]);

  const paginatedProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [allProducts, currentPage]);

  return (
    <main className="flex flex-col md:flex-row mt-16 sm:mt-20 md:mt-28 min-h-screen">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6">
          <h1 className="font-bold text-2xl sm:text-3xl mb-2 capitalize text-primary tracking-widest">
            Search Results
          </h1>
          <p className="mb-3 sm:mb-4 dark:text-gray-400 text-xs sm:text-sm">
            Showing {allProducts?.length || 0} results for:{" "}
            <strong>{keywords}</strong>
          </p>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-red-500">Failed to load products.</p>
          </div>
        ) : (
          <ProductsGrid products={paginatedProducts} />
        )}

        {allProducts && allProducts.length > pageSize && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </main>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > half + 2) {
        pageNumbers.push("...");
      }

      let start = Math.max(2, currentPage - half);
      let end = Math.min(totalPages - 1, currentPage + half);

      if (currentPage <= half + 1) {
        end = maxPagesToShow - 1;
      }
      if (currentPage >= totalPages - half) {
        start = totalPages - maxPagesToShow + 2;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - half - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center my-8 space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={
                currentPage === 1
                  ? "pointer-events-none text-muted-foreground"
                  : ""
              }
            />
          </PaginationItem>
          {pageNumbers.map((num, index) => (
            <PaginationItem key={index}>
              {typeof num === "number" ? (
                <PaginationLink
                  href="#"
                  isActive={currentPage === num}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(num);
                  }}
                  className={currentPage === num ? "bg-primary" : ""}
                >
                  {num}
                </PaginationLink>
              ) : (
                <PaginationEllipsis />
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none text-muted-foreground"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
