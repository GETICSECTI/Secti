import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { DocumentosServidorPublicosList } from '../../../components/DocumentosServidorPublicosList';
import type { DocumentoServidorPublicoItem } from '../../../components/DocumentosServidorPublicosList';
import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../../utils/useSEO.ts';
import { documentosServidorService } from '../../../services/documentosServidorService';
import { tagService, type TagPublica } from '../../../services/tagService.ts';
import { handleApiError } from '../../../utils/errorHandler';


export const Servidor = () => {
  // SEO
  useSEO({
    title: 'Servidor',
    description: 'Informações e documentos voltados aos servidores públicos da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/secti/servidor',
    keywords: 'Servidor Público, SECTI, Documentos, Pernambuco',
  });
  const [documentos, setDocumentos] = useState<DocumentoServidorPublicoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroAno, setFiltroAno] = useState<number | undefined>();
  const [filtroDataPublicacao, setFiltroDataPublicacao] = useState<string>('');
  const [filtroTagId, setFiltroTagId] = useState<number | undefined>();
  const [tags, setTags] = useState<TagPublica[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Carregar tags no carregamento inicial
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
  const carregarDocumentos = useCallback(async (pagina: number, titulo: string = '', ano?: number, dataPublicacao?: string, tagIds?: number[]) => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar documentos do servidor públicos do endpoint
      const response = await documentosServidorService.listarPublico({
        titulo: titulo || undefined,
        ano: ano,
        dataPublicacao: dataPublicacao || undefined,
        tagIds: tagIds,
        pagina: pagina,
        itensPorPagina: 10,
      });

      // Converter resposta para formato DocumentoServidorPublicoItem
      const documentosFormatados: DocumentoServidorPublicoItem[] = response.documentos.map(doc => ({
        id: doc.id,
        nome: doc.titulo,
        tipo: 'pdf' as const,
        tamanho: 'Não disponível',
        categoria: 'Documentos',
        url: doc.caminhoArquivo,
        dataPublicacao: doc.dataPublicacao,
        tags: doc.tags,
      }));

      setDocumentos(documentosFormatados);
      setTotalPaginas(response.totalPaginas);
    } catch (err) {
      const mensagemErro = handleApiError(err);
      setError(mensagemErro);
      console.error('Erro ao carregar documentos do servidor:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDocumentos(paginaAtual, filtroTitulo, filtroAno, filtroDataPublicacao, filtroTagId ? [filtroTagId] : undefined);
  }, [paginaAtual, filtroTitulo, filtroAno, filtroDataPublicacao, filtroTagId, carregarDocumentos]);

  const handleMudarPagina = (novaPagina: number) => {
    setPaginaAtual(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltroChange = (titulo: string, ano?: number, dataPublicacao?: string, tagIds?: number[]) => {
    setFiltroTitulo(titulo);
    setFiltroAno(ano);
    setFiltroDataPublicacao(dataPublicacao || '');
    setFiltroTagId(tagIds && tagIds.length > 0 ? tagIds[0] : undefined);
    setPaginaAtual(1);
  };

  const handleLimpar = () => {
    setFiltroTitulo('');
    setFiltroAno(undefined);
    setFiltroDataPublicacao('');
    setFiltroTagId(undefined);
    setPaginaAtual(1);
  };

  return (
    <PublicLayout>
      <HeroSection
        title="Servidor"
        subtitle="Documentos e orientações para servidores da SECTI"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Introdução */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">Área do Servidor</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Encontre aqui documentos importantes, orientações e materiais relacionados à gestão de pessoas e avaliação de desempenho dos servidores da SECTI-PE.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-700 font-medium">Erro ao carregar documentos: {error}</p>
              </div>
            )}

        {!error && (
          <DocumentosServidorPublicosList
            documents={documentos}
            tags={tags}
            isLoading={isLoading}
            isLoadingTags={isLoadingTags}
            totalPaginas={totalPaginas}
            paginaAtual={paginaAtual}
            onMudarPagina={handleMudarPagina}
            onFiltroChange={handleFiltroChange}
            onLimpar={handleLimpar}
          />
        )}
        </div>
        </div>
      </section>
    </PublicLayout>
  );
};
