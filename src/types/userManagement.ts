export interface User {
  UserID: number;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  Point: number;
  StatusID: number;
  StatusName?: string; // This is added client-side
  TierName: string;
  RoleName: string;
  CreatedAt: string;
  UpdatedAt: string;
  StreetAddress: string | null;
  Ward: string | null;
  Province: string | null;
  MinimumPoint: number | null;
  ImageURL?: string | null;
  Reason?: string;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  size?: number; // Alias for pageSize
  phone?: string;
  sortBy?: "createdAt" | "point";
  sortOrder?: "asc" | "desc";
  status?: "Active" | "Inactive";
  tier?: "Bronze" | "Silver" | "Gold";
  role?: "Admin" | "User" | "Seller";
}

export interface UserApiResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
