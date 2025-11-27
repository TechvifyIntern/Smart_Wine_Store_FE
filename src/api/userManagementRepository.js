import { api } from '@/services/api';
import BaseRepository from './baseRepository.js';

class UserManagementRepository extends BaseRepository {
  constructor() {
    super('/user-management');
  }

  /**
   * Get all users with pagination, sort, and filter
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.size - Items per page
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc/desc)
   * @param {number[]} params.roles - Filter by role IDs
   * @param {number[]} params.tiers - Filter by tier IDs
   * @param {number[]} params.statuses - Filter by status IDs
   */
  async getUsers(params = {}) {
    const response = await this.getAll(params);
    return response.data.data; // Extract the data array from the paginated response
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
        params: { username, page, size }
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
        StreetAddress: data.StreetAddress ?? '',
        Ward: data.Ward ?? '',
        Province: data.Province ?? '',
        Point: data.Point ?? 0 // Ensure Point is never undefined
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
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
   */
  async updateUserStatus(id, statusId) {
    try {
      const response = await api.put(`${this.endpoint}/${id}/status`, {
        statusId
      });
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
        roleId
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
