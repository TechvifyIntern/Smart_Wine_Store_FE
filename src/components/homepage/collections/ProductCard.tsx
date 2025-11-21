
"use client"
import { useState } from "react";

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

interface ProductCardProps {
    product: Product;
}121212

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative cursor-pointer border border-gray-200 dark:border-0 dark:border-t-0 dark:bg-[#121212] transition-all duration-300 hover:shadow-lg w-72 h-[26rem] hover:h-[28.5rem]">
            {/* Image Section */}
            <div className="relative h-72 overflow-hidden flex items-center justify-center bg-white">
                <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="p-4 text-center space-y-2">
                {/* Category */}
                <p className="text-sm font-extralight">
                    {product.productDetail.origin}
                </p>

                {/* Product Name */}
                <h3 className="text-base font-medium">
                    {product.productName}
                </h3>


                {/* Price */}
                <div className="flex items-center justify-center gap-2">
                    <span className="text-base font-medium text-primary">
                        {product.salePrice}
                    </span>
                </div>

                {/* Add to Cart Button - Overlay at bottom on hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button className="w-full py-3 px-4 bg-primary text-white text-sm font-medium rounded hover:bg-primary-dark transition-colors">
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    );
}