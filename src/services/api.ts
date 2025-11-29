import axios from "axios";
import { useAppStore } from "@/store/auth";

export const api = axios.create({
  baseURL: process.env.BE_API_URL || "http://localhost:3000",
});

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    // Get the accessToken from localStorage (only in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAppStore.getState().refreshToken;

        if (!refreshToken) {
          // No refresh token, logout user
          console.error("No refresh token available");
          useAppStore.getState().logout();
          return Promise.reject(error);
        }

        console.log("Attempting to refresh token...");

        // Try to refresh the token
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Refresh response:", response.data);

        if (response.data.success && response.data.data?.accessToken) {
          const newAccessToken = response.data.data.accessToken;
          const newRefreshToken = response.data.data.refreshToken;

          console.log("Token refreshed successfully");

          // Update the tokens in store
          if (newRefreshToken) {
            useAppStore.getState().setTokens(newAccessToken, newRefreshToken);
          } else {
            useAppStore.getState().setAccessToken(newAccessToken);
          }

          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request with new token
          return api(originalRequest);
        } else {
          console.error("Refresh response invalid:", response.data);
          throw new Error("Invalid refresh response");
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        console.error("Token refresh failed:", refreshError);
        if (axios.isAxiosError(refreshError)) {
          console.error("Refresh error response:", refreshError.response?.data);
          console.error("Refresh error status:", refreshError.response?.status);
        }
        useAppStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
