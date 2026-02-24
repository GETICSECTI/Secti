import { useState } from 'react';

export interface PerguntaFrequenteView {
  id?: string;
  pergunta: string;
  resposta: string;
  imagemUrl?: string;
}

interface PerguntasFrequentesViewProps {
  perguntas: PerguntaFrequenteView[];
}

export const PerguntasFrequentesView = ({ perguntas }: PerguntasFrequentesViewProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  if (!perguntas || perguntas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>

      <div className="space-y-2 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
        {perguntas.map((pergunta, index) => {
          const id = pergunta.id || `pf-${index}`;
          const isExpanded = expandedIds.has(id);

          return (
            <div key={id} className="hover:bg-gray-50 transition-colors">
              {/* Header do Accordion */}
              <button
                onClick={() => toggleExpanded(id)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900">
                    {pergunta.pergunta}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ml-2 shrink-0 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Conteúdo do Accordion */}
              {isExpanded && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                  {pergunta.imagemUrl && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={pergunta.imagemUrl}
                        alt={pergunta.pergunta}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
                        }}
                      />
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {pergunta.resposta}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

