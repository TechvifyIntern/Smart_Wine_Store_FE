'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex flex-col justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 to-background" />
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm tracking-widest text-primary uppercase">Heritage & Craftsmanship</p>
              <h1 className="text-5xl md:text-6xl font-serif text-balance leading-tight">
                Refinement in a bottle
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experience the pinnacle of winemaking excellence with our carefully curated collection of premium vintages.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Collection
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            <img
              src="/premium-wine-bottle-dark-elegant-luxury.jpg"
              alt="Premium wine bottle"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <p className="text-xs text-muted-foreground">Scroll to explore</p>
        <ChevronDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  )
}
