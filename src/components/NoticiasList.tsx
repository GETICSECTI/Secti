import { useState } from 'react';
import { formatarDataBrasileira } from '../utils/dateUtils';

export interface NoticiaItem {
  id: number;
  slug: string;
  titulo: string;
  autor: string;
  dataPublicacao: string; // formato: 'YYYY-MM-DD'
  resumo: string;
  imagem: string;
  link: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

interface NoticiasListProps {
  noticias: NoticiaItem[];
  isLoading?: boolean;
  totalPaginas?: number;
  paginaAtual?: number;
  onMudarPagina?: (pagina: number) => void;
  onFiltroChange?: (titulo: string) => void;
  onLimpar?: () => void;
}

export const NoticiasList = ({
  noticias,
  isLoading = false,
  totalPaginas = 1,
  paginaAtual = 1,
  onMudarPagina,
  onFiltroChange,
  onLimpar,
}: NoticiasListProps) => {
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  // Função para buscar
  const handleBuscar = () => {
    setFiltrosAplicados(true);
    onMudarPagina?.(1);
    onFiltroChange?.(filtroTitulo);
  };

  // Função para limpar filtros
  const handleLimpar = () => {
    setFiltroTitulo('');
    setFiltrosAplicados(false);
    onMudarPagina?.(1);
    onLimpar?.();
  };

  // Função para mudar de página
  const handleMudarPagina = (novaPagina: number) => {
    onMudarPagina?.(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para formatar data
  const formatarData = (dataString: string) => {
    return formatarDataBrasileira(dataString);
  };


  return (
    <div className="max-w-6xl mx-auto">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar Notícias</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
              Título da Notícia
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
                value={filtroTitulo}
                onChange={(e) => setFiltroTitulo(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o título da notícia..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBuscar}
              disabled={isLoading || !filtroTitulo}
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
            <button
              onClick={handleLimpar}
              disabled={isLoading || !filtrosAplicados}
              className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-600">
          {noticias.length} {noticias.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
          {totalPaginas > 1 && (
            <span className="ml-2">
              - Página {paginaAtual} de {totalPaginas}
            </span>
          )}
        </div>
      </div>

      {/* Lista de Notícias */}
      <div className="space-y-6">
        {noticias.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-xl text-gray-600">Nenhuma notícia encontrada</p>
            {filtrosAplicados && (
              <p className="text-gray-500 mt-2">Tente ajustar os filtros de busca</p>
            )}
          </div>
        ) : (
          <>
            {noticias.map(noticia => (
              <article key={noticia.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:flex">
                  {/* Imagem */}
                  <div className="md:w-1/3 max-h-48 flex items-center justify-center bg-gray-100">
                    <div className="w-full object-cover flex items-center justify-center overflow-hidden">
                      <img
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {noticia.tags && noticia.tags.length > 0 && (
                        noticia.tags.map((tag) => (
                          <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-[#195CE3]">
                            {tag.nome}
                          </span>
                        ))
                      )}
                      <span className="text-sm text-gray-600">
                        {formatarData(noticia.dataPublicacao)}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-[#0C2856] mb-3 line-clamp-2">
                      <a
                        href={noticia.link}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {noticia.titulo}
                      </a>
                    </h2>

                    <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                      {noticia.resumo}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Por <strong>{noticia.autor}</strong></span>
                      </div>

                      <a
                        href={noticia.link}
                        className="inline-flex items-center gap-2 bg-[#195CE3] text-white px-4 py-2 rounded-lg hover:bg-[#0C2856] transition duration-200 font-medium text-sm"
                      >
                        Ler mais
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 flex-wrap">
                <button
                  onClick={() => handleMudarPagina(paginaAtual - 1)}
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
                      onClick={() => handleMudarPagina(numero)}
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
                  onClick={() => handleMudarPagina(paginaAtual + 1)}
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
