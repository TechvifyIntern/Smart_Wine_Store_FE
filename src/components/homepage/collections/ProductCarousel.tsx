"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "./ProductCard";

interface ProductDetail {
    size: string;
    abv: string;
    origin: string;
}

interface Product {
    productId: number;
    productName: string;
    imageUrl: string;
    salePrice: string;
    productDetail: ProductDetail;
}

interface ProductCarouselProps {
    products: Product[];
    onRefSet?: (element: HTMLDivElement | null) => void;
}

export function ProductCarousel({ products, onRefSet }: ProductCarouselProps) {
    return (
        <div ref={onRefSet}>
            <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full overflow-visible"
            >
                <CarouselContent className="-ml-4 overflow-visible h-[30rem]">
                    {products.map((product) => (
                        <CarouselItem
                            key={product.productName}
                            className="pl-4 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 overflow-visible relative"
                        >
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
