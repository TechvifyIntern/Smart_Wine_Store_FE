export interface ProductDetail {
  ProductDetailID: string | number;
  ProductID?: string | number;
  Size: number;
  ABV: number;
  Producer: string;
  Origin: string;
  Varietal: string;
  DescriptionTitle: string;
  DescriptionContents: string;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  CategoryName?: string;
  CategoryID: string | number;
  ImageURL?: string;
  CostPrice: number;
  SalePrice: number;
  isActive?: boolean;
  detail?: ProductDetail;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}
