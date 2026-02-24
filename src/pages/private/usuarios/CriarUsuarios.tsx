import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { usuarioService } from '../../../services/usuarioService';

export const CriarUsuarios = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [emailEmUso, setEmailEmUso] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    perfilId: 0,
  });

  const handleEmailBlur = async (email: string) => {
    if (email && email.includes('@')) {
      try {
        const existe = await usuarioService.validarEmail(email);
        setEmailEmUso(!existe);
      } catch {
        setEmailEmUso(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro(null);
    setSucesso(null);

    // Validações
    if (!formData.nome || formData.nome.trim().length === 0) {
      setErro('Por favor, informe o nome');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setErro('Por favor, informe um email válido');
      return;
    }

    if (emailEmUso) {
      setErro('Este email já está em uso');
      return;
    }

    if (!formData.senha || formData.senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (!formData.perfilId || formData.perfilId <= 0) {
      setErro('Por favor, selecione um perfil');
      return;
    }

    setIsSubmitting(true);

    try {
      await usuarioService.cadastrar({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        perfilId: formData.perfilId,
      });

      setSucesso('Usuário criado com sucesso!');

      setTimeout(() => {
        navigate('/admin/usuarios');
      }, 1500);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao criar usuário';
      setErro(mensagemErro);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Usuário</h1>
            <p className="text-gray-600 mt-2">Preencha os campos abaixo para criar um novo usuário</p>
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
                <h3 className="text-sm font-medium text-red-800">Erro ao criar usuário</h3>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent"
              placeholder="Digite o nome do usuário"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 3 caracteres, máximo 100 caracteres</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              onBlur={(e) => handleEmailBlur(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent ${
                emailEmUso ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Digite o email do usuário"
              maxLength={150}
            />
            {emailEmUso && (
              <p className="text-xs text-red-600 mt-1">Este email já está em uso</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Máximo 150 caracteres</p>
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="senha"
              value={formData.senha}
              onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent"
              placeholder="Digite uma senha"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent"
              placeholder="Confirme a senha"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent cursor-pointer"
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
              disabled={isSubmitting || emailEmUso}
              className="px-6 py-3 bg-[#0C2856] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando...' : 'Criar Usuário'}
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

