interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
  disabled?: boolean;
}

/**
 * Gera a lista de itens da paginação com ellipsis.
 * Sempre mostra: primeira, última, página atual e até 1 vizinha de cada lado.
 * Insere '...' onde houver lacunas.
 */
function gerarItens(paginaAtual: number, totalPaginas: number): (number | '...')[] {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }

  const itens: (number | '...')[] = [];
  const vizinhos = new Set<number>();

  // sempre incluir 1ª, última, atual e vizinhas imediatas
  [1, totalPaginas, paginaAtual - 1, paginaAtual, paginaAtual + 1]
    .filter((n) => n >= 1 && n <= totalPaginas)
    .forEach((n) => vizinhos.add(n));

  const sorted = Array.from(vizinhos).sort((a, b) => a - b);

  for (let idx = 0; idx < sorted.length; idx++) {
    const cur = sorted[idx];
    if (idx > 0) {
      const prev = sorted[idx - 1];
      if (cur - prev === 2) {
        // lacuna de apenas 1 número → coloca o número em vez de "..."
        itens.push(prev + 1);
      } else if (cur - prev > 2) {
        itens.push('...');
      }
    }
    itens.push(cur);
  }

  return itens;
}

export const Paginacao = ({
  paginaAtual,
  totalPaginas,
  onMudarPagina,
  disabled = false,
}: PaginacaoProps) => {
  if (totalPaginas <= 1) return null;

  const itens = gerarItens(paginaAtual, totalPaginas);

  const btnBase =
    'px-4 py-2 rounded-lg font-medium transition duration-200';
  const btnAtivo =
    'bg-[#0C2856] text-white';
  const btnNormal =
    'bg-white cursor-pointer text-[#0C2856] border border-[#0C2856] hover:bg-[#0C2856] hover:text-white';
  const btnDesabilitado =
    'bg-gray-200 text-gray-400 cursor-not-allowed';
  const btnNumNormal =
    'bg-white cursor-pointer text-[#0C2856] border border-gray-300 hover:border-[#0C2856] hover:bg-gray-50';

  return (
    <div className="flex justify-center items-center gap-2 mt-8 pt-8 flex-wrap">
      {/* Anterior */}
      <button
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1 || disabled}
        className={`${btnBase} ${paginaAtual === 1 || disabled ? btnDesabilitado : btnNormal}`}
      >
        Anterior
      </button>

      {/* Números / Ellipsis */}
      <div className="flex gap-1 flex-wrap justify-center">
        {itens.map((item, idx) =>
          item === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-gray-500 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onMudarPagina(item)}
              disabled={disabled}
              className={`w-10 h-10 rounded-lg font-medium transition duration-200 ${
                item === paginaAtual ? btnAtivo : btnNumNormal
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Próximo */}
      <button
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas || disabled}
        className={`${btnBase} ${paginaAtual === totalPaginas || disabled ? btnDesabilitado : `cursor-pointer ${btnNormal}`}`}
      >
        Próximo
      </button>
    </div>
  );
};

