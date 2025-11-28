import { Product } from "./product-detail";

export interface Cart {
  CartID?: number;
  UserID?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface CartItem {
  CartItemID: number;
  CartID: number;
  ProductID: number;
  Quantity: number;
  product: Product;
}
