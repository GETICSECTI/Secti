import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useState } from 'react';
import { useSEO } from '../../../utils/useSEO.ts';
import OrganogramaSecti2023 from "../../../assets/OrganogramaSECTI2023.jpg";

export const Organograma = () => {
  // SEO
  useSEO({
    title: 'Organograma',
    description: 'Conheça a estrutura organizacional da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/secti/organograma',
    keywords: 'Organograma, SECTI, Estrutura, Pernambuco',
  });
  const [imagemCarregada, setImagemCarregada] = useState(false);
  const [erro, setErro] = useState(false);

  const handleImageLoad = () => {
    setImagemCarregada(true);
    setErro(false);
  };

  const handleImageError = () => {
    setErro(true);
    setImagemCarregada(false);
  };

  const abrirImagemCompleta = () => {
    window.open(OrganogramaSecti2023, '_blank');
  };

  return (
    <PublicLayout>
      <HeroSection
        title="Organograma"
        subtitle="Estrutura organizacional da SECTI-PE"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Introdução */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">Estrutura Organizacional</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Conheça a estrutura organizacional da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco e como estamos organizados para atender às demandas do setor.
              </p>
            </div>

            {/* Card do Organograma */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header do Card */}
              <div className="bg-[#0C2856] text-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Organograma Institucional</h3>
                    <p className="text-gray-200">Estrutura hierárquica e divisões da SECTI-PE</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={abrirImagemCompleta}
                      className="inline-flex items-center gap-2 bg-[#195CE3] text-white px-4 py-2 rounded-lg hover:bg-[#1348A3] transition duration-200 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      Ampliar
                    </button>
                    <a
                      href={OrganogramaSecti2023}
                      download="organograma-secti-pe-2023.jpg"
                      className="inline-flex items-center gap-2 bg-white text-[#0C2856] px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Baixar
                    </a>
                  </div>
                </div>
              </div>

              {/* Conteúdo da Imagem */}
              <div className="p-6">
                {erro ? (
                  // Estado de Erro
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-3">Organograma em Desenvolvimento</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      O organograma institucional está sendo atualizado. Em breve estará disponível para visualização e download.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex cursor-pointer items-center gap-2 bg-[#0C2856] text-white px-6 py-3 rounded-lg hover:bg-[#195CE3] transition duration-200 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Tentar Novamente
                      </button>
                      <a
                        href="mailto:contato@secti.pe.gov.br"
                        className="inline-flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Entrar em Contato
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Loading State */}
                    {!imagemCarregada && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 text-gray-600 mb-3">
                            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Carregando organograma...
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Imagem do Organograma */}
                    <div className="relative">
                      <img
                        src={OrganogramaSecti2023}
                        alt="Organograma da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco"
                        className={`w-full h-auto rounded-lg transition-opacity duration-300 cursor-zoom-in ${
                          imagemCarregada ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* Informações sobre Acessibilidade */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#0C2856]">
                <h4 className="text-lg font-bold text-[#0C2856] mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Acessibilidade
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Para melhor acessibilidade, você pode baixar a imagem em alta resolução ou solicitar uma versão em texto da estrutura organizacional através dos nossos canais de atendimento.
                </p>
              </div>

              {/* Informações sobre Atualizações */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#195CE3]">
                <h4 className="text-lg font-bold text-[#0C2856] mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Última Atualização
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Este organograma reflete a estrutura organizacional atual da SECTI-PE. Atualizações são realizadas conforme mudanças na estrutura institucional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
