import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { perfilService } from '../../../services/perfilService';
import { PerfilForm } from '../../../components/admin/PerfilForm';
import { handleApiError } from '../../../utils/errorHandler';

interface PerfilInitialData {
  id: number;
  nome: string;
  descricao: string;
  menusIds: number[];
  permissoes: {
    podeCadastrar: boolean;
    podeEditar: boolean;
    podeSuspenderHabilitar: boolean;
  };
}

export const EditarPerfil = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<PerfilInitialData | null>(null);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!id) {
        setErro('ID do perfil não fornecido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const perfil = await perfilService.obterPorId(Number(id));
        setInitialData({
          id: perfil.id,
          nome: perfil.nome,
          descricao: perfil.descricao,
          menusIds: perfil.menus?.map(m => m.id) || [],
          permissoes: {
            podeCadastrar: perfil.permissoes?.includes('podeCadastrar') || false,
            podeEditar: perfil.permissoes?.includes('podeEditar') || false,
            podeSuspenderHabilitar: perfil.permissoes?.includes('podeSuspenderHabilitar') || false,
          },
        });
      } catch (error) {
        const mensagem = handleApiError(error);
        setErro(mensagem);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, [id]);

  const handleSubmit = async (formData: Omit<PerfilInitialData, 'id'>) => {
    if (!id) {
      setErro('ID do perfil não fornecido');
      return;
    }

    setErro(null);
    setSucesso(null);
    setIsSubmitting(true);

    try {
      await perfilService.atualizar(Number(id), {
        nome: formData.nome,
        descricao: formData.descricao,
        menusIds: formData.menusIds,
        permissoes: formData.permissoes,
      });

      setSucesso('Perfil atualizado com sucesso!');

      setTimeout(() => {
        navigate('/admin/perfis');
      }, 1500);
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErro(mensagemErro);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#195CE3]"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="text-gray-600 mt-2">Atualize as informações do perfil de usuário</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/perfis')}
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
                <h3 className="text-sm font-medium text-red-800">Erro ao atualizar perfil</h3>
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
                <h3 className="text-sm font-medium text-green-800">Sucesso</h3>
                <p className="text-sm text-green-700 mt-1">{sucesso}</p>
              </div>
            </div>
          </div>
        )}

        {initialData && (
          <PerfilForm initialData={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    </PrivateLayout>
  );
};
