import { api } from "@/services/api";
import { ApiResponse } from "@/types/responses";
import {
  UserProfile,
  UserAddress,
  Order,
  AddAddressPayload,
  UpdateAddressPayload,
  UpdateProfilePayload, // Import UpdateProfilePayload
} from "@/types/profile"; // Import AddAddressPayload

export const getProfile = async (): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await api.get<ApiResponse<UserProfile>>("/profile");
    return response.data;
  } catch (error) {
    console.error("API Error - getProfile:", error);
    throw error;
  }
};

export const updateProfile = async (
  profileData: UpdateProfilePayload
): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await api.put<ApiResponse<UserProfile>>(
      "/profile",
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("API Error - updateProfile:", error);
    throw error;
  }
};

export const getUserAddress = async (): Promise<ApiResponse<UserAddress[]>> => {
  try {
    const response =
      await api.get<ApiResponse<UserAddress[]>>("/user-addresses");
    return response.data;
  } catch (error) {
    console.error("API Error - getUserAddress:", error);
    throw error;
  }
};

export const getUserOrder = async (): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await api.get<ApiResponse<Order[]>>("/orders");
    return response.data;
  } catch (error) {
    console.error("API Error - getUserOrder:", error);
    throw error;
  }
};

export const addAddress = async (
  addressData: AddAddressPayload
): Promise<ApiResponse<UserAddress>> => {
  try {
    const response = await api.post<ApiResponse<UserAddress>>(
      "/user-addresses",
      addressData
    );
    return response.data;
  } catch (error) {
    console.error("API Error - addAddress:", error);
    throw error;
  }
};

export const updateAddress = async (
  addressData: UpdateAddressPayload,
  addressId: number
): Promise<ApiResponse<UserAddress>> => {
  try {
    const response = await api.put<ApiResponse<UserAddress>>(
      `/user-addresses/${addressId}`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.error("API Error - updateAddress:", error);
    throw error;
  }
};

export const deleteAddress = async (
  addressId: number
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(`/user-addresses/${addressId}`);
    return {
      success: true,
      statusCode: response.status,
      message: "Address deleted successfully.",
      data: undefined,
    };
  } catch (error) {
    console.error("API Error - deleteAddress:", error);
    throw error;
  }
};

export const updateDefaultAddress = async (addressId: number) => {
  try {
    const response = await api.patch(`/user-addresses/${addressId}/default`);
    return {
      success: true,
      statusCode: response.status,
      message: "Address deleted successfully.",
      data: undefined,
    };
  } catch (error) {
    console.error("API Error - updateDefaultAddress:", error);
    throw error;
  }
};
