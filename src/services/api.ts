import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.BE_API_URL || 'http://localhost:3000',
});

export const getWines = async () => {
  const response = await api.get('/wines');
  return response.data;
};
