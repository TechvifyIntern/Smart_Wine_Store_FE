export const collections = [
  {
    categoryId: 1,
    categoryName: "Red Wine",
    description: "Rich and full-bodied red wines",
    productCount: 24,
    imageUrl: "/red-wine-collection.jpg",
    products: Array.from({ length: 10 }).map((_, i) => ({
      productId: `r${i + 1}`,
      productName: `Red Wine ${i + 1}`,
      imageUrl: "/red-wine-collection.jpg",
      salePrice: `${(500_000 + i * 50_000).toLocaleString('vi-VN')} VND`,
      productDetail: {
        size: "750ml",
        abv: `${12 + (i % 3)}%`,
        origin: "France",
      },
    })),
  },
  {
    categoryId: 2,
    categoryName: "White Wine",
    description: "Crisp and refreshing white wines",
    productCount: 18,
    imageUrl: "/white-wine-collection.jpg",
    products: Array.from({ length: 10 }).map((_, i) => ({
      productId: `w${i + 1}`,
      productName: `White Wine ${i + 1}`,
      imageUrl: "/white-wine-collection.jpg",
      salePrice: `${(450_000 + i * 40_000).toLocaleString('vi-VN')} VND`,
      productDetail: {
        size: "750ml",
        abv: `${11 + (i % 2)}%`,
        origin: "Italy",
      },
    })),
  },
  {
    categoryId: 3,
    categoryName: "Rosé Wine",
    description: "Elegant and balanced rosé wines",
    productCount: 12,
    imageUrl: "/rose-wine-collection.jpg",
    products: Array.from({ length: 10 }).map((_, i) => ({
      productId: `ro${i + 1}`,
      productName: `Rosé Wine ${i + 1}`,
      imageUrl: "/rose-wine-collection.jpg",
      salePrice: `${(480_000 + i * 30_000).toLocaleString('vi-VN')} VND`,
      productDetail: {
        size: "750ml",
        abv: `${12 + (i % 2)}%`,
        origin: "Spain",
      },
    })),
  },
];
