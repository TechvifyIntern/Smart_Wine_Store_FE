export const collections = [
  {
    categoryID: 1,
    categoryName: "Red Wine",
    description: "Rich and full-bodied red wines",
    productCount: 24,
    imageURL: "/red-wine-collection.jpg",
    products: Array.from({ length: 10 }).map((_, i) => ({
      id: `r${i + 1}`,
      name: `Red Wine ${i + 1}`,
      imageURL: "/red-wine-collection.jpg",
      Price: `${(500_000 + i * 50_000).toLocaleString('vi-VN')} VND`,
      product_detail: {
        Size: "750ml",
        ABV: `${12 + (i % 3)}%`,
        Origin: "France",
      },
    })),
  },
  {
    categoryID: 2,
    categoryName: "White Wine",
    description: "Crisp and refreshing white wines",
    productCount: 18,
    imageURL: "/white-wine-collection.jpg",
    products: Array.from({ length: 10 }).map((_, i) => ({
      id: `w${i + 1}`,
      name: `White Wine ${i + 1}`,
      imageURL: "/white-wine-collection.jpg",
      Price: `${(450_000 + i * 40_000).toLocaleString('vi-VN')} VND`,
      product_detail: {
        Size: "750ml",
        ABV: `${11 + (i % 2)}%`,
        Origin: "Italy",
      },
    })),
  },
  {
    categoryID: 3,
    categoryName: "Rosé Wine",
    description: "Elegant and balanced rosé wines",
    productCount: 12,
    imageURL: "/rose-wine-collection.jpg",
    products: Array.from({ length: 10 }).map((_, i) => ({
      id: `ro${i + 1}`,
      name: `Rosé Wine ${i + 1}`,
      imageURL: "/rose-wine-collection.jpg",
      Price: `${(480_000 + i * 30_000).toLocaleString('vi-VN')} VND`,
      product_detail: {
        Size: "750ml",
        ABV: `${12 + (i % 2)}%`,
        Origin: "Spain",
      },
    })),
  },
];
