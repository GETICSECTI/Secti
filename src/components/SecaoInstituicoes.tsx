import React from 'react';

export interface InstituicaoItem {
  id: number;
  nome: string;
  logo: string;
  url: string;
  descricao?: string;
}

interface SecaoInstituicoesProps {
  unidadesVinculadas?: InstituicaoItem[];
  instituicoesVinculadas?: InstituicaoItem[];
  instituicoesContratoGestao?: InstituicaoItem[];
}

const GrupoInstituicoes: React.FC<{ titulo: string; items: InstituicaoItem[] }> = ({ titulo, items }) => (
  <div className="mb-16">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-[#0C2856] mb-2">{titulo}</h2>
      <div className="h-1 w-24 bg-[#195CE3]"></div>
    </div>
    {items.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((instituicao) => (
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
        <p>Nenhum item cadastrado.</p>
      </div>
    )}
  </div>
);

export const SecaoInstituicoes: React.FC<SecaoInstituicoesProps> = ({
  unidadesVinculadas = [],
  instituicoesVinculadas = [],
  instituicoesContratoGestao = [],
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {unidadesVinculadas.length > 0 && (
          <GrupoInstituicoes titulo="Unidades" items={unidadesVinculadas} />
        )}
        {instituicoesVinculadas.length > 0 && (
          <GrupoInstituicoes titulo="Instituições Vinculadas" items={instituicoesVinculadas} />
        )}
        {instituicoesContratoGestao.length > 0 && (
          <GrupoInstituicoes titulo="Instituições com Contrato de Gestão" items={instituicoesContratoGestao} />
        )}
      </div>
    </section>
  );
};
