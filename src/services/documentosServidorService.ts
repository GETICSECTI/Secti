import { apiClient } from '../lib/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Faz o download de um documento do servidor internamente e dispara o download no navegador
 * @param caminhoArquivo - Caminho relativo do arquivo
 * @param nomeArquivo - Nome do arquivo para download (opcional)
 */
export const downloadDocumentoServidor = async (caminhoArquivo: string, nomeArquivo?: string): Promise<void> => {
  if (!caminhoArquivo) {
    throw new Error('Caminho do arquivo não informado');
  }

  const url = caminhoArquivo.startsWith('http') ? caminhoArquivo : `${window.location.origin}${caminhoArquivo}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo || caminhoArquivo.split('/').pop() || 'documento';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==================== INTERFACES ====================

export interface CadastrarDocumentoServidorRequest {
  titulo: string;
  dataPublicacao: string; // Data completa do backend
  caminho?: string;
  arquivo: File;
  tagIds?: number[];
}

export interface DocumentoServidorResponse {
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

export interface DocumentoServidorListItem {
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

export interface DocumentoServidorListResponse {
  documentos: DocumentoServidorListItem[];
  totalItens: number;
  paginaAtual: number;
  totalPaginas: number;
  caminhoFiltro?: string;
  categoriaFiltro?: string;
  anoFiltro?: number;
}

export interface DocumentoServidorListFilters {
  titulo?: string;
  caminho?: string;
  categoria?: string;
  id?: number;
  tagId?: number;
  ano?: number;
  pastaId?: number;
  dataPublicacao?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  ativo?: boolean;
  usuarioCriacaoId?: number;
  usuarioAtualizacaoId?: number;
  apenasAtivos?: boolean;
  ordenarPor?: string;
  ordenarDescendente?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

export interface DocumentoServidorPublicoItem {
  id: number;
  titulo: string;
  caminhoArquivo: string;
  dataPublicacao: string; // Data completa do backend
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

export interface DocumentoServidorPublicoListResponse {
  documentos: DocumentoServidorPublicoItem[];
  totalItens: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface DocumentoServidorPublicoFilters {
  titulo?: string;
  ano?: number;
  dataPublicacao?: string;
  tagIds?: number[];
  pagina?: number;
  itensPorPagina?: number;
}

export interface DocumentoServidorDetalhe {
  id: number;
  titulo: string;
  categoria: string;
  caminhoArquivo: string;
  dataPublicacao: string; // Data completa do backend
  ativo: boolean;
  dataCriacao: string;
  caminho?: string;
}

export interface EditarDocumentoServidorRequest {
  titulo: string;
  categoria: string;
  dataPublicacao: string; // Data completa do backend
  caminho?: string;
  arquivo?: File;
}

// ==================== VALIDAÇÕES ====================

const validarTitulo = (titulo: string): string[] => {
  const erros: string[] = [];
  if (!titulo || titulo.trim().length === 0) {
    erros.push('O título é obrigatório.');
  } else if (titulo.trim().length < 3) {
    erros.push('O título deve ter no mínimo 3 caracteres.');
  } else if (titulo.trim().length > 200) {
    erros.push('O título deve ter no máximo 200 caracteres.');
  }
  return erros;
};

const validarCategoria = (categoria: string): string[] => {
  const erros: string[] = [];
  if (!categoria || categoria.trim().length === 0) {
    erros.push('A categoria é obrigatória.');
  } else if (categoria.trim().length > 100) {
    erros.push('A categoria deve ter no máximo 100 caracteres.');
  }
  return erros;
};

const validarDataPublicacao = (data: string): string[] => {
  const erros: string[] = [];
  if (!data) {
    erros.push('A data de publicação é obrigatória.');
  } else {
    // Extrair ano - formato esperado: DD-MM-YYYY
    let ano: number;
    if (data.includes('/')) {
      // Formato DD/MM/YYYY
      ano = parseInt(data.split('/')[2], 10);
    } else if (data.includes('-')) {
      // Pode ser YYYY-MM-DD ou DD-MM-YYYY
      const parts = data.split('-');
      if (parts.length === 3) {
        // Se começa com um número de 4 dígitos, é YYYY
        if (parts[0].length === 4) {
          ano = parseInt(parts[0], 10);
        } else {
          // Caso contrário, é DD-MM-YYYY
          ano = parseInt(parts[2], 10);
        }
      } else {
        ano = NaN;
      }
    } else if (data.includes('T')) {
      // Formato ISO: YYYY-MM-DDTHH:MM:SS.sssZ
      ano = parseInt(data.split('T')[0].split('-')[0], 10);
    } else {
      ano = NaN;
    }

    if (isNaN(ano) || ano < 1900 || ano > 3000) {
      erros.push('A data de publicação deve estar entre 1900 e 3000.');
    }
  }
  return erros;
};

const validarArquivo = (arquivo: File | null | undefined, obrigatorio = true): string[] => {
  const erros: string[] = [];

  if (obrigatorio && !arquivo) {
    erros.push('O arquivo é obrigatório.');
    return erros;
  }

  if (arquivo) {
    const extensoesPermitidas = ['pdf', 'xls', 'xlsx', 'csv'];
    const extensao = arquivo.name.split('.').pop()?.toLowerCase();

    if (!extensao || !extensoesPermitidas.includes(extensao)) {
      erros.push('Formato de arquivo inválido. Formatos aceitos: PDF, XLS, XLSX, CSV.');
    }

    const tamanhoMaximo = 10 * 1024 * 1024; // 10MB
    if (arquivo.size > tamanhoMaximo) {
      erros.push('O arquivo não pode ter mais de 10MB.');
    }
  }

  return erros;
};

// ==================== SERVICE ====================

const buildFormData = (data: CadastrarDocumentoServidorRequest | EditarDocumentoServidorRequest): FormData => {
  const formData = new FormData();

  formData.append('Titulo', data.titulo.trim());
  formData.append('DataPublicacao', data.dataPublicacao);

  if (data.caminho) {
    formData.append('Caminho', data.caminho.trim());
  }

  if (data.arquivo) {
    formData.append('arquivo', data.arquivo);
  }

  if ('tagIds' in data && data.tagIds && data.tagIds.length > 0) {
    data.tagIds.forEach(id => formData.append('tagIds', id.toString()));
  }

  return formData;
};

export const documentosServidorService = {
  /**
   * Cadastra um novo documento do servidor
   */
  cadastrar: async (data: CadastrarDocumentoServidorRequest): Promise<DocumentoServidorResponse> => {
    // Validações
    const erros: string[] = [
      ...validarTitulo(data.titulo),
      ...validarDataPublicacao(data.dataPublicacao),
      ...validarArquivo(data.arquivo, true),
    ];

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.post<DocumentoServidorResponse>(
        '/DocumentoServidor/cadastrar',
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
   * Lista documentos do servidor com filtros e paginação
   */
  listar: async (filtros?: DocumentoServidorListFilters): Promise<DocumentoServidorListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.titulo) {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.id !== undefined) {
      params.append('Id', filtros.id.toString());
    }
    if (filtros?.tagId !== undefined) {
      params.append('TagId', filtros.tagId.toString());
    } else if (filtros?.categoria) {
      params.append('Categoria', filtros.categoria);
    }
    if (filtros?.ano !== undefined) {
      params.append('Ano', filtros.ano.toString());
    }
    if (filtros?.pastaId !== undefined) {
      params.append('PastaId', filtros.pastaId.toString());
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
    if (filtros?.apenasAtivos !== undefined) {
      params.append('ApenasAtivos', filtros.apenasAtivos.toString());
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
    const url = `/DocumentoServidor/listar${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<DocumentoServidorListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista documentos do servidor públicos (sem autenticação)
   */
  listarPublico: async (filtros?: DocumentoServidorPublicoFilters): Promise<DocumentoServidorPublicoListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.titulo) {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.ano !== undefined) {
      params.append('Ano', filtros.ano.toString());
    }
    if (filtros?.dataPublicacao) {
      params.append('DataPublicacao', filtros.dataPublicacao);
    }
    if (filtros?.tagIds && filtros.tagIds.length > 0) {
      filtros.tagIds.forEach(tagId => params.append('TagIds', tagId.toString()));
    }
    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/DocumentoServidor/listar-publico${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<DocumentoServidorPublicoListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtém documento do servidor por ID
   */
  obterPorId: async (id: number): Promise<DocumentoServidorDetalhe> => {
    try {
      const response = await apiClient.get<DocumentoServidorDetalhe>(`/DocumentoServidor/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Edita um documento do servidor existente
   */
  editar: async (id: number, data: EditarDocumentoServidorRequest): Promise<DocumentoServidorDetalhe> => {
    // Validações
    const erros: string[] = [
      ...validarTitulo(data.titulo),
      ...validarCategoria(data.categoria),
      ...validarDataPublicacao(data.dataPublicacao),
      ...validarArquivo(data.arquivo, false), // Arquivo opcional na edição
    ];

    if (erros.length > 0) {
      throw new Error(erros.join(' '));
    }

    try {
      const response = await apiClient.put<DocumentoServidorDetalhe>(
        `/DocumentoServidor/editar/${id}`,
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
   * Inativa um documento do servidor
   */
  inativar: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/DocumentoServidor/inativar/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Ativa um documento do servidor
   */
  ativar: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/DocumentoServidor/ativar/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
