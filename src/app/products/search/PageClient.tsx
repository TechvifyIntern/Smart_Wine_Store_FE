"use client";

import { useEffect, useMemo, useState } from "react";
import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductsGrid from "@/components/shop/ProductsGrid";
import Pagination from "@/components/shop/Pagination";
import { Products } from "@/types/products";
import { useSearchParams } from "next/navigation";
import { getSearchedProducts } from "@/services/products/api";

export default function PageClient() {
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Products[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  const keywords = searchParams.get("keywords") || undefined;

  const category = searchParams.get("category") || undefined;
  const origin = searchParams.get("origin") || undefined;
  const minAbv = Number(searchParams.get("minAbv")) || 0;
  const maxAbv = Number(searchParams.get("maxAbv")) || 60;
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSearchedProducts({
          name: keywords,
        });

        if (response.success) {
          const fetchedProducts = response.data || [];
          setProducts(fetchedProducts);
          setTotalPages(Math.ceil(fetchedProducts.length / pageSize));
          setCurrentPage(1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Fetch products error", error);
        setProducts([]);
        setTotalPages(1);
      }
    };

    fetchData();
  }, [keywords]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // if (origin && product.origin !== origin) return false;

      if (minAbv && Number(product.ABV) < minAbv) return false;
      if (maxAbv && Number(product.ABV) > maxAbv) return false;

      const price = product.SalePrice ?? product.CostPrice;

      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;

      console.log(products, minAbv, maxAbv, minPrice, maxPrice);

      return true;
    });
  }, [products, minAbv, maxAbv, minPrice, maxPrice]);

  return (
    <main className="mx-30 flex mt-28 min-h-screen">
      <SidebarFilters />
      <div className="flex-1 flex flex-col">
        <ProductsGrid
          products={filteredProducts}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
          />
        )}
      </div>
    </main>
  );
}
