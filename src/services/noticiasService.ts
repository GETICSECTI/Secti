import { apiClient } from '../lib/apiClient';

// Types para requisição de cadastro de notícia
export interface CadastrarNoticiaRequest {
  titulo: string;
  conteudo: string;
  resumo?: string;
  slug?: string;
  imagemCapaUrl?: string;
  imagemCapa?: File;
  imagemCapaBase64?: string;
  autor?: string;
  destaque?: boolean;
  tagIds?: number[];
}

// Types para resposta de notícia cadastrada
export interface NoticiaResponse {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  imagemCapaUrl: string;
  autor: string;
  dataPublicacao: string;
  dataCriacao: string;
  dataAtualizacao: string;
  publicada: boolean;
  destaque: boolean;
  usuarioCriacaoNome: string;
}

// Type para notícia detalhada
export interface NoticiaDetalhada {
  id: number;
  titulo: string;
  slug: string;
  conteudo: string;
  resumo: string;
  imagemCapaUrl: string;
  autor: string;
  publicada: boolean;
  destaque: boolean;
  dataPublicacao: string;
  dataCriacao: string;
  dataAtualizacao: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

// Type para notícia na listagem
export interface NoticiaListagem {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  imagemCapaUrl: string;
  autor: string;
  publicada: boolean;
  destaque: boolean;
  dataPublicacao: string;
  dataCriacao: string;
  dataAtualizacao: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

// Type para notícia na listagem pública (inclui slug e autor)
export interface NoticiaListagemPublica {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  imagemCapaUrl: string;
  autor: string;
  publicada: boolean;
  destaque: boolean;
  dataPublicacao: string;
  dataCriacao: string;
  dataAtualizacao: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

// Type para resposta de listagem paginada
export interface NoticiaListResponse {
  itens: NoticiaListagem[];
  total: number;
  pagina: number;
  itensPorPagina: number;
}

// Type para resposta de listagem pública paginada
export interface NoticiaListPublicaResponse {
  itens: NoticiaListagemPublica[];
  total: number;
  pagina: number;
  itensPorPagina: number;
}

// Type para edição de notícia
export interface EditarNoticiaRequest {
  titulo: string;
  conteudo: string;
  resumo?: string;
  slug?: string;
  imagemCapaUrl?: string;
  imagemCapa?: File;
  autor?: string;
  destaque?: boolean;
  tagIds?: number[];
}

// Type para resposta de edição
export interface EditarNoticiaResponse {
  id: number;
  titulo: string;
  resumo: string;
  publicada: boolean;
  destaque: boolean;
  dataAtualizacao: string;
}

// Type para filtros de listagem
export interface NoticiaFiltros {
  id?: number;
  tituloFiltro?: string;
  dataPublicacao?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  apenasPublicadas?: boolean;
  usuarioCriacaoId?: number;
  usuarioAtualizacaoId?: number;
  pagina?: number;
  itensPorPagina?: number;
}

// Validações do frontend (espelham as validações do backend)
export const validarNoticia = (data: CadastrarNoticiaRequest): string[] => {
  const erros: string[] = [];

  // Título: obrigatório, mínimo 3 caracteres
  if (!data.titulo || data.titulo.trim().length < 3) {
    erros.push('Título é obrigatório e deve ter no mínimo 3 caracteres.');
  }

  // Conteúdo: obrigatório, mínimo 10 caracteres
  if (!data.conteudo || data.conteudo.trim().length < 10) {
    erros.push('Conteúdo é obrigatório e deve ter no mínimo 10 caracteres.');
  }

  // Imagem de capa: opcional, mas se fornecida deve ser URL válida (http:// ou https://)
  if (data.imagemCapaUrl && data.imagemCapaUrl.trim() !== '') {
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(data.imagemCapaUrl)) {
      erros.push('A URL da imagem de capa deve começar com http:// ou https://');
    }
  }

