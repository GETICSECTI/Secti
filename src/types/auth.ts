export interface User {
  id: string;
  nome: string;
  email: string;
  ativo?: boolean;
  status?: number; // 1 = Ativo, 2 = Inativo, 3 = Admin
}

export interface Perfil {
  id: number;
  nome: string;
}

export interface Menu {
  id: number;
  nome: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  expiraEm: string;
  usuario: User;
  permissoes: string[];
  perfis: Perfil[];
  menus: Menu[];
}

export type AuthResponse = AuthData;

export interface AuthContextType {
  user: User | null;
  authData: AuthData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}
