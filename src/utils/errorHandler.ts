import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  errors?: { [key: string]: string[] };
}

interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Erro da API com resposta
    if (error.response?.data) {
      const apiError = error.response.data as ApiErrorResponse & ProblemDetails;

      // Formato RFC 7807 (Problem Details) - usado pelo backend .NET
      if (apiError.detail) {
        return apiError.detail;
      }

      if (apiError.title && apiError.title !== 'One or more validation errors occurred.') {
        return apiError.title;
      }

      // Se houver uma mensagem específica
      if (apiError.message) {
        return apiError.message;
      }

      // Se houver erros de validação
      if (apiError.errors) {
        const firstError = Object.values(apiError.errors)[0];
        if (firstError && firstError.length > 0) {
          return firstError[0];
        }
      }
    }

    // Erros de rede
    if (error.code === 'ERR_NETWORK') {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }

    if (error.code === 'ECONNABORTED') {
      return 'A requisição demorou muito. Tente novamente.';
    }

    // Erro de timeout
    if (error.message.includes('timeout')) {
      return 'Tempo de resposta esgotado. Tente novamente.';
    }

    // Erros HTTP específicos
    switch (error.response?.status) {
      case 400:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Usuário ou senha inválidos.';
      case 403:
        return 'Você não tem permissão para acessar este recurso.';
      case 404:
        return 'Recurso não encontrado.';
      case 500:
        return 'Erro no servidor. Tente novamente mais tarde.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  }

  // Erro genérico
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};
