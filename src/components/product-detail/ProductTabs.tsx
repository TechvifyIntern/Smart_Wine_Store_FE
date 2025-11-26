"use client";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product-detail";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  if (!product.detail) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-2">Description</h3>
      <div className="space-y-2 text-lg ml-6 mb-4">
        <p>{product.detail.DescriptionContents}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-semibold">Producer:</span>{" "}
            {product.detail.Producer}
          </li>
          <li>
            <span className="font-semibold">Origin:</span>{" "}
            {product.detail.Origin}
          </li>
          <li>
            <span className="font-semibold">Varietal:</span>{" "}
            {product.detail.Varietal}
          </li>
          <li>
            <span className="font-semibold">Alcohol Content:</span>{" "}
            {product.detail.ABV}%
          </li>
        </ul>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-xl z">Shipping</h4>
        <ul className="list-disc pl-5 space-y-2 ml-6">
          <li>
            <strong>Standard Shipping:</strong> Cost: {formatCurrency(200000)},
            Estimated Delivery: 5 business days
          </li>
          <li>
            <strong>Express Shipping:</strong> Cost: {formatCurrency(400000)},
            Estimated Delivery: 2-3 business days
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-xl">Size Chart</h4>
        <ul className="list-disc pl-5 space-y-2 ml-6">
          <li>Wine bottle dimensions: 750 ml standard bottle</li>
          <li>Height: 29.5 cm | Diameter: 8.5 cm</li>
        </ul>
      </div>
    </div>
  );
}
