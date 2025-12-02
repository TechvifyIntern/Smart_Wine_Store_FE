import { api } from "@/services/api";
import {
  SignInInput,
  SignUpInput,
  ResetPasswordInput,
  ForgotPasswordInput,
} from "@/validations/auth";
import { ApiResponse } from "@/types/responses"; // Import ApiResponse

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const signIn = async (
  data: SignInInput
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (data: SignUpInput): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otpCode: otp,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (
  token: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await api.post("/auth/refresh", { refreshToken: token });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (
  data: ChangePasswordPayload
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.put("/profile/change-password", data);
    return response.data;
  } catch (error) {
    console.error("API Error - changePassword:", error);
    throw error;
  }
};

export const forgotPassword = async (email: ForgotPasswordInput) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (resetData: ResetPasswordInput) => {
  const response = await api.post("/auth/reset-password", resetData);
  return response.data;
};
