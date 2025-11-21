"use client";

import { useEffect, useRef } from "react";
import { collections } from "@/data/collections";
import { CollectionSection } from "./CollectionSection";

export function CollectionsContainer() {
  const carouselRefs = useRef<HTMLDivElement[]>([]);

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

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto space-y-20">
        {collections.map((collection, idx) => (
          <CollectionSection
            key={collection.categoryId}
            collection={{
              ...collection,
              products: collection.products.map((p) => ({
                ...p,
                productId: Number(p.productId),
              })),
            }}
            onCarouselRefSet={(el) => {
              if (el) carouselRefs.current[idx] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
