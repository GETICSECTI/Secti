import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { ListarEditais, type Edital } from '../../../components/admin/ListarEditais';
import { editaisService, type EditalListFilters, type EditalListResponse } from '../../../services/editaisService';
import { tagService, type Tag } from '../../../services/tagService';
import { handleApiError } from '../../../utils/errorHandler';

export const ListarEdital = () => {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [filtroId, setFiltroId] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroPastaId, setFiltroPastaId] = useState<string>('');
  const [filtroCaminho, setFiltroCaminho] = useState<string>('');
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
  const [appliedFiltros, setAppliedFiltros] = useState<EditalListFilters | undefined>(undefined);
  const [ordenarPor] = useState<string>('titulo');
  const [ordenarDescendente] = useState<boolean>(false);

  const getTipoFromNome = (nomeArquivo?: string, caminhoArquivo?: string): Edital['tipo'] => {
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
  const hasFiltersObject = (filtros: EditalListFilters | undefined) => {
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
      filtroCaminho ||
      filtroAno ||
      filtroId ||
      filtroPastaId ||
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
        // prefer tagId
        tagId: filtroCategoria ? Number(filtroCategoria) : undefined,
        caminho: filtroCaminho || undefined,
        ano: filtroAno ? Number(filtroAno) : undefined,
        pastaId: filtroPastaId ? Number(filtroPastaId) : undefined,
        dataPublicacao: filtroDataPublicacao || undefined,
        dataCriacao: filtroDataCriacao || undefined,
        dataAtualizacao: filtroDataAtualizacao || undefined,
        ativo: filtroAtivo === 'Sim' ? true : filtroAtivo === 'Nao' ? false : undefined,
        usuarioCriacaoId: filtroUsuarioCriacaoId ? Number(filtroUsuarioCriacaoId) : undefined,
        usuarioAtualizacaoId: filtroUsuarioAtualizacaoId ? Number(filtroUsuarioAtualizacaoId) : undefined,
        ordenarPor: ordenarPor,
        ordenarDescendente: ordenarDescendente,
        itensPorPagina: itemsPerPage,
      } as Partial<EditalListFilters>;
    }
    if (appliedFiltros) return appliedFiltros;
    return {} as Partial<EditalListFilters>;
  };

  // Carregar editais com paginação no servidor (aceita filtros extras)
  const carregarEditais = useCallback(async (page = 1, filtrosExtra?: Partial<EditalListFilters>) => {
    setIsLoading(true);
    setErro(null);
    try {
      const filtros: EditalListFilters = {
        ordenarPor: filtrosExtra?.ordenarPor || ordenarPor || 'titulo',
        ordenarDescendente: filtrosExtra?.ordenarDescendente !== undefined ? filtrosExtra!.ordenarDescendente! : ordenarDescendente ?? false,
        apenasAtivos: filtrosExtra?.apenasAtivos !== undefined ? filtrosExtra!.apenasAtivos! : true,
        pagina: page,
        itensPorPagina: filtrosExtra?.itensPorPagina || itemsPerPage,
        ...(filtrosExtra || {}),
      } as EditalListFilters;

      const response: EditalListResponse = await editaisService.listar(filtros);

      const editaisFormatados: Edital[] = response.editais.map((edital) => ({
        id: edital.id,
        nome: edital.titulo,
        tipo: getTipoFromNome(edital.nomeArquivo, edital.caminhoArquivo),
        dataPublicacao: edital.dataPublicacao,
        caminhoArquivo: edital.caminhoArquivo,
        nomeArquivo: edital.nomeArquivo,
        tags: edital.tags,
      }));

      setEditais(editaisFormatados);
      setTotalItens(response.totalItens);
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
      const response = await tagService.listarPublico({ nome: undefined, pagina: 1, itensPorPagina: 1000 });
      const mapped = (response.tags || []).map(t => ({ id: t.id, nome: t.nome, ativo: true, dataCriacao: '' }));
      const tagsOrdenadas = [...mapped].sort((a, b) => a.nome.localeCompare(b.nome));
      setTags(tagsOrdenadas);
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErroTags(mensagemErro);
    } finally {
      setIsLoadingTags(false);
    }
  }, []);

  useEffect(() => {
    carregarEditais();
  }, [carregarEditais]);

  useEffect(() => {
    carregarTags();
  }, [carregarTags]);

  // Buscar editais via endpoint
  const handleSearch = () => {
    setCurrentPage(1);
    const filtros = getCurrentFilters();
    carregarEditais(1, filtros);
  };

  // Limpar filtros
  const handleClearSearch = () => {
    setBusca('');
    setFiltroId('');
    setFiltroCategoria('');
    setFiltroPastaId('');
    setFiltroCaminho('');
    setFiltroAno('');
    setFiltroDataPublicacao('');
    setFiltroDataCriacao('');
    setFiltroDataAtualizacao('');
    setFiltroAtivo('Todas');
    setFiltroUsuarioCriacaoId('');
    setFiltroUsuarioAtualizacaoId('');
    setAppliedFiltros(undefined);
    carregarEditais(1, undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      await editaisService.inativar(id);
      const current = getCurrentFilters();
      await carregarEditais(currentPage, current as Partial<EditalListFilters>);
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Editais</h1>
            <p className="text-gray-600 mt-2">
              {isLoading ? 'Carregando...' : `${totalItens} ${totalItens === 1 ? 'edital encontrado' : 'editais encontrados'}`}
            </p>
          </div>
          <Link
            to="/admin/editais/criar"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0C2856] text-white font-medium rounded-lg hover:bg-[#195CE3] transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Edital
          </Link>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar editais</h3>
                <p className="text-sm text-red-700 mt-1">{erro}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div>
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Nome
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
                  placeholder="Digite o nome..."
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={String(tag.id)}>
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

            {/* Campos adicionais e botões */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Usuários (IDs) e botões */}
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
            <p className="text-sm text-gray-500">Carregando editais...</p>
          </div>
        ) : (
          <>
            <ListarEditais
              editais={editais}
              onDelete={handleDelete}
              emptyStateTitle="Nenhum edital encontrado"
              emptyStateDescription="Crie um novo edital para começar"
              showHeader={false}
            />

            {/* Paginação */}
            {totalItens > itemsPerPage && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItens)}</span> de <span className="font-medium">{totalItens}</span> resultados
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                  <button
                    onClick={() => {
                      const current = getCurrentFilters();
                      carregarEditais(currentPage - 1, current as Partial<EditalListFilters>);
                    }}
                    disabled={currentPage === 1 || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{Math.ceil(totalItens / itemsPerPage)}</span>
                  </span>
                  <button
                    onClick={() => {
                      const current = getCurrentFilters();
                      carregarEditais(currentPage + 1, current as Partial<EditalListFilters>);
                    }}
                    disabled={currentPage === Math.ceil(totalItens / itemsPerPage) || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
