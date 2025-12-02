import { api } from "@/services/api";

class BaseRepository {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async get(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch ${this.endpoint.slice(1)}: ${error.message}`
      );
    }
  }

  async getAll(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch ${this.endpoint.slice(1)}: ${error.message}`
      );
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to create ${this.endpoint.slice(1)}: ${error.message}`
      );
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      // Enhanced error handling with better debugging
      const statusCode = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Unknown error occurred";

      // Try to extract meaningful error message
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (statusCode) {
        // Fallback to status code based messages
        switch (statusCode) {
          case 400:
            errorMessage = "Invalid data provided";
            break;
          case 401:
            errorMessage = "Login required";
            break;
          case 403:
            errorMessage = "Permission denied";
            break;
          case 404:
            errorMessage = "Resource not found";
            break;
          case 409:
            errorMessage = "Conflict with existing data";
            break;
          case 422:
            errorMessage = "Validation failed";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          default:
            errorMessage = `Request failed with status ${statusCode}`;
        }
      }

      console.error(`Failed to update ${this.endpoint.slice(1)}:`, {
        statusCode,
        message: errorMessage,
        requestData: data,
        responseData: errorData,
        fullError: error,
      });

      throw new Error(
        `Failed to update ${this.endpoint.slice(1)}: ${errorMessage}`
      );
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to delete ${this.endpoint.slice(1)}: ${error.message}`
      );
    }
  }

  async patch(id, data) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to patch ${this.endpoint.slice(1)}: ${error.message}`
      );
    }
  }
}

export default BaseRepository;
