import { create } from 'zustand';
import { Product } from '@/types/product';
import { CartItem } from '@/types/cart';

// Define the state shape
interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Create the store
export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.ProductID === product.ProductID
      );
      if (existingItem) {
        // If item already exists, increment quantity
        return {
          items: state.items.map((item) =>
            item.product.ProductID === product.ProductID
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        // If item doesn't exist, add it to the cart
        const newItem: CartItem = {
          id: product.ProductID, // Assuming ProductID is unique
          product,
          quantity,
        };
        return { items: [...state.items, newItem] };
      }
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.ProductID !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.ProductID === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
}));
