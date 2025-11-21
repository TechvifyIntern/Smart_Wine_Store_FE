"use client";

import { CategoryHeader } from "./CategoryHeader";
import { ProductCarousel } from "./ProductCarousel";

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

interface Collection {
    categoryId: number;
    categoryName: string;
    productCount: number;
    products: Product[];
}

interface CollectionSectionProps {
    collection: Collection;
    onCarouselRefSet?: (element: HTMLDivElement | null) => void;
}

export function CollectionSection({
    collection,
    onCarouselRefSet,
}: CollectionSectionProps) {
    return (
        <div className="space-y-8">
            <CategoryHeader categoryName={collection.categoryName} />
            <ProductCarousel
                products={collection.products}
                onRefSet={onCarouselRefSet}
            />
        </div>
    );
}
