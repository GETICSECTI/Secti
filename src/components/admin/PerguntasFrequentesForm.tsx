import { useState, useEffect } from 'react';

export interface PerguntaFrequente {
  id?: string;
  pergunta: string;
  resposta: string;
}

interface PerguntasFrequentesFormProps {
  perguntas: PerguntaFrequente[];
  onChange: (perguntas: PerguntaFrequente[]) => void;
  isSubmitting?: boolean;
}

export const PerguntasFrequentesForm = ({
  perguntas,
  onChange,
  isSubmitting = false
}: PerguntasFrequentesFormProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Debug: Log quando as perguntas mudarem
  useEffect(() => {
    console.log('[PerguntasFrequentesForm] Perguntas recebidas:', perguntas);
    console.log('[PerguntasFrequentesForm] Quantidade:', perguntas.length);
  }, [perguntas]);

  // Gerar ID único para novas perguntas
  const generateId = () => {
    return `pf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Toggle accordion
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Adicionar nova pergunta
  const handleAddQuestion = () => {
    const newQuestion: PerguntaFrequente = {
      id: generateId(),
      pergunta: '',
      resposta: '',
    };
    const newPerguntas = [...perguntas, newQuestion];
    onChange(newPerguntas);

    // Expandir a nova pergunta automaticamente
    if (newQuestion.id) {
      setExpandedIds(new Set([...expandedIds, newQuestion.id]));
    }
  };

  // Remover pergunta
  const handleRemoveQuestion = (id: string | undefined) => {
    if (!id) return;
    const newPerguntas = perguntas.filter(p => p.id !== id);
    onChange(newPerguntas);

    // Remover da visualização expandida
    const newExpanded = new Set(expandedIds);
    newExpanded.delete(id);
    setExpandedIds(newExpanded);
  };

  // Atualizar pergunta
  const handleUpdateQuestion = (id: string | undefined, updates: Partial<PerguntaFrequente>) => {
    if (!id) return;
    const newPerguntas = perguntas.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    onChange(newPerguntas);
  };


  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Perguntas Frequentes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Adicione perguntas e respostas em formato de accordion (sanfona)
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#195CE3] text-white rounded-lg font-medium hover:bg-[#0C2856] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Pergunta
        </button>
      </div>

      {/* Lista de Perguntas - Accordion */}
      {perguntas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.541-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">Nenhuma pergunta adicionada</p>
          <p className="text-sm text-gray-500 mt-1">Clique em "Adicionar Pergunta" para começar</p>
        </div>
      ) : (
        <div className="space-y-2 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
          {perguntas.map((pergunta, index) => {
            const id = pergunta.id || `pf-${index}`;
            const isExpanded = expandedIds.has(id);

            return (
              <div key={id} className="hover:bg-gray-50 transition-colors">
                {/* Header do Accordion */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(id)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          pergunta.pergunta ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {pergunta.pergunta || 'Clique para adicionar pergunta'}
                        </p>
                      </div>
                    </div>
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
                    {/* Pergunta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pergunta <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={pergunta.pergunta}
                        onChange={(e) => handleUpdateQuestion(id, { pergunta: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent disabled:bg-gray-100"
                        placeholder="Digite a pergunta"
                      />
                    </div>

                    {/* Resposta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resposta <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        value={pergunta.resposta}
                        onChange={(e) => handleUpdateQuestion(id, { resposta: e.target.value })}
                        disabled={isSubmitting}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent disabled:bg-gray-100"
                        placeholder="Digite a resposta"
                      />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(id)}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

