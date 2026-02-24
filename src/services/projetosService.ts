import { apiClient } from '../lib/apiClient';

// Type para pergunta frequente
export interface PerguntaFrequenteAPI {
  id: number;
  pergunta: string;
  resposta: string;
  ordem: number;
}

// Payload para envio de perguntas frequentes
export interface PerguntaFrequentePayload {
  pergunta: string;
  resposta: string;
  ordem: number;
}

// Types para requisição de cadastro de projeto
export interface CadastrarProjetoRequest {
  titulo: string;
  descricao?: string;
  url?: string;
  perguntasFrequentes?: PerguntaFrequentePayload[];
  fotoCapa?: File;
  logo?: File;
}

// Types para resposta de projeto cadastrado
export interface ProjetoResponse {
  id: number;
  titulo: string;
  urlProjeto: string;
  descricao: string;
  fotoCapaCaminho: string;
  logoCaminho: string;
  url: string;
  perguntasFrequentes: PerguntaFrequenteAPI[];
  dataCriacao: string;
}

// Type para projeto detalhado
export interface ProjetoDetalhado {
  id: number;
  titulo: string;
  urlProjeto: string;
  descricao: string;
  fotoCapaCaminho: string;
  logoCaminho: string;
  url: string;
  perguntasFrequentes: PerguntaFrequenteAPI[];
  ativo: boolean;
  dataCriacao: string;
}

// Type para projeto na listagem
export interface ProjetoListagem {
  id: number;
  titulo: string;
  urlProjeto: string;
  fotoCapaCaminho: string;
  logoCaminho: string;
  url: string;
  perguntasFrequentes: PerguntaFrequenteAPI[];
  ativo: boolean;
  dataCriacao: string;
}

// Type para resposta de listagem paginada
export interface ProjetoListResponse {
  projetos: ProjetoListagem[];
  totalItens: number;
  paginaAtual: number;
  totalPaginas: number;
}

// Type para edição de projeto
export interface EditarProjetoRequest {
  titulo: string;
  descricao?: string;
  url?: string;
  perguntasFrequentes?: PerguntaFrequentePayload[];
  fotoCapa?: File;
  logo?: File;
}

// Type para resposta de edição
export interface EditarProjetoResponse {
  id: number;
  titulo: string;
  urlProjeto: string;
  descricao: string;
  fotoCapaCaminho: string;
  logoCaminho: string;
  url: string;
  perguntasFrequentes: PerguntaFrequenteAPI[];
  ativo: boolean;
  dataCriacao: string;
}

// Type para filtros de listagem
export interface ProjetoFiltros {
  pagina?: number;
  itensPorPagina?: number;
  ordenarPor?: string;
  ordenarDescendente?: boolean;
  apenasAtivos?: boolean;
  titulo?: string;
}

// Validações do frontend
export const validarProjeto = (data: CadastrarProjetoRequest | EditarProjetoRequest): string[] => {
  const erros: string[] = [];

  // Título: obrigatório
  if (!data.titulo || data.titulo.trim().length === 0) {
    erros.push('Título é obrigatório.');
  }

  // URL: opcional, mas se fornecida deve ser válida
  if (data.url && data.url.trim() !== '') {
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(data.url)) {
      erros.push('A URL deve começar com http:// ou https://');
    }
  }

  return erros;
};

