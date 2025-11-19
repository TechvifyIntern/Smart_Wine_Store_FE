import React from "react";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    ProductID: number;
    ProductName: string;
    CategoryID: number;
    ImageURL?: string;
    CostPrice: number;
    SalePrice: number;
    isActive: boolean;
    detail: {
      ProductDetailID: number;
      ProductID: number;
      Size: number;
      ABV: number;
      Producer: string;
      Origin: string;
      Varietal: string;
      DescriptionTitle: string;
      DescriptionContents: string;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border hover:border-primary hover:cursor-pointer rounded p-4">
      <img
        src={product.ImageURL || "/placeholder-image.jpg"}
        alt={product.ProductName}
        className="mx-auto w-full h-96 object-cover rounded"
      />
      <h5 className="mt-3 font-medium tracking-wider text-xl">
        {product.ProductName}
      </h5>
      <p className="text-sm text-gray-600 mb-1">{product.detail.Producer}</p>
      <p className="text-xs text-gray-500 mb-2">
        {product.detail.Origin} • {product.detail.Size}ml • {product.detail.ABV}
        % ABV
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-lg">
            {product.SalePrice.toFixed(2)} VND
          </span>
          {product.CostPrice < product.SalePrice && (
            <span className="line-through text-sm text-gray-400 ml-2">
              {product.CostPrice.toFixed(2)} VND
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-600 line-clamp-2 flex-1">
          {product.detail.DescriptionTitle}
        </p>
        <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 hover:scale-120 transition-all ml-4">
          <ShoppingCart className="w-4 h-4 text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
