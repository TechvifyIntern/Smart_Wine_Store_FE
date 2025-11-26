"use client";

interface ProductImageProps {
  image?: string;
}

export function ProductImage({ image }: ProductImageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[600px] flex items-center justify-center">
        <img
          src={image || "/placeholder.svg"}
          alt={image}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
}
