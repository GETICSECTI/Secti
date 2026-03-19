import { apiClient } from '../lib/apiClient';
import { handleApiError } from '../utils/errorHandler';

// Interfaces para os submenus de transparência
export interface TransparenciaSubmenu {
  id: number;
  titulo: string;
  descricao?: string;
  url: string;
  ordem: number;
  ativo: boolean;
  dataCriacao: string;
}

// Interface para o endpoint público (sem id, ativo, etc)
export interface TransparenciaSubmenuPublico {
  titulo: string;
  url: string;
}

export interface TransparenciaSubmenuListResponse {
  submenus: TransparenciaSubmenu[];
  totalSubmenus: number;
}

export interface TransparenciaSubmenuListPagedResponse {
  itens: TransparenciaSubmenu[];
  total: number;
  pagina: number;
  itensPorPagina: number;
}

// Response da API (antes do mapeamento)
interface TransparenciaSubmenuListApiResponse {
  submenus: TransparenciaSubmenu[];
  totalSubmenus: number;
}


export interface CadastrarTransparenciaRequest {
  titulo: string;
  url: string;
  descricao?: string;
  ordem?: number;
}

export interface EditarTransparenciaRequest {
  titulo: string;
  url: string;
  descricao?: string;
  ordem?: number;
}

export interface TransparenciaResponse {
  id: number;
  titulo: string;
  descricao?: string;
  url: string;
  ordem: number;
  menuPaiId?: number;
  menuPaiNome?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface SuspenderHabilitarResponse {
  id: number;
  titulo: string;
  url: string;
  ativo: boolean;
  dataSuspensao?: string;
  dataHabilitacao?: string;
}

// Validação dos dados
const validarTransparencia = (data: CadastrarTransparenciaRequest | EditarTransparenciaRequest): string[] => {
  const erros: string[] = [];

  if (!data.titulo || data.titulo.trim().length < 3 || data.titulo.trim().length > 100) {
    erros.push('Título é obrigatório e deve ter entre 3 e 100 caracteres.');
  }

  if (!data.url || data.url.trim().length === 0 || data.url.trim().length > 500) {
    erros.push('URL é obrigatória e deve ter no máximo 500 caracteres.');
  }

  if (data.descricao && data.descricao.length > 200) {
    erros.push('Descrição deve ter no máximo 200 caracteres.');
  }

  if (data.ordem !== undefined && (data.ordem < 0 || data.ordem > 9999)) {
    erros.push('Ordem deve estar entre 0 e 9999.');
  }

  return erros;
};

export const transparenciaService = {
  /**
   * Cadastrar novo submenu de transparência
   */
  cadastrar: async (data: CadastrarTransparenciaRequest): Promise<TransparenciaResponse> => {
    const erros = validarTransparencia(data);
    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.post<TransparenciaResponse>(
        '/Menu/submenu/transparencia/cadastrar',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Editar submenu de transparência
   */
  editar: async (submenuId: number, data: EditarTransparenciaRequest): Promise<TransparenciaResponse> => {
    const erros = validarTransparencia(data);
    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.put<TransparenciaResponse>(
        `/Menu/submenu/transparencia/editar/${submenuId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Listar submenus de transparência (admin) com paginação cliente
   * NOTA: A API retorna todos os itens, paginação é feita no cliente
   */
  listarAdmin: async (): Promise<TransparenciaSubmenuListPagedResponse> => {
    try {
      const response = await apiClient.get<TransparenciaSubmenuListApiResponse>(
        '/Menu/submenu/transparencia/admin/listar'
      );

      // Mapear resposta da API para o formato esperado
      // NOTA: A API não suporta paginação, retorna todos os itens
      return {
        itens: response.data.submenus || [],
        total: response.data.totalSubmenus || 0,
        pagina: 1,
        itensPorPagina: 10,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Listar submenus de transparência (público)
   */
  listar: async (): Promise<TransparenciaSubmenuListResponse> => {
    try {
      const response = await apiClient.get<TransparenciaSubmenuListResponse>(
        '/Menu/submenu/transparencia/listar'
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Suspender submenu de transparência
   */
  suspender: async (id: number): Promise<SuspenderHabilitarResponse> => {
    try {
      const response = await apiClient.post<SuspenderHabilitarResponse>(
        `/Menu/submenu/transparencia/suspender/${id}`,
        { confirmar: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Habilitar submenu de transparência
   */
  habilitar: async (id: number): Promise<SuspenderHabilitarResponse> => {
    try {
      const response = await apiClient.post<SuspenderHabilitarResponse>(
        `/Menu/submenu/transparencia/habilitar/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obter detalhes de um submenu específico
   */
  obterPorId: async (id: number): Promise<TransparenciaSubmenu> => {
    // Carregar todos os itens para encontrar o submenu
    const response = await transparenciaService.listarAdmin();
    const submenu = response.itens.find(s => s.id === id);
    if (!submenu) {
      throw new Error('Submenu não encontrado');
    }
    return submenu;
  },
};
