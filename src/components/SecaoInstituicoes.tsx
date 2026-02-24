import React from 'react';

export interface InstituicaoItem {
  id: number;
  nome: string;
  logo: string;
  url: string;
  descricao?: string;
}

interface SecaoInstituicoesProps {
  instituicoesVinculadas?: InstituicaoItem[];
  instituicoesContratoGestao?: InstituicaoItem[];
}

export const SecaoInstituicoes: React.FC<SecaoInstituicoesProps> = ({
  instituicoesVinculadas = [],
  instituicoesContratoGestao = []
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Instituições Vinculadas */}
        <div className="mb-16">
          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0C2856] mb-2">Instituições Vinculadas</h2>
            <div className="h-1 w-24 bg-[#195CE3]"></div>
          </div>

          {/* Grid de Instituições */}
          {instituicoesVinculadas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {instituicoesVinculadas.map((instituicao) => (
                <a
                  key={instituicao.id}
                  href={instituicao.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#195CE3] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
                  title={instituicao.descricao || instituicao.nome}
                >
                  <div className="w-full h-32 flex items-center justify-center mb-3">
                    <img
                      src={instituicao.logo}
                      alt={instituicao.nome}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200x100?text=' + encodeURIComponent(instituicao.nome);
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-[#195CE3] transition-colors">
                    {instituicao.nome}
                  </h3>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma instituição vinculada cadastrada.</p>
            </div>
          )}
        </div>

        {/* Instituições com Contrato de Gestão */}
        <div>
          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0C2856] mb-2">Instituições com Contrato de Gestão</h2>
            <div className="h-1 w-24 bg-[#195CE3]"></div>
          </div>

          {/* Grid de Instituições */}
          {instituicoesContratoGestao.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {instituicoesContratoGestao.map((instituicao) => (
                <a
                  key={instituicao.id}
                  href={instituicao.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#195CE3] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
                  title={instituicao.descricao || instituicao.nome}
                >
                  <div className="w-full h-32 flex items-center justify-center mb-3">
                    <img
                      src={instituicao.logo}
                      alt={instituicao.nome}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200x100?text=' + encodeURIComponent(instituicao.nome);
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-[#195CE3] transition-colors">
                    {instituicao.nome}
                  </h3>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma instituição com contrato de gestão cadastrada.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

