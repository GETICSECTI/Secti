import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

export const ApresentacaoOuvidoria = () => {
  // SEO
  useSEO({
    title: 'Apresentação da Ouvidoria',
    description: 'Conheça a Ouvidoria da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco, seu papel e canais de comunicação.',
    canonical: 'https://secti.pe.gov.br/ouvidoria/apresentacao',
    keywords: 'Ouvidoria, SECTI, Comunicação, Denúncia',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="Apresentação da Ouvidoria"
        subtitle="Conheça o canal de comunicação entre você e a SECTI"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Introdução */}
            <div className="mb-12">
              <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">O que é a Ouvidoria?</h2>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-lg mb-6">
                    A Ouvidoria é um dos principais canais de acesso à administração da Secretaria de Ciência, Tecnologia e Inovação (SECTI) e a unidade responsável por atuar junto ao cidadão, recebendo as demandas da sociedade civil e dos servidores da Secretaria. É um canal aberto para sugestões, elogios, reclamações e pedidos de acesso à informação, além de um importante instrumento de controle social e de transformação institucional, uma vez propõe mudanças e ajustes nas atividades internas da SECTI, a partir das demandas encaminhadas pela sociedade, o que auxilia na busca pela eficiência da prestação do serviço público.
                  </p>
                </div>
              </div>
            </div>

            {/* O que a Ouvidoria faz */}
            <div className="mb-12">
              <div className="bg-[#195CE3] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center flex items-center justify-center gap-3">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  O que a Ouvidoria faz?
                </h2>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Recebe e trata todas as manifestações relacionadas aos serviços prestados pela SECTI;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Orienta o cidadão sobre encaminhamento de denúncia;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Encaminha as demandas às áreas responsáveis para o seu tratamento, guardando sigilo quando necessário ou solicitado;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Realiza toda a tramitação dos Pedidos de Acesso à Informação – PAI e Recursos de Acesso à Informação da Lei de Acesso à Informação;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Analisa o teor da resposta das áreas responsáveis, se atende objetivamente à solicitação do cidadão;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Informa aos cidadãos os resultados das demandas encaminhadas;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#195CE3]">
                    <svg className="w-6 h-6 text-[#195CE3] shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Realiza seminários para promover o exercício da cidadania e contribuir para o controle social.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* O que a Ouvidoria NÃO faz */}
            <div className="mb-12">
              <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center flex items-center justify-center gap-3">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  O que a Ouvidoria não faz?
                </h2>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                    <svg className="w-6 h-6 text-red-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Não substitui os canais institucionais de atendimento da SECTI e outros órgãos de polícia;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                    <svg className="w-6 h-6 text-red-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Não decide pelas unidades técnicas da SECTI quanto à solução de demandas;</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                    <svg className="w-6 h-6 text-red-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-700">Não presta consultoria jurídica.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Como chegar à Ouvidoria */}
            <div className="mb-12">
              <div className="bg-[#195CE3] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Como chegar à Ouvidoria Central da SECTI?</h2>
                <p className="text-xl text-center text-gray-100">A Ouvidoria Central da SECTI dispõe de vários canais para seu atendimento.</p>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Atendimento Presencial */}
                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856]">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-8 h-8 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="font-bold text-[#0C2856] text-xl">Atendimento Presencial</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 italic">(mediante agendamento)</p>
                    <p className="text-gray-700 mb-2">
                      <strong>Endereço:</strong><br />
                      Rua Vital de Oliveira, nº 32, Bairro do Recife, Recife – PE.<br />
                      CEP: 50.030-370
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Horário:</strong><br />
                      De segunda à sexta, das 8h às 17h
                    </p>
                    <p className="text-sm text-gray-600 mt-4">
                      No endereço acima, também é possível enviar cartas para a Ouvidoria.
                    </p>
                  </div>

                  {/* Teleatendimento */}
                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#195CE3]">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-8 h-8 text-[#195CE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <h3 className="font-bold text-[#0C2856] text-xl">Teleatendimento</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[#0C2856] text-white rounded-lg p-4 text-center">
                        <p className="text-4xl font-bold">162</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <p className="text-2xl font-semibold text-[#0C2856]">(81) 3183-5598</p>
                      </div>
                    </div>
                  </div>

                  {/* Internet */}
                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856]">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-8 h-8 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <h3 className="font-bold text-[#0C2856] text-xl">Internet</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Acesse os formulários para manifestações no ícone <strong>"Fale com a Ouvidoria"</strong> ou envie um e-mail para:
                    </p>
                    <div className="bg-[#195CE3] text-white rounded-lg p-3 text-center">
                      <a href="mailto:ouvidoria@secti.pe.gov.br" className="font-semibold hover:underline">
                        ouvidoria@secti.pe.gov.br
                      </a>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      No site oficial da Fundação de Amparo à Ciência e Tecnologia do Estado de Pernambuco (FACEPE), também encontram-se disponíveis os formulários para registro de manifestação. Acesse <a href="http://www.facepe.br" target="_blank" rel="noopener noreferrer" className="text-[#195CE3] font-semibold hover:underline">www.facepe.br</a>.
                    </p>
                  </div>

                  {/* Caixa de Sugestão */}
                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#195CE3]">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-8 h-8 text-[#195CE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <h3 className="font-bold text-[#0C2856] text-xl">Caixa de Sugestão</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Deixe sua manifestação na urna localizada em:
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-[#195CE3]">
                        <p className="font-semibold text-[#0C2856]">Sede da SECTI</p>
                        <p className="text-gray-600">Rua Vital de Oliveira, nº 32, Bairro do Recife</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-[#195CE3]">
                        <p className="font-semibold text-[#0C2856]">Espaço Ciência</p>
                        <p className="text-gray-600">Complexo de Salgadinho Parque Memorial Arcoverde – Parque 2, s/n – Salgadinho, Olinda – PE. CEP: 53020-560</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border-l-2 border-[#195CE3]">
                        <p className="font-semibold text-[#0C2856]">FACEPE</p>
                        <p className="text-gray-600">Rua Benfica, 150, Madalena, Recife – PE. CEP: 50720-001</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-[#0C2856] text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Sua voz é importante!</h3>
              <p className="text-lg text-gray-100">
                A Ouvidoria está à disposição para ouvir suas sugestões, elogios, reclamações e solicitações de informação.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
