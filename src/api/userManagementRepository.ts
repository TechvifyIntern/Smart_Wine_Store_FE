import { api } from "@/services/api";
import BaseRepository from "./baseRepository";
import { Account } from "@/data/accounts";
import { CreateAccountFormData } from "@/validations/accounts/accountSchema";

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  size?: number;
  phone?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  tier?: string;
  role?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Repository Class ---

class UserManagementRepository extends BaseRepository {
  constructor() {
    super("/user-management");
  }

  async getUsers(
    params: UserQueryParams = {}
  ): Promise<PaginatedResponse<Account>> {
    try {
      // Build query parameters according to API spec
      const queryParams: any = {
        page: params.page || 1,
        pageSize: params.pageSize || params.size || 10,
      };

      // Add optional filters
      if (params.phone) queryParams.phone = params.phone;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
      if (params.status) queryParams.status = params.status;
      if (params.tier) queryParams.tier = params.tier;
      if (params.role) queryParams.role = params.role;

      const response = await api.get(this.endpoint, { params: queryParams });

      // Handle the response structure
      // Assuming structure: response.data = { success: boolean, data: { data: [], total: ... } }
      if (response.data?.success && response.data?.data) {
        const rawData = response.data.data;

        const users: Account[] = Array.isArray(rawData.data)
          ? rawData.data.map((user: any) => ({
              ...user,
              MinimumPoint: user.MinimumPoint ?? 0,
              StreetAddress: user.StreetAddress ?? "",
              Ward: user.Ward ?? "",
              Province: user.Province ?? "",
              Point: user.Point ?? 0,
              StatusName:
                user.StatusID === 1
                  ? "Active"
                  : user.StatusID === 2
                    ? "Inactive"
                    : user.StatusName,
            }))
          : [];

        return {
          data: users,
          total: rawData.total || 0,
          page: rawData.page,
          pageSize: rawData.pageSize,
          totalPages: rawData.totalPages,
        };
      }

      return {
        data: [],
        total: 0,
      };
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Search users by username with pagination
   */
  async searchUsers(
    username: string,
    page: number = 1,
    size: number = 10
  ): Promise<any> {
    try {
      const response = await api.get(`${this.endpoint}/search`, {
        params: { username, page, size },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number | string): Promise<Account> {
    try {
      // Assuming this.get returns an AxiosResponse-like object
      const response = await this.get(id);

      const data = response.data;

      // Transform API response to match component expectations
      return {
        ...data,
        MinimumPoint: data.MinimumPoint ?? 0,
        StreetAddress: data.StreetAddress ?? "",
        Ward: data.Ward ?? "",
        Province: data.Province ?? "",
        Point: data.Point ?? 0,
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  /**
   * Get user by ID (original implementation)
   */
  async getUserByIdOriginal(id: number | string): Promise<any> {
    return this.get(id);
  }

  /**
   * Update user generic data
   */
  async updateUser(
    id: number | string,
    userData: Partial<Account>
  ): Promise<any> {
    return this.update(id, userData);
  }

  /**
   * Update user status
   * @param reason - Reason is required when banning (StatusID = 2)
   */
  async updateUserStatus(
    id: number | string,
    statusId: number,
    reason?: string
  ): Promise<any> {
    try {
      const payload: { StatusID: number; Reason?: string } = {
        StatusID: statusId,
      };

      // Add reason when banning (StatusID = 2)
      if (statusId === 2 && reason) {
        payload.Reason = reason;
      }

      const response = await api.put(`${this.endpoint}/${id}/status`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(
    id: number | string,
    RoleID: EditAccountFormData
  ): Promise<any> {
    try {
      const response = await api.put(`${this.endpoint}/${id}/role`, {
        RoleID,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number | string): Promise<any> {
    return this.delete(id);
  }

  /**
   * Send password reset email to user
   */
  async sendPasswordReset(id: number | string, email: string): Promise<any> {
    try {
      // Note: The original code passed 'id' but didn't use it in the API call, only email
      const response = await api.post(`auth/reset-password`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to send password reset: ${error.message}`);
    }
  }

  /**
   * Create a new user account via Auth register endpoint
   */
  async createAccount(data: Partial<CreateAccountFormData>): Promise<any> {
    try {
      const response = await api.post(`auth/register`, data);
      console.log(response);

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create account: ${error.message}`);
    }
  }
}

interface EditAccountFormData {
  RoleID: number;
}

// Export singleton instance
const userManagementRepository = new UserManagementRepository();
export default userManagementRepository;
