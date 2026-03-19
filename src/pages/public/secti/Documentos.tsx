import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { DocumentosPublicosList } from '../../../components/DocumentosPublicosList';
import type { DocumentoPublicoItem } from '../../../components/DocumentosPublicosList';
import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../../utils/useSEO.ts';
import { documentosService } from '../../../services/documentosService.ts';
import { tagService, type TagPublica } from '../../../services/tagService.ts';
import { handleApiError } from '../../../utils/errorHandler';


export const Documentos = () => {
  // SEO
  useSEO({
    title: 'Documentos',
    description: 'Consulte os documentos públicos da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/secti/documentos',
    keywords: 'Documentos, SECTI, Pernambuco, Transparência',
  });
  const [documentos, setDocumentos] = useState<DocumentoPublicoItem[]>([]);
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
      } catch {
        //Intencionalmente Ingorado
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

      const response = await documentosService.listarPublico({
        titulo: titulo || undefined,
        ano: ano,
        dataPublicacao: dataPublicacao || undefined,
        tagIds: tagIds,
        ordenarPor: 'anopublicacao',
        ordenarDescendente: true,
        pagina: pagina,
        itensPorPagina: 10,
      });

      const documentosFormatados: DocumentoPublicoItem[] = response.documentos.map(doc => ({
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

  const handleBuscar = (titulo: string, ano?: number, dataPublicacao?: string, tagIds?: number[]) => {
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
        title="Documentos"
        subtitle="Acesse documentos, relatórios e publicações da SECTI"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700 font-medium">Erro ao carregar documentos: {error}</p>
            </div>
          )}

          {/* Documents List */}
          {!error && (
            <DocumentosPublicosList
              documents={documentos}
              tags={tags}
              isLoading={isLoading}
              isLoadingTags={isLoadingTags}
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
  );
};
