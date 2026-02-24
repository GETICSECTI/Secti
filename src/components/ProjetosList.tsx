import { useEffect, useState } from 'react';
import { formatarDataBrasileira } from '../utils/dateUtils';

export interface ProjetoItem {
  id: number;
  titulo: string;
  descricao?: string;
  fotoCapaCaminho?: string;
  logoCaminho?: string;
  url?: string;
  ativo: boolean;
  dataCriacao: string;
  link?: string;
  urlProjeto?: string;
}

interface ProjetosListProps {
  projetos: ProjetoItem[];
  isLoading?: boolean;
  error?: string | null;
}

export const ProjetosList = ({ projetos, isLoading = false, error = null }: ProjetosListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(projetos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjetos = projetos.slice(startIndex, endIndex);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2856]"></div>
          <span className="ml-4 text-gray-600">Carregando projetos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (projetos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8 4M7 9l6 3.5m6-3.5l-6 3.5" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
          <p className="text-gray-500 mt-2">Não há projetos disponíveis no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentProjetos.map((projeto) => (
          <div
            key={projeto.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
          >
            {/* Imagem */}
            {projeto.fotoCapaCaminho && (
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                <img
                  src={projeto.fotoCapaCaminho}
                  alt={projeto.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Logo */}
            {projeto.logoCaminho && (
              <div className="p-4 flex items-center justify-center bg-gray-50 border-b border-gray-200">
                <img
                  src={projeto.logoCaminho}
                  alt={`Logo ${projeto.titulo}`}
                  className="h-12 object-contain"
                />
              </div>
            )}

            {/* Conteúdo */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {projeto.titulo}
              </h3>

              {projeto.descricao && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {projeto.descricao}
                </p>
              )}

              {/* Data de Criação */}
              <div className="flex items-center text-xs text-gray-500 mb-4 pt-4 border-t border-gray-100">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatarDataBrasileira(projeto.dataCriacao)}
              </div>

              {/* Botões */}
              <div className="flex gap-2 mt-auto">
                {projeto.urlProjeto && (
                  <a
                    href={projeto.link || `/projetos/${projeto.urlProjeto}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-[#0C2856] text-[#0C2856] px-4 py-2 rounded-lg font-semibold hover:bg-[#0C2856] hover:text-white transition-colors text-sm"
                  >
                    <span>Detalhes</span>
                  </a>
                )}
                {projeto.url && (
                  <a
                    href={projeto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0C2856] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#195CE3] transition-colors text-sm"
                  >
                    <span>Acessar</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-4 py-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, projetos.length)}</span> de <span className="font-medium">{projetos.length}</span> projetos
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Anterior
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#0C2856] text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
