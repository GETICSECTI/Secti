import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

export const Historia = () => {
  // SEO
  useSEO({
    title: 'História',
    description: 'Conheça a história da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco e sua evolução ao longo dos anos.',
    canonical: 'https://secti.pe.gov.br/secti/historia',
    keywords: 'História, SECTI, Pernambuco, Trajetória',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="História"
        subtitle="A trajetória da SECTI ao longo dos anos"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Timeline Section */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-8 text-center">Linha do Tempo</h2>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-linear-to-b from-[#0C2856] to-[#195CE3]"></div>

                <div className="space-y-12">
                  {/* 1988 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="md:text-right mb-4 md:mb-0">
                        <div className="bg-[#0C2856] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">1988</h3>
                          <p className="text-gray-100">
                            Criação da Secretaria de Ciência e Tecnologia do Estado de Pernambuco pela <strong>Lei 10.133 de 1988</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block"></div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#0C2856] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 1991 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="hidden md:block"></div>
                      <div className="mb-4 md:mb-0">
                        <div className="bg-[#195CE3] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">1991</h3>
                          <p className="text-gray-100">
                            Extinção da Secretaria pela <strong>Lei 10.569/1991</strong>, publicada no Diário Oficial em 20 de abril de 1991.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#195CE3] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 1993 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="md:text-right mb-4 md:mb-0">
                        <div className="bg-[#0C2856] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">1993</h3>
                          <p className="text-gray-100">
                            Recriação do órgão pela <strong>Lei 10.920</strong>, publicada no Diário Oficial em 02 de julho de 1993, com a denominação de <strong>Secretaria de Ciência, Tecnologia e Meio Ambiente (SECTMA)</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block"></div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#0C2856] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 2003 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="hidden md:block"></div>
                      <div className="mb-4 md:mb-0">
                        <div className="bg-[#195CE3] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">2003</h3>
                          <p className="text-gray-100">
                            A SECTMA passou a ter competência especificamente sobre recursos hídricos e ações de ensino superior, nos termos da <strong>Lei Complementar 49/2003</strong>, publicada no Diário Oficial em 1º de fevereiro de 2003.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#195CE3] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 2007 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="md:text-right mb-4 md:mb-0">
                        <div className="bg-[#0C2856] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">2007</h3>
                          <p className="text-gray-100">
                            A <strong>Lei 13.205/2007</strong>, publicada no Diário Oficial em 20 de janeiro de 2007, criou a Secretaria de Recursos Hídricos do Estado. Ficaram vinculadas à SECTMA: CPRH, Distrito Estadual de Fernando de Noronha, FACEPE e UPE.
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block"></div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#0C2856] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 2011 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="hidden md:block"></div>
                      <div className="mb-4 md:mb-0">
                        <div className="bg-[#195CE3] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">2011</h3>
                          <p className="text-gray-100">
                            A <strong>Lei 14.264</strong>, publicada no Diário Oficial em 07 de janeiro de 2011, a SECTMA voltou a ser <strong>Secretaria de Ciência e Tecnologia (SECTEC)</strong>. Foi criada a Secretaria de Meio Ambiente e Sustentabilidade (SEMAS).
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#195CE3] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 2015 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="md:text-right mb-4 md:mb-0">
                        <div className="bg-[#0C2856] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">2015</h3>
                          <p className="text-gray-100">
                            A Secretaria passa a incorporar o termo "inovação", se tornando <strong>Secretaria de Ciência, Tecnologia e Inovação (SECTI)</strong>, de acordo com a <strong>Lei estadual n° 15.452/15</strong>, publicada no Diário Oficial em 16 de janeiro de 2015.
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block"></div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#0C2856] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* 2017 */}
                  <div className="relative">
                    <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                      <div className="hidden md:block"></div>
                      <div className="mb-4 md:mb-0">
                        <div className="bg-[#195CE3] text-white rounded-lg p-6 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">2017</h3>
                          <p className="text-gray-100">
                            O Distrito Estadual de Fernando de Noronha passou a ser vinculado à SEMAS em virtude da <strong>Lei 16.069/17</strong>, publicada no Diário Oficial em 16 de junho de 2017.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#195CE3] rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Construção Histórica Section */}
            <div className="mt-16">
              <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Construção Histórica</h2>
                <p className="text-xl text-center text-gray-100">Prédio da Secretaria de Ciência, Tecnologia e Inovação</p>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="mb-6">
                    No início do século passado – no ano de <strong>1919</strong> – foi erguido o prédio que hoje abriga a Secretaria de Ciência, Tecnologia e Inovação (SECTI). Com uma arquitetura no estilo eclético, foi uma das primeiras edificações a serem erguidas na zona portuária do Recife. <strong>Tombado pelo Patrimônio Histórico</strong>, é considerado um dos principais exemplares do acervo de edifícios da área.
                  </p>

                  <p className="mb-6">
                    Inicialmente projetado para sediar a fiscalização do Porto, foi, até meados da década de 80, sede do Departamento Nacional de Portos e Vias Navegáveis (DNPVN). Seus elementos decorativos são resultado de um impressionante serviço de estucaria, método que utiliza moldes para criação de ornatos.
                  </p>

                  {/* Cards com características do prédio */}
                  <div className="grid md:grid-cols-2 gap-6 my-8">
                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[#0C2856]">
                      <h4 className="font-bold text-[#0C2856] mb-2 text-lg">Dimensões</h4>
                      <p className="text-gray-700">Fachada de 25,5 metros de altura e 30 metros de comprimento</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[#195CE3]">
                      <h4 className="font-bold text-[#0C2856] mb-2 text-lg">Construção</h4>
                      <p className="text-gray-700">Empresa francesa Societé de Construction du Port</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[#0C2856]">
                      <h4 className="font-bold text-[#0C2856] mb-2 text-lg">Estrutura</h4>
                      <p className="text-gray-700">Alvenaria de tijolos cerâmicos e maciços, sacadas em concreto armado</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[#195CE3]">
                      <h4 className="font-bold text-[#0C2856] mb-2 text-lg">Madeiramento</h4>
                      <p className="text-gray-700">Portas e esquadrias em madeira amarelo vinhático</p>
                    </div>
                  </div>

                  <div className="bg-[#0C2856] text-white rounded-lg p-8 my-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Restauração (2002-2003)
                    </h3>
                    <p className="mb-4 text-gray-100">
                      As primeiras obras de restauração foram iniciadas em janeiro de 2002 e concluídas em janeiro de 2003, sob o comando do arquiteto <strong>Jorge Passos</strong>.
                    </p>
                    <p className="mb-4 text-gray-100">
                      No trabalho de revitalização do bairro do Recife, coordenado pelo Porto Digital, Passos realizou o restauro da fachada, das esquadrias, das grades, da escada monumental e da coberta da edificação.
                    </p>
                    <p className="text-gray-100">
                      A fachada foi recomposta seguindo o projeto original. Para recompor sua estrutura, a equipe de restauradores reuniu peças espalhadas pelo interior do prédio e, com pesquisa fotográfica e histórica, foi possível descobrir os formatos originais e obter o desenho inicial de objetos e estruturas.
                    </p>
                  </div>

                  <div className="text-[#0C2856] rounded-lg p-6 text-center">
                    <h4 className="text-2xl font-bold mb-2">Patrimônio Histórico</h4>
                    <p className="text-lg">
                      O prédio é tombado e reconhecido como um dos principais exemplares arquitetônicos da zona portuária do Recife
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
