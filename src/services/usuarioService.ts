import { apiClient } from '../lib/apiClient';
import { handleApiError } from '../utils/errorHandler';

// ==================== INTERFACES ====================

export interface CadastrarUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  perfilId: number;
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  dataCriacao: string;
}

export interface UsuarioDetalheResponse {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  status?: number; // 1 = Ativo, 2 = Inativo, 3 = Admin
  dataCriacao: string;
  dataAtualizacao: string;
  perfilNome: string;
}

export interface UsuarioListItem {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  status?: number; // 1 = Ativo, 2 = Inativo, 3 = Admin
  dataCriacao: string;
  perfilNome: string;
}

export interface UsuarioListResponse {
  itens: UsuarioListItem[];
  total: number;
  pagina: number;
  itensPorPagina: number;
}

export interface UsuarioListFilters {
  nomeOuEmailFiltro?: string;
  apenasAtivos?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

export interface AtualizarUsuarioRequest {
  nome: string;
  perfilId: number;
}

export interface SuspenderUsuarioRequest {
  confirmar: boolean;
}

export interface SuspenderUsuarioResponse {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  dataSuspensao: string;
}

export interface HabilitarUsuarioResponse {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  dataHabilitacao: string;
}

// ==================== VALIDAÇÕES ====================

const validarNome = (nome: string): string[] => {
  const erros: string[] = [];
  if (!nome || nome.trim().length === 0) {
    erros.push('O nome é obrigatório.');
  } else if (nome.trim().length < 3) {
    erros.push('O nome deve ter no mínimo 3 caracteres.');
  } else if (nome.trim().length > 100) {
    erros.push('O nome deve ter no máximo 100 caracteres.');
  }
  return erros;
};

const validarEmail = (email: string): string[] => {
  const erros: string[] = [];
  if (!email || email.trim().length === 0) {
    erros.push('O email é obrigatório.');
  } else if (!email.includes('@') || !email.includes('.')) {
    erros.push('O email deve ser válido.');
  } else if (email.trim().length > 150) {
    erros.push('O email deve ter no máximo 150 caracteres.');
  }
  return erros;
};

const validarSenha = (senha: string): string[] => {
  const erros: string[] = [];
  if (!senha || senha.trim().length === 0) {
    erros.push('A senha é obrigatória.');
  } else if (senha.length < 8) {
    erros.push('A senha deve ter no mínimo 8 caracteres.');
  }
  return erros;
};

const validarPerfilId = (perfilId: number | null | undefined): string[] => {
  const erros: string[] = [];
  if (!perfilId || perfilId <= 0) {
    erros.push('O perfil é obrigatório.');
  }
  return erros;
};

// ==================== SERVICE ====================

export const usuarioService = {
  /**
   * Cadastra um novo usuário
   */
  cadastrar: async (data: CadastrarUsuarioRequest): Promise<UsuarioResponse> => {
    // Validações
    const erros: string[] = [
      ...validarNome(data.nome),
      ...validarEmail(data.email),
      ...validarSenha(data.senha),
      ...validarPerfilId(data.perfilId),
    ];

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.post<UsuarioResponse>('/Usuario/cadastrar', {
        nome: data.nome.trim(),
        email: data.email.trim(),
        senha: data.senha,
        perfilId: data.perfilId,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista usuários com filtros e paginação
   */
  listar: async (filtros?: UsuarioListFilters): Promise<UsuarioListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.nomeOuEmailFiltro) {
      params.append('NomeOuEmailFiltro', filtros.nomeOuEmailFiltro);
    }
    // Define o padrão como true (apenas ativos) se não for explicitamente definido como false
    const apenasAtivos = filtros?.apenasAtivos !== false;
    params.append('ApenasAtivos', apenasAtivos.toString());

    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Usuario/listar${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<UsuarioListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtém um usuário por ID
   */
  obterPorId: async (id: number): Promise<UsuarioDetalheResponse> => {
    try {
      const response = await apiClient.get<UsuarioDetalheResponse>(`/Usuario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Atualiza um usuário existente
   */
  atualizar: async (id: number, data: AtualizarUsuarioRequest): Promise<UsuarioDetalheResponse> => {
    // Validações
    const erros: string[] = [
      ...validarNome(data.nome),
      ...validarPerfilId(data.perfilId),
    ];

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.put<UsuarioDetalheResponse>(`/Usuario/atualizar/${id}`, {
        nome: data.nome.trim(),
        perfilId: data.perfilId,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Suspende um usuário
   */
  suspender: async (id: number): Promise<SuspenderUsuarioResponse> => {
    try {
      const response = await apiClient.post<SuspenderUsuarioResponse>(
        `/Usuario/suspender/${id}`,
        { confirmar: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Habilita um usuário
   */
  habilitar: async (id: number): Promise<HabilitarUsuarioResponse> => {
    try {
      const response = await apiClient.post<HabilitarUsuarioResponse>(`/Usuario/habilitar/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Valida se um email já existe
   */
  validarEmail: async (email: string): Promise<boolean> => {
    try {
      await apiClient.get(`/Usuario/validar-email/${email}`);
      return true;
    } catch {
      return false;
    }
  },
};
