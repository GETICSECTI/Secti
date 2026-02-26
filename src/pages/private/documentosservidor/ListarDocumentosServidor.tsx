import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { ListarDocumentosServidor as ListarDocumentosServidorComponent, type DocumentoServidor } from '../../../components/admin/ListarDocumentosServidor';
import { documentosServidorService, type DocumentoServidorListFilters, type DocumentoServidorListResponse } from '../../../services/documentosServidorService';
import { tagService, type Tag } from '../../../services/tagService';
import { handleApiError } from '../../../utils/errorHandler';

export const ListarDocumentosServidor = () => {
  const [documentos, setDocumentos] = useState<DocumentoServidor[]>([]);
  const [filtroAno, setFiltroAno] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroId, setFiltroId] = useState<string>('');
  const [filtroPastaId, setFiltroPastaId] = useState<string>('');
  const [filtroTagId, setFiltroTagId] = useState<string>('');
  const [filtroDataPublicacao, setFiltroDataPublicacao] = useState<string>('');
  const [filtroDataCriacao, setFiltroDataCriacao] = useState<string>('');
  const [filtroDataAtualizacao, setFiltroDataAtualizacao] = useState<string>('');
  const [busca, setBusca] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erroTags, setErroTags] = useState<string | null>(null);
  const [totalItens, setTotalItens] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tags, setTags] = useState<Tag[]>([]);
  const [appliedFiltros, setAppliedFiltros] = useState<DocumentoServidorListFilters | undefined>(undefined);
  const [ordenarPor] = useState<string>('dataPublicacao');
  const [ordenarDescendente] = useState<boolean>(true);

  const getTipoFromNome = (nomeArquivo?: string, caminhoArquivo?: string): DocumentoServidor['tipo'] => {
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
  const hasFiltersObject = (filtros: DocumentoServidorListFilters | undefined) => {
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
      filtroAno ||
      filtroId ||
      filtroPastaId ||
      filtroTagId ||
      filtroDataPublicacao ||
      filtroDataCriacao ||
      filtroDataAtualizacao
    );
    const serverHas = hasFiltersObject(appliedFiltros);
    return uiHas || serverHas;
  };

  const getCurrentFilters = () => {
    if (hasAnyFilterApplied()) {
      const categoriaFiltro = filtroCategoria ? Number(filtroCategoria) : undefined;
      return {
        id: filtroId ? Number(filtroId) : undefined,
        titulo: busca.trim() || undefined,
        categoria: categoriaFiltro || undefined,
        ano: filtroAno ? Number(filtroAno) : undefined,
        pastaId: filtroPastaId ? Number(filtroPastaId) : undefined,
        tagId: filtroTagId ? Number(filtroTagId) : undefined,
        dataPublicacao: filtroDataPublicacao || undefined,
        dataCriacao: filtroDataCriacao || undefined,
        dataAtualizacao: filtroDataAtualizacao || undefined,
        ordenarPor: ordenarPor,
        ordenarDescendente: ordenarDescendente,
        itensPorPagina: itemsPerPage,
      } as Partial<DocumentoServidorListFilters>;
    }
    if (appliedFiltros) return appliedFiltros;
    return {} as Partial<DocumentoServidorListFilters>;
  };

  // Carregar documentos com paginação no servidor (aceita filtros extras)
  const carregarDocumentos = useCallback(async (page = 1, filtrosExtra?: Partial<DocumentoServidorListFilters>) => {
    setIsLoading(true);
    setErro(null);
    try {
      const filtros: DocumentoServidorListFilters = {
        ordenarPor: filtrosExtra?.ordenarPor || ordenarPor || 'dataPublicacao',
        ordenarDescendente: filtrosExtra?.ordenarDescendente !== undefined ? filtrosExtra!.ordenarDescendente! : ordenarDescendente ?? true,
        apenasAtivos: filtrosExtra?.apenasAtivos !== undefined ? filtrosExtra!.apenasAtivos! : true,
        pagina: page,
        itensPorPagina: filtrosExtra?.itensPorPagina || itemsPerPage,
        ...(filtrosExtra || {}),
      } as DocumentoServidorListFilters;

      const response: DocumentoServidorListResponse = await documentosServidorService.listar(filtros);

      const documentosFormatados: DocumentoServidor[] = response.documentos.map((doc) => ({
        id: doc.id,
        nome: doc.titulo,
        tipo: getTipoFromNome(doc.nomeArquivo, doc.caminhoArquivo),
        categoria: doc.categoria,
        dataPublicacao: doc.dataPublicacao,
        caminhoArquivo: doc.caminhoArquivo,
        nomeArquivo: doc.nomeArquivo,
        tags: doc.tags,
      }));

      setDocumentos(documentosFormatados);
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
    carregarDocumentos();
  }, [carregarDocumentos]);

  useEffect(() => {
    carregarTags();
  }, [carregarTags]);

  // Buscar documentos via endpoint
  const handleSearch = () => {
    carregarDocumentos(1, getCurrentFilters());
  };

  // Limpar filtros
  const handleClearSearch = () => {
    setBusca('');
    setFiltroAno('');
    setFiltroCategoria('');
    setFiltroId('');
    setFiltroPastaId('');
    setFiltroTagId('');
    setFiltroDataPublicacao('');
    setFiltroDataCriacao('');
    setFiltroDataAtualizacao('');
    carregarDocumentos(1, undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      await documentosServidorService.inativar(id);
      // Recarregar lista mantendo filtros
      await carregarDocumentos(currentPage, getCurrentFilters());
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Documentos do Servidor</h1>
            <p className="text-gray-600 mt-2">
              {isLoading ? 'Carregando...' : `${totalItens} ${totalItens === 1 ? 'documento encontrado' : 'documentos encontrados'}`}
            </p>
          </div>
          <Link
            to="/admin/documentos-servidor/criar"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0C2856] text-white font-medium rounded-lg hover:bg-[#195CE3] transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Documento
          </Link>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar documentos</h3>
                <p className="text-sm text-red-700 mt-1">{erro}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">Buscar por Nome</label>
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
                    placeholder="Digite o nome..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>
            </div>

            {/* ID */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">ID</label>
              <input
                type="number"
                id="id"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Ex: 123"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              />
            </div>



            {/* PastaId */}
            <div>
              <label htmlFor="pastaId" className="block text-sm font-medium text-gray-700 mb-2">Pasta (ID)</label>
              <input
                type="number"
                id="pastaId"
                value={filtroPastaId}
                onChange={(e) => setFiltroPastaId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Ex: 5"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              />
            </div>

            {/* TagId */}
            <div>
              <label htmlFor="tagId" className="block text-sm font-medium text-gray-700 mb-2">Tag (ID)</label>
              <input
                type="number"
                id="tagId"
                value={filtroTagId}
                onChange={(e) => setFiltroTagId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Ex: 2"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
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

            {/* Data de Publicacao */}
            <div>
              <label htmlFor="dataPublicacao" className="block text-sm font-medium text-gray-700 mb-2">Data de Publicação</label>
              <input
                type="datetime-local"
                id="dataPublicacao"
                value={filtroDataPublicacao}
                onChange={(e) => setFiltroDataPublicacao(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              />
            </div>

            {/* Data Criacao */}
            <div>
              <label htmlFor="dataCriacao" className="block text-sm font-medium text-gray-700 mb-2">Data de Criação</label>
              <input
                type="datetime-local"
                id="dataCriacao"
                value={filtroDataCriacao}
                onChange={(e) => setFiltroDataCriacao(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              />
            </div>

            {/* Data Atualizacao */}
            <div>
              <label htmlFor="dataAtualizacao" className="block text-sm font-medium text-gray-700 mb-2">Data de Atualização</label>
              <input
                type="datetime-local"
                id="dataAtualizacao"
                value={filtroDataAtualizacao}
                onChange={(e) => setFiltroDataAtualizacao(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              />
            </div>

            {/* Botões de ação */}
            <div className="md:col-span-3 flex gap-2">
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

        {isLoading ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">Carregando documentos...</p>
          </div>
        ) : (
          <>
            <ListarDocumentosServidorComponent
              documentos={documentos}
              onDelete={handleDelete}
              emptyStateTitle="Nenhum documento do servidor encontrado"
              emptyStateDescription="Crie um novo documento para começar"
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
                      carregarDocumentos(currentPage - 1, current as Partial<DocumentoServidorListFilters>);
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
                      carregarDocumentos(currentPage + 1, current as Partial<DocumentoServidorListFilters>);
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
