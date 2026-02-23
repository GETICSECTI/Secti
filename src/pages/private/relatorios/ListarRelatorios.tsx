import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { ListarRelatorios as ListarRelatoriosComponent, type Relatorio } from '../../../components/admin/ListarRelatorios';
import { relatoriosService, type RelatorioListFilters } from '../../../services/relatoriosService';
import { tagService, type Tag } from '../../../services/tagService';
import { handleApiError } from '../../../utils/errorHandler';

export const ListarRelatorios = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [filtroId, setFiltroId] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroCaminho, setFiltroCaminho] = useState<string>('');
  const [filtroPastaId, setFiltroPastaId] = useState<string>('');
  const [filtroAno, setFiltroAno] = useState<string>('');
  const [filtroDataPublicacao, setFiltroDataPublicacao] = useState<string>('');
  const [filtroDataCriacao, setFiltroDataCriacao] = useState<string>('');
  const [filtroDataAtualizacao, setFiltroDataAtualizacao] = useState<string>('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('Todas');
  const [filtroUsuarioCriacaoId, setFiltroUsuarioCriacaoId] = useState<string>('');
  const [filtroUsuarioAtualizacaoId, setFiltroUsuarioAtualizacaoId] = useState<string>('');
  const [busca, setBusca] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroTags, setErroTags] = useState<string | null>(null);
  const [totalItens, setTotalItens] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tags, setTags] = useState<Tag[]>([]);
  const [appliedFiltros, setAppliedFiltros] = useState<RelatorioListFilters | undefined>(undefined);
  const [ordenarPor] = useState<string>('titulo');
  const [ordenarDescendente] = useState<boolean>(false);

  const getTipoFromNome = (nomeArquivo?: string, caminhoArquivo?: string): Relatorio['tipo'] => {
    const origem = nomeArquivo || caminhoArquivo || '';
    const parts = origem.split('.');
    if (parts.length < 2) return 'outro';
    const ext = parts.pop()?.toLowerCase();
    if (ext === 'pdf' || ext === 'xls' || ext === 'xlsx' || ext === 'csv') {
      return ext;
    }
    return 'outro';
  };

  // Verifica se um objeto de filtros contém algum filtro significativo
  const hasFiltersObject = (filtros: RelatorioListFilters | undefined) => {
    if (!filtros) return false;
    const keys = Object.keys(filtros).filter(k => k !== 'pagina' && k !== 'itensPorPagina' && k !== 'ordenarPor' && k !== 'ordenarDescendente');
    return keys.some(k => {
      const v = (filtros as Record<string, unknown>)[k];
      if (v === undefined || v === null) return false;
      if (typeof v === 'string') return String(v).trim() !== '';
      return true;
    });
  };

  const hasAnyFilterApplied = () => {
    const uiHas = Boolean(
      busca.trim() ||
      filtroCategoria ||
      filtroTipo !== 'Todos' ||
      filtroId ||
      filtroCaminho ||
      filtroPastaId ||
      filtroAno ||
      filtroDataPublicacao ||
      filtroDataCriacao ||
      filtroDataAtualizacao ||
      (filtroAtivo !== 'Todas') ||
      filtroUsuarioCriacaoId ||
      filtroUsuarioAtualizacaoId
    );
    const serverHas = hasFiltersObject(appliedFiltros);
    return uiHas || serverHas;
  };

  const getCurrentFilters = () => {
    if (hasAnyFilterApplied()) {
      return {
        id: filtroId ? Number(filtroId) : undefined,
        titulo: busca.trim() || undefined,
        caminho: filtroCaminho || undefined,
        categoria: filtroCategoria || undefined,
        tipo: filtroTipo && filtroTipo !== 'Todos' ? filtroTipo : undefined,
        pastaId: filtroPastaId ? Number(filtroPastaId) : undefined,
        ano: filtroAno ? Number(filtroAno) : undefined,
        dataPublicacao: filtroDataPublicacao || undefined,
        dataCriacao: filtroDataCriacao || undefined,
        dataAtualizacao: filtroDataAtualizacao || undefined,
        ativo: filtroAtivo === 'Sim' ? true : filtroAtivo === 'Nao' ? false : undefined,
        usuarioCriacaoId: filtroUsuarioCriacaoId ? Number(filtroUsuarioCriacaoId) : undefined,
        usuarioAtualizacaoId: filtroUsuarioAtualizacaoId ? Number(filtroUsuarioAtualizacaoId) : undefined,
        ordenarPor: ordenarPor,
        ordenarDescendente: ordenarDescendente,
        itensPorPagina: itemsPerPage,
      } as Partial<RelatorioListFilters & { tipo?: string }>;
    }
    if (appliedFiltros) return appliedFiltros;
    return {} as Partial<RelatorioListFilters>;
  };

  // Carregar relatórios com paginação (aceita filtros extras)
  const carregarRelatorios = useCallback(async (page = 1, filtrosExtra?: Partial<RelatorioListFilters>) => {
    setIsLoading(true);
    setErro(null);
    try {
      // Use only filtrosExtra provided by caller; do not read UI state here to avoid
      // triggering requests on every keystroke.
      const filtros: RelatorioListFilters = {
        ordenarPor: filtrosExtra?.ordenarPor || ordenarPor || 'dataPublicacao',
        ordenarDescendente: filtrosExtra?.ordenarDescendente !== undefined ? filtrosExtra!.ordenarDescendente! : ordenarDescendente ?? true,
        apenasAtivos: filtrosExtra?.apenasAtivos !== undefined ? filtrosExtra!.apenasAtivos! : true,
        pagina: filtrosExtra?.pagina ?? page,
        itensPorPagina: filtrosExtra?.itensPorPagina ?? itemsPerPage,
        ...(filtrosExtra || {}),
      } as RelatorioListFilters;

      const response = await relatoriosService.listar(filtros);

      let relatoriosFormatados: Relatorio[] = response.relatorios.map((relatorio) => ({
        id: relatorio.id,
        nome: relatorio.titulo,
        tipo: getTipoFromNome(relatorio.nomeArquivo, relatorio.caminhoArquivo),
        categoria: relatorio.categoria,
        dataPublicacao: relatorio.dataPublicacao,
        caminhoArquivo: relatorio.caminhoArquivo,
        nomeArquivo: relatorio.nomeArquivo,
        tags: relatorio.tags,
      }));

      // Apply client-side filters only if they were passed in filtrosExtra
      const filtrosExtraTyped = filtrosExtra as Partial<RelatorioListFilters & { tipo?: string }> | undefined;
      const tituloFiltro = filtrosExtraTyped?.titulo;
      const tipoFiltro = filtrosExtraTyped?.tipo;

      if (tituloFiltro) {
        relatoriosFormatados = relatoriosFormatados.filter(r => r.nome.toLowerCase().includes(tituloFiltro.toLowerCase()));
      }
      if (tipoFiltro) {
        relatoriosFormatados = relatoriosFormatados.filter(r => r.tipo === tipoFiltro);
      }

      // If client-side filtering was applied, paginate on client; otherwise use server totals
      const precisaFiltroLocal = Boolean(tituloFiltro || tipoFiltro);
      if (precisaFiltroLocal) {
        setTotalItens(relatoriosFormatados.length);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setRelatorios(relatoriosFormatados.slice(start, end));
      } else {
        setRelatorios(relatoriosFormatados);
        setTotalItens(response.totalItens);
      }

      setCurrentPage(page);
      setAppliedFiltros(hasFiltersObject(filtros) ? filtros : undefined);
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErro(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage, ordenarPor, ordenarDescendente]);

  const carregarTags = useCallback(async () => {
    setIsLoadingTags(true);
    setErroTags(null);
    try {
      const response = await tagService.listar({
        apenasAtivas: true,
        pagina: 1,
        itensPorPagina: 1000,
      });
      const tagsOrdenadas = [...response.itens].sort((a, b) => a.nome.localeCompare(b.nome));
      setTags(tagsOrdenadas);
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErroTags(mensagemErro);
    } finally {
      setIsLoadingTags(false);
    }
  }, []);

  useEffect(() => {
    carregarRelatorios();
  }, [carregarRelatorios]);

  useEffect(() => {
    carregarTags();
  }, [carregarTags]);

  // Buscar relatórios via endpoint
  const handleSearch = () => {
    carregarRelatorios(1, getCurrentFilters());
  };

  // Limpar filtros
  const handleClearSearch = () => {
    setBusca('');
    setFiltroTipo('Todos');
    setFiltroCategoria('');
    setFiltroId('');
    setFiltroCaminho('');
    setFiltroPastaId('');
    setFiltroAno('');
    setFiltroDataPublicacao('');
    setFiltroDataCriacao('');
    setFiltroDataAtualizacao('');
    setFiltroAtivo('Todas');
    setFiltroUsuarioCriacaoId('');
    setFiltroUsuarioAtualizacaoId('');
    setAppliedFiltros(undefined);
    carregarRelatorios(1, undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      await relatoriosService.inativar(id);
      // Recarregar lista mantendo filtros
      await carregarRelatorios(currentPage, getCurrentFilters());
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErro(mensagemErro);
    }
  };

  return (
    <PrivateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Relatórios</h1>
            <p className="text-gray-600 mt-2">
              {isLoading ? 'Carregando...' : `${totalItens} ${totalItens === 1 ? 'relatório encontrado' : 'relatórios encontrados'}`}
            </p>
          </div>
          <Link
            to="/admin/relatorios/criar"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0C2856] text-white font-medium rounded-lg hover:bg-[#195CE3] transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Relatório
          </Link>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar relatórios</h3>
                <p className="text-sm text-red-700 mt-1">{erro}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
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
                  placeholder="Digite o título do relatório..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                id="categoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.nome}>
                    {tag.nome}
                  </option>
                ))}
              </select>
              {isLoadingTags && (
                <p className="mt-1 text-xs text-gray-500">Carregando categorias...</p>
              )}
              {erroTags && (
                <p className="mt-1 text-xs text-red-600">{erroTags}</p>
              )}
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Arquivo
              </label>
              <select
                id="tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="block w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              >
                <option value="Todos">Todos</option>
                <option value="pdf">PDF</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            {/* Campos adicionais e botões */}
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID */}
              <div>
                <label htmlFor="filtroId" className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                <input
                  type="number"
                  id="filtroId"
                  value={filtroId}
                  onChange={(e) => setFiltroId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Ex: 123"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Caminho */}
              <div>
                <label htmlFor="filtroCaminho" className="block text-sm font-medium text-gray-700 mb-2">Caminho</label>
                <input
                  type="text"
                  id="filtroCaminho"
                  value={filtroCaminho}
                  onChange={(e) => setFiltroCaminho(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Digite o caminho..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* PastaId */}
              <div>
                <label htmlFor="filtroPastaId" className="block text-sm font-medium text-gray-700 mb-2">Pasta (ID)</label>
                <input
                  type="number"
                  id="filtroPastaId"
                  value={filtroPastaId}
                  onChange={(e) => setFiltroPastaId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Ex: 5"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Ano */}
              <div>
                <label htmlFor="filtroAno" className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                <input
                  type="number"
                  id="filtroAno"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Ex: 2024"
                  min={1900}
                  max={3000}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Data Publicacao */}
              <div>
                <label htmlFor="filtroDataPublicacao" className="block text-sm font-medium text-gray-700 mb-2">Data de Publicação</label>
                <input
                  type="datetime-local"
                  id="filtroDataPublicacao"
                  value={filtroDataPublicacao}
                  onChange={(e) => setFiltroDataPublicacao(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Data Criacao */}
              <div>
                <label htmlFor="filtroDataCriacao" className="block text-sm font-medium text-gray-700 mb-2">Data de Criação</label>
                <input
                  type="datetime-local"
                  id="filtroDataCriacao"
                  value={filtroDataCriacao}
                  onChange={(e) => setFiltroDataCriacao(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Data Atualizacao */}
              <div>
                <label htmlFor="filtroDataAtualizacao" className="block text-sm font-medium text-gray-700 mb-2">Data de Atualização</label>
                <input
                  type="datetime-local"
                  id="filtroDataAtualizacao"
                  value={filtroDataAtualizacao}
                  onChange={(e) => setFiltroDataAtualizacao(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Ativo */}
              <div>
                <label htmlFor="filtroAtivo" className="block text-sm font-medium text-gray-700 mb-2">Ativo</label>
                <select
                  id="filtroAtivo"
                  value={filtroAtivo}
                  onChange={(e) => setFiltroAtivo(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                >
                  <option value="Todas">Todas</option>
                  <option value="Sim">Sim</option>
                  <option value="Nao">Não</option>
                </select>
              </div>

              {/* Usuário Criação (ID) */}
              <div>
                <label htmlFor="filtroUsuarioCriacaoId" className="block text-sm font-medium text-gray-700 mb-2">Usuário Criação (ID)</label>
                <input
                  type="number"
                  id="filtroUsuarioCriacaoId"
                  value={filtroUsuarioCriacaoId}
                  onChange={(e) => setFiltroUsuarioCriacaoId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Ex: 10"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              {/* Usuário Atualização (ID) */}
              <div>
                <label htmlFor="filtroUsuarioAtualizacaoId" className="block text-sm font-medium text-gray-700 mb-2">Usuário Atualização (ID)</label>
                <input
                  type="number"
                  id="filtroUsuarioAtualizacaoId"
                  value={filtroUsuarioAtualizacaoId}
                  onChange={(e) => setFiltroUsuarioAtualizacaoId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Ex: 12"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !hasAnyFilterApplied()}
                  className="flex-1 cursor-pointer bg-[#0C2856] text-white px-4 py-2 rounded-md hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
                <button
                  onClick={handleClearSearch}
                  disabled={isLoading || !hasAnyFilterApplied()}
                  className="flex-1 px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">Carregando relatórios...</p>
          </div>
        ) : (
          <>
            <ListarRelatoriosComponent
              relatorios={relatorios}
              onDelete={handleDelete}
              emptyStateTitle="Nenhum relatório encontrado"
              emptyStateDescription="Crie um novo relatório para começar"
              showHeader={false}
            />
            {/* Paginação */}
            {totalItens > itemsPerPage && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItens)} de {totalItens} relatórios
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => carregarRelatorios(currentPage - 1, getCurrentFilters())}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => carregarRelatorios(currentPage + 1, getCurrentFilters())}
                    disabled={currentPage * itemsPerPage >= totalItens || isLoading}
                    className="px-4 py-2 bg-[#0C2856] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PrivateLayout>
  );
};
