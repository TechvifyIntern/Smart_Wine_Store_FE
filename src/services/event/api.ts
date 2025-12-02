import { Event } from "@/types/events";
import { api } from "../api";
import { ApiResponse } from "@/api/inventoriesRepository";

export const getEvents = async (
  Cursor: number = 0,
  Size: number = 10
): Promise<ApiResponse<Event[]>> => {
  try {
    const { data: res } = await api.get<{
      success: boolean;
      data: Event[];
      message?: string;
    }>("/events", {
      params: { cursor: Cursor, size: Size },
    });

    if (!res.success) {
      return {
        success: false,
        statusCode: 500,
        message: res.message || "Failed to fetch events",
        data: [],
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Success",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status ?? 500,
      message:
        error?.response?.data?.message ?? "An unexpected error occurred.",
      data: [],
    };
  }
};

export const getAvailableEvents = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const { data: res } =
      await api.get<ApiResponse<Event[]>>("/events/available");

    if (!res.success) {
      return {
        success: false,
        statusCode: res.statusCode,
        message: res.message || "Failed to fetch available events",
        data: [],
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Success",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: error?.response?.status ?? 500,
      message:
        error?.response?.data?.message ?? "An unexpected error occurred.",
      data: [],
    };
  }
};
