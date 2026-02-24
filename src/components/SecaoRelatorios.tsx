import { useState, useEffect } from 'react';
import { relatoriosService, downloadRelatorio } from '../services/relatoriosService';
import { handleApiError } from '../utils/errorHandler';

interface RelatorioItem {
  id: number;
  titulo: string;
  caminhoArquivo: string;
  dataPublicacao: string;
}

interface SecaoRelatoriosProps {
  limit?: number;
}

export const SecaoRelatorios = ({ limit = 6 }: SecaoRelatoriosProps) => {
  const [relatorios, setRelatorios] = useState<RelatorioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    const carregarRelatorios = async () => {
      try {
        setIsLoading(true);
        const response = await relatoriosService.listarPublico({
          ordenarPor: 'anopublicacao',
          ordenarDescendente: true,
          pagina: 1,
          itensPorPagina: limit,
        });
        setRelatorios(response.relatorios);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', handleApiError(error));
        setRelatorios([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarRelatorios();
  }, [limit]);

  const handleDownload = async (caminhoArquivo: string, titulo: string) => {
    try {
      setDownloadingId(Date.now());
      await downloadRelatorio(caminhoArquivo, titulo);
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      alert('Erro ao baixar relatório. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };


  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-[#0C2856] to-[#1a3f7d] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Relatórios</h2>
            <p className="text-lg text-blue-100">Carregando relatórios...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (relatorios.length === 0) {
    return null; // Não renderizar a seção se não houver relatórios
  }

  return (
    <section className="py-12 bg-gray-50 text-[#0C2856]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-[#0C2856] font-bold mb-4">Relatórios</h2>
          <p className="text-lg text-[#0C2856] max-w-2xl mx-auto">
            Acesse os relatórios e documentos técnicos da SECTI sobre ciência, tecnologia e inovação
          </p>
        </div>

        {/* Grid de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {relatorios.map(relatorio => (
            <div
              key={relatorio.id}
              className="group bg-white shadow-md bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20 hover:border-opacity-40"
            >
              {/* Ícone */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0C2856] bg-opacity-20 group-hover:bg-opacity-40 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white bg-[#0C2856] px-3 py-1 rounded-full">
                  {relatorio.dataPublicacao.substring(0, 4)}
                </span>
              </div>

              {/* Título */}
              <h3 className="text-lg font-semibold mb-4 line-clamp-2 transition-colors">
                {relatorio.titulo}
              </h3>

              {/* Botão Download */}
              <button
                onClick={() => handleDownload(relatorio.caminhoArquivo, relatorio.titulo)}
                disabled={downloadingId !== null}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0C2856] cursor-pointer hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloadingId !== null ? 'Baixando...' : 'Baixar'}
              </button>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <a
            href="/secti/relatorios"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0C2856] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver todos os relatórios
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

