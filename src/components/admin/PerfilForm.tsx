import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { perfilService, type Menu, type PermissaoInfo } from '../../services/perfilService';

interface PerfilFormData {
  nome: string;
  descricao: string;
  menusIds: number[];
  permissoes: PermissaoInfo;
}

interface PerfilFormProps {
  initialData?: Partial<PerfilFormData & { id: number }>;
  onSubmit: (data: PerfilFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const PerfilForm = ({ initialData, onSubmit, isSubmitting }: PerfilFormProps) => {
  const navigate = useNavigate();
  const [errosValidacao, setErrosValidacao] = useState<string[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingOpcoes, setLoadingOpcoes] = useState(true);

  const [formData, setFormData] = useState<PerfilFormData>({
    nome: '',
    descricao: '',
    menusIds: [],
    permissoes: {
      podeCadastrar: false,
      podeEditar: false,
      podeSuspenderHabilitar: false,
    },
  });

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        setLoadingOpcoes(true);
        const menusResp = await perfilService.listarMenus();

        setMenus(menusResp.menus);
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      } finally {
        setLoadingOpcoes(false);
      }
    };

    carregarOpcoes();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissaoChange = (permissao: keyof PermissaoInfo) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [permissao]: !prev.permissoes[permissao],
      },
    }));
  };

  const handleMenuToggle = (menuId: number) => {
    setFormData(prev => ({
      ...prev,
      menusIds: prev.menusIds.includes(menuId)
        ? prev.menusIds.filter(id => id !== menuId)
        : [...prev.menusIds, menuId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const erros: string[] = [];

    if (!formData.nome || formData.nome.trim().length < 3) {
      erros.push('Nome é obrigatório e deve ter no mínimo 3 caracteres.');
    }

    if (!formData.descricao || formData.descricao.trim().length < 5) {
      erros.push('Descrição é obrigatória e deve ter no mínimo 5 caracteres.');
    }

    if (formData.menusIds.length === 0) {
      erros.push('Selecione no mínimo um menu.');
    }

    if (!formData.permissoes.podeCadastrar && !formData.permissoes.podeEditar && !formData.permissoes.podeSuspenderHabilitar) {
      erros.push('Selecione no mínimo uma permissão.');
    }

    if (erros.length > 0) {
      setErrosValidacao(erros);
      return;
    }

    setErrosValidacao([]);
    await onSubmit(formData);
  };

  if (loadingOpcoes) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#195CE3]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erros de Validação */}
      {errosValidacao.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-900">Por favor, corrija os seguintes erros:</p>
              <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                {errosValidacao.map((erro, index) => (
                  <li key={index}>{erro}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Card Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Perfil <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            minLength={3}
            value={formData.nome}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
            placeholder="Digite o nome do perfil"
          />
          <p className="mt-1 text-sm text-gray-500">
            Mínimo de 3 caracteres. ({formData.nome.length}/3+)
          </p>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição <span className="text-red-600">*</span>
          </label>
          <textarea
            id="descricao"
            name="descricao"
            required
            minLength={5}
            rows={4}
            value={formData.descricao}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
            placeholder="Digite a descrição do perfil"
          />
          <p className="mt-1 text-sm text-gray-500">
            Mínimo de 5 caracteres. ({formData.descricao.length}/5+)
          </p>
        </div>

        {/* Permissões */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Permissões <span className="text-red-600">*</span>
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="podeCadastrar"
                type="checkbox"
                checked={formData.permissoes.podeCadastrar}
                onChange={() => handlePermissaoChange('podeCadastrar')}
                className="w-5 h-5 text-[#195CE3] border-gray-300 rounded focus:ring-[#195CE3] cursor-pointer"
              />
              <label htmlFor="podeCadastrar" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Pode Cadastrar
              </label>
              <p className="ml-2 text-xs text-gray-500">Permite criar novos registros</p>
            </div>

            <div className="flex items-center">
              <input
                id="podeEditar"
                type="checkbox"
                checked={formData.permissoes.podeEditar}
                onChange={() => handlePermissaoChange('podeEditar')}
                className="w-5 h-5 text-[#195CE3] border-gray-300 rounded focus:ring-[#195CE3] cursor-pointer"
              />
              <label htmlFor="podeEditar" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Pode Editar
              </label>
              <p className="ml-2 text-xs text-gray-500">Permite editar registros existentes</p>
            </div>

            <div className="flex items-center">
              <input
                id="podeSuspenderHabilitar"
                type="checkbox"
                checked={formData.permissoes.podeSuspenderHabilitar}
                onChange={() => handlePermissaoChange('podeSuspenderHabilitar')}
                className="w-5 h-5 text-[#195CE3] border-gray-300 rounded focus:ring-[#195CE3] cursor-pointer"
              />
              <label htmlFor="podeSuspenderHabilitar" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Pode Suspender/Habilitar
              </label>
              <p className="ml-2 text-xs text-gray-500">Permite ativar/desativar registros</p>
            </div>
          </div>
        </div>

        {/* Menus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Menus Disponíveis <span className="text-red-600">*</span>
          </label>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {menus.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum menu disponível</p>
            ) : (
              menus.map(menu => (
                <div key={menu.id} className="flex items-start">
                  <input
                    id={`menu-${menu.id}`}
                    type="checkbox"
                    checked={formData.menusIds.includes(menu.id)}
                    onChange={() => handleMenuToggle(menu.id)}
                    className="w-5 h-5 text-[#195CE3] border-gray-300 rounded focus:ring-[#195CE3] cursor-pointer mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <label htmlFor={`menu-${menu.id}`} className="text-sm font-medium text-gray-700 cursor-pointer block">
                      {menu.nome}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{menu.descricao}</p>
                    {menu.subMenus && menu.subMenus.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {menu.subMenus.length} submenu(s)
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            {formData.menusIds.length} menu(s) selecionado(s)
          </p>
        </div>
        <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-4">
            <button
                type="button"
                onClick={() => navigate('/admin/perfis')}
                className="px-6 py-3 border cursor-pointer border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0C2856] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                  <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </span>
              ) : (
                  initialData ? 'Atualizar Perfil' : 'Criar Perfil'
              )}
            </button>
          </div>
        </div>
        </div>
    </form>
  );
};
