import { Product } from "./product";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}