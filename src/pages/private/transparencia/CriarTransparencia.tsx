import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { TransparenciaForm } from '../../../components/admin/TransparenciaForm';
import { transparenciaService } from '../../../services/transparenciaService';
import { handleApiError } from '../../../utils/errorHandler';

interface TransparenciaFormData {
  titulo: string;
  url: string;
  descricao: string;
  ordem: number;
}

export const CriarTransparencia = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const handleSubmit = async (formData: TransparenciaFormData) => {
    setIsSubmitting(true);
    setErro(null);
    setSucesso(null);

    try {
      await transparenciaService.cadastrar(formData);

      setSucesso('Submenu de transparência cadastrado com sucesso!');

      // Aguardar um momento para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/admin/transparencia');
      }, 1500);
    } catch (error) {
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
            <h1 className="text-3xl font-bold text-gray-900">Novo Submenu de Transparência</h1>
            <p className="text-gray-600 mt-2">Preencha os campos abaixo para criar um novo submenu de transparência</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/transparencia')}
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
                <p className="text-sm font-medium text-red-900">Erro ao cadastrar submenu</p>
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
                <p className="text-sm text-green-700 mt-1">Redirecionando para a lista de submenus...</p>
              </div>
            </div>
          </div>
        )}

        <TransparenciaForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </PrivateLayout>
  );
};
