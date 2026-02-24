import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { usuarioService } from '../../../services/usuarioService';
import { useAuth } from '../../../contexts';

export const EditarUsuarios = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [ehPropriaContaPermitida, setEhPropriaContaPermitida] = useState(true);
  const [usuarioSuspenso, setUsuarioSuspenso] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfilId: 0,
    ativo: true,
  });

  // Carrega dados do usuário ao montar o componente
  useEffect(() => {
    const carregarUsuario = async () => {
      if (!id) {
        setErro('ID do usuário não informado');
        return;
      }

      // Validar se está tentando editar a própria conta
      if (user && user.id === id) {
        setErro('Não é permitido editar sua própria conta. Solicite a outro administrador para fazer alterações em sua conta.');
        setEhPropriaContaPermitida(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErro(null);

      try {
        const usuario = await usuarioService.obterPorId(parseInt(id));

        // Validar se o usuário é admin (status 3) - não pode ser editado
        if (usuario.status === 3) {
          setErro('❌ Este usuário é um administrador e não pode ser editado. Administradores não podem ser modificados.');
          setUsuarioAdmin(true);
          setFormData({
            nome: usuario.nome,
            email: usuario.email,
            perfilId: 0,
            ativo: usuario.ativo,
          });
          setIsLoading(false);
          return;
        }

        // Validar se o usuário está suspenso (status 2)
        if (usuario.status === 2) {
          setErro('🔒 Este usuário está suspenso e não pode ser editado. Habilite o usuário primeiro para poder fazer alterações.');
          setUsuarioSuspenso(true);
          setFormData({
            nome: usuario.nome,
            email: usuario.email,
            perfilId: 0,
            ativo: usuario.ativo,
          });
          setIsLoading(false);
          return;
        }

        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          perfilId: 0,
          ativo: usuario.ativo,
        });
      } catch (error) {
        const mensagemErro = error instanceof Error ? error.message : 'Erro ao carregar usuário';
        setErro(mensagemErro);
      } finally {
        setIsLoading(false);
      }
    };

    carregarUsuario();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro(null);
    setSucesso(null);

    // Validações
    if (!formData.nome || formData.nome.trim().length === 0) {
      setErro('Por favor, informe o nome');
      return;
    }

    if (formData.nome.trim().length < 3) {
      setErro('O nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (!formData.perfilId || formData.perfilId <= 0) {
      setErro('Por favor, selecione um perfil');
      return;
    }

    setIsSubmitting(true);

    try {
      await usuarioService.atualizar(parseInt(id!), {
        nome: formData.nome,
        perfilId: formData.perfilId,
      });

      setSucesso('Usuário atualizado com sucesso!');

      setTimeout(() => {
        navigate('/admin/usuarios');
      }, 1500);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      setErro(mensagemErro);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">Carregando dados do usuário...</p>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Usuário</h1>
            <p className="text-gray-600 mt-2">Atualize os dados do usuário abaixo</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/usuarios')}
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
                <h3 className="text-sm font-medium text-red-800">Erro ao atualizar usuário</h3>
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              disabled={!ehPropriaContaPermitida || usuarioSuspenso || usuarioAdmin}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Digite o nome do usuário"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 3 caracteres, máximo 100 caracteres</p>
          </div>

          {/* Email (somente leitura) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              placeholder="Email do usuário"
            />
            <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
          </div>

          {/* Perfil */}
          <div>
            <label htmlFor="perfil" className="block text-sm font-medium text-gray-700 mb-2">
              Perfil <span className="text-red-500">*</span>
            </label>
            <select
              id="perfil"
              value={formData.perfilId}
              onChange={(e) => setFormData(prev => ({ ...prev, perfilId: parseInt(e.target.value) }))}
              disabled={!ehPropriaContaPermitida || usuarioSuspenso || usuarioAdmin}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value={0}>Selecione um perfil</option>
              <option value={1}>Administrador</option>
              <option value={2}>Gerenciador</option>
              <option value={3}>Usuário</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || !ehPropriaContaPermitida || usuarioSuspenso}
              className="px-6 py-3 bg-[#0C2856] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Atualizando...' : 'Atualizar Usuário'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/usuarios')}
              className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
};

