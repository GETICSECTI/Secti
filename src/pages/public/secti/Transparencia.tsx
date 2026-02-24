import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useState, useEffect } from 'react';
import { useSEO } from '../../../utils/useSEO.ts';
import { transparenciaService } from '../../../services/transparenciaService';
import { handleApiError } from '../../../utils/errorHandler';
import { LoadingScreen } from '../../../components/LoadingScreen';

interface TransparenciaSubmenu {
  titulo: string;
  url: string;
}

export const Transparencia = () => {
  const [submenus, setSubmenus] = useState<TransparenciaSubmenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO
  useSEO({
    title: 'Transparência',
    description: 'Acesso à informação e transparência da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/secti/transparencia',
    keywords: 'Transparência, Informação, SECTI, Pernambuco',
  });

  useEffect(() => {
    const carregarSubmenus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Buscar submenus de transparência do endpoint público
        const response = await transparenciaService.listar();
        setSubmenus(response.submenus);
      } catch (err) {
        const mensagemErro = handleApiError(err);
        setError(mensagemErro);
        console.error('Erro ao carregar submenus de transparência:', err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarSubmenus();
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <PublicLayout>
        <HeroSection
          title="Transparência"
          subtitle="Acesse informações sobre a SECTI"
        />

        {/* Content Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Introdução */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">
                  Portal de Transparência
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Conheça mais sobre os programas, projetos e informações institucionais da SECTI.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                  <p className="text-red-700 font-medium">Erro ao carregar submenus: {error}</p>
                </div>
              )}

              {/* No Content Message */}
              {!isLoading && submenus.length === 0 && !error && (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <p className="text-gray-600 text-lg">Nenhum submenu disponível no momento.</p>
                </div>
              )}

              {/* Submenus Grid */}
              {submenus.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {submenus.map((submenu, index) => (
                    <a
                      key={index}
                      href={submenu.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#195CE3]"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#0C2856] group-hover:text-[#195CE3] transition-colors">
                              {submenu.titulo}
                            </h3>
                          </div>
                          <svg
                            className="w-6 h-6 text-gray-400 group-hover:text-[#195CE3] transition-colors ml-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-[#0C2856] to-[#195CE3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
};

