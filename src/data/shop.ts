export const wineCategories = [
  { id: 2, name: "White Wine", parentId: 1, count: 18 },
  { id: 3, name: "Rosé Wine", parentId: 1, count: 12 },
  { id: 4, name: "Sparkling", parentId: 1, count: 8 },
];

export const whiskyCategories = [
  { id: 6, name: "Scotch Whisky", parentId: 5, count: 18 },
  { id: 7, name: "Irish Whisky", parentId: 5, count: 12 },
  { id: 8, name: "Bourbon", parentId: 5, count: 8 },
];


export const sizes = [
  { id: 1, label: "375ml", count: 15 },
  { id: 2, label: "750ml", count: 35 },
  { id: 3, label: "1.5L", count: 10 },
  { id: 4, label: "3L", count: 5 },
];

export const colors = [
  { id: 1, label: "Red", count: 25 },
  { id: 2, label: "White", count: 18 },
  { id: 3, label: "Rosé", count: 12 },
  { id: 4, label: "Orange", count: 3 },
];

export const brands = [
  { id: 1, name: "Villenoir", count: 10 },
  { id: 2, name: "Casa Blanca", count: 8 },
  { id: 3, name: "Summer Rose", count: 7 },
  { id: 4, name: "Premium Wines", count: 12 },
];

