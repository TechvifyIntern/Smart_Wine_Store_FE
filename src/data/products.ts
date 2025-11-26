export interface Product {
  ProductID: number;
  ProductName: string;
  CategoryID: string | number;
  ImageURL?: string;
  CostPrice: string | number;
  SalePrice: number;
  isActive?: boolean;
}

const products: Product[] = [
  {
    ProductID: 1,
    ProductName: "Chateau Margaux 2015",
    CategoryID: 1,
    ImageURL: "https://picsum.photos/seed/margaux/200/200",
    CostPrice: 250000,
    SalePrice: 350000,
    isActive: true,
  },
  {
    ProductID: 2,
    ProductName: "Domaine de la Romanée-Conti 2018",
    CategoryID: 1,
    ImageURL: "https://picsum.photos/seed/romanee/200/200",
    CostPrice: 450000,
    SalePrice: 650000,
    isActive: true,
  },
  {
    ProductID: 3,
    ProductName: "Opus One 2019",
    CategoryID: 1,
    ImageURL: "https://picsum.photos/seed/opus/200/200",
    CostPrice: 300000,
    SalePrice: 480000,
    isActive: true,
  },
  {
    ProductID: 4,
    ProductName: "Penfolds Grange 2016",
    CategoryID: 1,
    ImageURL: "https://picsum.photos/seed/grange/200/200",
    CostPrice: 350000,
    SalePrice: 550000,
    isActive: true,
  },
  {
    ProductID: 5,
    ProductName: "Chardonnay Reserve Sonoma",
    CategoryID: 2,
    ImageURL: "https://picsum.photos/seed/chard/200/200",
    CostPrice: 120000,
    SalePrice: 220000,
    isActive: true,
  },
  {
    ProductID: 6,
    ProductName: "Sauvignon Blanc Marlborough",
    CategoryID: 2,
    ImageURL: "https://picsum.photos/seed/sb/200/200",
    CostPrice: 110000,
    SalePrice: 200000,
    isActive: true,
  },
  {
    ProductID: 7,
    ProductName: "Champagne Brut Prestige",
    CategoryID: 3,
    ImageURL: "https://picsum.photos/seed/champ/200/200",
    CostPrice: 180000,
    SalePrice: 320000,
    isActive: false,
  },
  {
    ProductID: 8,
    ProductName: "Prosecco DOCG",
    CategoryID: 3,
    ImageURL: "https://picsum.photos/seed/prosecco/200/200",
    CostPrice: 80000,
    SalePrice: 150000,
    isActive: true,
  },
  {
    ProductID: 9,
    ProductName: "Rose d'Anjou Loire Valley",
    CategoryID: 4,
    ImageURL: "https://picsum.photos/seed/rose/200/200",
    CostPrice: 95000,
    SalePrice: 180000,
    isActive: true,
  },
  {
    ProductID: 10,
    ProductName: "Pinot Noir California",
    CategoryID: 1,
    ImageURL: "https://picsum.photos/seed/pinot/200/200",
    CostPrice: 140000,
    SalePrice: 260000,
    isActive: true,
  },
];

export default products;
