import { apiClient } from '../lib/apiClient';

export interface Permissao {
  id: number;
  nome: string;
  descricao: string;
  codigo: string;
  modulo: string;
}

export interface PermissaoInfo {
  podeCadastrar: boolean;
  podeEditar: boolean;
  podeSuspenderHabilitar: boolean;
}

export interface Menu {
  id: number;
  nome: string;
  descricao: string;
  rota: string;
  icone: string;
  ordem?: number;
  menuPaiId?: number;
  menuPaiNome?: string;
  subMenus?: string[];
}

export interface Perfil {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  permissoes?: string[];
  menus?: Menu[];
  quantidadeUsuarios?: number;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface PerfilListaItem {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  quantidadeUsuarios: number;
  dataCriacao: string;
}

export interface PerfilResponse {
  perfis: PerfilListaItem[];
  totalItens: number;
  paginaAtual: number;
  totalPaginas: number;
  itensPorPagina: number;
}

export interface CadastrarPerfilRequest {
  nome: string;
  descricao: string;
  menusIds: number[];
  permissoes: PermissaoInfo;
}

export interface AtualizarPerfilRequest {
  nome: string;
  descricao: string;
  menusIds: number[];
  permissoes: PermissaoInfo;
}

export interface ModuloPermissoes {
  modulo: string;
  permissoes: Permissao[];
}

export interface ListarPermissoesResponse {
  modulos: ModuloPermissoes[];
  totalPermissoes: number;
}

export interface ListarMenusResponse {
  menus: Menu[];
  totalMenus: number;
}

export interface AtribuirPermissoesRequest {
  permissoesIds: number[];
}

export interface RemoverPermissoesRequest {
  permissoesIds: number[];
}

export interface AtribuirMenusRequest {
  menusIds: number[];
  incluirMenusFilhos: boolean;
}

export interface RemoverMenusRequest {
  menusIds: number[];
  removerMenusFilhos: boolean;
}

export interface SuspenderPerfilRequest {
  confirmar: boolean;
}

const perfilService = {
  // CRUD Operations
  async cadastrar(data: CadastrarPerfilRequest): Promise<Perfil> {
    const response = await apiClient.post('/Perfil/cadastrar', data);
    return response.data;
  },

  async listar(filtros?: {
    nomeFiltro?: string;
    ordenarPor?: string;
    ordenarDescendente?: boolean;
    pagina?: number;
    itensPorPagina?: number;
  }): Promise<PerfilResponse> {
    const params = new URLSearchParams();

    if (filtros) {
      if (filtros.nomeFiltro) params.append('NomeFiltro', filtros.nomeFiltro);
      if (filtros.ordenarPor) params.append('OrdenarPor', filtros.ordenarPor);
      if (filtros.ordenarDescendente !== undefined) params.append('OrdenarDescendente', String(filtros.ordenarDescendente));
      if (filtros.pagina !== undefined) params.append('Pagina', String(filtros.pagina));
      if (filtros.itensPorPagina !== undefined) params.append('ItensPorPagina', String(filtros.itensPorPagina));
    }

    const response = await apiClient.get('/Perfil/listar', { params });
    return response.data;
  },

  async obterPorId(id: number): Promise<Perfil> {
    const response = await apiClient.get(`/Perfil/${id}`);
    return response.data;
  },

  async atualizar(id: number, data: AtualizarPerfilRequest): Promise<Perfil> {
    const response = await apiClient.put(`/Perfil/atualizar/${id}`, data);
    return response.data;
  },

  async validarNome(nome: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/Perfil/validar-nome/${nome}`);
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // Suspender e Habilitar
  async suspender(id: number, confirmar: boolean = true): Promise<void> {
    await apiClient.post(`/Perfil/suspender/${id}`, { confirmar });
  },

  async habilitar(id: number): Promise<void> {
    await apiClient.post(`/Perfil/habilitar/${id}`);
  },

  // Permissões
  async listarPermissoes(): Promise<ListarPermissoesResponse> {
    const response = await apiClient.get('/Perfil/permissoes/listar');
    return response.data;
  },

  async atribuirPermissoes(id: number, data: AtribuirPermissoesRequest): Promise<void> {
    await apiClient.post(`/Perfil/${id}/permissoes/atribuir`, data);
  },

  async removerPermissoes(id: number, data: RemoverPermissoesRequest): Promise<void> {
    await apiClient.post(`/Perfil/${id}/permissoes/remover`, data);
  },

  // Menus
  async listarMenus(): Promise<ListarMenusResponse> {
    const response = await apiClient.get('/Perfil/menus/listar');
    return response.data;
  },

  async atribuirMenus(id: number, data: AtribuirMenusRequest): Promise<void> {
    await apiClient.post(`/Perfil/${id}/menus/atribuir`, data);
  },

  async removerMenus(id: number, data: RemoverMenusRequest): Promise<void> {
    await apiClient.post(`/Perfil/${id}/menus/remover`, data);
  },
};

export { perfilService };

