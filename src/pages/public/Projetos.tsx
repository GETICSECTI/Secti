import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { HeroSection } from '../../components/HeroSection';
import { ProjetosList } from '../../components/ProjetosList';
import type { ProjetoItem } from '../../components/ProjetosList';
import { AccordionPerguntas, type PerguntaFrequentePublica } from '../../components/AccordionPerguntas';
import { useSEO } from '../../utils/useSEO.ts';
import { projetosService } from '../../services/projetosService';
import { handleApiError } from '../../utils/errorHandler';
import { LoadingScreen } from '../../components/LoadingScreen';
import { formatarDataBrasileira } from '../../utils/dateUtils';

export const Projetos = () => {
  const { slug } = useParams<{ slug: string }>();
  const [projetos, setProjetos] = useState<ProjetoItem[]>([]);
  const [perguntasFrequentes, setPerguntasFrequentes] = useState<PerguntaFrequentePublica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO
  useSEO({
    title: 'Projetos',
    description: 'Conheça os projetos desenvolvidos pela Secretaria de Ciência, Tecnologia e Inovação de Pernambuco.',
    canonical: 'https://secti.pe.gov.br/projetos',
    keywords: 'Projetos, SECTI, Inovação, Ciência, Tecnologia',
  });

  const projetoDetalhe = slug ? projetos[0] : null;

  const descricaoParagrafos = (projetoDetalhe?.descricao || '')
    .split('\n')
    .map((texto) => texto.trim())
    .filter(Boolean);

  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;

        if (slug) {
          // Se um slug foi passado, buscar apenas esse projeto (endpoint público)
          response = await projetosService.buscarPublicoPorSlug(slug);

          const projetoFormatado: ProjetoItem = {
            id: response.id,
            titulo: response.titulo,
            descricao: response.descricao || 'Projeto sem descrição',
            fotoCapaCaminho: response.fotoCapaCaminho,
            logoCaminho: response.logoCaminho,
            url: response.url,
            urlProjeto: response.urlProjeto,
            ativo: response.ativo,
            dataCriacao: response.dataCriacao,
          };

          setProjetos([projetoFormatado]);

          // Processar perguntas frequentes
          if (response.perguntasFrequentes && response.perguntasFrequentes.length > 0) {
            const perguntas = response.perguntasFrequentes.sort((a, b) => a.ordem - b.ordem);
            setPerguntasFrequentes(perguntas);
          } else {
            setPerguntasFrequentes([]);
          }
        } else {
          // Se nenhum slug, buscar todos os projetos públicos
          response = await projetosService.listarPublico({
            pagina: 1,
            itensPorPagina: 100,
          });

          // Converter resposta para formato ProjetoItem
          const projetosFormatados: ProjetoItem[] = response.projetos.map(projeto => ({
            id: projeto.id,
            titulo: projeto.titulo,
            descricao: projeto.fotoCapaCaminho ? 'Projeto com documentação' : 'Projeto sem documentação',
            fotoCapaCaminho: projeto.fotoCapaCaminho,
            logoCaminho: projeto.logoCaminho,
            url: projeto.url,
            urlProjeto: projeto.urlProjeto,
            ativo: projeto.ativo,
            dataCriacao: projeto.dataCriacao,
          }));

          setProjetos(projetosFormatados);
        }
      } catch (err) {
        const mensagemErro = handleApiError(err);
        setError(mensagemErro);
        console.error('Erro ao carregar projetos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarProjetos();
  }, [slug]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection
        title={slug ? projetos[0]?.titulo || 'Projeto' : 'Nossos Projetos'}
        subtitle={slug ? 'Detalhes do projeto' : 'Conheça os projetos em desenvolvimento pela SECTI'}
      />

      {/* Conteúdo Principal */}
      <div className="bg-white py-12">
        {!slug && (
          <ProjetosList
            projetos={projetos}
            isLoading={isLoading}
            error={error}
          />
        )}

        {slug && projetoDetalhe && (
          <section className="py-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
                {/* Cabeçalho do projeto */}
                <div className="bg-[#0C2856] text-white rounded-t-lg p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-blue-100">Projeto</p>
                      <h2 className="text-3xl md:text-4xl font-bold mt-2">{projetoDetalhe.titulo}</h2>
                    </div>
                    {projetoDetalhe.logoCaminho && (
                      <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
                        <img
                          src={projetoDetalhe.logoCaminho}
                          alt={`Logo ${projetoDetalhe.titulo}`}
                          className="h-16 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  {projetoDetalhe.url && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={projetoDetalhe.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-[#0C2856] px-5 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        Acessar site do projeto
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <Link
                        to="/projetos"
                        className="inline-flex items-center gap-2 border border-white text-white px-5 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                      >
                        Voltar para projetos
                      </Link>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="bg-white rounded-b-lg p-8">
                  {projetoDetalhe.fotoCapaCaminho && (
                    <div className="mb-8">
                      <img
                        src={projetoDetalhe.fotoCapaCaminho}
                        alt={projetoDetalhe.titulo}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {descricaoParagrafos.length > 0 ? (
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      {descricaoParagrafos.map((texto, index) => (
                        <p key={`${index}-${texto.slice(0, 12)}`}>{texto}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Este projeto ainda não possui descrição.</p>
                  )}

                  {/* Perguntas Frequentes - Exibir apenas quando visualizar projeto específico */}
                  {slug && perguntasFrequentes.length > 0 && (
                      <div className="container mt-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Perguntas Frequentes
                          </h2>
                          <AccordionPerguntas perguntas={perguntasFrequentes} />
                        </div>
                      </div>
                  )}

                  <div className="mt-8 text-sm text-gray-500">
                    Publicado em {formatarDataBrasileira(projetoDetalhe.dataCriacao)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
};
