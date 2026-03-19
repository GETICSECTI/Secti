import { PublicLayout } from '../../layouts/PublicLayout';
import { HeroSection } from '../../components/HeroSection';
import { DocumentosParceriasPublicosList } from '../../components/DocumentosParceriasPublicosList';
import type { DocumentoParceriaPublicoItem } from '../../components/DocumentosParceriasPublicosList';
import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../utils/useSEO.ts';
import { editaisService } from '../../services/editaisService';
import { tagService, type TagPublica } from '../../services/tagService.ts';
import { handleApiError } from '../../utils/errorHandler';

export const Editais = () => {
  // SEO
  useSEO({
    title: 'Editais',
    description: 'Consulte os editais públicos da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/editais',
    keywords: 'Editais, SECTI, Chamadas Públicas, Pernambuco',
  });
  const [documentos, setDocumentos] = useState<DocumentoParceriaPublicoItem[]>([]);
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

  const carregarEditais = useCallback(
    async (pagina: number, titulo: string = '', ano?: number, dataPublicacao?: string, tagIds?: number[]) => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar editais públicos do endpoint
        const response = await editaisService.listarPublico({
          titulo: titulo || undefined,
          ano: ano,
          dataPublicacao: dataPublicacao || undefined,
          tagIds: tagIds,
          ordenarPor: 'anopublicacao',
          ordenarDescendente: true,
          pagina: pagina,
          itensPorPagina: 10,
        });

        // Converter resposta para formato DocumentoParceriaPublicoItem
        const editaisFormatados: DocumentoParceriaPublicoItem[] = response.editais.map(edital => ({
          id: edital.id,
          nome: edital.titulo,
          tipo: 'pdf' as const,
          tamanho: 'Não disponível',
          categoria: 'Editais',
          url: edital.caminhoArquivo,
          dataPublicacao: edital.dataPublicacao,
          tags: edital.tags,
        }));

        setDocumentos(editaisFormatados);
        setTotalPaginas(response.totalPaginas);
      } catch (err) {
        const mensagemErro = handleApiError(err);
        setError(mensagemErro);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    carregarEditais(paginaAtual, filtroTitulo, filtroAno, filtroDataPublicacao, filtroTagId ? [filtroTagId] : undefined);
  }, [paginaAtual, filtroTitulo, filtroAno, filtroDataPublicacao, filtroTagId, carregarEditais]);

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
        title="Editais"
        subtitle="Consulte editais de fomento, bolsas e oportunidades da SECTI"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introdução */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">Editais Disponíveis</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Encontre oportunidades de fomento à pesquisa, bolsas de estudo, apoio a startups e outros
              editais promovidos pela Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700 font-medium">Erro ao carregar editais: {error}</p>
            </div>
          )}

          {/* Documents List */}
          <DocumentosParceriasPublicosList
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
        </div>
      </section>
    </PublicLayout>
  );
};
