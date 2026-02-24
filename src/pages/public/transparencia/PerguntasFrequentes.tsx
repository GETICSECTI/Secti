import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { Accordion } from '../../../components/Accordion.tsx';
import type { AccordionItem } from '../../../components/Accordion.tsx';
import { useSEO } from '../../../utils/useSEO.ts';

// Dados de perguntas frequentes
const perguntasFrequentes: AccordionItem[] = [
  {
    id: 9,
    pergunta: 'A SECTI recebe estagiário?',
    resposta: `Esta Secretaria não faz seleção para estagiário. Quando precisamos, solicitamos a <strong>CIEE-PE</strong>. O estudante deve estar cadastrado nessa empresa, ou quando vem uma solicitação do próprio setor que está precisando do estagiário. Nós aqui não selecionamos estagiários nem qualquer outra categoria de Servidor.`
  },
  {
    id: 10,
    pergunta: 'Gostaria de saber se a SECTI está envolvida na promoção de algum projeto de incentivo à geração de energias renováveis no Estado de Pernambuco?',
    resposta: `A SECTI é um órgão de condução da Política em Ciência, Tecnologia & Inovação relativa ao Estado de Pernambuco e de articulação com entidades que desenvolvem atividades de pesquisa e desenvolvimento, induzindo e fomentando ações de Pesquisa Desenvolvimento Inovação – PDI.

Entretanto é importante saber que o Estado não dispõe de quadro técnico para realização de construção e/ou instalação de infraestrutura e operar o empreendimento em energia solar fotovoltaica. O nosso papel tem sido o de induzir e apoiar, inclusive com contrapartida financeira, tais empreendimentos de forma que o Setor privado possa desenvolver esse setor em Pernambuco.

A título de exemplo, a usina fotovoltaica de Petrolina está sendo montada pela <strong>CHESF</strong> – Companhia Hidro Elétrica do São Francisco / <strong>CEPEL</strong> – Centro de Pesquisa de Energia Elétrica / <strong>UPE</strong> – Universidade de Pernambuco / <strong>UFPE</strong> – Universidade Federal de Pernambuco e a Heliotérmica pelo CEPEL/UFPE/CHESF. Já as plantas fotovoltaicas que estão sendo montadas em Fernando de Noronha são de responsabilidade da <strong>CELPE</strong> – Companhia Energética de Pernambuco.

Nesses projetos participam também alunos de graduação, mestrado e doutorado e pesquisadores das instituições de Ensino e Pesquisa de Pernambuco (UPE, UFPE, IFPE e UNIVASF, para listar algumas), na coordenação do projeto está o Professor José Bione Filho. Recomenda-se que os possíveis interessados entrem em contato diretamente com as instituições executoras dos projetos para saber das demandas e oportunidades de envolvimento nesses projetos ou mesmo com o coordenador do projeto.`
  },
  {
    id: 11,
    pergunta: 'O que preciso fazer para conhecer o Espaço Ciência? Temos que marcar a visita?',
    resposta: `O Espaço Ciência tem a entrada <strong>gratuita</strong> e está aberto ao público todos os dias da semana. Se o objetivo é levar um grupo basta agendar a visita pelo telefone <strong>(81) 3241.3226</strong>, durante a semana, das <strong>8h às 12h</strong> e <strong>13h às 17h</strong>.

A visita pode ser feita durante a semana, das <strong>8h ao 12h</strong> e <strong>13h as 17h</strong>, ou nos fins de semana à tarde de <strong>13h30min às 17h</strong>.

A visita fica geralmente organizada por uma duração de 2 h, para uma escola do interior, pode se combinar uma programação mais extensa, de 4 horas.

Ver modalidades e opções de visitação no site do Espaço Ciência: <a href="http://www.espacociencia.pe.gov.br" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">www.espacociencia.pe.gov.br</a>

<strong>É importante o uso de chapéu, protetor solar e água. Não disponibilizamos a venda de alimento dentro do local.</strong>`
  },
  {
    id: 12,
    pergunta: 'Como faço para matricular meu filho no curso de férias do Espaço Ciência? O curso abrange os estudantes de escolas públicas e privadas?',
    resposta: `Os cursos de férias realizados pelo Espaço Ciência são destinados aos estudantes de Escola <strong>pública e privada</strong>. Os cursos de férias são disponíveis para crianças do <strong>ensino fundamental I ao ensino médio</strong>.

As inscrições são realizadas através do site, acesse: <a href="http://www.espacociencia.pe.gov.br" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">www.espacociencia.pe.gov.br</a>, neste endereço eletrônico estão disponíveis as informações necessárias para cada curso.`
  },
  {
    id: 13,
    pergunta: 'Gostaria de solicitar a disponibilidade da Legislação Estadual específica referente à criação e implementação dos Parques Núcleo de Gestão do Porto Digital e Parque Tecnológico de Eletroeletrônica de Pernambuco – ParqTel.',
    resposta: `As informações solicitadas podem ser encontradas no Diário Oficial do Estado de Pernambuco no link: <a href="http://www.cepe.com.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">www.cepe.com.br</a>

<strong>Documentos disponíveis:</strong>

1. Diário Oficial de Pernambuco de sexta-feira em 05/07/1996, pág. 03;
2. Diário Oficial de Pernambuco PRODEPE em 30/04/1996, pág. 04;
3. Diário Oficial de Pernambuco Comitê Gestor em 08/08/1996, pág. 10;
4. Diário Oficial Novo Comitê Gestor em 30/06/2011, pág. 16.

Estes documentos podem ser pesquisados no site: <a href="http://www.cepe.com.br/" target="_blank" rel="noopener noreferrer" class="text-[#195CE3] hover:underline font-semibold">www.cepe.com.br</a>`
  },
  {
    id: 14,
    pergunta: 'Como funciona o PROUNI-PE?',
    resposta: `Destinado a brasileiros e/ou naturalizados, não portadores de diploma de curso superior, cuja renda familiar mensal per capita não exceda o valor de 1,5 (um e meio) salário mínimo, ressalvados os casos de complementação pedagógica para bacharéis e segunda licenciatura em áreas afins para professores do ensino fundamental ou médio.

<strong>Requisitos:</strong>

• Ter vínculo de matrícula nas Instituições de Ensino Superior – IES integrantes do PROUNI-PE;
• Ter cursado o ensino médio completo em escola da rede pública;
• Ter cursado o ensino médio completo em escola da rede particular, na condição de bolsista integral da própria escola;
• Ter realizado Exame Nacional do Ensino Médio – ENEM nos dois últimos anos contados a partir da publicação do edital de seleção.

<strong>Vagas reservadas para:</strong>

• Ser professor do ensino fundamental ou médio, que esteja no exercício da docência, independentemente da renda familiar per capita;
• Ser portador de qualquer tipo de deficiência, nos termos definidos em lei, que comprovem vínculo de matrícula nas Instituições de Ensino Superior – IES integrantes do PROUNI-PE; ou
• Mulheres em situação de vulnerabilidade socioeconômica ou vítimas de violência doméstica e familiar, que comprovem vínculo de matrícula nas Instituições de Ensino Superior – IES integrantes do PROUNI-PE.

<strong>Como participar:</strong>

O processo seletivo do PROUNI-PE tem uma única etapa de inscrição. A inscrição, gratuita, é feita exclusivamente pela internet, na página do PROUNI-PE. Encerrado o prazo de inscrição, o sistema do PROUNI-PE classifica os estudantes de acordo com as notas obtidas no ENEM.

<strong>Contatos:</strong>

<strong>WhatsApp:</strong> (81) 984948041
<strong>E-mail:</strong> prouni@secti.pe.gov.br
<strong>Endereço:</strong> Rua Vital de Oliveira, nº 32, Bairro do Recife, Recife – PE, Brasil, CEP: 50030-370`
  }
];

