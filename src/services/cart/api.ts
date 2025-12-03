import { api } from "@/services/api";

export const addToCart = async (productId: number, quantity: number) => {
  try {
    const response = await api.post("/cart/items", {
      ProductID: productId,
      Quantity: quantity,
    });
    return response.data;
  } catch (error) {
    console.error("API Error - addToCart:", error);
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("API Error - getCartItems:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  productId: number,
  quantity: number
) => {
  try {
    const response = await api.put(`/cart/items/${productId}`, {
      Quantity: quantity,
    });
    return response.data;
  } catch (error) {
    console.error("API Error - updateCartItemQuantity:", error);
    throw error;
  }
};

export const removeCartItem = async (productId: number) => {
  try {
    const response = await api.delete(`/cart/items/${productId}`);
    return response;
  } catch (error) {
    console.error("API Error - removeCartItem:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");
    return response;
  } catch (error) {
    console.error("API Error - clearCart:", error);
    throw error;
  }
};
