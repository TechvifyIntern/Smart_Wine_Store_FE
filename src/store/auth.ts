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
  _hasHydrated: boolean; // Track hydration status
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  clearAuth: () => void; // Add clearAuth
  setAuthOpen: (open: boolean) => void; // Add setAuthOpen
  setAuthMode: (mode: "signin" | "signup" | "forgot" | "otp") => void; // Add setAuthMode
  setHasHydrated: (hasHydrated: boolean) => void;
}

const decodeToken = (token: string): User | null => {
  try {
    const decodedToken = jwtDecode(token);
    const roleId = (decodedToken as any).roleId;
    return {
      id: decodedToken.sub,
      email: (decodedToken as any).email,
      roleId: String(roleId), // Convert to string for consistency
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
    useCartStore.getState().setEventDiscount(null);
    useCartStore.getState().setEventId(null);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      authOpen: false, // Initialize authOpen
      authMode: "signin", // Initialize authMode
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => {
        const user = decodeToken(accessToken);
        set({ user, accessToken, refreshToken });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
          // Save roleId to localStorage for easy access
          if (user?.roleId) {
            localStorage.setItem("roleId", user.roleId);
          }
        }
        setAuthToken(accessToken);
        fetchCartAndSetStore();
      },
      setAccessToken: (accessToken) => {
        const user = decodeToken(accessToken);
        set({ user, accessToken });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
          // Save roleId to localStorage for easy access
          if (user?.roleId) {
            localStorage.setItem("roleId", user.roleId);
          }
        }
        setAuthToken(accessToken);
      },
      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("roleId");
        }
        setAuthToken("");
      },
      logout: () => {
        get().clearAuth();
        useCartStore.getState().clearCartStore();
      },
      setAuthOpen: (open) => set({ authOpen: open }), // Implement setAuthOpen
      setAuthMode: (mode) => set({ authMode: mode }), // Implement setAuthMode
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error && state) {
            state.setHasHydrated(true);
            if (state.accessToken) {
              setAuthToken(state.accessToken);
              fetchCartAndSetStore();
            }
          }
        };
      },
    }
  )
);
