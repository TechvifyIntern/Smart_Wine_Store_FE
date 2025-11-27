import { api } from '@/services/api';

class BaseRepository {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async get(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ${this.endpoint.slice(1)}: ${error.message}`);
    }
  }

  async getAll(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ${this.endpoint.slice(1)}: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create ${this.endpoint.slice(1)}: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      const statusCode = error.response?.status;
      console.error(`Failed to update ${this.endpoint.slice(1)}:`, {
        statusCode,
        message: errorMessage,
        error: error.response?.data
      });
      throw new Error(`Failed to update ${this.endpoint.slice(1)}: ${errorMessage} (Status: ${statusCode})`);
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete ${this.endpoint.slice(1)}: ${error.message}`);
    }
  }


  async patch(id, data) {
    try {
      const response = await api.patch(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to patch ${this.endpoint.slice(1)}: ${error.message}`);
    }
  }
}

export default BaseRepository;
