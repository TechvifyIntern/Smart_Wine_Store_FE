import { Category } from "@/data/categories";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/responses";

export const getParentCategory = async (): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await api.get(`/categories/parents`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChildrenCategory = async (
  parentId: number
): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await api.get(`/categories/${parentId}/children`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
