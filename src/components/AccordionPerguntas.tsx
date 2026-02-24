import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface PerguntaFrequentePublica {
  id: number;
  pergunta: string;
  resposta: string;
  ordem: number;
}

interface AccordionPerguntasProps {
  perguntas: PerguntaFrequentePublica[];
}

export const AccordionPerguntas = ({ perguntas }: AccordionPerguntasProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
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
    <div className="space-y-3">
      {perguntas.map((pergunta) => {
        const isExpanded = expandedIds.has(pergunta.id);

        return (
          <div
            key={pergunta.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header do Accordion */}
            <button
              type="button"
              onClick={() => toggleExpanded(pergunta.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <h3 className="text-base font-semibold text-gray-900 flex-1 pr-4">
                {pergunta.pergunta}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Conteúdo do Accordion */}
            {isExpanded && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {pergunta.resposta}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

