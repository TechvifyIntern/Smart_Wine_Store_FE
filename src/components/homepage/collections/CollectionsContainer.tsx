"use client";

import { useEffect, useRef, useState } from "react";
import { CollectionSection } from "./CollectionSection";
import { Product } from "@/types/product-detail";
import { getAllProducts } from "@/services/products/api";

export function CollectionsContainer() {
  const carouselRefs = useRef<HTMLDivElement[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product[]>([]);

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

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getAllProducts(0, 9);
        setFeaturedProduct(products.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto space-y-20">
        <CollectionSection products={featuredProduct} />
      </div>
    </section>
  );
}
