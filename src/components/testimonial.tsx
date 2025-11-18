"use client";

import { testimonials } from "@/data/testimonials";

export function Testimonial() {
  // Duplicate testimonials for seamless infinite scroll
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Feedback Section */}
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-center">
            What Our Subscribers Say
          </h3>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-left-to-right">
              {doubledTestimonials.map((feedback, index) => (
                <div
                  key={index}
                  className="shrink-0 bg-background p-6 rounded-lg shadow-sm border border-border mx-4"
                  style={{ width: "calc(33.333% - 2rem)" }}
                >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
