import { apiClient } from '../lib/apiClient';
import { handleApiError } from '../utils/errorHandler';

// ==================== INTERFACES ====================

export interface Tag {
  id: number;
  nome: string;
  ativo: boolean;
  dataCriacao: string;
}

export interface CriarTagRequest {
  nome: string;
}

export interface EditarTagRequest {
  nome: string;
  ativo: boolean;
}

export interface ListarTagsResponse {
  itens: Tag[];
  total: number;
  pagina: number;
  itensPorPagina: number;
}

export interface ListarTagsFilters {
  nomeFiltro?: string;
  apenasAtivas?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

export interface TagPublica {
  id: number;
  nome: string;
}

export interface ListarTagsPublicasResponse {
  tags: TagPublica[];
  totalItens: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface ListarTagsPublicasFilters {
  nome?: string;
  pagina?: number;
  itensPorPagina?: number;
}

// ==================== VALIDAÇÕES ====================

const validarNome = (nome: string): string[] => {
  const erros: string[] = [];
  if (!nome || nome.trim().length === 0) {
    erros.push('O nome é obrigatório.');
  } else if (nome.trim().length < 2) {
    erros.push('O nome deve ter no mínimo 2 caracteres.');
  } else if (nome.trim().length > 50) {
    erros.push('O nome deve ter no máximo 50 caracteres.');
  }
  return erros;
};

// ==================== SERVICE ====================

export const tagService = {
  /**
   * Cadastra uma nova tag
   */
  cadastrar: async (data: CriarTagRequest): Promise<Tag> => {
    const erros = validarNome(data.nome);

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.post<Tag>('/Tag/cadastrar', {
        nome: data.nome.trim(),
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista tags com filtros e paginação
   */
  listar: async (filtros?: ListarTagsFilters): Promise<ListarTagsResponse> => {
    const params = new URLSearchParams();

    if (filtros?.nomeFiltro) {
      params.append('nomeFiltro', filtros.nomeFiltro);
    }
    if (filtros?.apenasAtivas !== undefined) {
      params.append('apenasAtivas', filtros.apenasAtivas.toString());
    }
    if (filtros?.pagina !== undefined) {
      params.append('pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('itensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Tag/listar${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<ListarTagsResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista tags de forma pública (sem autenticação)
   */
  listarPublico: async (filtros?: ListarTagsPublicasFilters): Promise<ListarTagsPublicasResponse> => {
    const params = new URLSearchParams();

    if (filtros?.nome) {
      params.append('Nome', filtros.nome);
    }
    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Tag/listar-publico${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<ListarTagsPublicasResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtém uma tag por ID
   */
  obterPorId: async (id: number): Promise<Tag> => {
    try {
      const response = await apiClient.get<Tag>(`/Tag/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Edita uma tag existente
   */
  editar: async (id: number, data: EditarTagRequest): Promise<Tag> => {
    const erros = validarNome(data.nome);

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.put<Tag>(`/Tag/editar/${id}`, {
        nome: data.nome.trim(),
        ativo: data.ativo,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Inativa uma tag
   */
  inativar: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/Tag/inativar/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Ativa uma tag
   */
  ativar: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/Tag/ativar/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

