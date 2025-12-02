import { api } from "../api";
import { ApiResponse } from "@/types/responses";

export interface CheckoutItem {
  ProductID: number;
  Quantity: number;
}

export interface CheckoutPayload {
  UserName: string;
  Email: string;
  PhoneNumber: string;
  OrderStreetAddress: string;
  OrderWard: string;
  OrderDistrict: string;
  OrderProvince: string;
  Items: CheckoutItem[];
  StatusID?: number;
  EventID?: number | null;
  PaymentMethodID: number;
  ReturnUrl: string;
}

export type CheckoutResponse = ApiResponse<{ paymentUrl?: string } | null>;

export const checkout = async (
  payload: CheckoutPayload
): Promise<CheckoutResponse> => {
  try {
    const response = await api.post("/orders", payload);
    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || {
        success: false,
        statusCode: 500,
        message: "An unknown error occurred during checkout.",
        data: null,
      }
    );
  }
};
