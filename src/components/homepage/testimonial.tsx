"use client";

import { testimonials } from "@/data/testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLocale } from "@/contexts/LocaleContext";

export function Testimonial() {
  const { t } = useLocale();

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Feedback Section */}
        <div className="space-y-6 sm:space-y-8">
          <h3 className="text-xl sm:text-2xl font-serif text-center">
            {t("testimonials.title")}
          </h3>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full mx-auto"
            aria-label="Testimonial carousel"
            tabIndex={0}
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {testimonials.map((feedback, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="bg-background p-4 sm:p-6 rounded-lg shadow-sm border border-border h-full">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500 text-sm sm:text-base">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-4">
                      &ldquo;{feedback.comment}&rdquo;
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-foreground">
                      - {feedback.name}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
