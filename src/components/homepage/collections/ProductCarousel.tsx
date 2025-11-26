"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product-detail";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full overflow-visible"
      >
        <CarouselContent className="-ml-4 overflow-visible h-120 ">
          {products.map((product) => (
            <CarouselItem
              key={product.ProductID}
              className="pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 overflow-visible relative"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="top-4/10" />
        <CarouselNext className="top-4/10" />
      </Carousel>
    </div>
  );
}
