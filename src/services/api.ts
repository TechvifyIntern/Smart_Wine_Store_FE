import axios from "axios";
import { useAppStore } from "@/store/auth";

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

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
