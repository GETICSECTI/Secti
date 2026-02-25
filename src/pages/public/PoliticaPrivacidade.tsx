import { PublicLayout } from '../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../components/HeroSection.tsx';
import { useSEO } from '../../utils/useSEO.ts';

export const PoliticaPrivacidade = () => {
  useSEO({
    title: 'Política de Privacidade',
    description: 'Política de Privacidade da SECTI — como coletamos, usamos e protegemos seus dados.',
    canonical: 'https://secti.pe.gov.br/politica-de-privacidade',
    keywords: 'Política de Privacidade, Dados Pessoais, Cookies',
  });

  return (
    <PublicLayout>
      <HeroSection
        title="Política de Privacidade"
        subtitle="Como tratamos seus dados e garantimos sua privacidade"
      />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Política de Privacidade</h2>
              <p className="text-xl text-center text-gray-100">Última atualização: fevereiro de 2026</p>
            </div>

            <div className="bg-gray-50 rounded-b-lg p-8">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p>
                  A Secretaria de Ciência, Tecnologia e Inovação de Pernambuco (SECTI) respeita a privacidade dos usuários e
                  está comprometida com a proteção dos dados pessoais coletados por meio deste site. Esta política descreve
                  quais informações coletamos, como as usamos, com quem as compartilhamos e os direitos que você possui em relação
                  aos seus dados.
                </p>

                <h3>1. Informações que coletamos</h3>
                <p>
                  Podemos coletar dados pessoais que você nos fornece diretamente (por exemplo, ao enviar formulários, comentários ou
                  mensagens) e dados coletados automaticamente (por exemplo, através de cookies e registros de acesso). Exemplos incluem:
                </p>
                <ul>
                  <li>Dados de navegação (endereço IP, tipo de navegador, páginas visitadas, horário de acesso);</li>
                  <li>Preferências e consentimentos relacionados a cookies e comunicações.</li>
                </ul>

                <h3>2. Como usamos seus dados</h3>
                <p>Utilizamos as informações para os seguintes fins:</p>
                <ul>
                  <li>Fornecer e melhorar os serviços do site;</li>
                  <li>Analisar estatísticas de uso para otimizar o site e nossas iniciativas.</li>
                </ul>

                <h3>3. Cookies e tecnologias semelhantes</h3>
                <p>
                  Utilizamos cookies para melhorar a experiência do usuário, ajustar preferências e coletar estatísticas de uso.
                  Você pode optar por aceitar ou recusar cookies através do aviso exibido no site. Cookies estritamente necessários são
                  essenciais para o funcionamento do site; cookies analíticos são usados para compreender o uso e melhorar a experiência.
                </p>

                <h3>4. Compartilhamento de informações</h3>
                <p>
                  Não vendemos seus dados pessoais. Podemos compartilhar informações com fornecedores e prestadores de serviços que
                  atuam em nosso nome para fins operacionais (por exemplo, serviços de hospedagem, análise). Esses parceiros
                  somente processam os dados conforme instruções da SECTI e mediante contratos que garantem sua proteção.
                </p>

                <h3>5. Segurança dos dados</h3>
                <p>
                  Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados pessoais contra acesso não autorizado,
                  uso indevido, divulgação ou destruição. No entanto, nenhum método de transmissão ou armazenamento eletrônico é
                  completamente seguro; portanto, não podemos garantir segurança absoluta.
                </p>

                <h3>6. Retenção de dados</h3>
                <p>
                  Reteremos seus dados pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, exceto quando
                  um período de retenção mais longo for exigido por lei.
                </p>

                <h3>7. Seus direitos</h3>
                <p>
                  Você pode, a qualquer momento, solicitar o acesso, correção, portabilidade ou exclusão de seus dados pessoais, bem como
                  se opor ao tratamento ou solicitar a limitação do uso. Para exercer seus direitos, entre em contato pelo canal abaixo.
                </p>

                <h3>8. Alterações nesta política</h3>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Comunicaremos mudanças relevantes no site e
                  atualizaremos a data de última revisão no topo desta página.
                </p>

                <h3>9. Contato</h3>
                <p>
                  Caso tenha dúvidas sobre esta política ou queira exercer seus direitos, entre em contato:
                </p>
                <p>
                  SECTI — Secretaria de Ciência, Tecnologia e Inovação de Pernambuco
                  <br />
                  E-mail: <a href="mailto:ouvidoria@secti.pe.gov.br">ouvidoria@secti.pe.gov.br</a>
                </p>

                <p>
                  Esta política aplica-se ao site oficial da SECTI. Se você acessar conteúdos hospedados em plataformas de terceiros,
                  verifique as políticas dessas plataformas separadamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

