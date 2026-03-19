import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { TransparenciaForm } from '../../../components/admin/TransparenciaForm';
import { transparenciaService, type TransparenciaSubmenu } from '../../../services/transparenciaService';
import { handleApiError } from '../../../utils/errorHandler';

interface TransparenciaFormData {
  titulo: string;
  url: string;
  descricao: string;
  ordem: number;
}

export const EditarTransparencia = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<TransparenciaFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarTransparencia = async () => {
      if (!id) return;

      const submenuId = parseInt(id, 10);
      if (isNaN(submenuId)) {
        setError('ID inválido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const submenu: TransparenciaSubmenu = await transparenciaService.obterPorId(submenuId);

        // Converter dados da API para o formato do formulário
        const formData: TransparenciaFormData = {
          titulo: submenu.titulo,
          url: submenu.url,
          descricao: submenu.descricao || '',
          ordem: submenu.ordem,
        };

        setInitialData(formData);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    carregarTransparencia();
  }, [id]);

  const handleSubmit = async (formData: TransparenciaFormData) => {
    if (!id) return;

    const submenuId = parseInt(id, 10);
    if (isNaN(submenuId)) {
      setError('ID inválido');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await transparenciaService.editar(submenuId, formData);

      // Redirecionar para a lista
      navigate('/admin/transparencia');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2856]"></div>
          <span className="ml-2 text-gray-600">Carregando submenu...</span>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Submenu de Transparência</h1>
            <p className="text-gray-600 mt-2">
              Faça as alterações necessárias no submenu selecionado.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/transparencia')}
            className="inline-flex cursor-pointer items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário */}
        {initialData && (
          <TransparenciaForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </PrivateLayout>
  );
};
