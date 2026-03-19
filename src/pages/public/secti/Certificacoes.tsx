import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

export const Certificacoes = () => {
  // SEO
  useSEO({
    title: 'Certificações',
    description: 'Conheça as certificações e reconhecimentos de excelência da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/secti/certificacoes',
    keywords: 'Certificações, Qualidade, SECTI, Pernambuco',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="Certificações"
        subtitle="Reconhecimentos e certificações de excelência da SECTI-PE"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Introdução */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">Excelência em Governança e Gestão</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                A SECTI-PE mantém seu compromisso com a transparência, eficiência e qualidade na gestão pública,
                conquistando importantes certificações que atestam nossos padrões de excelência.
              </p>
            </div>

            {/* Certificações Cards */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* IAS Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#0C2856] text-white p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">IAS</h3>
                      <p className="text-gray-200">Índice de Adequação ao Sistema de Controle Interno</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">NÍVEL 5</span>
                    <span className="text-sm text-gray-200">Máxima adequação</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      Instrumento que avalia o grau de adequação das Unidades de Controle Interno (UCIs) do Poder Executivo Estadual aos requisitos estabelecidos no <strong>Decreto Estadual nº 47.087/2019</strong>, na <strong>Portaria nº 011/2019</strong> e nas orientações técnicas repassadas pela SCGE, a partir de pontos de controle estabelecidos pela SECTI.
                    </p>
                    <p className="mb-6">
                      Possui cinco níveis, sendo o <strong>nível 5</strong> o nível máximo de adequação.
                    </p>
                  </div>

                  {/* Anos de conquista */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-[#0C2856] mb-3">Anos de Conquista do Nível Máximo:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['2021', '2022', '2023', '2024', '2025'].map(ano => (
                        <span key={ano} className="bg-[#0C2856] text-white px-3 py-1 rounded-lg font-medium">
                          {ano}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      <strong>5 anos consecutivos</strong> mantendo o padrão de excelência
                    </p>
                  </div>
                </div>
              </div>

              {/* IIMG Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#195CE3] text-white p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">IIMG</h3>
                      <p className="text-gray-200">Instrumento de Maturidade da Gestão</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">100 PONTOS</span>
                    <span className="text-sm text-gray-200">Pontuação máxima</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      Desenvolvido para ser o primeiro patamar de referência do nível de maturidade da governança e gestão do <strong>Gestaopublicagov.br</strong>.
                    </p>
                    <p className="mb-6">
                        uma ferramenta de autoavaliação aplicada pelo Governo Federal para aprimorar o desempenho de órgãos que operam recursos da União. Com base em critérios como liderança, estratégias e processos, o IMGG determina o nível de maturidade da gestão, gerando planos de ação para a melhoria contínua da qualidade e eficiência.
                    </p>
                  </div>

                  {/* Benefícios */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-[#195CE3] mb-3">Benefícios da Certificação:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#195CE3] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Aprimoramento da governança institucional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#195CE3] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Otimização de processos de gestão</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#195CE3] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Melhoria na operacionalização de parcerias</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Compromisso */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-[#0C2856] mb-4">Nosso Compromisso</h3>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Estas certificações refletem o compromisso contínuo da SECTI-PE com a excelência na gestão pública,
                  transparência e eficiência no uso dos recursos estaduais.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#0C2856] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#0C2856] mb-2">Transparência</h4>
                  <p className="text-sm text-gray-700">Atuação transparente e responsável em todas as ações institucionais.</p>
                </div>

                <div className="text-center">
                  <div className="bg-[#0C2856] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#0C2856] mb-2">Eficiência</h4>
                  <p className="text-sm text-gray-700">Otimização contínua de processos e recursos para melhores resultados.</p>
                </div>

                <div className="text-center">
                  <div className="bg-[#0C2856] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#0C2856] mb-2">Qualidade</h4>
                  <p className="text-sm text-gray-700">Padrões elevados de qualidade em todos os serviços prestados.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
