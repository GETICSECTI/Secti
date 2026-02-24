import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { NoticiaForm } from '../../../components/admin/NoticiaForm';
import { noticiasService, type NoticiaDetalhada, type EditarNoticiaRequest } from '../../../services/noticiasService';
import { handleApiError } from '../../../utils/errorHandler';

interface NoticiaFormData {
  id?: number;
  titulo: string;
  slug: string;
  tagId: number | null;
  autor: string;
  resumo: string;
  conteudo: string;
  imagemDestaque: string;
  imagemArquivo: File | null;
  status: 'Publicada' | 'Rascunho' | 'Arquivada';
  destaque: boolean;
}

export const EditarNoticia = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<NoticiaFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarNoticia = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        // Buscar notícia pelo slug real da API
        const noticia: NoticiaDetalhada = await noticiasService.buscarPublicoPorSlug(slug);

        // Converter dados da API para o formato do formulário
        const formData: NoticiaFormData = {
          id: noticia.id,
          titulo: noticia.titulo,
          slug: noticia.slug,
          tagId: noticia.tags && noticia.tags.length > 0 ? noticia.tags[0].id : null,
          autor: noticia.autor,
          resumo: noticia.resumo,
          conteudo: noticia.conteudo,
          imagemDestaque: noticia.imagemCapaUrl,
          imagemArquivo: null,
          status: noticia.publicada ? 'Publicada' : 'Rascunho',
          destaque: noticia.destaque,
        };

        setInitialData(formData);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    carregarNoticia();
  }, [slug]);

  const handleSubmit = async (formData: NoticiaFormData) => {
    if (!initialData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('[EditarNoticia] Estado recebido do formulário:', {
        titulo: formData.titulo,
        autor: formData.autor,
        imagemArquivo: formData.imagemArquivo ? `${formData.imagemArquivo.name} (${formData.imagemArquivo.size} bytes)` : 'null',
        imagemDestaque: formData.imagemDestaque || 'vazio',
      });

      // Preparar dados para o endpoint
      const dadosNoticia: EditarNoticiaRequest = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        resumo: formData.resumo || undefined,
        autor: formData.autor || undefined,
        destaque: formData.destaque || false,
        tagIds: formData.tagId ? [formData.tagId] : undefined,
      };

      // Se houver arquivo, enviar o arquivo
      if (formData.imagemArquivo) {
        dadosNoticia.imagemCapa = formData.imagemArquivo;
        console.log('[EditarNoticia] Enviando arquivo:', formData.imagemArquivo.name);
      }
      // Senão, se houver URL (e não for blob), enviar a URL
      else if (formData.imagemDestaque && !formData.imagemDestaque.startsWith('blob:')) {
        dadosNoticia.imagemCapaUrl = formData.imagemDestaque;
        console.log('[EditarNoticia] Enviando URL:', formData.imagemDestaque);
      }

      console.log('[EditarNoticia] Dados a enviar:', {
        ...dadosNoticia,
        imagemCapa: dadosNoticia.imagemCapa ? `File(${dadosNoticia.imagemCapa.name})` : undefined,
      });

      // Chamar API usando o ID da notícia inicial
      await noticiasService.editar(initialData.id || 0, dadosNoticia);

      // Redirecionar para a lista
      navigate('/admin/noticias');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2856]"></div>
          <span className="ml-2 text-gray-600">Carregando notícia...</span>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Notícia</h1>
            <p className="text-gray-600 mt-2">
              Faça as alterações necessárias na notícia selecionada.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/noticias')}
            className="inline-flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário */}
        {initialData && (
          <div className="overflow-x-hidden">
            <NoticiaForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};
