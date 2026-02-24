export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
  server: {
    proxy: {
      '/api': {
        target: 'http://sitesectiapi',
        changeOrigin: true,
      },
    },
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/Auth/login',
    logout: '/Auth/logout',
    recuperarSenha: '/Auth/recuperar-senha',
    resetarSenha: '/Auth/resetar-senha',
  },
};
