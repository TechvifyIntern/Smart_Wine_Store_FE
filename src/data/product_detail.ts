import type { Product, Review } from "@/types/product-detail";

export const mockProduct: Product = {
  ProductID: 1,
  ProductName: "Exquisite Collection Shiraz",
  CategoryID: "red-wines",
  ImageURL: "/ros--wine-collection-bottles.jpg",
  CostPrice: "79.99",
  SalePrice: 60.99,
  Product_Detail: {
    ProductDetailID: "1",
    Size: 750,
    ABV: 14.5,
    Producer: "Premium Wine Estate",
    Origin: "Barossa Valley, Australia",
    Varietal: "Shiraz",
    DescriptionTitle: "Sophisticated Blend",
    DescriptionContents:
      "A sophisticated blend of full-bodied Shiraz with rich berry notes and subtle oak aging. Perfect for collectors and connoisseurs alike.",
  },
};

export const relatedProducts: Product[] = [
  {
    ProductID: 2,
    ProductName: "Cabernet Sauvignon Reserve",
    CategoryID: "red-wines",
    ImageURL: "/ros--wine-collection-bottles.jpg",
    CostPrice: "70.00",
    SalePrice: 89.99,
    Product_Detail: {
      ProductDetailID: "2",
      Size: 750,
      ABV: 13.8,
      Producer: "Estate Vineyards",
      Origin: "Napa Valley, USA",
      Varietal: "Cabernet Sauvignon",
      DescriptionTitle: "Premium Cabernet",
      DescriptionContents:
        "A premium Cabernet with complex layers of dark fruit and oak.",
    },
  },
  {
    ProductID: 3,
    ProductName: "Pinot Noir Selection",
    CategoryID: "red-wines",
    ImageURL: "/ros--wine-collection-bottles.jpg",
    CostPrice: "50.00",
    SalePrice: 64.99,
    Product_Detail: {
      ProductDetailID: "3",
      Size: 750,
      ABV: 13.5,
      Producer: "Vineyard Masters",
      Origin: "Central Coast, USA",
      Varietal: "Pinot Noir",
      DescriptionTitle: "Elegant Selection",
      DescriptionContents:
        "An elegant Pinot Noir with balanced acidity and red fruit notes.",
    },
  },
  {
    ProductID: 4,
    ProductName: "Chardonnay Premium",
    CategoryID: "white-wines",
    ImageURL: "/ros--wine-collection-bottles.jpg",
    CostPrice: "40.00",
    SalePrice: 54.99,
    Product_Detail: {
      ProductDetailID: "4",
      Size: 750,
      ABV: 13.2,
      Producer: "White Wine Estates",
      Origin: "Sonoma County, USA",
      Varietal: "Chardonnay",
      DescriptionTitle: "Crisp Premium",
      DescriptionContents: "A crisp Chardonnay with butter and apple flavors.",
    },
  },
  {
    ProductID: 5,
    ProductName: "Chardonnay Premium",
    CategoryID: "white-wines",
    ImageURL: "/ros--wine-collection-bottles.jpg",
    CostPrice: "40.00",
    SalePrice: 54.99,
    Product_Detail: {
      ProductDetailID: "4",
      Size: 750,
      ABV: 13.2,
      Producer: "White Wine Estates",
      Origin: "Sonoma County, USA",
      Varietal: "Chardonnay",
      DescriptionTitle: "Crisp Premium",
      DescriptionContents: "A crisp Chardonnay with butter and apple flavors.",
    },
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    author: "John Smith",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Absolutely exceptional wine! The complexity and depth of flavor is remarkable. Highly recommended for any serious collector.",
    helpful: 42,
  },
  {
    id: "2",
    author: "Sarah Johnson",
    rating: 4,
    date: "1 month ago",
    comment:
      "Great quality wine with excellent taste profile. Perfect for special occasions.",
    helpful: 28,
  },
  {
    id: "3",
    author: "Michael Davis",
    rating: 5,
    date: "1 month ago",
    comment:
      "Outstanding vintage! The balance of tannins and fruit is perfect. Worth every penny.",
    helpful: 35,
  },
];
