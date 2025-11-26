"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarFilters from "@/components/shop/SidebarFilters";
import ProductsGrid from "@/components/shop/ProductsGrid";
import ShopPagination from "@/components/shop/Pagination";
import { Products } from "@/types/products";
import { getFilteredProducts } from "@/services/products/api";

export default function PageClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Products[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  const category = searchParams.get("category") || undefined;
  const origin = searchParams.get("origin") || undefined;
  const minAbv = Number(searchParams.get("minAbv")) || undefined;
  const maxAbv = Number(searchParams.get("maxAbv")) || undefined;
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

  const pageSize = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFilteredProducts({
          category,
          origin,
          minAbv,
          maxAbv,
          minSalePrice: minPrice,
          maxSalePrice: maxPrice,
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
  }, [category, origin, minAbv, maxAbv, minPrice, maxPrice]);

  console.log(products);

  return (
    <main className="mx-30 flex mt-28 min-h-screen">
      <SidebarFilters category={category} />

      <div className="flex-1 flex flex-col">
        <div className="px-10">
          <h1 className="font-bold text-3xl mb-2 capitalize text-primary tracking-widest">
            Product
          </h1>
          <p className="mb-4 dark:text-gray-400 text-sm">
            Browse our collection of premium product.
          </p>
        </div>

        <ProductsGrid
          products={products}
          currentPage={currentPage}
          pageSize={pageSize}
        />

        {totalPages > 1 && (
          <ShopPagination
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
