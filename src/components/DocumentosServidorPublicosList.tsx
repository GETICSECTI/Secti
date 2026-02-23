import { useState } from 'react';
import { downloadDocumentoServidor } from '../services/documentosServidorService';
import { formatarDataBrasileira } from '../utils/dateUtils';

export interface DocumentoServidorPublicoItem {
  id: number;
  nome: string;
  tipo: 'pdf' | 'doc' | 'docx';
  tamanho: string;
  categoria: string;
  url: string;
  dataPublicacao: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

interface DocumentosServidorPublicosListProps {
  documents: DocumentoServidorPublicoItem[];
  tags?: Array<{ id: number; nome: string }>;
  isLoading?: boolean;
  isLoadingTags?: boolean;
  totalPaginas?: number;
  paginaAtual?: number;
  onMudarPagina?: (pagina: number) => void;
  onFiltroChange?: (titulo: string, ano?: number, dataPublicacao?: string, tagIds?: number[]) => void;
  onLimpar?: () => void;
}

export const DocumentosServidorPublicosList = ({
  documents,
  tags = [],
  isLoading = false,
  isLoadingTags = false,
  totalPaginas = 1,
  paginaAtual = 1,
  onMudarPagina,
  onFiltroChange,
  onLimpar,
}: DocumentosServidorPublicosListProps) => {
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroAno, setFiltroAno] = useState<number | ''>('');
  const [filtroDataPublicacao, setFiltroDataPublicacao] = useState('');
  const [filtroTagId, setFiltroTagId] = useState<number | ''>('');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Função para buscar com filtros
  const handleBuscar = () => {
    setFiltrosAplicados(true);
    onMudarPagina?.(1);
    onFiltroChange?.(
      filtroNome,
      filtroAno ? Number(filtroAno) : undefined,
      filtroDataPublicacao || undefined,
      filtroTagId ? [Number(filtroTagId)] : undefined
    );
  };

  // Função para limpar filtros
  const handleLimparFiltros = () => {
    setFiltroNome('');
    setFiltroAno('');
    setFiltroDataPublicacao('');
    setFiltroTagId('');
    setFiltrosAplicados(false);
    onMudarPagina?.(1);
    onLimpar?.();
  };

  // Função para baixar documento
  const handleDownload = async (docId: number, caminhoArquivo: string, nomeArquivo: string) => {
    try {
      setDownloadingId(docId);
      await downloadDocumentoServidor(caminhoArquivo, nomeArquivo);
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      alert('Erro ao baixar documento. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2856]"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium">Carregando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Título */}
          <div>
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
              Título do Documento
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
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o título do documento..."
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
              value={filtroAno}
              onChange={(e) => setFiltroAno(e.target.value === '' ? '' : Number(e.target.value))}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 2024"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          {/* Data de Publicação */}
          <div>
            <label htmlFor="dataPublicacao" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Publicação
            </label>
            <input
              type="date"
              id="dataPublicacao"
              value={filtroDataPublicacao}
              onChange={(e) => setFiltroDataPublicacao(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <select
              id="tags"
              value={filtroTagId}
              onChange={(e) => setFiltroTagId(e.target.value === '' ? '' : Number(e.target.value))}
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
            disabled={isLoading || (!filtroNome && !filtroAno && !filtroDataPublicacao && !filtroTagId)}
            className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={handleLimparFiltros}
            disabled={isLoading || !filtrosAplicados}
            className="px-6 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl text-gray-600">Nenhum documento encontrado</p>
            <p className="text-gray-500 mt-2">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <>
            {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Ícone do tipo de arquivo */}
                  <div className="shrink-0">
                    {getIconeTipo(doc.tipo)}
                  </div>

                  {/* Informações do documento */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#0C2856] mb-2">{doc.nome}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <strong>Tipo:</strong> {doc.tipo.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <strong>Publicado em:</strong> {formatarDataBrasileira(doc.dataPublicacao)}
                      </span>
                    </div>
                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {doc.tags.map(tag => (
                          <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0C2856] text-white">
                            {tag.nome}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botão de Download */}
                  <div className="shrink-0">
                    <button
                      onClick={() => handleDownload(doc.id, doc.url, doc.nome)}
                      disabled={downloadingId === doc.id}
                      className="inline-flex items-center gap-2 bg-[#195CE3] text-white px-6 py-3 rounded-lg hover:bg-[#0C2856] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {downloadingId === doc.id ? 'Baixando...' : 'Baixar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pt-8 flex-wrap">
                <button
                  onClick={() => onMudarPagina?.(paginaAtual - 1)}
                  disabled={paginaAtual === 1 || isLoading}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    paginaAtual === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white cursor-pointer text-[#0C2856] border border-[#0C2856] hover:bg-[#0C2856] hover:text-white'
                  }`}
                >
                  Anterior
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                    <button
                      key={numero}
                      onClick={() => onMudarPagina?.(numero)}
                      disabled={isLoading}
                      className={`px-3 py-2 rounded-lg font-medium transition duration-200 ${
                        numero === paginaAtual
                          ? 'bg-[#0C2856] text-white'
                          : 'bg-white cursor-pointer text-[#0C2856] border border-[#0C2856] hover:bg-[#0C2856] hover:text-white'
                      }`}
                    >
                      {numero}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onMudarPagina?.(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas || isLoading}
                  className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition duration-200 ${
                    paginaAtual === totalPaginas
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white cursor-pointer text-[#0C2856] border border-[#0C2856] hover:bg-[#0C2856] hover:text-white'
                  }`}
                >
                  Próximo
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
