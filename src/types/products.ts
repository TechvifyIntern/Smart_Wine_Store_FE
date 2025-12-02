export interface Products {
  ProductID: number;
  ProductName: string;
  CategoryName: string;
  ImageURL: string;
  CostPrice: number;
  SalePrice: number;
  isActive: boolean;
  Size: number;
  ABV: string;
  DiscountValue: number;
  DiscountTypeID: number | null;
}
