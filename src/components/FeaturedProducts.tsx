"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { wines } from "@/data/wines";
import Image from "next/image";

export default function FeaturedProducts() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
      <div className="relative">
        <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
        <div className="absolute top-4 right-4 bg-gray-400 h-6 w-16 rounded-full animate-pulse"></div>
      </div>
      <div className="p-6">
        <div className="h-5 bg-gray-300 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Wines
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated selection of premium wines from
            renowned vineyards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : wines.map((wine) => (
                <div
                  key={wine.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={wine.image}
                      alt={wine.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      onLoad={() => setIsLoading(false)}
                      onError={() => setIsLoading(false)}
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        New
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                      {wine.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {wine.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-600">
                        {wine.price}
                      </span>
                      <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
            View All Wines
          </button>
        </div>
      </div>
    </section>
  );
}
