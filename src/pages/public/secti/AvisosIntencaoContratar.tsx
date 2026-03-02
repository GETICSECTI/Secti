import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../../utils/useSEO.ts';
import { Paginacao } from '../../../components/Paginacao';
import {
  avisosIntencaoContratarService,
  type AvisoIntencaoContratarPublicoItem,
} from '../../../services/avisosIntencaoContratarService.ts';
import { tagService, type TagPublica } from '../../../services/tagService.ts';
import { handleApiError } from '../../../utils/errorHandler';
import { downloadAviso } from '../../../services/avisosIntencaoContratarService.ts';
import { formatarDataBrasileira } from '../../../utils/dateUtils';

export const AvisosIntencaoContratar = () => {
  useSEO({
    title: 'Avisos de Intenção de Contratar',
    description: 'Consulte os avisos de intenção de contratar da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/secti/avisos-intencao-contratar',
    keywords: 'Avisos, Intenção de Contratar, SECTI, Pernambuco, Transparência',
  });

  const [avisos, setAvisos] = useState<AvisoIntencaoContratarPublicoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItens, setTotalItens] = useState(0);

  // Filtros
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroTituloInput, setFiltroTituloInput] = useState('');
  const [filtroAno, setFiltroAno] = useState<number | ''>('');
  const [filtroAnoInput, setFiltroAnoInput] = useState<number | ''>('');
  const [filtroTagId, setFiltroTagId] = useState<number | ''>('');
  const [filtroTagIdInput, setFiltroTagIdInput] = useState<number | ''>('');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Tags
  const [tags, setTags] = useState<TagPublica[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Carregar tags
  useEffect(() => {
    const carregarTags = async () => {
      try {
        setIsLoadingTags(true);
        const response = await tagService.listarPublico({
          pagina: 1,
          itensPorPagina: 50,
        });
        const tagsOrdenadas = [...response.tags].sort((a, b) => a.nome.localeCompare(b.nome));
        setTags(tagsOrdenadas);
      } catch (err) {
        console.error('Erro ao carregar tags:', err);
      } finally {
        setIsLoadingTags(false);
      }
    };
    carregarTags();
  }, []);

  const carregarAvisos = useCallback(
    async (pagina: number, titulo?: string, ano?: number, tagIds?: number[]) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await avisosIntencaoContratarService.listarPublico({
          titulo: titulo || undefined,
          ano: ano || undefined,
          tagIds: tagIds,
          ordenarPor: 'anopublicacao',
          ordenarDescendente: true,
          pagina,
          itensPorPagina: 10,
        });

        setAvisos(response.avisos);
        setTotalPaginas(response.totalPaginas);
        setTotalItens(response.totalItens);
      } catch (err) {
        const mensagem = handleApiError(err);
        setError(mensagem);
        console.error('Erro ao carregar avisos:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    carregarAvisos(
      paginaAtual,
      filtroTitulo || undefined,
      filtroAno ? Number(filtroAno) : undefined,
      filtroTagId ? [Number(filtroTagId)] : undefined
    );
  }, [paginaAtual, filtroTitulo, filtroAno, filtroTagId, carregarAvisos]);

  const handleBuscar = () => {
    setFiltroTitulo(filtroTituloInput);
    setFiltroAno(filtroAnoInput);
    setFiltroTagId(filtroTagIdInput);
    setFiltrosAplicados(true);
    setPaginaAtual(1);
  };

  const handleLimpar = () => {
    setFiltroTituloInput('');
    setFiltroAnoInput('');
    setFiltroTagIdInput('');
    setFiltroTitulo('');
    setFiltroAno('');
    setFiltroTagId('');
    setFiltrosAplicados(false);
    setPaginaAtual(1);
  };

  const handleMudarPagina = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = async (aviso: AvisoIntencaoContratarPublicoItem) => {
    try {
      setDownloadingId(aviso.id);
      await downloadAviso(aviso.caminhoArquivo, aviso.titulo);
    } catch (err) {
      console.error('Erro ao baixar aviso:', err);
      alert('Erro ao baixar o arquivo. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <PublicLayout>
      <HeroSection
        title="Avisos de Intenção de Contratar"
        subtitle="Consulte os avisos de intenção de contratar publicados pela SECTI"
      />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700 font-medium">Erro ao carregar avisos: {error}</p>
            </div>
          )}

          <div className="max-w-6xl mx-auto">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar Avisos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Título */}
                <div>
                  <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Aviso
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
                      value={filtroTituloInput}
                      onChange={(e) => setFiltroTituloInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o título do aviso..."
                    />
                  </div>
                </div>

                {/* Ano */}
                <div>
                  <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-2">
                    Ano
                  </label>
                  <input
                    type="number"
                    id="ano"
                    value={filtroAnoInput}
                    onChange={(e) => setFiltroAnoInput(e.target.value === '' ? '' : Number(e.target.value))}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 2024"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tag
                  </label>
                  <select
                    id="tags"
                    value={filtroTagIdInput}
                    onChange={(e) => setFiltroTagIdInput(e.target.value === '' ? '' : Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma tag</option>
                    {isLoadingTags ? (
                      <option disabled>Carregando tags...</option>
                    ) : tags.length === 0 ? (
                      <option disabled>Nenhuma tag disponível</option>
                    ) : (
                      tags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.nome}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleBuscar}
                  disabled={isLoading || (!filtroTituloInput && filtroAnoInput === '' && filtroTagIdInput === '')}
                  className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
                <button
                  onClick={handleLimpar}
                  disabled={isLoading || !filtrosAplicados}
                  className="px-6 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2856]"></div>
                </div>
                <p className="text-lg text-gray-600 font-medium">Carregando avisos...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Total */}
                {!error && (
                  <div className="text-sm text-gray-600 mb-2">
                    {totalItens} {totalItens === 1 ? 'aviso encontrado' : 'avisos encontrados'}
                    {totalPaginas > 1 && (
                      <span className="ml-2">- Página {paginaAtual} de {totalPaginas}</span>
                    )}
                  </div>
                )}

                {/* Lista */}
                {avisos.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xl text-gray-600">Nenhum aviso encontrado</p>
                    <p className="text-gray-500 mt-2">Tente ajustar os filtros de busca</p>
                  </div>
                ) : (
                  <>
                    {avisos.map(aviso => (
                      <div key={aviso.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Ícone */}
                          <div className="shrink-0">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>

                          {/* Informações */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-[#0C2856] mb-2">{aviso.titulo}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <strong>Publicado em:</strong> {formatarDataBrasileira(aviso.dataPublicacao)}
                              </span>
                            </div>
                            {/* Tags */}
                            {aviso.tags && aviso.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {aviso.tags.map(tag => (
                                  <span
                                    key={tag.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0C2856] text-white"
                                  >
                                    {tag.nome}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Botão Download */}
                          <div className="shrink-0">
                            <button
                              onClick={() => handleDownload(aviso)}
                              disabled={downloadingId === aviso.id}
                              className="inline-flex items-center gap-2 bg-[#195CE3] text-white px-6 py-3 rounded-lg hover:bg-[#0C2856] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {downloadingId === aviso.id ? 'Baixando...' : 'Baixar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Paginação */}
                    <Paginacao
                      paginaAtual={paginaAtual}
                      totalPaginas={totalPaginas}
                      onMudarPagina={handleMudarPagina}
                      disabled={isLoading}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

