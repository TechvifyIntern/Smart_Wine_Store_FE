import axios from "axios";
import { useAppStore } from "@/store/auth";
import { refreshToken as refreshTokenApi } from "@/services/auth/api";

export const api = axios.create({
  baseURL: process.env.BE_API_URL || "http://localhost:3000",
});

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    // Get the accessToken from the store using getState()
    const accessToken = useAppStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAppStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await refreshTokenApi(refreshToken);
          useAppStore.getState().setTokens(response.accessToken, response.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          useAppStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
