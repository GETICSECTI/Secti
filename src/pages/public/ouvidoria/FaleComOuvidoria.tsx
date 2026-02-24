import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

// Import das imagens
import ManifestacaoImg from '../../../assets/Manifestacao.png';
import ConsultaPublicaImg from '../../../assets/ConsultaPublica.jpg';
import AcessoAInformacaoImg from '../../../assets/AcessoAInformacao.png';
import AcompanhamentoPedidosImg from '../../../assets/AcompanhamentoPedidos.jpg';
import ConsultaLogadaImg from '../../../assets/ConsultaLogada.jpg';
import LGPDPEImg from '../../../assets/LGPDPE.png';

export const FaleComOuvidoria = () => {
  // SEO
  useSEO({
    title: 'Fale com a Ouvidoria',
    description: 'Canais para entrar em contato com a Ouvidoria da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/ouvidoria/fale-com-ouvidoria',
    keywords: 'Contato, Ouvidoria, SECTI, Reclamação, Sugestão',
  });

  // Array com as opções de atendimento
  const opcoes = [
    {
      id: 1,
      titulo: 'Registrar Manifestação',
      descricao: 'Registre sua sugestão, elogio, reclamação ou denúncia',
      link: 'https://ouve.pe.gov.br/modalidades/2/tipos_atendimentos',
      imagem: ManifestacaoImg
    },
    {
      id: 2,
      titulo: 'Consulta Pública',
      descricao: 'Consulte manifestações públicas sem necessidade de login',
      link: 'https://transparencia.pe.gov.br/participacao-cidada-pe/acesso-a-informacao/consulta-publica-de-pedidos-de-acesso-a-informacao/',
      imagem: ConsultaPublicaImg
    },
    {
      id: 3,
      titulo: 'Acesso à Informação',
      descricao: 'Solicite informações públicas (Lei de Acesso)',
      link: 'https://ouve.pe.gov.br/modalidades/1/tipos_atendimentos',
      imagem: AcessoAInformacaoImg
    },
    {
      id: 4,
      titulo: 'Acompanhamento de Pedidos',
      descricao: 'Acompanhe seus pedidos de acesso à informação',
      link: 'https://ouve.pe.gov.br/modalidades/consultas',
      imagem: AcompanhamentoPedidosImg
    },
    {
      id: 5,
      titulo: 'Consulta Logada',
      descricao: 'Acesse suas manifestações com login',
      link: 'https://ouve.pe.gov.br/login',
      imagem: ConsultaLogadaImg
    },
    {
      id: 6,
      titulo: 'LGPD - PE',
      descricao: 'Informações sobre proteção de dados pessoais',
      link: 'https://ouve.pe.gov.br/modalidades/3/tipos_atendimentos',
      imagem: LGPDPEImg
    }
  ];

  return (
    <PublicLayout>
      <HeroSection
        title="Fale com a Ouvidoria"
        subtitle="Ouve.PE - O novo canal de comunicação com o cidadão"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            {/* Sobre o Ouve.PE */}
            <div className="mb-12">
              <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Sobre o Ouve.PE</h2>
                <p className="text-xl text-center text-gray-100">Sistema integrado de atendimento ao cidadão</p>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-lg mb-6">
                    O <strong>Ouve.PE</strong> foi projetado para otimizar o atendimento e a comunicação entre a população e a Rede de Ouvidorias do Estado em substituição ao antigo sistema Gcon, que apresentava limitações. Com um layout amigável e ferramentas de V Libras, o Ouve.PE promete maior acessibilidade, confiabilidade e eficiência nas tratativas. Os cidadãos poderão realizar consultas a todas as manifestações já realizadas, com a possibilidade de complementação.
                  </p>
                </div>

                {/* Características do Ouve.PE */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856]">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-8 h-8 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                      <h4 className="font-bold text-[#0C2856]">Acessibilidade</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Interface amigável com recursos de V Libras para melhor acessibilidade</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856]">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-8 h-8 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h4 className="font-bold text-[#0C2856]">Confiabilidade</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Sistema seguro e confiável para proteção de suas informações</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#0C2856]">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-8 h-8 text-[#0C2856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h4 className="font-bold text-[#0C2856]">Eficiência</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Tratamento ágil e eficiente de todas as manifestações recebidas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opções de Atendimento */}
            <div className="mb-12">
              <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Como podemos ajudar?</h2>
                <p className="text-xl text-center text-gray-100">Escolha uma das opções abaixo para iniciar seu atendimento</p>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opcoes.map((opcao) => (
                    <a
                      key={opcao.id}
                      href={opcao.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={opcao.imagem}
                          alt={opcao.titulo}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
