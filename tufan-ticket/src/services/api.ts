import axios from 'axios';

// Create base API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
import { InternalAxiosRequestConfig } from 'axios';

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token'); // or any other method to get the token
  config.headers.Authorization = `Bearer ${token}` as string;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: any; }; }) => {
    // Handle common errors
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/auth/signin';
      }
      
      if (status === 403) {
        // Forbidden - show permission error
        console.error('Permission denied');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;