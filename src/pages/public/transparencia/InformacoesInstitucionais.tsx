import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { Accordion } from '../../../components/Accordion.tsx';
import type { AccordionItem } from '../../../components/Accordion.tsx';
import { useSEO } from '../../../utils/useSEO.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faEye,
  faBullseye,
  faFileAlt,
  faUsers,
  faGavel,
  faClock,
  faMapMarkerAlt,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";

// Dados das seções em accordion
const secoesAccordion: AccordionItem[] = [
  {
    id: 1,
    pergunta: 'Identidade Institucional',
    resposta: `
      <p class="mb-4">O Governo do Estado criou a Secretaria de Ciência e Tecnologia do Estado de Pernambuco em <strong>1988</strong>, pela <strong>Lei 10.133</strong>, órgão integrante da Administração Direta do Poder Executivo Estadual. Três anos depois, em <strong>1991</strong>, ela foi extinta e somente recriada em <strong>1993</strong>, por força da <strong>Lei 10.920</strong>, com a denominação de Secretaria de Ciência, Tecnologia e Meio Ambiente (SECTMA).</p>
      
      <p class="mb-4">Ao longo dos anos a Secretaria passou por diversas modificações institucionais, em 27 de Dezembro de 2018, a partir da <strong>Lei Nº 16.520</strong> incluiu explicitamente a dimensão inovação em suas atribuições tornando-se a <strong>Secretaria de Ciência, Tecnologia e Inovação (SECTI)</strong>, ligada à Administração Direta do Poder Executivo Estadual. Já em 02 de julho de 2021, um novo regulamento da SECTI foi aprovado nos termos do <strong>Decreto Estadual nº 50.925 de 02 de Julho de 2021</strong>, definindo a atual estrutura.</p>
      
      <p class="mb-4">A SECTI desenvolve suas atividades orientada pela <strong>Estratégia de Ciência, Tecnologia e Inovação para Pernambuco 2023-2027 (ECT&I-PE)</strong>, que compreende uma série de diretrizes para um conjunto orquestrado de ações a serem tomadas de forma articulada pelo governo, empresas, academia e sociedade.</p>
      
      <p class="mb-4"><strong>Suas atividades estão centradas nos seguintes eixos:</strong></p>
      <ul class="list-disc ml-6 mb-4 space-y-2">
        <li>Ciência, Articulação e Compartilhamento do Conhecimento</li>
        <li>Competências, Talentos e Criatividade</li>
        <li>Tecnologia e Competitividade</li>
        <li>Inovação para o Bem Estar Social</li>
      </ul>
    `
  },
  {
    id: 2,
    pergunta: 'Instituições Vinculadas à SECTI',
    resposta: `
      <div class="space-y-6">
        <div class="border-l-4 border-[#195CE3] pl-4">
          <h4 class="font-bold text-[#0C2856] mb-2 text-lg">Fundação de Amparo à Ciência e Tecnologia do Estado de Pernambuco (FACEPE)</h4>
          <p class="mb-2">A Facepe foi criada pela Lei Estadual nº 10.401 de 26 de dezembro de 1989. A missão da Fundação é promover o desenvolvimento científico e tecnológico do Estado de Pernambuco, através do fomento à ciência, tecnologia e inovação, mantendo estreita sintonia com o atendimento às suas necessidades sócio-econômicas.</p>
          <p><a href="http://facepe.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">Acesse: http://facepe.br/</a></p>
        </div>

        <div class="border-l-4 border-[#195CE3] pl-4">
          <h4 class="font-bold text-[#0C2856] mb-2 text-lg">Universidade de Pernambuco (UPE)</h4>
          <p class="mb-2">Instituição pública de ensino superior presente em todas as regiões do Estado. É administrada pela Fundação Universidade de Pernambuco, criada pela Lei Estadual nº 10.518, de 29 de novembro de 1990. A UPE tem um complexo multicampi, formado por 13 unidades de ensino e três grandes hospitais – Hospital Universitário Oswaldo Cruz (HUOC), Centro Integrado de Saúde Amaury de Medeiros (CISAM) e Pronto Socorro Cardiológico Universitário de Pernambuco Prof. Luiz Tavares (Procape).</p>
          <p><a href="http://www.upe.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">Acesse: http://www.upe.br/</a></p>
        </div>

        <div class="border-l-4 border-[#195CE3] pl-4">
          <h4 class="font-bold text-[#0C2856] mb-2 text-lg">Espaço Ciência</h4>
          <p class="mb-2">Centro interativo de divulgação científica, onde o visitante pode explorar o mundo da ciência de forma agradável e divertida. Com uma área de aproximadamente 12 hectares, é o maior ao ar livre da América Latina, recebendo uma média anual de 150 mil visitantes, principalmente estudantes.</p>
          <p><a href="http://www.espacociencia.pe.gov.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">Acesse: http://www.espacociencia.pe.gov.br/</a></p>
        </div>

        <div class="border-l-4 border-[#195CE3] pl-4">
          <h4 class="font-bold text-[#0C2856] mb-2 text-lg">Parqtel</h4>
          <p class="mb-2">O Parque Tecnológico Industrial, conhecido como Parqtel, é um complexo imobiliário planejado para promover o desenvolvimento empresarial e tecnológico em Pernambuco. Criado pelo Decreto Estadual Nº 46.901, DE 18 DE DEZEMBRO DE 2018, e vinculado à Secretaria de Ciência, Tecnologia e Inovação, o Parqtel ocupa uma área de 43,64 hectares no Município do Recife.</p>
          <p><a href="https://parqtel.pe.gov.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">Acesse: https://parqtel.pe.gov.br/</a></p>
        </div>
      </div>
    `
  },
  {
    id: 3,
    pergunta: 'Instituições Parceiras através de Contrato de Gestão',
    resposta: `
      <div class="space-y-6">
        <div class="border-l-4 border-[#195CE3] pl-4">
          <h4 class="font-bold text-[#0C2856] mb-2 text-lg">Porto Digital</h4>
          <p class="mb-2">Parque tecnológico de Tecnologia da Informação e Comunicação e Economia Criativa. Sua governança e projetos estruturadores são implantados pelo Núcleo de Gestão do Porto Digital, associação civil sem fins lucrativos, qualificada como Organização Social (OS).</p>
          <p><a href="http://www.portodigital.org/home" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">Acesse: http://www.portodigital.org/home</a></p>
        </div>

        <div class="border-l-4 border-[#195CE3] pl-4">
          <h4 class="font-bold text-[#0C2856] mb-2 text-lg">Instituto de Tecnologia de Pernambuco (ITEP)</h4>
          <p class="mb-2">O Itep é um centro de referência regional na oferta de soluções tecnológicas para o setor produtivo, visando à modernização e o desenvolvimento sustentável de Pernambuco e da Região Nordeste. Juridicamente, é uma associação civil de direito privado sem fins econômicos, qualificada como organização social. Criado em 1942, o ITEP atua no atendimento às principais demandas dos setores econômicos estratégicos do Estado e do Nordeste.</p>
          <p><a href="http://www.itep.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">Acesse: http://www.itep.br/</a></p>
        </div>
      </div>
    `
  },
  {
    id: 4,
    pergunta: 'Competências e Legislação Aplicável',
    resposta: `
      <p class="mb-4">A <strong>Lei Nº 18.139, de 18 de janeiro de 2023</strong>, que dispõe sobre a estrutura e o funcionamento do Poder Executivo, define no artigo 1º, inciso XVI, as competências da Secretaria de Ciência, Tecnologia e Inovação (SECTI), conforme segue:</p>
      
      <div class="bg-gray-100 p-4 rounded-lg mb-4 italic">
        <p>"Secretaria de Ciência, Tecnologia e Inovação: formular, fomentar e executar as ações de política estadual de desenvolvimento científico, tecnológico e de inovação; promover e apoiar ações e atividades de incentivo à ciência, as ações de ensino superior, pesquisa científica e extensão; planejar e executar ações para a criação e consolidação de ambientes e empreendimentos de inovação no Estado; formular e desenvolver medidas para ampliação e interiorização da base de competências científicas e tecnológicas do Estado, bem como apoiar as ações de polícia científica e medicina legal; instituir e gerir centros tecnológicos; promover a educação tecnológica e promover a radiodifusão pública e de serviços conexos; e na qualidade de Instituição Científica, Tecnológica e de Inovação do Estado de Pernambuco – ICT-PE cumpre planejar, acompanhar, promover e apoiar o desenvolvimento de pesquisa básica ou aplicada de caráter científico ou tecnológico ou o desenvolvimento de novos produtos, serviços ou processos."</p>
      </div>
    `
  },
  {
    id: 5,
    pergunta: 'Ética e Integridade',
    resposta: `
      <p class="mb-4"><strong>CÓDIGO DE ÉTICA DA ADMINISTRAÇÃO PÚBLICA ESTADUAL</strong></p>
      
      <ul class="space-y-3 mb-4">
        <li>• Para conhecer o <strong>Código de Conduta da Alta Administração do Poder Executivo Estadual</strong>, acesse o <a href="#" class="text-[#195CE3] hover:underline">Decreto nº 46.854, de 07 de Dezembro de 2018</a>.</li>
        
        <li>• Confira o <strong>Código de Ética dos Agentes Públicos da SECTI</strong>, acesse a <a href="#" class="text-[#195CE3] hover:underline">Portaria nº 24, de 25 de Março de 2025</a>.</li>
        
        <li>• Confira o <strong>Código de Ética dos Agentes Públicos da Administração Direta e Indireta do Poder Executivo Estadual</strong>, acesse o <a href="#" class="text-[#195CE3] hover:underline">Decreto nº 46.852, de 07 de Dezembro de 2018</a>.</li>
        
        <li>• <strong>Comissão de Ética</strong> – A <a href="#" class="text-[#195CE3] hover:underline">PORTARIA SECTI Nº 001, DE 03/01/24 (atualizada)</a></li>
      </ul>
      
      <p class="mt-4">Acesse o <strong>Programa de Integridade da SECTI</strong>. Nele é possível visualizar as principais ações promovidas pela Comissão de Gestão da Integridade – CGI, responsável pela implantação do Programa, bem como as formas de monitoramento e prevenção que serão desenvolvidas dentro desta instituição.</p>
    `
  },
  {
    id: 6,
    pergunta: 'Lei Geral de Proteção de Dados - LGPD',
    resposta: `
      <div class="space-y-3">
        <p><strong>Encarregado:</strong> Marcelo Victor José de Barros Ribeiro (Setorial Contábil)</p>
        <p><strong>E-mail:</strong> <a href="mailto:marcelo.ribeiro@secti.pe.gov.br" class="text-[#195CE3] hover:underline">marcelo.ribeiro@secti.pe.gov.br</a></p>
        <p><strong>Telefone:</strong> (81) 3183-5572</p>
        <p class="mt-4"><a href="#" class="text-[#195CE3] hover:underline font-semibold">Transparência LGPD - Portaria 042.2024 – E</a></p>
      </div>
    `
  }
];

