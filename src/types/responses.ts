export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T;
  total: number;
}

export interface ApiResponsePaging<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: T;
    total: number;
  };
}
