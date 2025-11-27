export interface ProductDetail {
  Size?: number;
  ABV?: number;
  Producer?: string;
  Origin?: string;
  Varietal?: string;
  DescriptionTitle?: string;
  DescriptionContents?: string;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  CategoryID?: number | string;
  CategoryName?: string;
  ImageURL?: string;
  CostPrice: string | number;
  SalePrice: number;
  isActive?: boolean;
  detail?: ProductDetail;
}

const products: Product[] = [
  {
    ProductID: 1,
    ProductName: "Chateau Margaux 2015",
    CategoryName: "Red Wines",
    ImageURL: "https://picsum.photos/seed/margaux/200/200",
    CostPrice: 250000,
    SalePrice: 350000,
    isActive: true,
  },
  {
    ProductID: 2,
    ProductName: "Domaine de la Romanée-Conti 2018",
    CategoryName: "Red Wines",
    ImageURL: "https://picsum.photos/seed/romanee/200/200",
    CostPrice: 450000,
    SalePrice: 650000,
    isActive: true,
  },
  {
    ProductID: 3,
    ProductName: "Opus One 2019",
    CategoryName: "Red Wines",
    ImageURL: "https://picsum.photos/seed/opus/200/200",
    CostPrice: 300000,
    SalePrice: 480000,
    isActive: true,
  },
  {
    ProductID: 4,
    ProductName: "Penfolds Grange 2016",
    CategoryName: "Red Wines",
    ImageURL: "https://picsum.photos/seed/grange/200/200",
    CostPrice: 350000,
    SalePrice: 550000,
    isActive: true,
  },
  {
    ProductID: 5,
    ProductName: "Chardonnay Reserve Sonoma",
    CategoryName: "White Wines",
    ImageURL: "https://picsum.photos/seed/chard/200/200",
    CostPrice: 120000,
    SalePrice: 220000,
    isActive: true,
  },
  {
    ProductID: 6,
    ProductName: "Sauvignon Blanc Marlborough",
    CategoryName: "White Wines",
    ImageURL: "https://picsum.photos/seed/sb/200/200",
    CostPrice: 110000,
    SalePrice: 200000,
    isActive: true,
  },
  {
    ProductID: 7,
    ProductName: "Champagne Brut Prestige",
    CategoryName: "Sparkling Wines",
    ImageURL: "https://picsum.photos/seed/champ/200/200",
    CostPrice: 180000,
    SalePrice: 320000,
    isActive: false,
  },
  {
    ProductID: 8,
    ProductName: "Prosecco DOCG",
    CategoryName: "Sparkling Wines",
    ImageURL: "https://picsum.photos/seed/prosecco/200/200",
    CostPrice: 80000,
    SalePrice: 150000,
    isActive: true,
  },
  {
    ProductID: 9,
    ProductName: "Rose d'Anjou Loire Valley",
    CategoryName: "Rosé Wines",
    ImageURL: "https://picsum.photos/seed/rose/200/200",
    CostPrice: 95000,
    SalePrice: 180000,
    isActive: true,
  },
  {
    ProductID: 10,
    ProductName: "Pinot Noir California",
    CategoryName: "Red Wines",
    ImageURL: "https://picsum.photos/seed/pinot/200/200",
    CostPrice: 140000,
    SalePrice: 260000,
    isActive: true,
  },
];

export default products;
