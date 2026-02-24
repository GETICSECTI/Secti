import { PublicLayout } from '../../layouts/PublicLayout';
import { HeroSection } from '../../components/HeroSection';
import { NoticiasList } from '../../components/NoticiasList';
import type { NoticiaItem } from '../../components/NoticiasList';
import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../utils/useSEO.ts';
import { noticiasService } from '../../services/noticiasService';
import { handleApiError } from '../../utils/errorHandler';
import { LoadingScreen } from '../../components/LoadingScreen';
import SectiPredio from "../../assets/SECTIPredio.jpg"


export const TodasNoticias = () => {
  const [noticias, setNoticias] = useState<NoticiaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const itensPorPagina = 10;

  // SEO
  useSEO({
    title: 'Notícias',
    description: 'Acompanhe as últimas notícias da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/noticias',
    keywords: 'Notícias, SECTI, Atualidades, Comunicados',
  });

  const carregarNoticias = useCallback(async (pagina: number, titulo: string = '') => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar notícias publicadas do endpoint público
      const response = await noticiasService.listarPublico({
        tituloFiltro: titulo || undefined,
        pagina: pagina,
        itensPorPagina: itensPorPagina,
      });

      // Converter resposta para formato NoticiaItem
      const noticiasFormatadas: NoticiaItem[] = response.itens.map(noticia => ({
        id: noticia.id,
        slug: noticia.slug,
        titulo: noticia.titulo,
        autor: noticia.autor,
        dataPublicacao: noticia.dataPublicacao,
        resumo: noticia.resumo,
        imagem: noticia.imagemCapaUrl || SectiPredio,
        link: `/noticias/${noticia.slug}`,
        tags: noticia.tags,
      }));

      setNoticias(noticiasFormatadas);

      // Calcular total de páginas
      const totalPages = Math.ceil(response.total / itensPorPagina);
      setTotalPaginas(totalPages);
    } catch (err) {
      const mensagemErro = handleApiError(err);
      setError(mensagemErro);
      console.error('Erro ao carregar notícias:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarNoticias(paginaAtual, filtroTitulo);
  }, [paginaAtual, filtroTitulo, carregarNoticias]);

  const handleBuscar = (titulo: string) => {
    setFiltroTitulo(titulo);
    setPaginaAtual(1);
  };

  const handleLimpar = () => {
    setFiltroTitulo('');
    setPaginaAtual(1);
  };

  const handleMudarPagina = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isLoading && paginaAtual === 1 && <LoadingScreen />}
      <PublicLayout>
        <HeroSection
          title="Notícias"
          subtitle="Acompanhe as últimas novidades sobre ciência, tecnologia e inovação em Pernambuco"
        />

        {/* Content Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Introdução */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">Todas as Notícias</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Fique por dentro de todas as novidades, projetos e iniciativas da Secretaria de Ciência,
                Tecnologia e Inovação de Pernambuco.
              </p>
            </div>


            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* News List */}
            {noticias.length > 0 && (
              <NoticiasList
                noticias={noticias}
                isLoading={isLoading}
                totalPaginas={totalPaginas}
                paginaAtual={paginaAtual}
                onMudarPagina={handleMudarPagina}
                onFiltroChange={handleBuscar}
                onLimpar={handleLimpar}
              />
            )}
          </div>
        </section>
      </PublicLayout>
    </>
  );
};
