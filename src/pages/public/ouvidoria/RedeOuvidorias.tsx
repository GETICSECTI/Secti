import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

export const RedeOuvidorias = () => {
  // SEO
  useSEO({
    title: 'Rede de Ouvidorias',
    description: 'Conheça a rede de ouvidorias do Estado de Pernambuco e seus contatos.',
    canonical: 'https://secti.pe.gov.br/ouvidoria/rede-ouvidorias',
    keywords: 'Rede Ouvidorias, Contatos, Pernambuco',
  });
  const ouvidorias = [
    {
      id: 1,
      orgao: 'SECRETARIA DE CIÊNCIA, TECNOLOGIA E INOVAÇÃO',
      sigla: 'SECTI',
      ouvidor: 'Fátima Maria Pereira de Lima',
      endereco: 'Rua Vital de Oliveira, 32 – 2º andar – Bairro do Recife',
      cep: '50.030-370',
      telefone: '(081) 3183.5598',
      email: 'ouvidoria@secti.pe.gov.br',
    },
    {
      id: 2,
      orgao: 'UNIVERSIDADE DE PERNAMBUCO',
      sigla: 'UPE',
      ouvidor: 'Maria do Rosário Lapenda',
      endereco: 'Avenida Agamenon Magalhães, s/n, Santo Amaro, Recife',
      cep: '50.100-010',
      telefone: '(81) 3183.3676',
      email: 'ouvidoria@upe.br',
    },
    {
      id: 3,
      orgao: 'CENTRO INTEGRADO DE SAÚDE AMAURY MEDEIROS',
      sigla: 'CISAM',
      ouvidor: 'Tânia Santos Cavalcante Santana',
      endereco: 'Rua Visconde de Mamanguape, s/n, Encruzilhada, Recife',
      cep: '52030-010',
      telefone: '(81) 3182.7709',
      email: 'ouvidoriacisam@gmail.com',
    },
    {
      id: 4,
      orgao: 'HOSPITAL UNIVERSITÁRIO OSWALDO CRUZ',
      sigla: 'HUOC',
      ouvidor: 'Edmar Maria Santos',
      endereco: 'Rua Arnóbio Marques, 310, Santo Amaro, Recife',
      cep: '51.100-130',
      telefone: '(81) 3184.1270',
      email: 'ouvidoria.huoc@gmail.com',
    },
    {
      id: 5,
      orgao: 'PRONTO SOCORRO CARDIOLÓGICO PROF. LUIZ TAVARES',
      sigla: 'PROCAPE',
      ouvidor: 'Irapuan da Silva Duarte Júnior',
      endereco: 'Rua dos Palmares, s/n, Santo Amaro, Recife',
      cep: '50100-060',
      telefone: '(81) 3181.7217',
      email: 'procapeouvidoria@gmail.com',
    }
  ];

  return (
    <PublicLayout>
      <HeroSection
        title="Rede de Ouvidorias da SECTI"
        subtitle="Conheça nossa rede de atendimento ao cidadão"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            {/* Introdução */}
            <div className="mb-12">
              <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Nossa Rede de Atendimento</h2>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-lg text-center mb-6">
                    A Secretaria de Ciência, Tecnologia e Inovação – SECTI coloca à disposição sua <strong>Ouvidoria Central</strong> e as <strong>setoriais dos órgãos vinculados</strong>. Conheça a nossa rede de atendimento:
                  </p>
                </div>

                {/* Estatísticas */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856] text-center">
                    <div className="text-4xl font-bold text-[#0C2856] mb-2">{ouvidorias.length}</div>
                    <p className="text-gray-700 font-semibold">Ouvidorias</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856] text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-12 h-12 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold">Atendimento Dedicado</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856] text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-12 h-12 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold">Canais Seguros</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Ouvidorias */}
            <div className="space-y-8">
              {ouvidorias.map((ouv, index) => (
                <div key={ouv.id} className="relative">
                  {/* Card da Ouvidoria */}
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-[#0C2856] hover:shadow-2xl transition-shadow duration-300">
                    {/* Header com gradiente */}
                    <div className={`bg-[#0C2856] text-white p-6`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                              <span className="text-xl font-bold">{ouv.sigla}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                              <span className="text-lg font-bold">{index + 1}</span>
                            </div>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold mb-1">{ouv.orgao}</h3>
                        </div>
                        <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>

                    {/* Corpo do Card */}
                    <div className="p-6">
                      {/* Ouvidor */}
                      <div className="mb-6 bg-gray-50 rounded-lg p-4 border-l-2 border-[#195CE3]">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-600 uppercase">Ouvidor(a)</span>
                        </div>
                        <p className="text-lg font-bold text-[#0C2856]">{ouv.ouvidor}</p>
                      </div>

                      {/* Informações de Contato */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Endereço */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#195CE3] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <p className="text-sm font-semibold text-gray-600">Endereço</p>
                              <p className="text-gray-700">{ouv.endereco}</p>
                              <p className="text-gray-700">CEP: {ouv.cep}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contatos */}
                        <div className="space-y-3">
                          {/* Telefone */}
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#195CE3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <p className="text-sm font-semibold text-gray-600">Telefone</p>
                              <p className="text-gray-700 font-medium">{ouv.telefone}</p>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#195CE3] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-semibold text-gray-600">E-mail</p>
                              <a href={`mailto:${ouv.email}`} className="text-[#195CE3] font-medium hover:underline">
                                {ouv.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