// Service de Projetos
export const projetosService = {
  /**
   * Cadastra um novo projeto no sistema
   */
  cadastrar: async (data: CadastrarProjetoRequest): Promise<ProjetoResponse> => {
    // Validar dados antes de enviar
    const errosValidacao = validarProjeto(data);
    if (errosValidacao.length > 0) {
      throw new Error(errosValidacao.join(' '));
    }

    console.log('[ProjetosService] Dados recebidos:', {
      titulo: data.titulo,
      fotoCapa: data.fotoCapa ? `File: ${data.fotoCapa.name} (${data.fotoCapa.size} bytes)` : 'não fornecida',
      logo: data.logo ? `File: ${data.logo.name} (${data.logo.size} bytes)` : 'não fornecida',
    });

    const formData = new FormData();
    formData.append('Titulo', data.titulo);
    if (data.descricao) formData.append('Descricao', data.descricao);
    if (data.url) formData.append('Url', data.url);
    if (data.perguntasFrequentes && data.perguntasFrequentes.length > 0) {
      formData.append('PerguntasFrequentes', JSON.stringify(data.perguntasFrequentes));
    }
    if (data.fotoCapa) {
      console.log('[ProjetosService] Anexando FotoCapa:', data.fotoCapa.name);
      formData.append('FotoCapa', data.fotoCapa);
    }
    if (data.logo) {
      console.log('[ProjetosService] Anexando Logo:', data.logo.name);
      formData.append('Logo', data.logo);
    }

    console.log('[ProjetosService] FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    const response = await apiClient.post<ProjetoResponse>('/Projeto/cadastrar', formData);
    return response.data;
  },

  /**
   * Lista projetos com filtros e paginação
   */
  listar: async (filtros?: ProjetoFiltros): Promise<ProjetoListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }
    if (filtros?.titulo !== undefined && filtros.titulo !== '') {
      params.append('Titulo', filtros.titulo);
    }
    if (filtros?.ordenarPor !== undefined) {
      params.append('OrdenarPor', filtros.ordenarPor);
    }
    if (filtros?.ordenarDescendente !== undefined) {
      params.append('OrdenarDescendente', filtros.ordenarDescendente.toString());
    }
    if (filtros?.apenasAtivos !== undefined) {
      params.append('ApenasAtivos', filtros.apenasAtivos.toString());
    }

    const queryString = params.toString();
    const url = `/Projeto/listar${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ProjetoListResponse>(url);
    return response.data;
  },

  /**
   * Lista projetos públicos (apenas ativos, sem autenticação)
   */
  listarPublico: async (filtros?: {
    pagina?: number;
    itensPorPagina?: number;
  }): Promise<{
    projetos: ProjetoListagem[];
    totalItens: number;
    pagina: number;
    itensPorPagina: number;
    totalPaginas: number;
  }> => {
    const params = new URLSearchParams();

    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Projeto/listar-publico${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Busca um projeto por ID
   */
  buscarPorId: async (id: number): Promise<ProjetoDetalhado> => {
    const response = await apiClient.get<ProjetoDetalhado>(`/Projeto/${id}`);
    return response.data;
  },

  /**
   * Busca um projeto ativo por UrlProjeto (slug) - endpoint público
   */
  buscarPublicoPorSlug: async (slug: string): Promise<ProjetoDetalhado> => {
    const response = await apiClient.get<ProjetoDetalhado>(`/Projeto/${slug}`);
    return response.data;
  },

  /**
   * Edita um projeto existente
   */
  editar: async (id: number, data: EditarProjetoRequest): Promise<EditarProjetoResponse> => {
    // Validar dados antes de enviar
    const errosValidacao = validarProjeto(data);
    if (errosValidacao.length > 0) {
      throw new Error(errosValidacao.join(' '));
    }

    console.log('[ProjetosService] Editar - Dados recebidos:', {
      titulo: data.titulo,
      fotoCapa: data.fotoCapa ? `File: ${data.fotoCapa.name} (${data.fotoCapa.size} bytes)` : 'não fornecida',
      logo: data.logo ? `File: ${data.logo.name} (${data.logo.size} bytes)` : 'não fornecida',
    });

    const formData = new FormData();
    formData.append('Titulo', data.titulo);
    if (data.descricao) formData.append('Descricao', data.descricao);
    if (data.url) formData.append('Url', data.url);
    if (data.perguntasFrequentes && data.perguntasFrequentes.length > 0) {
      formData.append('PerguntasFrequentes', JSON.stringify(data.perguntasFrequentes));
    }
    if (data.fotoCapa) {
      console.log('[ProjetosService] Editar - Anexando FotoCapa:', data.fotoCapa.name);
      formData.append('FotoCapa', data.fotoCapa);
    }
    if (data.logo) {
      console.log('[ProjetosService] Editar - Anexando Logo:', data.logo.name);
      formData.append('Logo', data.logo);
    }

    console.log('[ProjetosService] Editar - FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    // PUT é o método correto para edição, o interceptor do apiClient já remove o Content-Type
    // para que o navegador defina automaticamente o boundary correto para multipart/form-data
    const response = await apiClient.put<EditarProjetoResponse>(`/Projeto/editar/${id}`, formData);
    return response.data;
  },

  /**
   * Inativa um projeto
   */
  inativar: async (id: number): Promise<void> => {
    await apiClient.post(`/Projeto/inativar/${id}`);
  },

  /**
   * Ativa um projeto
   */
  ativar: async (id: number): Promise<void> => {
    await apiClient.post(`/Projeto/ativar/${id}`);
  },
};