// Products with nested details (API-like structure)
export const products = [
  {
    ProductID: 1,
    ProductName: "Premium Cabernet Sauvignon",
    CategoryID: 2, // White Wine category
    ImageURL: "/wine-bottle-cabernet-sauvignon.jpg",
    CostPrice: 99.99,
    SalePrice: 129.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 1,
      ProductID: 1,
      Size: 750,
      ABV: 14.5,
      Producer: "Villenoir Estate",
      Origin: "Napa Valley, California",
      Varietal: "Cabernet Sauvignon",
      DescriptionTitle: "Premium Red Wine Collection",
      DescriptionContents: "Discover the perfect balance of tradition and innovation in every bottle. Our premium selection represents years of careful cultivation and expert craftsmanship."
    }
  },
  {
    ProductID: 2,
    ProductName: "Crisp Chardonnay",
    CategoryID: 2, // White Wine category
    ImageURL: "/white-wine-collection-bottles.jpg",
    CostPrice: 69.99,
    SalePrice: 89.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 2,
      ProductID: 2,
      Size: 750,
      ABV: 13.0,
      Producer: "Casa Blanca Winery",
      Origin: "Sonoma Valley, California",
      Varietal: "Chardonnay",
      DescriptionTitle: "Elegant White Wine Selection",
      DescriptionContents: "Refined white wine with crisp flavors and aromatic complexity, perfect for any occasion."
    }
  },
  {
    ProductID: 3,
    ProductName: "Elegant Rosé",
    CategoryID: 3, // Rosé Wine category
    ImageURL: "/white-wine-collection-bottles.jpg",
    CostPrice: 54.99,
    SalePrice: 69.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 3,
      ProductID: 3,
      Size: 750,
      ABV: 12.5,
      Producer: "Summer Rose Vineyard",
      Origin: "Provence, France",
      Varietal: "Grenache",
      DescriptionTitle: "Beautiful Rosé Wine Collection",
      DescriptionContents: "Light and refreshing rosé wine with bright berry flavors and elegant finish."
    }
  },
  {
    ProductID: 4,
    ProductName: "Bold Merlot",
    CategoryID: 2, // White Wine category
    ImageURL: "/wine-bottle-cabernet-sauvignon.jpg",
    CostPrice: 94.99,
    SalePrice: 119.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 4,
      ProductID: 4,
      Size: 750,
      ABV: 13.8,
      Producer: "Villenoir Estate",
      Origin: "Piedmont, Italy",
      Varietal: "Merlot",
      DescriptionTitle: "Full-Bodied Red Wine Experience",
      DescriptionContents: "Rich and velvety merlot with deep fruit flavors and smooth tannins."
    }
  },
  {
    ProductID: 5,
    ProductName: "Savory Sauvignon Blanc",
    CategoryID: 2, // White Wine category
    ImageURL: "/white-wine-collection-bottles.jpg",
    CostPrice: 62.99,
    SalePrice: 79.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 5,
      ProductID: 5,
      Size: 750,
      ABV: 12.0,
      Producer: "Casa Blanca Winery",
      Origin: "Marlborough, New Zealand",
      Varietal: "Sauvignon Blanc",
      DescriptionTitle: "Crisp White Wine Collection",
      DescriptionContents: "Zesty and refreshing sauvignon blanc with vibrant citrus notes and herbaceous undertones."
    }
  },
  {
    ProductID: 6,
    ProductName: "Vintage Pinot Noir",
    CategoryID: 2, // White Wine category
    ImageURL: "/wine-vineyard-landscape-winery-elegant.jpg",
    CostPrice: 149.99,
    SalePrice: 189.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 6,
      ProductID: 6,
      Size: 750,
      ABV: 14.2,
      Producer: "Premium Wines Estate",
      Origin: "Burgundy, France",
      Varietal: "Pinot Noir",
      DescriptionTitle: "Vintage Collection Showcase",
      DescriptionContents: "Elegant vintage pinot noir with delicate flavors and exceptional aging potential."
    }
  },
  {
    ProductID: 7,
    ProductName: "Classic Pinot Grigio",
    CategoryID: 2, // White Wine category
    ImageURL: "/white-wine-collection-bottles.jpg",
    CostPrice: 50.99,
    SalePrice: 64.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 7,
      ProductID: 7,
      Size: 750,
      ABV: 12.8,
      Producer: "Casa Blanca Winery",
      Origin: "Friuli, Italy",
      Varietal: "Pinot Grigio",
      DescriptionTitle: "Light and Crisp White Wine",
      DescriptionContents: "Clean and light pinot grigio with bright acidity and mineral notes."
    }
  },
  {
    ProductID: 8,
    ProductName: "Sweet Champagne",
    CategoryID: 4, // Sparkling category
    ImageURL: "/wine-vineyard-landscape-winery-elegant.jpg",
    CostPrice: 239.99,
    SalePrice: 299.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 8,
      ProductID: 8,
      Size: 750,
      ABV: 12.0,
      Producer: "Premium Wines Estate",
      Origin: "Champagne, France",
      Varietal: "Chardonnay",
      DescriptionTitle: "Luxury Sparkling Wine Collection",
      DescriptionContents: "Prestigious champagne with fine bubbles, complex flavors, and celebratory elegance."
    }
  },
  {
    ProductID: 9,
    ProductName: "Dry Prosecco",
    CategoryID: 4, // Sparkling category
    ImageURL: "/wine-vineyard-landscape-winery-elegant.jpg",
    CostPrice: 39.99,
    SalePrice: 49.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 9,
      ProductID: 9,
      Size: 750,
      ABV: 11.0,
      Producer: "Summer Rose Vineyard",
      Origin: "Veneto, Italy",
      Varietal: "Glera",
      DescriptionTitle: "Italian Sparkling Wine Treasures",
      DescriptionContents: "Charming prosecco with lively bubbles, fruity flavors, and affordable luxury."
    }
  },
  {
    ProductID: 10,
    ProductName: "Robust Syrah",
    CategoryID: 2, // White Wine category
    ImageURL: "/wine-bottle-cabernet-sauvignon.jpg",
    CostPrice: 119.99,
    SalePrice: 149.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 10,
      ProductID: 10,
      Size: 750,
      ABV: 14.0,
      Producer: "Villenoir Estate",
      Origin: "Rhone Valley, France",
      Varietal: "Syrah",
      DescriptionTitle: "Bold Red Wine Adventures",
      DescriptionContents: "Powerful syrah with dark fruit flavors, peppery spices, and robust structure."
    }
  },
  {
    ProductID: 11,
    ProductName: "Refreshing Riesling",
    CategoryID: 2, // White Wine category
    ImageURL: "/white-wine-collection-bottles.jpg",
    CostPrice: 43.99,
    SalePrice: 54.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 11,
      ProductID: 11,
      Size: 750,
      ABV: 11.5,
      Producer: "Casa Blanca Winery",
      Origin: "Mosel, Germany",
      Varietal: "Riesling",
      DescriptionTitle: "Refreshing White Wine Discovery",
      DescriptionContents: "Delicate riesling with sweet fruit aromas and balanced acidity for versatile pairing."
    }
  },
  {
    ProductID: 12,
    ProductName: "Fruity Cabernet Franc",
    CategoryID: 2, // White Wine category
    ImageURL: "/wine-vineyard-landscape-winery-elegant.jpg",
    CostPrice: 111.99,
    SalePrice: 139.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 12,
      ProductID: 12,
      Size: 750,
      ABV: 13.5,
      Producer: "Premium Wines Estate",
      Origin: "Loire Valley, France",
      Varietal: "Cabernet Franc",
      DescriptionTitle: "Unique Red Wine Experience",
      DescriptionContents: "Distinctive cabernet franc with vibrant berry flavors and herbal complexity."
    }
  },
  {
    ProductID: 13,
    ProductName: "Blush Zinfandel",
    CategoryID: 3, // Rosé Wine category
    ImageURL: "/wine-vineyard-landscape-winery-elegant.jpg",
    CostPrice: 47.99,
    SalePrice: 59.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 13,
      ProductID: 13,
      Size: 750,
      ABV: 13.2,
      Producer: "Summer Rose Vineyard",
      Origin: "California, USA",
      Varietal: "Zinfandel",
      DescriptionTitle: "Premium Rosé Wine Collection",
      DescriptionContents: "Rose zin with juicy red fruit flavors, soft tannins, and summer appeal."
    }
  },
  {
    ProductID: 14,
    ProductName: "Iconic Bordeaux Blend",
    CategoryID: 2, // White Wine category
    ImageURL: "/wine-bottle-cabernet-sauvignon.jpg",
    CostPrice: 319.99,
    SalePrice: 399.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 14,
      ProductID: 14,
      Size: 750,
      ABV: 13.9,
      Producer: "Villenoir Estate",
      Origin: "Bordeaux, France",
      Varietal: "Bordeaux Blend",
      DescriptionTitle: "Iconic Fine Wine Collection",
      DescriptionContents: "Prestigious bordeaux blend with exceptional depth, aging potential, and classic French elegance."
    }
  },
  {
    ProductID: 15,
    ProductName: "Aromatic Gewürztraminer",
    CategoryID: 2, // White Wine category
    ImageURL: "/white-wine-collection-bottles.jpg",
    CostPrice: 59.99,
    SalePrice: 74.99,
    isActive: true,
    Product_Detail: {
      ProductDetailID: 15,
      ProductID: 15,
      Size: 750,
      ABV: 12.3,
      Producer: "Casa Blanca Winery",
      Origin: "Alsace, France",
      Varietal: "Gewürztraminer",
      DescriptionTitle: "Aromatic White Wine Specialties",
      DescriptionContents: "Distinctively aromatic gewürztraminer with lychee, rose, and spice notes for unique flavor experience."
    }
  },
];
