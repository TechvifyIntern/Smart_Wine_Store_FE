import { Event } from "@/types/events";
import { api } from "../api";
import { ApiResponse } from "@/api/inventoriesRepository";

interface ApiEventResponse {
  EventID: number;
  EventName: string;
  Description: string;
  ImageURL: string | null;
  DiscountValue: number;
  DiscountTypeID: number;
  MinimumValue: number;
  TimeStart: string;
  TimeEnd: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getEvents = async (
  Cursor: number = 0,
  Size: number = 10
): Promise<ApiResponse<Event[]>> => {
  try {
    const { data: res } = await api.get<{
      success: boolean;
      data: ApiEventResponse[];
      message?: string;
    }>("/events", {
      params:
        Cursor !== undefined && Size !== undefined
          ? { cursor: Cursor, size: Size }
          : undefined,
    });

    if (!res.success) {
      return {
        success: false,
        statusCode: 500,
        message: res.message || "Failed to fetch events",
        data: [],
      };
    }

    const mappedEvents: Event[] = res.data.map((ev) => ({
      EventID: ev.EventID,
      EventName: ev.EventName,
      Description: ev.Description,
      ImageURL: ev.ImageURL,
      DiscountValue: ev.DiscountValue,
      DiscountTypeID: ev.DiscountTypeID,
      MinimumValue: ev.MinimumValue,
      TimeStart: ev.TimeStart,
      TimeEnd: ev.TimeEnd,
      CreatedAt: ev.CreatedAt,
      UpdatedAt: ev.UpdatedAt,
    }));

    return {
      success: true,
      statusCode: 200,
      message: "Success",
      data: mappedEvents,
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
