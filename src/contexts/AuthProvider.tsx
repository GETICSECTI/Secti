import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials, AuthData } from '../types/auth';
import { authService } from '../services/authService';
import { setUnauthorizedCallback } from '../lib/apiClient';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Registrar callback para quando token expirar (401)
    setUnauthorizedCallback(() => {
      setAuthData(null);
      navigate('/login?sessionExpired=true', { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    // Verificar autenticação existente ao carregar
    const initAuth = async () => {
      try {
        // Tentar obter dados de autenticação do localStorage
        const savedAuthData = authService.getAuthData();

        if (savedAuthData) {
          setAuthData(savedAuthData);
        } else {
          setAuthData(null);
        }
      } catch (error) {
        console.error('Erro na inicialização de autenticação:', error);
        setAuthData(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    // Validação periódica do token (a cada 30 segundos)
    // Verifica localmente se o token expirou usando a data de expiração
    const tokenValidationInterval = setInterval(() => {
      const currentAuthData = authService.getAuthData();

      if (!currentAuthData) {
        return;
      }

      try {
        // Verificar se o token expirou comparando com a data de expiração
        const expiracaoToken = new Date(currentAuthData.expiraEm).getTime();
        const agora = new Date().getTime();

        // Se o token expirou, limpar dados e redirecionar
        if (agora > expiracaoToken) {
          localStorage.removeItem('auth_data');
          setAuthData(null);
          navigate('/login?sessionExpired=true', { replace: true });
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(tokenValidationInterval);
  }, [navigate]);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setAuthData(response);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthData(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value = {
    user: authData?.usuario || null,
    authData,
    isAuthenticated: !!authData,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
