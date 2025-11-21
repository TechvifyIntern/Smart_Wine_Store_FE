"use client";

import { collections } from "@/data/collections";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Activity, MapPin, Tag, ShoppingCart, BottleWine } from "lucide-react";
import Link from "next/link";

export function Collections() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto space-y-20">
        {collections.map((collection) => (
          <div key={collection.categoryId} className="space-y-8">
            {/* Category header */}
            <div className="text-center">
              <p className="text-sm tracking-widest text-primary uppercase">
                {collection.categoryName}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif mt-2">
                {collection.productCount} Products Chưa gắn Link
              </h2>
            </div>

            {/* Carousel */}
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full overflow-visible"
            >
              <CarouselContent className="-ml-4 overflow-visible">
                {collection.products.map((product) => (
                  <CarouselItem
                    key={product.productId}
                    className="pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 overflow-visible relative"
                  >
                    <Link href={`/product/${product.productId}`}>
                      <div className="group relative cursor-pointer hover:z-50 hover:drop-shadow-lg z-10 hover:border-2 hover:border-primary hover:rounded-xl">
                        <div className="relative h-60 rounded-xl">
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40 rounded-xl" />
                        </div>

                        <div className="p-4 space-y-2 bg-white rounded-b-xl shadow-md border border-transparent hover:shadow-xl hover:border-primary">
                          <h3 className="text-lg font-semibold text-black">
                            {product.productName}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center space-x-2 text-sm text-primary font-bold">
                            <Tag className="w-4 h-4" />
                            <span>{product.salePrice}</span>
                          </div>

                          {/* Size & ABV */}
                          <div className="flex justify-between text-sm text-muted-foreground my-1">
                            <div className="flex items-center space-x-2">
                              <BottleWine className="w-4 h-4" />
                              <span>{product.productDetail.size}</span>
                            </div>
                            <div className="flex items-center space-x-2 mr-16">
                              <Activity className="w-4 h-4" />
                              <span>{product.productDetail.abv}</span>
                            </div>
                          </div>

                          {/* Origin & Add to Cart */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{product.productDetail.origin}</span>
                            </div>
                            <button className="flex items-center space-x-1 px-3 py-1 text-sm font-semibold text-white bg-primary rounded hover:bg-primary/90 transition hover:cursor-pointer">
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ))}
      </div>
    </section>
  );
}
