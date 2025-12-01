"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RecommendedProduct } from "@/services/recommendation/api";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Spinner } from "../ui/spinner";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: RecommendedProduct[];
  isLoading: boolean;
}

export function RecommendationModal({
  isOpen,
  onClose,
  products,
  isLoading,
}: RecommendationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-primary">
            🎉 Order Placed Successfully!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            We think you might also love these wines based on your taste.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : products.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {products.map((product) => (
                <CarouselItem
                  key={product.product_id}
                  className="pl-2 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="group relative border rounded-lg p-4 hover:shadow-md transition-all bg-card h-full flex flex-col">
                    <div className="relative h-40 w-full mb-3 overflow-hidden rounded-md">
                      <img
                        src={product.img_link}
                        alt={product.name}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <h4 className="font-semibold text-sm line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {product.volumn}ml
                        </span>
                        <span className="text-muted-foreground">
                          {product.abv}%
                        </span>
                      </div>
                      <div className="font-bold text-primary">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() =>
                        window.open(`/products/${product.product_id}`, "_blank")
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground py-10">
            No recommendations available.
          </p>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button onClick={onClose} size="lg" className="w-full sm:w-auto">
            Complete & Go to Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
