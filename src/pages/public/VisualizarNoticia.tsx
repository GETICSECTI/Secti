import { PublicLayout } from '../../layouts/PublicLayout.tsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faXTwitter, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faCalendar, faUser, faShare } from '@fortawesome/free-solid-svg-icons';
import { useSEO } from '../../utils/useSEO.ts';
import { noticiasService, type NoticiaDetalhada } from '../../services/noticiasService';
import { handleApiError } from '../../utils/errorHandler';
import { LoadingScreen } from '../../components/LoadingScreen';
import { formatarDataBrasileira } from '../../utils/dateUtils';

export const VisualizarNoticia = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState<NoticiaDetalhada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO dinâmico baseado na notícia carregada
  useSEO({
    title: noticia?.titulo || 'Notícia',
    description: noticia?.resumo || 'Leia a notícia completa no site da SECTI Pernambuco.',
    canonical: `https://secti.pe.gov.br/noticias/${slug}`,
    keywords: `${noticia?.titulo || 'Notícia'}, SECTI, Notícias, Comunicados`,
  });

  useEffect(() => {
    const carregarNoticia = async () => {
      if (!slug) {
        setError('Slug da notícia não encontrado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await noticiasService.buscarPublicoPorSlug(slug);
        setNoticia(data);
      } catch (err) {
        const mensagemErro = handleApiError(err);
        setError(mensagemErro);
        console.error('Erro ao carregar notícia:', err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarNoticia();
  }, [slug]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !noticia) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Notícia não encontrada</h2>
            <p className="text-gray-600 mb-6">{error || 'A notícia que você está procurando não existe ou foi removida.'}</p>
            <button
              onClick={() => navigate('/noticias')}
              className="inline-flex items-center gap-2 bg-[#0C2856] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#195CE3] transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar para notícias
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // URL atual para compartilhamento
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(noticia.titulo);

  // Funções de compartilhamento
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <PublicLayout>
      {/* Cabeçalho Azul */}
      <div className="bg-[#0C2856] text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li className="text-blue-200">/</li>
              <li>
                <button
                  onClick={() => navigate('/noticias')}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  Notícias
                </button>
              </li>
              <li className="text-blue-200">/</li>
              <li className="text-blue-200 truncate">{noticia.titulo}</li>
            </ol>
          </nav>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-4xl">
            {noticia.titulo}
          </h1>

          {/* Metadados */}
          <div className="flex flex-wrap items-center gap-4 text-blue-100">
            {noticia.autor && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} />
                <span>Por {noticia.autor}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} />
              <span>{formatarDataBrasileira(noticia.dataPublicacao)}</span>
            </div>
            {noticia.tags && noticia.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {noticia.tags.map((tag) => (
                  <span key={tag.id} className="px-3 py-1 bg-blue-200 text-[#0C2856] rounded-full text-sm font-medium">
                    {tag.nome}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo do Blog */}
      <article className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Imagem de Capa */}
            {noticia.imagemCapaUrl && (
              <div className="mb-10">
                <img
                  src={noticia.imagemCapaUrl}
                  alt={noticia.titulo}
                  className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Resumo */}
            {noticia.resumo && (
              <div className="mb-10">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light italic border-l-4 border-[#195CE3] pl-6 py-2">
                  {noticia.resumo}
                </p>
              </div>
            )}

            {/* Conteúdo */}
            <div
              className="break-all prose prose-lg md:prose-xl max-w-none
                prose-headings:text-[#0C2856] prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-6
                prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-justify
                prose-a:text-[#195CE3] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-em:text-gray-700
                prose-ul:list-disc prose-ul:ml-6 prose-ul:my-6 prose-ul:space-y-3
                prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-6 prose-ol:space-y-3
                prose-li:text-gray-800 prose-li:leading-relaxed
                prose-img:rounded-lg prose-img:shadow-xl prose-img:my-10 prose-img:w-full
                prose-blockquote:border-l-4 prose-blockquote:border-[#195CE3] prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r
                prose-hr:border-gray-300 prose-hr:my-10"
              dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
            />

            {/* Separador */}
            <div className="border-t border-gray-200 my-12"></div>

            {/* Compartilhamento */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-[#0C2856] mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faShare} />
                Compartilhe esta notícia
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={shareOnFacebook}
                  className="flex items-center gap-2 px-5 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  aria-label="Compartilhar no Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-lg" />
                  <span>Facebook</span>
                </button>

                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  aria-label="Compartilhar no X (Twitter)"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
                  <span>Twitter</span>
                </button>

                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center gap-2 px-5 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095196] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  aria-label="Compartilhar no LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
                  <span>LinkedIn</span>
                </button>

                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE57] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  aria-label="Compartilhar no WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={shareViaEmail}
                  className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  aria-label="Compartilhar por Email"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Email</span>
                </button>

                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-5 py-3 bg-[#0C2856] text-white rounded-lg hover:bg-[#195CE3] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium"
                  aria-label="Copiar link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copiar Link</span>
                </button>
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/noticias')}
                className="inline-flex items-center gap-2 text-[#0C2856] hover:text-[#195CE3] font-semibold transition-colors cursor-pointer text-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Voltar para todas as notícias</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
};