export const InformacoesInstitucionais = () => {
  // SEO
  useSEO({
    title: 'Informações Institucionais',
    description: 'Informações institucionais da Secretaria de Ciência, Tecnologia e Inovação de Pernambuco, incluindo visão, missão, valores e estrutura organizacional.',
    canonical: 'https://secti.pe.gov.br/transparencia/informacoes-institucionais',
    keywords: 'Informações Institucionais, SECTI, Estrutura, Missão',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="Informações Institucionais"
        subtitle="Conheça a estrutura, missão e competências da SECTI"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Introdução */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">
                Acesse as informações institucionais
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Clique nas opções abaixo para conhecer mais sobre a SECTI.
              </p>
            </div>

            {/* Cards de Missão e Visão */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Missão */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#0C2856]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#0C2856] text-white rounded-full p-3 mr-4">
                    <FontAwesomeIcon icon={faBullseye} className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0C2856]">Missão Institucional</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  A Secretaria de Ciência, Tecnologia e Inovação tem como missão institucional <strong>promover a Ciência, Tecnologia e Inovação como vetores estratégicos para desenvolvimento social, econômico e sustentável do Estado de Pernambuco</strong>.
                </p>
              </div>

              {/* Visão */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-[#195CE3]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#195CE3] text-white rounded-full p-3 mr-4">
                    <FontAwesomeIcon icon={faEye} className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0C2856]">Visão do Futuro</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Sistema Estadual de CT&I forte e integrado</strong> com empresas inovadoras e competitivas, distribuídas no território estadual e demandantes de mão de obra local qualificada, com melhor padrão de vida para a população.
                </p>
              </div>
            </div>

            {/* Accordion com as seções */}
            <div className="mb-12">
              <Accordion items={secoesAccordion} />
            </div>

            {/* Informações de Contato */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FontAwesomeIcon icon={faClock} className="text-4xl text-[#0C2856] mb-4" />
                <h4 className="font-bold text-[#0C2856] mb-2">Horário de Funcionamento</h4>
                <p className="text-gray-700">08:00 às 12:00</p>
                <p className="text-gray-700">13:00 às 17:00</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-[#0C2856] mb-4" />
                <h4 className="font-bold text-[#0C2856] mb-2">Endereço</h4>
                <p className="text-gray-700">Rua Vital de Oliveira, 32</p>
                <p className="text-gray-700">Bairro do Recife - Recife - PE</p>
                <p className="text-gray-700">CEP: 50030-370</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <FontAwesomeIcon icon={faPhone} className="text-4xl text-[#0C2856] mb-4" />
                <h4 className="font-bold text-[#0C2856] mb-2">Telefone</h4>
                <p className="text-gray-700 text-xl font-semibold">(81) 3183-5550</p>
              </div>
            </div>

            {/* Cards Informativos Adicionais */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Fundo INOVAR-PE */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#195CE3]">
                <h4 className="font-bold text-[#0C2856] mb-3 text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} />
                  Fundo Público Vinculado
                </h4>
                <p className="text-gray-700 mb-2">
                  A SECTI coordena o <strong>Comitê Deliberativo do Fundo de Inovação do Estado de Pernambuco – Fundo INOVAR-PE</strong>.
                </p>
                <p className="text-sm text-gray-600">LEI Nº 16.381, DE 11 DE JUNHO DE 2018</p>
              </div>

              {/* Estrutura Organizacional */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#0C2856]">
                <h4 className="font-bold text-[#0C2856] mb-3 text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} />
                  Estrutura Organizacional
                </h4>
                <p className="text-gray-700 mb-3">
                  Conheça a Estrutura organizacional – <Link className="text-[#195CE3]" to="/secti/organograma"> Organograma SECTI.</Link>
                </p>
              </div>

              {/* Plano de Cargos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#195CE3]">
                <h4 className="font-bold text-[#0C2856] mb-3 text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faFileAlt} />
                  Plano de Cargos e Carreira
                </h4>
                <p className="text-gray-700">
                  <strong>Observação:</strong> A SECTI não possui plano de cargos e carreira até o momento.
                </p>
              </div>

              {/* Conselhos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#0C2856]">
                <h4 className="font-bold text-[#0C2856] mb-3 text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faGavel} />
                  Conselhos
                </h4>
                <p className="text-gray-700">
                  <strong>Observação:</strong> A SECTI não possui conselho ativo até o momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
