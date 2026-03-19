import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';
import Mauricelia from "../../../assets/Mauricelia-Montenegro.jpg"

export const ASecretariaCargo = () => {
  // SEO
  useSEO({
    title: 'A Secretária',
    description: 'Conheça a Secretária de Ciência, Tecnologia e Inovação de Pernambuco e sua trajetória profissional.',
    canonical: 'https://secti.pe.gov.br/secti/a-secretaria-cargo',
    keywords: 'Secretária, SECTI, Pernambuco, Gestão',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="A Secretária"
        subtitle="Conheça a gestora à frente da SECTI-PE"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Photo Column */}
              <div className="md:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-linear-to-br from-[#0C2856] to-[#195CE3] rounded-lg p-1 shadow-xl">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img
                        src={Mauricelia}
                        alt="Mauricélia Vidal Montenegro - Secretária de Ciência, Tecnologia e Inovação de Pernambuco"
                        className="w-full h-full object-cover aspect-3/4"
                      />
                    </div>
                  </div>

                  {/* LinkedIn Button */}
                  <a
                    href="https://www.linkedin.com/in/mauriceliamontenegro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0077B5] text-white py-3 px-4 rounded-lg hover:bg-[#006399] transition duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Content Column */}
              <div className="md:col-span-2">
                {/* Nome e Cargo */}
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-2">Mauricélia Vidal Montenegro</h2>
                  <p className="text-xl text-[#195CE3] font-semibold mb-4">Secretária de Ciência, Tecnologia e Inovação de Pernambuco</p>

                  <div className="h-1 w-24 bg-linear-to-r from-[#0C2856] to-[#195CE3] rounded-full mb-6"></div>

                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      Administradora, Mestre em Economia pela Universidade Federal da Paraíba, em Campina Grande, e Doutoranda em Administração pela Universidad de la Empresa (UDE) em Montevidéu, capital do Uruguai; Mauricélia Vidal Montenegro foi apontada pela governadora Raquel Lyra para o comando da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco (Secti-PE). A designação foi publicada no Diário Oficial do Poder Executivo do Estado, no dia 2 de janeiro de 2023.
                    </p>

                    <p className="mb-6">
                      Paraibana de Santana dos Garrotes, desde cedo foi residir em Campina Grande e está radicada em Caruaru-PE desde 2001. É casada com o empresário Ricardo Montenegro e mãe das gêmeas Adélia e Manuela.
                    </p>
                  </div>
                </div>

                {/* Formação */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-2xl font-bold text-[#0C2856] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Formação Acadêmica
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#195CE3] mt-1">•</span>
                      <span><strong>Doutoranda em Administração</strong> - Universidad de la Empresa (UDE), Montevidéu, Uruguai</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#195CE3] mt-1">•</span>
                      <span><strong>Mestre em Economia</strong> - Universidade Federal da Paraíba, Campina Grande</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#195CE3] mt-1">•</span>
                      <span><strong>Administradora</strong></span>
                    </li>
                  </ul>
                </div>

                {/* Experiência Profissional */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#0C2856] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Experiência Profissional
                  </h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      Com larga experiência no setor privado, voltado principalmente para gestão executiva e acadêmica de Instituições de Ensino Superior (IES), atua também como <strong>Avaliadora do Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep)</strong>, para credenciamento de IES, autorização e reconhecimento de cursos de graduação.
                    </p>

                    <p className="mb-4">
                      Em Caruaru desde o ano de 2001, foi coordenadora do curso de Administração, Diretora Acadêmica, Diretora Executiva e a primeira Reitora da <strong>UniFavip Wyden</strong>. Por sua relevante atuação na educação no Estado de Pernambuco, recebeu os títulos de <strong>Cidadã Caruaruense e Pernambucana</strong>.
                    </p>

                    <p className="mb-4">
                      Em 2012, quando o grupo americano <strong>Adtalem Global Education</strong> (com sede em Chicago, Illinois – EUA), adquiriu a UniFavip; Mauricélia tornou-se <strong>Diretora Regional do Nordeste</strong>, liderando seis Instituições de Ensino Superior: Unifavip em Caruaru e UNIFBV no Recife (Pernambuco); UNIRUY e AREA 1 em Salvador (Bahia); Devry JPA em João Pessoa (Paraíba); FACIMP em Imperatriz e Faculdade Medicina de Açailândia, ambas no Maranhão.
                    </p>
                  </div>
                </div>

                {/* Reconhecimentos */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0C2856] rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <h4 className="font-bold text-lg">Leadership Excellence</h4>
                    </div>
                    <p className="text-sm text-gray-100">
                      Reconhecida como a melhor gestora global da Adtalem em 2014
                    </p>
                  </div>

                  <div className="bg-[#0C2856] rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-bold text-lg">Programa Catalyst</h4>
                    </div>
                    <p className="text-sm text-gray-100">
                      Participou do maior programa de desenvolvimento de carreira da Adtalem em Chicago (2017-2018)
                    </p>
                  </div>
                </div>

                {/* TEDx */}
                <div className="bg-[#FF2B06] text-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.545 8.182L12 13.09 4.455 8.182v7.636L12 20.727l7.545-4.909V8.182zM12 3.273L4.455 8.182 12 13.09l7.545-4.908L12 3.273z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl mb-2">TEDx Talks</h4>
                      <p className="text-lg">Palestrante no TEDx Recife em 2018</p>
                    </div>
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
