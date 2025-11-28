import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { setAuthToken } from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { useCartStore } from "@/store/cart";
import { getCartItems } from "@/services/cart/api";

interface AppState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  authOpen: boolean; // Add authOpen
  authMode: "signin" | "signup" | "forgot" | "otp"; // Add authMode
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  setAuthOpen: (open: boolean) => void; // Add setAuthOpen
  setAuthMode: (mode: "signin" | "signup" | "forgot" | "otp") => void; // Add setAuthMode
}

const decodeToken = (token: string): User | null => {
  try {
    const decodedToken = jwtDecode(token);
    return {
      id: decodedToken.sub,
      email: (decodedToken as any).email,
      roleId: (decodedToken as any).roleId,
    };
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

const fetchCartAndSetStore = async () => {
  try {
    const cartResponse = await getCartItems();
    useCartStore.getState().setItems(cartResponse.data.items);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      authOpen: false, // Initialize authOpen
      authMode: "signin", // Initialize authMode
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        const user = decodeToken(accessToken);
        set({ user, accessToken, refreshToken });
        setAuthToken(accessToken);
        fetchCartAndSetStore();
      },
      setAccessToken: (accessToken) => {
        const user = decodeToken(accessToken);
        set({ user, accessToken });
        setAuthToken(accessToken);
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        setAuthToken("");
        useCartStore.getState().clearCart();
      },
      setAuthOpen: (open) => set({ authOpen: open }), // Implement setAuthOpen
      setAuthMode: (mode) => set({ authMode: mode }), // Implement setAuthMode
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      onRehydrateStorage: (state) => {
        if (state.accessToken) {
          setAuthToken(state.accessToken);
          fetchCartAndSetStore();
        }
      },
    }
  )
);
