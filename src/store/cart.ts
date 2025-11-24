import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import {
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  getCartItems,
} from "@/services/cart/api";
import { useAppStore } from "@/store/auth"; // Import useAppStore
import { toast } from "@/hooks/use-toast"; // Import toast

// Define the state shape
interface CartState {
  items: CartItem[];
  isUpdating: boolean;
  setItems: (items: CartItem[]) => void;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
}

// Create the store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isUpdating: false,
      setItems: (items) => set({ items }),
      addToCart: async (product, quantity) => {
        const { user } = useAppStore.getState();
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to add items to your cart.",
            variant: "destructive",
          });
          throw new Error("AUTH_REQUIRED");
        }

        set({ isUpdating: true });

        try {
          // Make the API call to add item to cart
          await addItemToCart(product.ProductID, quantity);

          // After successful modification, refetch the entire cart
          const cartResponse = await getCartItems();
          if (cartResponse.success) {
            set({ items: cartResponse.data.items }); // Update local state with refetched data
            toast({
              title: "Item added to cart",
              description: `${product.ProductName} has been added to your cart.`,
            });
          } else {
            // Handle error during refetch
            toast({
              title: "Error",
              description:
                cartResponse.message ||
                "Failed to update cart after adding item.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to add item to cart:", error);
          toast({
            title: "Error",
            description: "Failed to add item to cart.",
            variant: "destructive",
          });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },
      removeFromCart: async (productId) => {
        set({ isUpdating: true });

        try {
          await removeCartItem(productId);

          const cartResponse = await getCartItems();
          if (cartResponse.success) {
            set({ items: cartResponse.data.items });
            toast({
              title: "Item removed",
              description: "The item has been removed from your cart.",
            });
          } else {
            toast({
              title: "Error",
              description:
                cartResponse.message ||
                "Failed to update cart after removing item.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to remove item from cart:", error);
          toast({
            title: "Error",
            description: "Failed to remove item from cart.",
            variant: "destructive",
          });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },
      updateQuantity: async (productId, quantity) => {
        set({ isUpdating: true });

        try {
          await updateCartItemQuantity(productId, quantity);

          const cartResponse = await getCartItems();
          if (cartResponse.success) {
            set({ items: cartResponse.data.items });
            toast({
              title: "Quantity updated",
              description: "Item quantity has been updated.",
            });
          } else {
            toast({
              title: "Error",
              description:
                cartResponse.message ||
                "Failed to update cart after changing quantity.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Failed to update item quantity in cart:", error);
          toast({
            title: "Error",
            description: "Failed to update item quantity in cart.",
            variant: "destructive",
          });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage", // unique name for the storage
    }
  )
);
