import { api } from "@/services/api";
import BaseRepository from "./baseRepository";

class UserManagementRepository extends BaseRepository {
  constructor() {
    super("/user-management");
  }

  /**
   * Get all users with pagination, sort, and filter
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (starts from 1)
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.phone - Search by exact phone number
   * @param {string} params.sortBy - Sort by field (createdAt, point)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @param {string} params.status - Filter by status (Active, Inactive)
   * @param {string} params.tier - Filter by tier (Bronze, Silver, Gold)
   * @param {string} params.role - Filter by role (Admin, User, Seller)
   */
  async getUsers(params = {}) {
    try {
      // Build query parameters according to API spec
      const queryParams = {
        page: params.page || 1,
        pageSize: params.pageSize || params.size || 10,
      };

      // Add optional filters
      if (params.phone) {
        queryParams.phone = params.phone;
      }
      if (params.sortBy) {
        queryParams.sortBy = params.sortBy;
      }
      if (params.sortOrder) {
        queryParams.sortOrder = params.sortOrder;
      }
      if (params.status) {
        queryParams.status = params.status;
      }
      if (params.tier) {
        queryParams.tier = params.tier;
      }
      if (params.role) {
        queryParams.role = params.role;
      }

      const response = await api.get(this.endpoint, { params: queryParams });

      // Handle the response structure
      if (response.data.success && response.data.data) {
        const users = response.data.data.data.map((user) => ({
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
        }));
        return {
          data: users,
          total: response.data.data.total,
          page: response.data.data.page,
          pageSize: response.data.data.pageSize,
          totalPages: response.data.data.totalPages,
        };
      }

      return {
        data: [],
        total: 0,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Search users by username with pagination
   * @param {string} username - Username to search
   * @param {number} page - Page number
   * @param {number} size - Items per page
   */
  async searchUsers(username, page = 1, size = 10) {
    try {
      const response = await api.get(`${this.endpoint}/search`, {
        params: { username, page, size },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   */
  async getUserById(id) {
    try {
      const response = await this.get(id);
      // Transform API response to match component expectations
      const data = response.data;
      return {
        ...data,
        MinimumPoint: data.MinimumPoint ?? 0, // Provide default if missing
        StreetAddress: data.StreetAddress ?? "",
        Ward: data.Ward ?? "",
        Province: data.Province ?? "",
        Point: data.Point ?? 0, // Ensure Point is never undefined
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  /**
   * Get user by ID (original implementation)
   * @param {number} id - User ID
   */
  async getUserByIdOriginal(id) {
    return this.get(id);
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - User data to update
   */
  async updateUser(id, userData) {
    return this.update(id, userData);
  }

  /**
   * Update user status
   * @param {number} id - User ID
   * @param {number} statusId - New status ID
   * @param {string | undefined} reason - Reason for status change (required when banning)
   */
  async updateUserStatus(id, statusId, reason = undefined) {
    try {
      const payload = {
        StatusID: statusId,
      };

      // Add reason when banning (StatusID = 2)
      if (statusId === 2 && reason) {
        payload.Reason = reason;
      }

      const response = await api.put(`${this.endpoint}/${id}/status`, payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }

  /**
   * Update user role
   * @param {number} id - User ID
   * @param {number} roleId - New role ID
   */
  async updateUserRole(id, roleId) {
    try {
      const response = await api.put(`${this.endpoint}/${id}/role`, {
        roleId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   */
  async deleteUser(id) {
    return this.delete(id);
  }
}

// Export singleton instance
const userManagementRepository = new UserManagementRepository();
export default userManagementRepository;
