import { ProductImage } from "@/components/product/ProductImage";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { getProductById } from "@/services/product/api";
import { Product } from "@/types/product";
import { ApiResponse } from "@/types/responses";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  try {
    const productData: ApiResponse<Product> = await getProductById(id);
    const product = productData.data;

    return (
      <main className="min-h-screen mt-28">
        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <ProductImage image={product.ImageURL} />
            <ProductInfo product={product} />
          </div>

          {/* Tabs Section */}
          <ProductTabs product={product} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return (
      <main className="min-h-screen mt-28">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p>Sorry, we couldn't find the product you're looking for.</p>
        </div>
      </main>
    );
  }
}
