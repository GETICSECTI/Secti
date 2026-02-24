import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const authDataStr = localStorage.getItem('auth_data');
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.token) {
          config.headers.Authorization = `Bearer ${authData.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }

    // Se for FormData, remover Content-Type para deixar o navegador definir automaticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem('auth_data');
    }

    return Promise.reject(error);
  }
);
