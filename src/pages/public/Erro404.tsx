import { Link } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useSEO } from '../../utils/useSEO.ts';
import ImagemErro404 from "../../assets/Erro404.png";

export const Erro404 = () => {
  // SEO
  useSEO({
    title: 'Página não encontrada',
    description: 'A página que você procura não foi encontrada. Retorne à página inicial da SECTI Pernambuco.',
    canonical: 'https://secti.pe.gov.br/erro404',
    keywords: 'Erro 404, Página não encontrada',
    ogType: 'website',
  });
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-200px)] bg-linear-to-b from-gray-50 to-white relative overflow-hidden">

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl w-full">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img src={ImagemErro404} alt="Robô quebrado sinalizando erro 404" className="w-full h-36 md:h-60"/>
              </div>
            </div>


            {/* Título e descrição */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-[#0C2856] mb-4">
                Página Não Encontrada
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                O robô procurou por toda parte, mas não conseguiu encontrar esta página.
              </p>
              <p className="text-gray-500 max-w-lg mx-auto">
                A página que você está procurando pode ter sido movida, removida ou nunca ter existido.
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/"
                className="bg-[#0C2856] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#195CE3] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Voltar ao Início
              </Link>

              <button
                onClick={() => window.history.back()}
                className="bg-transparent cursor-pointer text-[#0C2856] px-8 py-3 rounded-lg font-medium border-2 border-[#0C2856] hover:bg-[#0C2856] hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Página Anterior
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
