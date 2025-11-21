"use client";

import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">You might also like</h2>
      <div className="relative">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
          }}
        >
          <CarouselContent className="-ml-4 min-h-[600px] items-center">
            {products.map((product) => (
              <CarouselItem key={product.ProductID} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
