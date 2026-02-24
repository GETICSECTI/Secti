import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { DeleteModal } from '../../../components/admin/DeleteModal';
import { noticiasService, type NoticiaDetalhada } from '../../../services/noticiasService';
import { handleApiError } from '../../../utils/errorHandler';

interface NoticiaData {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  autor: string;
  dataPublicacao: string;
  resumo: string;
  conteudo: string;
  imagemDestaque: string;
  status: 'Publicada' | 'Rascunho' | 'Arquivada';
  destaque: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

export const VisualizarNoticiaAdmin = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noticia, setNoticia] = useState<NoticiaData | null>(null);

  useEffect(() => {
    const carregarNoticia = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        // Buscar notícia pelo slug real da API
        const noticiaData: NoticiaDetalhada = await noticiasService.buscarPublicoPorSlug(slug);

        // Converter dados da API para o formato do componente
        const noticiaFormatted: NoticiaData = {
          id: noticiaData.id,
          slug: noticiaData.slug,
          titulo: noticiaData.titulo,
          categoria: 'Notícias',
          autor: noticiaData.autor,
          dataPublicacao: new Date(noticiaData.dataPublicacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }),
          resumo: noticiaData.resumo,
          conteudo: noticiaData.conteudo,
          imagemDestaque: noticiaData.imagemCapaUrl,
          status: noticiaData.publicada ? 'Publicada' : 'Rascunho',
          destaque: noticiaData.destaque,
          dataCriacao: new Date(noticiaData.dataCriacao).toLocaleDateString('pt-BR'),
          dataAtualizacao: new Date(noticiaData.dataAtualizacao).toLocaleDateString('pt-BR'),
          tags: noticiaData.tags,
        };

        setNoticia(noticiaFormatted);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    carregarNoticia();
  }, [slug]);

  const handleDelete = async () => {
    if (!noticia) return;

    try {
      await noticiasService.inativar(noticia.id);
      navigate('/admin/noticias');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleActivate = async () => {
    if (!noticia) return;

    try {
      await noticiasService.ativar(noticia.id);
      // Recarregar dados após ativar
      window.location.reload();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
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

  if (error || !noticia) {
    return (
      <PrivateLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar notícia</h3>
              <p className="text-sm text-red-700 mt-1">{error || 'Notícia não encontrada'}</p>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Visualizar Notícia</h1>
            <p className="text-gray-600 mt-2">
              Detalhes da notícia selecionada.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/noticias')}
              className="inline-flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
            <Link
              to={`/admin/noticias/editar/${noticia.slug}`}
              className="inline-flex items-center gap-2 bg-[#0C2856] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#195CE3] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
          </div>
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

        {/* Conteúdo da notícia */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Imagem de destaque */}
          {noticia.imagemDestaque && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                    src={noticia.imagemDestaque}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover"
                />
              </div>
          )}

          <div className="p-4 md:p-6 lg:p-8">
            {/* Título e status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 wrap-break-word">
                {noticia.titulo}
              </h1>
              <div className="flex items-center gap-2 shrink-0">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
            noticia.status === 'Publicada'
                ? 'bg-green-100 text-green-800'
                : noticia.status === 'Rascunho'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
        }`}>
          {noticia.status}
        </span>
                {noticia.destaque && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
            Destaque
          </span>
                )}
              </div>
            </div>

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="wrap-break-word">{noticia.dataPublicacao}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="wrap-break-word">{noticia.autor}</span>
              </div>
              {noticia.tags && noticia.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="inline-flex items-center gap-1 wrap-break-word">
                    {noticia.tags.map((tag) => (
                      <span key={tag.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {tag.nome}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Resumo */}
            {noticia.resumo && (
                <div className="mb-6">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed wrap-break-word">
                    {noticia.resumo}
                  </p>
                </div>
            )}

            {/* Conteúdo */}
            <div
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                 break-all"
                dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
            />

            {/* Informações adicionais */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="wrap-break-word">Criado em: {noticia.dataCriacao}</span>
                <span className="wrap-break-word">Última atualização: {noticia.dataAtualizacao}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          {noticia.status === 'Rascunho' && (
            <button
              onClick={handleActivate}
              className="inline-flex cursor-pointer items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publicar Notícia
            </button>
          )}
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {noticia.status === 'Publicada' ? 'Despublicar' : 'Excluir'} Notícia
          </button>
        </div>

        {/* Modal de confirmação de exclusão */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title={`${noticia.status === 'Publicada' ? 'Despublicar' : 'Excluir'} notícia`}
          message={`Tem certeza que deseja ${noticia.status === 'Publicada' ? 'despublicar' : 'excluir'} a notícia "${noticia.titulo}"? ${noticia.status === 'Publicada' ? 'Ela ficará como rascunho.' : 'Esta ação não pode ser desfeita.'}`}
        />
      </div>
    </PrivateLayout>
  );
};
