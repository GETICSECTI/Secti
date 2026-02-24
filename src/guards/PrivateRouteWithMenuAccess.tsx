import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts';

interface PrivateRouteWithMenuAccessProps {
  children: React.ReactNode;
  requiredMenu?: string;
}

export const PrivateRouteWithMenuAccess = ({ children, requiredMenu }: PrivateRouteWithMenuAccessProps) => {
  const { isAuthenticated, isLoading, authData } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se um menu específico é requerido, validar acesso
  if (requiredMenu && authData?.menus) {
    const temAcesso = authData.menus.some(menu => menu.nome.toLowerCase() === requiredMenu.toLowerCase());
    if (!temAcesso) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

