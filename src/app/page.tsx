"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromotionalProducts from "@/components/PromotionalProducts";
import Footer from "@/components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";

export default function Home() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Full page loading simulation
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-amber-400 mb-2">
            Loading Wine Collection
          </h2>
          <p className="text-gray-300">
            Preparing your premium wine experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AgeVerificationModal />
      <Header />
      <HeroSlider />
      <FeaturedProducts />
      <PromotionalProducts />
      <Footer />
    </div>
  );
}
