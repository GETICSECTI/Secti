import { apiClient } from '../lib/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Faz o download de uma parceria internamente e dispara o download no navegador
 * @param caminhoArquivo - Caminho relativo do arquivo
 * @param nomeArquivo - Nome do arquivo para download (opcional)
 */
export const downloadParceria = async (caminhoArquivo: string, nomeArquivo?: string): Promise<void> => {
  if (!caminhoArquivo) {
    throw new Error('Caminho do arquivo não informado');
  }

  const url = caminhoArquivo.startsWith('http') ? caminhoArquivo : `${window.location.origin}${caminhoArquivo}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo || caminhoArquivo.split('/').pop() || 'parceria';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==================== INTERFACES ====================

export interface CadastrarParceriaRequest {
  titulo: string;
  dataPublicacao: string; // Data completa
  caminho?: string;
  arquivo: File;
  tagIds?: number[];
}

export interface ParceriaResponse {
  id: number;
  titulo: string;
  categoria: string;
  caminhoArquivo: string;
  nomeArquivo: string;
  dataPublicacao: string; // Data completa do backend
  dataCriacao: string;
  caminho?: string;
  usuarioCriacaoNome?: string;
}

export interface ParceriaListItem {
  id: number;
  titulo: string;
  categoria: string;
  caminhoArquivo: string;
  nomeArquivo: string;
  dataPublicacao: string; // Data completa do backend
  dataCriacao: string;
  ativo: boolean;
  caminho?: string;
  usuarioCriacaoNome?: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

export interface ParceriaListResponse {
  parcerias: ParceriaListItem[];
  totalItens: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
  caminhoFiltro?: string;
}

export interface ParceriaPublicoItem {
  id: number;
  titulo: string;
  caminhoArquivo: string;
  dataPublicacao: string; // Data completa do backend
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

export interface ParceriaPublicoListResponse {
  parcerias: ParceriaPublicoItem[];
  totalItens: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface ParceriaDetalhe {
  id: number;
  titulo: string;
  categoria: string;
  caminhoArquivo: string;
  dataPublicacao: string; // Data completa do backend
  ativo: boolean;
  dataCriacao: string;
  caminho?: string;
}

export interface EditarParceriaRequest {
  titulo: string;
  categoria: string;
  dataPublicacao: string; // Data completa
  caminho?: string;
  arquivo?: File;
}

export interface ParceriaListFilters {
  caminho?: string;
  categoria?: string;
  // numeric tagId preferred
  tagId?: number;
  id?: number;
  titulo?: string;
  ano?: number;
  dataPublicacao?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  ativo?: boolean;
  usuarioCriacaoId?: number;
  usuarioAtualizacaoId?: number;
  apenasAtivas?: boolean;
  ordenarPor?: string;
  ordenarDescendente?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

export interface ParceriaPublicoFilters {
  titulo?: string;
  ano?: number;
  dataPublicacao?: string;
  tagIds?: number[];
  ordenarPor?: string;
  ordenarDescendente?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

// ==================== VALIDAÇÕES ====================

const validarTitulo = (titulo: string): string[] => {
  const erros: string[] = [];
  if (!titulo || titulo.trim().length === 0) {
    erros.push('O título é obrigatório.');
  } else if (titulo.trim().length < 3) {
    erros.push('O título deve ter no mínimo 3 caracteres.');
  } else if (titulo.length > 200) {
    erros.push('O título deve ter no máximo 200 caracteres.');
  }
  return erros;
};

const validarCategoria = (categoria: string): string[] => {
  const erros: string[] = [];
  if (!categoria || categoria.trim().length === 0) {
    erros.push('A categoria é obrigatória.');
  } else if (categoria.length > 100) {
    erros.push('A categoria deve ter no máximo 100 caracteres.');
  }
  return erros;
};

const validarDataPublicacao = (data: string): string[] => {
  const erros: string[] = [];
  if (!data) {
    erros.push('A data de publicação é obrigatória.');
  } else {
    const ano = new Date(data).getFullYear();
    if (ano < 1900 || ano > 3000) {
      erros.push('O ano de publicação deve estar entre 1900 e 3000.');
    }
  }
  return erros;
};

const validarCaminho = (caminho?: string): string[] => {
  const erros: string[] = [];
  if (caminho && caminho.length > 500) {
    erros.push('O caminho deve ter no máximo 500 caracteres.');
  }
  return erros;
};

const validarArquivo = (arquivo?: File): string[] => {
  const erros: string[] = [];

  if (!arquivo) {
    erros.push('O arquivo é obrigatório.');
    return erros;
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = ['pdf', 'xls', 'xlsx', 'csv'];
  const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/csv',
  ];

  if (arquivo.size > MAX_FILE_SIZE) {
    erros.push('O arquivo não pode ter mais de 10MB.');
  }

  const ext = arquivo.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    erros.push('Formato de arquivo inválido. Use PDF, XLS, XLSX ou CSV.');
  }

  if (arquivo.type && !ALLOWED_MIME_TYPES.includes(arquivo.type)) {
    erros.push('Tipo MIME de arquivo inválido.');
  }

  return erros;
};

const validarParceria = (data: CadastrarParceriaRequest | EditarParceriaRequest): string[] => {
  const erros: string[] = [];

  erros.push(...validarTitulo(data.titulo));
  erros.push(...validarDataPublicacao(data.dataPublicacao));
  erros.push(...validarCaminho(data.caminho));

  if ('arquivo' in data && data.arquivo) {
    erros.push(...validarArquivo(data.arquivo));
  } else if ('arquivo' in data && !data.arquivo) {
    // Para cadastro, arquivo é obrigatório
    erros.push('O arquivo é obrigatório.');
  }

  return erros;
};

const buildFormData = (data: CadastrarParceriaRequest | EditarParceriaRequest): FormData => {
  const formData = new FormData();
  formData.append('Titulo', data.titulo);
  formData.append('DataPublicacao', data.dataPublicacao);

  if (data.caminho) {
    formData.append('Caminho', data.caminho);
  }

  if ('arquivo' in data && data.arquivo) {
    formData.append('arquivo', data.arquivo);
  }

  if ('tagIds' in data && data.tagIds && data.tagIds.length > 0) {
    data.tagIds.forEach(id => formData.append('tagIds', id.toString()));
  }

  return formData;
};

// ==================== SERVICE ====================

export const parceriasService = {
  /**
   * Cadastra uma nova parceria
   */
  cadastrar: async (data: CadastrarParceriaRequest): Promise<ParceriaResponse> => {
    const erros = validarParceria(data);
    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.post<ParceriaResponse>(
        '/Parceria/cadastrar',
        buildFormData(data),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista parcerias com filtros e paginação
   */
  listar: async (filtros?: ParceriaListFilters): Promise<ParceriaListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.titulo) {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.caminho) {
      params.append('Caminho', filtros.caminho);
    }
    // prefer TagId when provided, fallback to Categoria
    if (filtros?.tagId !== undefined) {
      params.append('TagId', filtros.tagId.toString());
    } else if (filtros?.categoria) {
      params.append('Categoria', filtros.categoria);
    }
    if (filtros?.ano !== undefined) {
      params.append('Ano', filtros.ano.toString());
    }
    if (filtros?.dataPublicacao) {
      params.append('DataPublicacao', filtros.dataPublicacao);
    }
    if (filtros?.dataCriacao) {
      params.append('DataCriacao', filtros.dataCriacao);
    }
    if (filtros?.dataAtualizacao) {
      params.append('DataAtualizacao', filtros.dataAtualizacao);
    }
    if (filtros?.ativo !== undefined) {
      params.append('Ativo', filtros.ativo.toString());
    }
    if (filtros?.usuarioCriacaoId !== undefined) {
      params.append('UsuarioCriacaoId', filtros.usuarioCriacaoId.toString());
    }
    if (filtros?.usuarioAtualizacaoId !== undefined) {
      params.append('UsuarioAtualizacaoId', filtros.usuarioAtualizacaoId.toString());
    }
    if (filtros?.apenasAtivas !== undefined) {
      params.append('ApenasAtivas', filtros.apenasAtivas.toString());
    }
    if (filtros?.ordenarPor) {
      params.append('OrdenarPor', filtros.ordenarPor);
    }
    if (filtros?.ordenarDescendente !== undefined) {
      params.append('OrdenarDescendente', filtros.ordenarDescendente.toString());
    }
    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Parceria/listar${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<ParceriaListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista parcerias públicas (sem autenticação)
   */
  listarPublico: async (filtros?: ParceriaPublicoFilters): Promise<ParceriaPublicoListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.titulo) {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.dataPublicacao) {
      params.append('DataPublicacao', filtros.dataPublicacao);
    }
    if (filtros?.ordenarPor) {
      params.append('OrdenarPor', filtros.ordenarPor);
    }
    if (filtros?.ordenarDescendente !== undefined) {
      params.append('OrdenarDescendente', filtros.ordenarDescendente.toString());
    }
    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Parceria/listar-publico${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<ParceriaPublicoListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Busca uma parceria por ID
   */
  buscarPorId: async (id: number): Promise<ParceriaDetalhe> => {
    const response = await apiClient.get<ParceriaDetalhe>(`/Parceria/${id}`);
    return response.data;
  },

  /**
   * Edita uma parceria existente
   */
  editar: async (id: number, data: EditarParceriaRequest): Promise<ParceriaDetalhe> => {
    // Para edição, o arquivo é opcional
    const erros: string[] = [];
    erros.push(...validarTitulo(data.titulo));
    erros.push(...validarCategoria(data.categoria));
    erros.push(...validarDataPublicacao(data.dataPublicacao));
    erros.push(...validarCaminho(data.caminho));

    if (data.arquivo) {
      erros.push(...validarArquivo(data.arquivo));
    }

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.put<ParceriaDetalhe>(
        `/Parceria/editar/${id}`,
        buildFormData(data),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Inativa uma parceria
   */
  inativar: async (id: number): Promise<void> => {
    await apiClient.post(`/Parceria/inativar/${id}`);
  },

  /**
   * Ativa uma parceria
   */
  ativar: async (id: number): Promise<void> => {
    await apiClient.post(`/Parceria/ativar/${id}`);
  },
};

export default parceriasService;

