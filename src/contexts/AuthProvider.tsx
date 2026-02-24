import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LoginCredentials, AuthData } from '../types/auth';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const initAuth = async () => {
      try {
        // Try to get auth data from localStorage
        const savedAuthData = authService.getAuthData();

        if (savedAuthData) {
          setAuthData(savedAuthData);
        } else {
          setAuthData(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthData(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setAuthData(response);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthData(null);
    } catch (error) {
      console.error('Logout error:', error);
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