export const PerguntasFrequentes = () => {
  // SEO
  useSEO({
    title: 'Perguntas Frequentes',
    description: 'Perguntas frequentes e respostas sobre a Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/transparencia/perguntas-frequentes',
    keywords: 'FAQ, Perguntas Frequentes, SECTI, Dúvidas',
  });
  return (
    <PublicLayout>
      <HeroSection
        title="Perguntas Frequentes"
        subtitle="Encontre respostas para as dúvidas mais comuns sobre os serviços e programas da SECTI"
      />

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introdução */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C2856] mb-4">
              Conheça as perguntas e respostas frequentes
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Clique nas opções abaixo para visualizar as respostas.
            </p>
          </div>

          {/* Accordion */}
          <div className="max-w-4xl mx-auto">
            <Accordion items={perguntasFrequentes} />
          </div>

          {/* Informações Adicionais */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto border-l-4 border-[#195CE3]">
            <h3 className="text-xl font-bold text-[#0C2856] mb-4">
              Não encontrou o que procurava?
            </h3>
            <p className="text-gray-700 mb-4">
              Se sua dúvida não foi respondida aqui, entre em contato conosco através dos nossos canais de atendimento.
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Telefone:</strong> (81) 3183-5550
              </p>
              <p>
                <strong>Horário de atendimento:</strong> Segunda a sexta, das 8h às 17h
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
