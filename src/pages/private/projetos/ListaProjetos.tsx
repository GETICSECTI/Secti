import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { TabelaProjetos, type ProjetoAdmin } from '../../../components/admin/TabelaProjetos';
import { projetosService, type ProjetoListResponse, type ProjetoFiltros } from '../../../services/projetosService';
import { handleApiError } from '../../../utils/errorHandler';

export const ListaProjetos = () => {
  const [projetos, setProjetos] = useState<ProjetoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [appliedFiltros, setAppliedFiltros] = useState<ProjetoFiltros | undefined>(undefined);
  const [ordenarPor] = useState<string>('titulo');
  const [ordenarDescendente] = useState<boolean>(false);

  // Carregar projetos da API
  const loadProjetos = useCallback(async (page = 1, filtrosExtra?: Partial<ProjetoFiltros>) => {
    try {
      setLoading(true);
      setError(null);

      // Use apenas os filtros passados explicitamente pelo chamador (getCurrentFilters)
      // Se filtrosExtra estiver undefined, realiza listagem padrão (sem filtros adicionais)
      const filtros: ProjetoFiltros = {
        ordenarPor: filtrosExtra?.ordenarPor || ordenarPor,
        ordenarDescendente: filtrosExtra?.ordenarDescendente !== undefined ? filtrosExtra!.ordenarDescendente! : ordenarDescendente,
        pagina: filtrosExtra?.pagina ?? page,
        itensPorPagina: filtrosExtra?.itensPorPagina ?? itemsPerPage,
        ...(filtrosExtra || {}),
      } as ProjetoFiltros;

      const response: ProjetoListResponse = await projetosService.listar(filtros);

      // Converter dados da API para o formato esperado pelo componente
      const projetosFormatted: ProjetoAdmin[] = response.projetos.map(item => ({
        id: item.id,
        titulo: item.titulo,
        descricao: item.fotoCapaCaminho ? 'Com capa' : 'Sem capa',
        fotoCapaCaminho: item.fotoCapaCaminho,
        logoCaminho: item.logoCaminho,
        url: item.url,
        ativo: item.ativo,
        dataCriacao: item.dataCriacao,
      }));

      setProjetos(projetosFormatted);
      setTotalItems(response.totalItens);
      setCurrentPage(response.paginaAtual);
      // marcar filtros aplicados (dirty) quando houver campos além de pagina/itensPorPagina
      const hasFiltersObject = (f?: ProjetoFiltros | undefined) => {
        if (!f) return false;
        const keys = Object.keys(f).filter(k => k !== 'pagina' && k !== 'itensPorPagina' && k !== 'ordenarPor' && k !== 'ordenarDescendente');
        return keys.some(k => {
          const v = (f as Record<string, unknown>)[k];
          if (v === undefined || v === null) return false;
          if (typeof v === 'string') return String(v).trim() !== '';
          return true;
        });
      };

      setAppliedFiltros(hasFiltersObject(filtros) ? filtros : undefined);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, ordenarPor, ordenarDescendente]);

  useEffect(() => {
    loadProjetos(1);
  }, [loadProjetos]);

  // Função para excluir projeto (inativar)
  const handleDelete = async (id: number) => {
    try {
      await projetosService.inativar(id);
      // Recarregar lista após inativar
      await loadProjetos(currentPage, getCurrentFilters());
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  // Função para ativar projeto
  const handleActivate = async (id: number) => {
    try {
      await projetosService.ativar(id);
      // Recarregar lista após ativar
      await loadProjetos(currentPage, getCurrentFilters());
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const hasFiltersObject = (f?: ProjetoFiltros | undefined) => {
    if (!f) return false;
    const keys = Object.keys(f).filter(k => k !== 'pagina' && k !== 'itensPorPagina' && k !== 'ordenarPor' && k !== 'ordenarDescendente');
    return keys.some(k => {
      const v = (f as Record<string, unknown>)[k];
      if (v === undefined || v === null) return false;
      if (typeof v === 'string') return String(v).trim() !== '';
      return true;
    });
  };

  const hasAnyFilterApplied = () => {
    const uiHas = Boolean(busca.trim() || filtroStatus !== 'Todos');
    const serverHas = hasFiltersObject(appliedFiltros);
    return uiHas || serverHas;
  };

  const getCurrentFilters = () => {
    if (hasAnyFilterApplied()) {
      return {
        titulo: busca.trim() || undefined,
        apenasAtivos: filtroStatus === 'Ativo' ? true : filtroStatus === 'Inativo' ? false : undefined,
        ordenarPor: ordenarPor,
        ordenarDescendente: ordenarDescendente,
        itensPorPagina: itemsPerPage,
      } as Partial<ProjetoFiltros>;
    }
    if (appliedFiltros) return appliedFiltros;
    return {} as Partial<ProjetoFiltros>;
  };

  // Buscar projetos
  const handleSearch = () => {
    loadProjetos(1, getCurrentFilters());
  };

  // Limpar busca
  const handleClearSearch = () => {
    setBusca('');
    setFiltroStatus('Todos');
    setAppliedFiltros(undefined);
    loadProjetos(1, undefined);
  };

  return (
    <PrivateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Projetos</h1>
            <p className="text-gray-600 mt-2">
              {loading ? 'Carregando...' : `${totalItems} ${totalItems === 1 ? 'projeto encontrado' : 'projetos encontrados'}`}
            </p>
          </div>
          <Link
            to="/admin/projetos/criar"
            className="inline-flex items-center justify-center gap-2 bg-[#0C2856] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Projeto</span>
          </Link>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Busca */}
            <div className="flex-1">
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Título
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                  placeholder="Digite o título..."
                />
              </div>
            </div>

            {/* Filtro Status */}
            <div className="sm:min-w-max">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="block cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              >
                <option value="Todos">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSearch}
                disabled={loading || !hasAnyFilterApplied()}
                className="flex-1 cursor-pointer bg-[#0C2856] text-white px-4 py-2 rounded-md hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
              <button
                onClick={handleClearSearch}
                disabled={loading || !hasAnyFilterApplied()}
                className="flex-1 px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2856]"></div>
              <span className="ml-2 text-gray-600">Carregando projetos...</span>
            </div>
          </div>
        ) : (
          <TabelaProjetos
            projetos={projetos}
            onDelete={handleDelete}
            onActivate={handleActivate}
            emptyMessage={busca || filtroStatus !== 'Todos' ? 'Não há nenhum projeto com esse filtro.' : undefined}
          />
        )}

        {/* Paginação */}
        {totalItems > itemsPerPage && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de <span className="font-medium">{totalItems}</span> resultados
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
              <button
                onClick={() => {
                  loadProjetos(currentPage - 1, getCurrentFilters());
                }}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 cursor-pointer border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{Math.ceil(totalItems / itemsPerPage)}</span>
              </span>
              <button
                onClick={() => {
                  loadProjetos(currentPage + 1, getCurrentFilters());
                }}
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || loading}
                className="px-3 py-1 cursor-pointer border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};

