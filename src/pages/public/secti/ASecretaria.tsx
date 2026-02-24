import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

export const ASecretaria = () => {
  // SEO
  useSEO({
    title: 'A Secretaria',
    description: 'Conheça a Secretaria de Ciência, Tecnologia e Inovação de Pernambuco, sua história, competências e papel no desenvolvimento científico e tecnológico do estado.',
    canonical: 'https://secti.pe.gov.br/secti/a-secretaria',
    keywords: 'SECTI, Secretaria, Ciência, Tecnologia, Inovação, Pernambuco',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="A Secretaria"
        subtitle="Secretaria de Ciência, Tecnologia e Inovação de Pernambuco"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Introdução */}
            <div className="mb-8">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-xl mb-6 font-medium text-[#0C2856]">
                  A Secretaria de Ciência, Tecnologia e Inovação de Pernambuco (Secti/PE) desempenha o papel fundamental de formular, fomentar e executar ações da política estadual de desenvolvimento científico, tecnológico e de inovação, como fator de evolução social.
                </p>

                <p className="mb-6">
                  De acordo com a <strong>Lei Estadual nº 18.139, de 18 de janeiro de 2023</strong>, o órgão tem ainda a competência de promover e apoiar ações e atividades de incentivo à ciência, as ações de ensino superior, pesquisa científica e extensão; planejar e executar ações para a criação e consolidação de ambientes e empreendimentos de inovação no Estado.
                </p>
              </div>
            </div>

            {/* Competências Section */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0C2856] mb-6">Competências</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Formular e desenvolver medidas para ampliação e interiorização da base de competências científicas e tecnológicas do Estado, bem como apoiar as ações de polícia científica e medicina legal; instituir e gerir centros tecnológicos; e promover a educação tecnológica e a radiodifusão pública e de serviços conexos também estão entre as missões da Instituição estadual, que tem a <strong>Fundação de Amparo à Ciência e Tecnologia (Facepe)</strong> e a <strong>Universidade de Pernambuco (UPE)</strong> como entidades vinculadas.
                </p>
              </div>
            </div>

            {/* Parcerias e Gestão */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0C2856] mb-6">Parcerias e Gestão</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Com foco no estímulo à tecnologia e à inovação, a Secti mantém contrato de gestão com o <strong>Instituto de Tecnologia de Pernambuco (Itep)</strong> e o <strong>Núcleo de Gestão Porto Digital</strong>.
                </p>
              </div>
            </div>

            {/* Equipamentos Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Espaço Ciência */}
              <div className="bg-[#0C2856] rounded-lg p-6 text-white shadow-lg">
                <div className="mb-4">
                  <svg className="h-12 w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Espaço Ciência</h3>
                <p className="text-sm leading-relaxed">
                  Com forte atuação na popularização, educação e sensibilização científica, a Secti/PE é responsável pelo Espaço Ciência, um museu interativo de ciência e tecnologia, localizado entre as cidades de Recife e Olinda. Com áreas para contemplação, lazer e aprendizagem, no equipamento é realizado um conjunto de procedimentos voltados à comunicação da ciência para estudantes, professores e o público em geral.
                </p>
              </div>

              {/* Parqtel */}
              <div className="bg-[#0C2856] rounded-lg p-6 text-white shadow-lg">
                <div className="mb-4">
                  <svg className="h-12 w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Parqtel</h3>
                <p className="text-sm leading-relaxed">
                  Além disso, gere também o Parque Tecnológico de Eletrônicos e Tecnologias Associadas de Pernambuco, Parqtel, um complexo imobiliário planejado para o desenvolvimento empresarial e tecnológico de Pernambuco.
                </p>
              </div>
            </div>

            {/* Entidades Vinculadas */}
            <div className="bg-[#0C2856] rounded-lg p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Entidades Vinculadas</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-semibold text-lg">Facepe</h4>
                    <p className="text-sm text-gray-200">Fundação de Amparo à Ciência e Tecnologia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-semibold text-lg">UPE</h4>
                    <p className="text-sm text-gray-200">Universidade de Pernambuco</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-semibold text-lg">Itep</h4>
                    <p className="text-sm text-gray-200">Instituto de Tecnologia de Pernambuco</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div>
                    <h4 className="font-semibold text-lg">Porto Digital</h4>
                    <p className="text-sm text-gray-200">Núcleo de Gestão Porto Digital</p>
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
