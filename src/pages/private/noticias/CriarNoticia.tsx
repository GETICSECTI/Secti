import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { NoticiaForm } from '../../../components/admin/NoticiaForm';
import { noticiasService, type CadastrarNoticiaRequest } from '../../../services/noticiasService';
import { handleApiError } from '../../../utils/errorHandler';

interface NoticiaFormData {
  titulo: string;
  slug: string;
  autor: string;
  resumo: string;
  conteudo: string;
  imagemDestaque: string;
  imagemArquivo: File | null;
  status: 'Publicada' | 'Rascunho' | 'Arquivada';
  destaque: boolean;
  tagId: number | null;
}

export const CriarNoticia = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleSubmit = async (formData: NoticiaFormData) => {
    setIsSubmitting(true);
    setErro(null);
    setSucesso(null);

    try {
      console.log('[CriarNoticia] Estado recebido do formulário:', {
        titulo: formData.titulo,
        autor: formData.autor,
        imagemArquivo: formData.imagemArquivo ? `${formData.imagemArquivo.name} (${formData.imagemArquivo.size} bytes)` : 'null',
        imagemDestaque: formData.imagemDestaque || 'vazio',
      });

      // Preparar dados para o endpoint
      const dadosNoticia: CadastrarNoticiaRequest = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        resumo: formData.resumo || undefined,
        autor: formData.autor || undefined,
        destaque: formData.destaque || false,
        tagIds: formData.tagId ? [formData.tagId] : undefined,
      };

      // Se houver arquivo, enviar o arquivo
      if (formData.imagemArquivo) {
        dadosNoticia.imagemCapa = formData.imagemArquivo;
        console.log('[CriarNoticia] Enviando arquivo:', formData.imagemArquivo.name);
      }
      // Senão, se houver URL (e não for blob), enviar a URL
      else if (formData.imagemDestaque && !formData.imagemDestaque.startsWith('blob:')) {
        dadosNoticia.imagemCapaUrl = formData.imagemDestaque;
        console.log('[CriarNoticia] Enviando URL:', formData.imagemDestaque);
      }

      console.log('[CriarNoticia] Dados a enviar:', {
        ...dadosNoticia,
        imagemCapa: dadosNoticia.imagemCapa ? `File(${dadosNoticia.imagemCapa.name})` : undefined,
      });

      // Chamar API
      await noticiasService.cadastrar(dadosNoticia);

      setSucesso('Notícia cadastrada com sucesso!');

      // Aguardar um momento para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/admin/noticias');
      }, 1500);
    } catch (error) {

      // Verificar se é erro de autenticação/permissão
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 401) {
          setErro('Sua sessão expirou. Por favor, faça login novamente.');
          return;
        }
        if (axiosError.response?.status === 403) {
          setErro('Você não tem permissão para cadastrar notícias. Verifique suas permissões com o administrador.');
          return;
        }
      }

      const mensagemErro = handleApiError(error);
      setErro(mensagemErro);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Notícia</h1>
            <p className="text-gray-600 mt-2">Preencha os campos abaixo para criar uma nova notícia</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/noticias')}
            className="text-gray-600 cursor-pointer hover:text-gray-900 font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>

        {/* Mensagens de feedback */}
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-900">Erro ao cadastrar notícia</p>
                <p className="text-sm text-red-700 mt-1">{erro}</p>
              </div>
            </div>
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-900">{sucesso}</p>
                <p className="text-sm text-green-700 mt-1">Redirecionando para a lista de notícias...</p>
              </div>
            </div>
          </div>
        )}

        <NoticiaForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </PrivateLayout>
  );
};
