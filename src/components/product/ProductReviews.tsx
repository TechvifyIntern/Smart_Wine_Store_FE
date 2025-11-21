"use client";

import type { Review } from "@/types/product";
import { ThumbsUp } from "lucide-react";

interface ProductReviewsProps {
  reviews: Review[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold">{review.author}</h4>
                <p className="text-sm ">{review.date}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-amber-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="mb-4">{review.comment}</p>
            <button className="flex items-center gap-2 text-sm  hover">
              <ThumbsUp className="w-4 h-4" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
