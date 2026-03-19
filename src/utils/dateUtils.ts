/**
 * Utilitários para manipulação de datas
 */

/**
 * Formata uma data no formato brasileiro DD/MM/AAAA
 * @param dateString - String de data no formato ISO ou Date
 * @returns String formatada como DD/MM/AAAA
 */
export const formatarDataBrasileira = (dateString: string | Date): string => {
  try {
    if (typeof dateString === 'string') {
      // Extrair apenas a data (YYYY-MM-DD) da string, evitando problemas com fuso horário
      const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

      if (dateMatch) {
        const [, ano, mes, dia] = dateMatch;
        return `${dia}/${mes}/${ano}`;
      }

      // Fallback para interpretação com Date se não conseguir extrair
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      const diaNum = date.getDate().toString().padStart(2, '0');
      const mesNum = (date.getMonth() + 1).toString().padStart(2, '0');
      const anoNum = date.getFullYear();

      return `${diaNum}/${mesNum}/${anoNum}`;
    } else {
      // Se for Date, usar getDate/getMonth/getFullYear
      if (isNaN(dateString.getTime())) {
        return 'Data inválida';
      }

      const dia = dateString.getDate().toString().padStart(2, '0');
      const mes = (dateString.getMonth() + 1).toString().padStart(2, '0');
      const ano = dateString.getFullYear();

      return `${dia}/${mes}/${ano}`;
    }
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formata uma data por extenso em português
 * @param dateString - String de data no formato ISO ou Date
 * @returns String formatada como "DD de mês de AAAA"
 */
export const formatarDataPorExtenso = (dateString: string | Date): string => {
  try {
    if (typeof dateString === 'string') {
      // Extrair apenas a data (YYYY-MM-DD) da string, evitando problemas com fuso horário
      const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

      if (dateMatch) {
        const [, ano, mes, dia] = dateMatch.map(Number);
        const meses = [
          'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
          'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        return `${dia} de ${meses[mes - 1]} de ${ano}`;
      }

      // Fallback para interpretação com Date se não conseguir extrair
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      const diaNum = date.getDate();
      const mesNum = date.getMonth();
      const anoNum = date.getFullYear();
      const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];
      return `${diaNum} de ${meses[mesNum]} de ${anoNum}`;
    } else {
      // Se for Date, usar getDate/getMonth/getFullYear
      if (isNaN(dateString.getTime())) {
        return 'Data inválida';
      }

      const dia = dateString.getDate();
      const mes = dateString.getMonth();
      const ano = dateString.getFullYear();

      const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];

      return `${dia} de ${meses[mes]} de ${ano}`;
    }
  } catch {
    return 'Data inválida';
  }
};

/**
 * Extrai o ano de uma data
 * @param dateString - String de data no formato ISO ou Date
 * @returns Ano como número
 */
export const extrairAno = (dateString: string | Date): number => {
  try {
    if (typeof dateString === 'string') {
      // Extrair apenas a data (YYYY-MM-DD) da string, evitando problemas com fuso horário
      const dateMatch = dateString.match(/^(\d{4})-/);

      if (dateMatch) {
        return Number(dateMatch[1]);
      }

      // Fallback para interpretação com Date se não conseguir extrair
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.getFullYear();
      }

      return new Date().getFullYear();
    } else {
      return dateString.getFullYear();
    }
  } catch {
    return new Date().getFullYear();
  }
};
