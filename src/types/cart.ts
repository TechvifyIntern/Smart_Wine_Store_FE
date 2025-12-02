import { Product } from "./product-detail";

export interface Cart {
  CartID?: number;
  UserID?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  membershipDiscounts?: Record<string, number>;
  eventDiscount?: number;
  userTier?: string;
}

export interface CartItem {
  CartItemID: number;
  CartID: number;
  ProductID: number;
  Quantity: number;
  product: Product;
}
