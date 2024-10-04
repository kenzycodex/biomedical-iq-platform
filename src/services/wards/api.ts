import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'https://biomedical-iq-backend.onrender.com';

// Define types for the ward data and responses
interface Ward {
  id?: number;
  ward_name: string;
  description: string;
  capacity: number;
  floor_number: number;
}

interface WardResponse {
  wards: Ward[];
}

interface SingleWardResponse {
  ward: Ward;
}

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Authorization token if present
api.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API functions with TypeScript definitions
export const fetchWards = (): Promise<AxiosResponse<WardResponse>> => api.get('/ward/list');
export const createWard = (wardData: Ward): Promise<AxiosResponse<SingleWardResponse>> => api.post('/ward/create', wardData);
export const updateWard = (wardId: number, wardData: Ward): Promise<AxiosResponse<SingleWardResponse>> => api.put(`/ward/update/${wardId}`, wardData);
export const deleteWard = (wardId: number): Promise<AxiosResponse<void>> => api.delete(`/ward/delete/${wardId}`);
