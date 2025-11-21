import { ProductImage } from "@/components/product/ProductImage";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import {
  mockProduct,
  mockReviews,
  relatedProducts,
} from "@/data/product_detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen mt-28">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <ProductImage image={mockProduct.ImageURL} />
          <ProductInfo product={mockProduct} />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={mockProduct} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />

        {/* Reviews Section */}
        <ProductReviews reviews={mockReviews} />
      </div>
    </main>
  );
}
