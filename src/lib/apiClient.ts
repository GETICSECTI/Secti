import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Callback para redirecionar para login quando token expirar
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorized = callback;
};

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
      } catch {
          //Intencionalmente Ignorado
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
    // Tratamento de erros 401 - Token expirado
    if (error.response?.status === 401) {
      // Limpar dados de autenticação do localStorage
      localStorage.removeItem('auth_data');

      // Chamar callback para redirecionar para login se registrado
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    return Promise.reject(error);
  }
);
