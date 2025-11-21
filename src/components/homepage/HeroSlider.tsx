"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    slides = SLIDES,
    autoPlayInterval = 5000,
}: HeroSliderProps) {
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

        // After slide transition (700ms), wait 1 second, then show content
        setTimeout(() => {
            setIsTransitioning(false);
            setTimeout(() => {
                setShowContent(true);
            }, 1000); // 1 second delay after slide transition
        }, 700);
    }, [isTransitioning, slides.length]);

    // Navigate to previous slide
    const goToPrev = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setShowContent(false); // Hide content immediately
        setDirection("left");
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );

        // After slide transition (700ms), wait 1 second, then show content
        setTimeout(() => {
            setIsTransitioning(false);
            setTimeout(() => {
                setShowContent(true);
            }, 1000); // 1 second delay after slide transition
        }, 700);
    }, [isTransitioning, slides.length]);

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

    // Get the current slide
    const currentSlide = slides[currentIndex];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black mt-16">
            {/* Slides Container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => {
                    // Determine if this slide should be visible
                    const isActive = index === currentIndex;
                    const isPrev = index === (currentIndex - 1 + slides.length) % slides.length;
                    const isNext = index === (currentIndex + 1) % slides.length;

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
                                    quality={90}
                                />
                                {/* Dark overlay for better text readability */}
                                <div className="absolute inset-0 bg-black/40" />
                            </div>

                            {/* Content Overlay - Animated with 1s delay after slide transition */}
                            {isActive && showContent && (
                                <div className="absolute inset-0 flex items-center justify-center pt-20 sm:pt-24 md:pt-28">
                                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="max-w-4xl mx-auto text-center">
                                            {/* Main Content - Slide in from right with fade */}
                                            <h1
                                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-[#FFFFFF] mb-6 leading-tight"
                                                style={{
                                                    animation: "slideInFromRightWithFade 0.8s ease-out forwards",
                                                    opacity: 0,
                                                }}
                                            >
                                                {slide.content}
                                            </h1>

                                            {/* CTA Button - Fade in with slight delay */}
                                            <button
                                                className="px-8 py-3 bg-[#ad8d5e] hover:bg-[#967a4d] text-white font-light  transition-all duration-300 transform hover:scale-105"
                                                style={{
                                                    animation: "fadeInUp 0.6s ease-out 0.3s forwards",
                                                    opacity: 0,
                                                }}
                                            >
                                                Shop now
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
            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
                {/* Previous Button */}
                <button
                    onClick={goToPrev}
                    aria-label="Previous slide"
                    className="pointer-events-auto w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#6a522f]/20 hover:bg-[#ad8d5e] text-white/30  hover:text-white/60 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                {/* Next Button */}
                <button
                    onClick={goToNext}
                    aria-label="Next slide"
                    className="pointer-events-auto w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full  bg-[#6a522f]/20 hover:bg-[#ad8d5e] text-white/30 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
            </div>

            {/* Slide Indicators (Dots) */}
            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 sm:gap-3">
                {slides.map((_, index) => (
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
                        className={`h-2 rounded-full transition-all duration-700 ease-in-out ${index === currentIndex
                            ? "w-8 sm:w-12 bg-[#ad8d5e]"
                            : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>

            {/* Custom CSS Animations */}
            <style jsx>{`
        @keyframes slideInFromRightWithFade {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
