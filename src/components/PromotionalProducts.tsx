"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { promotions } from "@/data/promotions";
import Image from "next/image";

export default function PromotionalProducts() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const PromotionSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
        <div className="absolute top-4 left-4 bg-gray-400 h-6 w-20 rounded-full animate-pulse"></div>
      </div>
      <div className="p-6">
        <div className="h-5 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Special Promotions
          </h2>
          <p className="text-gray-700 text-xl">
            Limited time offers on our finest selections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <PromotionSkeleton key={index} />
              ))
            : promotions.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.discount}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-black">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-800">
                        {product.discountedPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <button className="w-full bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
