import { apiClient } from '../lib/apiClient';
import { handleApiError } from '../utils/errorHandler';

/**
 * Faz o download de um relatório internamente e dispara o download no navegador
 * @param caminhoArquivo - Caminho relativo do arquivo
 * @param nomeArquivo - Nome do arquivo para download (opcional)
 */
export const downloadRelatorio = async (caminhoArquivo: string, nomeArquivo?: string): Promise<void> => {
  if (!caminhoArquivo) {
    throw new Error('Caminho do arquivo não informado');
  }

  const url = caminhoArquivo.startsWith('http') ? caminhoArquivo : `${window.location.origin}${caminhoArquivo}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo || caminhoArquivo.split('/').pop() || 'relatorio';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==================== INTERFACES ====================

export interface CadastrarRelatorioRequest {
  titulo: string;
  dataPublicacao: string; // Data completa
  caminho?: string;
  arquivo: File;
  tagIds?: number[];
}

export interface RelatorioResponse {
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

export interface RelatorioListItem {
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

export interface RelatorioListResponse {
  relatorios: RelatorioListItem[];
  totalItens: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
  caminhoFiltro?: string;
}

export interface RelatorioListFilters {
  caminho?: string;
  categoria?: string;
  id?: number;
  titulo?: string;
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

export interface RelatorioPublicoItem {
  id: number;
  titulo: string;
  caminhoArquivo: string;
  dataPublicacao: string; // Data completa do backend
}

export interface RelatorioPublicoListResponse {
  relatorios: RelatorioPublicoItem[];
  totalItens: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface RelatorioPublicoFilters {
  titulo?: string;
  dataPublicacao?: string;
  caminho?: string;
  categoria?: string;
  ordenarPor?: string;
  ordenarDescendente?: boolean;
  pagina?: number;
  itensPorPagina?: number;
}

export interface RelatorioDetalhe {
  id: number;
  titulo: string;
  categoria: string;
  caminhoArquivo: string;
  dataPublicacao: string; // Data completa do backend
  ativo: boolean;
  dataCriacao: string;
  caminho?: string;
}

export interface EditarRelatorioRequest {
  titulo: string;
  categoria: string;
  dataPublicacao: string; // Data completa
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
    const dataObj = new Date(data);
    if (dataObj.getFullYear() < 1900 || dataObj.getFullYear() > 3000) {
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

const buildFormData = (data: CadastrarRelatorioRequest | EditarRelatorioRequest): FormData => {
  const formData = new FormData();

  formData.append('Titulo', data.titulo.trim());
  formData.append('DataPublicacao', data.dataPublicacao.trim());

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

export const relatoriosService = {
  /**
   * Cadastra um novo relatório
   */
  cadastrar: async (data: CadastrarRelatorioRequest): Promise<RelatorioResponse> => {
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
      const response = await apiClient.post<RelatorioResponse>(
        '/Relatorio/cadastrar',
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
   * Lista relatórios com filtros e paginação
   */
  listar: async (filtros?: RelatorioListFilters): Promise<RelatorioListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.id !== undefined) {
      params.append('Id', filtros.id.toString());
    }
    if (filtros?.titulo) {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.caminho) {
      params.append('Caminho', filtros.caminho);
    }
    if (filtros?.categoria) {
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

    const queryString = params.toString();
    const url = `/Relatorio/listar${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<RelatorioListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Lista relatórios públicos (sem autenticação)
   */
  listarPublico: async (filtros?: RelatorioPublicoFilters): Promise<RelatorioPublicoListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.titulo) {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.dataPublicacao) {
      params.append('DataPublicacao', filtros.dataPublicacao);
    }
    if (filtros?.caminho) {
      params.append('Caminho', filtros.caminho);
    }
    if (filtros?.categoria) {
      params.append('Categoria', filtros.categoria);
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
    const url = `/Relatorio/listar-publico${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await apiClient.get<RelatorioPublicoListResponse>(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Obtém relatório por ID
   */
  obterPorId: async (id: number): Promise<RelatorioDetalhe> => {
    try {
      const response = await apiClient.get<RelatorioDetalhe>(`/Relatorio/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Edita um relatório existente
   */
  editar: async (id: number, data: EditarRelatorioRequest): Promise<RelatorioDetalhe> => {
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
      const response = await apiClient.put<RelatorioDetalhe>(
        `/Relatorio/editar/${id}`,
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
   * Inativa um relatório
   */
  inativar: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/Relatorio/inativar/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Ativa um relatório
   */
  ativar: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/Relatorio/ativar/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
