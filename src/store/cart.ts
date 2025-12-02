import { create } from "zustand";
import { CartItem } from "@/types/cart";
import {
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  getCartItems,
  clearCart as clearCartAPI,
} from "@/services/cart/api";
import { useAppStore } from "@/store/auth"; // Import useAppStore
import { toast } from "@/hooks/use-toast"; // Import toast
import { persist } from "zustand/middleware";

// Define the state shape
interface CartState {
  items: CartItem[];
  isUpdating: boolean;
  eventDiscount: number | null;
  eventId: number | null;
  setItems: (items: CartItem[]) => void;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setEventDiscount: (discount: number | null) => void;
  setEventId: (id: number | null) => void;
}

// Create the store
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isUpdating: false,
      eventDiscount: null,
      eventId: null,
      setItems: (items) => set({ items }),
      setEventDiscount: (discount) => set({ eventDiscount: discount }),
      setEventId: (id) => set({ eventId: id }),
      addToCart: async (productId, quantity) => {
        const { user } = useAppStore.getState();
        if (!user) {
          toast({
            title: "Login Required",
            description: "Please log in to add items to your cart.",
            variant: "destructive",
          });
          throw new Error("AUTH_REQUIRED");
        }

        set({ isUpdating: true });

        try {
          // Make the API call to add item to cart first
          await addToCart(productId, quantity);

          // After successful addition, refetch the entire cart
          const cartResponse = await getCartItems();
          if (cartResponse.success) {
            set({ items: cartResponse.data.items });
            toast({
              title: "Item added to cart",
              description: `Product has been added to your cart.`,
            });
          } else {
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
      clearCart: async () => {
        set({ isUpdating: true });
        try {
          await clearCartAPI();
          set({ items: [] });
          toast({
            title: "Cart cleared",
            description: "All items have been removed from your cart.",
          });
        } catch (error) {
          console.error("Failed to clear cart:", error);
          toast({
            title: "Error",
            description: "Failed to clear cart.",
            variant: "destructive",
          });
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