  return erros;
};

// Service de Notícias
export const noticiasService = {
  /**
   * Cadastra uma nova notícia no sistema
   *
   * Requisitos:
   * - Usuário deve estar autenticado
   * - Usuário deve ter acesso ao menu "Notícias"
   * - Usuário deve ter permissão de "Cadastrar"
   * - Administradores têm acesso total
   */
  cadastrar: async (data: CadastrarNoticiaRequest): Promise<NoticiaResponse> => {
    // Validar dados antes de enviar
    const errosValidacao = validarNoticia(data);
    if (errosValidacao.length > 0) {
      throw new Error(errosValidacao.join(' '));
    }

    console.log('[NoticiasService] Dados recebidos:', {
      titulo: data.titulo,
      autor: data.autor || 'não fornecido',
      imagemCapa: data.imagemCapa ? `File: ${data.imagemCapa.name} (${data.imagemCapa.size} bytes)` : 'não fornecida',
      imagemCapaUrl: data.imagemCapaUrl || 'não fornecida',
    });

    // Se houver arquivo de imagem, usar FormData
    if (data.imagemCapa) {
      const formData = new FormData();
      formData.append('Titulo', data.titulo);
      formData.append('Conteudo', data.conteudo);
      if (data.resumo) formData.append('Resumo', data.resumo);
      if (data.slug) formData.append('Slug', data.slug);
      if (data.autor) formData.append('Autor', data.autor);
      if (data.destaque !== undefined) formData.append('Destaque', data.destaque.toString());
      if (data.tagIds && data.tagIds.length > 0) {
        data.tagIds.forEach(tagId => formData.append('TagIds', tagId.toString()));
      }
      formData.append('ImagemCapa', data.imagemCapa);

      console.log('[NoticiasService] Enviando com FormData');
      console.log('[NoticiasService] FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      const response = await apiClient.post<NoticiaResponse>('/Noticia/cadastrar', formData);
      return response.data;
    }

    // Caso contrário, usar JSON
    console.log('[NoticiasService] Enviando com JSON');
    const payload = {
      titulo: data.titulo,
      conteudo: data.conteudo,
      resumo: data.resumo,
      slug: data.slug,
      imagemCapaUrl: data.imagemCapaUrl,
      autor: data.autor,
      destaque: data.destaque,
      tagIds: data.tagIds,
    };

    const response = await apiClient.post<NoticiaResponse>('/Noticia/cadastrar', payload);
    return response.data;
  },

  /**
   * Lista notícias com filtros e paginação
   */
  listar: async (filtros?: NoticiaFiltros): Promise<NoticiaListResponse> => {
    const params = new URLSearchParams();

    if (filtros?.id !== undefined) {
      params.append('id', filtros.id.toString());
    }
    if (filtros?.tituloFiltro) {
      params.append('tituloFiltro', filtros.tituloFiltro);
    }
    if (filtros?.dataPublicacao) {
      params.append('dataPublicacao', filtros.dataPublicacao);
    }
    if (filtros?.dataCriacao) {
      params.append('dataCriacao', filtros.dataCriacao);
    }
    if (filtros?.dataAtualizacao) {
      params.append('dataAtualizacao', filtros.dataAtualizacao);
    }
    if (filtros?.apenasPublicadas !== undefined) {
      params.append('apenasPublicadas', filtros.apenasPublicadas.toString());
    }
    if (filtros?.usuarioCriacaoId !== undefined) {
      params.append('usuarioCriacaoId', filtros.usuarioCriacaoId.toString());
    }
    if (filtros?.usuarioAtualizacaoId !== undefined) {
      params.append('usuarioAtualizacaoId', filtros.usuarioAtualizacaoId.toString());
    }
    if (filtros?.pagina !== undefined) {
      params.append('pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('itensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Noticia/listar${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<NoticiaListResponse>(url);
    return response.data;
  },

  /**
   * Lista notícias publicadas (endpoint público, sem autenticação)
   * Retorna apenas notícias com status Publicada, ordenadas por data de publicação (mais recentes primeiro)
   */
  listarPublico: async (filtros?: {
    tituloFiltro?: string;
    pagina?: number;
    itensPorPagina?: number;
  }): Promise<NoticiaListPublicaResponse> => {
    const params = new URLSearchParams();

    if (filtros?.tituloFiltro) {
      params.append('TituloFiltro', filtros.tituloFiltro);
    }
    if (filtros?.pagina !== undefined) {
      params.append('Pagina', filtros.pagina.toString());
    }
    if (filtros?.itensPorPagina !== undefined) {
      params.append('ItensPorPagina', filtros.itensPorPagina.toString());
    }

    const queryString = params.toString();
    const url = `/Noticia/listar-publico${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<NoticiaListPublicaResponse>(url);
    return response.data;
  },

  /**
   * Busca uma notícia por ID
   */
  buscarPorId: async (id: number): Promise<NoticiaDetalhada> => {
    const response = await apiClient.get<NoticiaDetalhada>(`/Noticia/${id}`);
    return response.data;
  },

  /**
   * Busca uma notícia publicada por slug - endpoint público, sem autenticação
   * Retorna 404 se o slug não existir ou a notícia não estiver publicada
   */
  buscarPublicoPorSlug: async (slug: string): Promise<NoticiaDetalhada> => {
    const response = await apiClient.get<NoticiaDetalhada>(`/Noticia/${slug}`);
    return response.data;
  },

  /**
   * Edita uma notícia existente
   */
  editar: async (id: number, data: EditarNoticiaRequest): Promise<EditarNoticiaResponse> => {
    // Validar dados antes de enviar
    const errosValidacao = validarNoticia(data);
    if (errosValidacao.length > 0) {
      throw new Error(errosValidacao.join(' '));
    }

    console.log('[NoticiasService] Editar - Dados recebidos:', {
      titulo: data.titulo,
      autor: data.autor || 'não fornecido',
      imagemCapa: data.imagemCapa ? `File: ${data.imagemCapa.name} (${data.imagemCapa.size} bytes)` : 'não fornecida',
      imagemCapaUrl: data.imagemCapaUrl || 'não fornecida',
    });

    // Se houver arquivo de imagem, usar FormData
    if (data.imagemCapa) {
      const formData = new FormData();
      formData.append('Titulo', data.titulo);
      formData.append('Conteudo', data.conteudo);
      if (data.resumo) formData.append('Resumo', data.resumo);
      if (data.slug) formData.append('Slug', data.slug);
      if (data.autor) formData.append('Autor', data.autor);
      if (data.destaque !== undefined) formData.append('Destaque', data.destaque.toString());
      if (data.tagIds && data.tagIds.length > 0) {
        data.tagIds.forEach(tagId => formData.append('TagIds', tagId.toString()));
      }
      formData.append('ImagemCapa', data.imagemCapa);

      console.log('[NoticiasService] Editar - Enviando com FormData');
      console.log('[NoticiasService] Editar - FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      const response = await apiClient.put<EditarNoticiaResponse>(`/Noticia/editar/${id}`, formData);
      return response.data;
    }

    // Caso contrário, usar JSON
    console.log('[NoticiasService] Editar - Enviando com JSON');
    const payload = {
      titulo: data.titulo,
      conteudo: data.conteudo,
      resumo: data.resumo,
      slug: data.slug,
      imagemCapaUrl: data.imagemCapaUrl,
      autor: data.autor,
      destaque: data.destaque,
      tagIds: data.tagIds,
    };

    const response = await apiClient.put<EditarNoticiaResponse>(`/Noticia/editar/${id}`, payload);
    return response.data;
  },

  /**
   * Inativa (despublica) uma notícia
   */
  inativar: async (id: number): Promise<void> => {
    await apiClient.post(`/Noticia/inativar/${id}`);
  },

  /**
   * Ativa (publica) uma notícia
   */
  ativar: async (id: number): Promise<void> => {
    await apiClient.post(`/Noticia/ativar/${id}`);
  },
};

