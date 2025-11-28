"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

// Slide data interface
interface Slide {
  id: number;
  content: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    content: "Exceptional Wines Every Occasion",
    image: "/sample-1.webp",
  },
  {
    id: 2,
    content: "Each Wine Has Its Own Recipe",
    image: "/sample-2.webp",
  },
  {
    id: 3,
    content: "The Art of Wine Tasting",
    image: "/sample-3.webp",
  },
];

interface HeroSliderProps {
  slides?: Slide[];
  autoPlayInterval?: number;
}

export function HeroSlider({
  slides,
  autoPlayInterval = 5000,
}: HeroSliderProps) {
  const { t } = useLocale();

  // Use default slides with translations if not provided
  const defaultSlides: Slide[] = [
    {
      id: 1,
      content: t("home.hero.slide1"),
      image: "/sample-1.webp",
    },
    {
      id: 2,
      content: t("home.hero.slide2"),
      image: "/sample-2.webp",
    },
    {
      id: 3,
      content: t("home.hero.slide3"),
      image: "/sample-3.webp",
    },
  ];

  const slidesData = slides || defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Navigate to next slide
  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setShowContent(false); // Hide content immediately
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesData.length);

    // After slide transition (700ms), wait 1 second, then show content
    setTimeout(() => {
      setIsTransitioning(false);
      setTimeout(() => {
        setShowContent(true);
      }, 1000); // 1 second delay after slide transition
    }, 700);
  }, [isTransitioning, slidesData.length]);

  // Navigate to previous slide
  const goToPrev = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setShowContent(false); // Hide content immediately
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
    );

    // After slide transition (700ms), wait 1 second, then show content
    setTimeout(() => {
      setIsTransitioning(false);
      setTimeout(() => {
        setShowContent(true);
      }, 1000); // 1 second delay after slide transition
    }, 700);
  }, [isTransitioning, slidesData.length]);

  // Auto-play functionality - exactly 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [goToNext, autoPlayInterval]);

  // Show content on initial load
  useEffect(() => {
    // Initial content animation on mount
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden bg-black mt-14 sm:mt-16">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slidesData.map((slide, index) => {
          // Determine if this slide should be visible
          const isActive = index === currentIndex;
          const isPrev =
            index === (currentIndex - 1 + slidesData.length) % slidesData.length;

          // Position classes based on slide state
          let positionClass = "translate-x-full"; // Default: off-screen right

          if (isActive) {
            positionClass = "translate-x-0"; // Center
          } else if (isPrev) {
            positionClass = "-translate-x-full"; // Off-screen left
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${positionClass}`}
              style={{
                transitionProperty: "transform",
              }}
            >
              {/* Background Image with Overlay */}
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.content}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  quality={75}
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Content Overlay - Animated with 1s delay after slide transition */}
              {isActive && showContent && (
                <div className="absolute inset-0 flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
                  <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                      {/* Main Content - Slide in from right with fade */}
                      <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-[#FFFFFF] mb-4 sm:mb-6 leading-tight px-2"
                        style={{
                          animation:
                            "slideInFromRightWithFade 0.8s ease-out forwards",
                          opacity: 0,
                        }}
                      >
                        {slide.content}
                      </h1>

                      {/* CTA Button - Fade in with slight delay */}
                      <button
                        className="px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 bg-[#ad8d5e] hover:bg-[#967a4d] text-white text-sm sm:text-base font-light transition-all duration-300 transform hover:scale-105 rounded-md"
                        style={{
                          animation: "fadeInUp 0.6s ease-out 0.3s forwards",
                          opacity: 0,
                        }}
                      >
                        {t("home.hero.shopNow")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-8 pointer-events-none">
        {/* Previous Button */}
        <button
          onClick={goToPrev}
          aria-label="Previous slide"
          className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#6a522f]/20 hover:bg-[#ad8d5e] text-white/30 hover:text-white/80 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          aria-label="Next slide"
          className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#6a522f]/20 hover:bg-[#ad8d5e] text-white/30 hover:text-white/80 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning && index !== currentIndex) {
                setIsTransitioning(true);
                setShowContent(false);
                setDirection(index > currentIndex ? "right" : "left");
                setCurrentIndex(index);
                setTimeout(() => {
                  setIsTransitioning(false);
                  setTimeout(() => {
                    setShowContent(true);
                  }, 1000);
                }, 700);
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-700 ease-in-out ${index === currentIndex
              ? "w-6 sm:w-8 md:w-12 bg-[#ad8d5e]"
              : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes slideInFromRightWithFade {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          @keyframes slideInFromRightWithFade {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </div>
  );
}
