"use client";

import { testimonials } from "@/data/testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Testimonial() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="min-w-6xl mx-20">
        {/* Feedback Section */}
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-center">
            What Our Subscribers Say
          </h3>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full max-w-6xl mx-auto"
            aria-label="Testimonial carousel"
            tabIndex={0}
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((feedback, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4"
                >
                  <div className="bg-background p-6 rounded-lg shadow-sm border border-border h-full">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      &ldquo;{feedback.comment}&rdquo;
                    </p>
                    <p className="font-semibold text-foreground">
                      - {feedback.name}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
