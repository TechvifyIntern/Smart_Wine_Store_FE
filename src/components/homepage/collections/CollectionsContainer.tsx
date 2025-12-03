"use client";

import { useEffect, useRef } from "react";
import { CollectionSection } from "./CollectionSection";
import { getAllProducts } from "@/services/products/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export function CollectionsContainer() {
  const carouselRefs = useRef<HTMLDivElement[]>([]);

  const {
    data: featuredProduct,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: () => getAllProducts(0, 9),
    select: (data) => data.data.data,
  });

  useEffect(() => {
    const intervals = carouselRefs.current.map((carousel) => {
      if (!carousel) return null;
      const content = carousel.querySelector("[role='list']");
      if (!content) return null;
      let scrollAmount = 0;
      const step = carousel.clientWidth / 3; // slide 1/3 width
      return setInterval(() => {
        if (content) {
          scrollAmount += step;
          if (scrollAmount > content.scrollWidth - carousel.clientWidth) {
            scrollAmount = 0;
          }
          content.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }
      }, 3000);
    });
    return () => intervals.forEach((i) => i && clearInterval(i));
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card flex justify-center">
        <Spinner />
      </section>
    );
  }

  if (isError || !featuredProduct) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card text-center">
        <p>Error loading products. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto space-y-20">
        <CollectionSection products={featuredProduct} />
      </div>
    </section>
  );
}
