import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { tagService, type Tag } from '../../../services/tagService';
import { DeleteModal } from '../../../components/admin/DeleteModal';

export const ListarCategorias = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [modalAction, setModalAction] = useState<'inativar' | 'ativar'>('inativar');

  const carregarTags = useCallback(async (page = 1, nomeFiltro = '') => {
    try {
      setLoading(true);
      setError(null);
      const resposta = await tagService.listar({
        nomeFiltro: nomeFiltro || undefined,
        apenasAtivas: true,
        pagina: 1,
        itensPorPagina: 10000,
      });

      let tagsFormatted = resposta.itens;

      if (nomeFiltro) {
        tagsFormatted = tagsFormatted.filter(t =>
          t.nome.toLowerCase().includes(nomeFiltro.toLowerCase())
        );
      }

      setTotalItems(tagsFormatted.length);
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setTags(tagsFormatted.slice(start, end));
      setCurrentPage(page);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar categorias';
      setError(mensagem);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    carregarTags();
  }, [carregarTags]);

  const handleBuscar = () => {
    setCurrentPage(1);
    carregarTags(1, busca);
  };

  const handleLimparBusca = () => {
    setBusca('');
    setCurrentPage(1);
    carregarTags(1);
  };

  const handleInativar = (tag: Tag) => {
    setSelectedTag(tag);
    setModalAction('inativar');
    setDeleteModalOpen(true);
  };

  const handleAtivar = (tag: Tag) => {
    setSelectedTag(tag);
    setModalAction('ativar');
    setDeleteModalOpen(true);
  };

  const confirmarAcao = async () => {
    if (!selectedTag) return;

    try {
      setError(null);
      if (modalAction === 'inativar') {
        await tagService.inativar(selectedTag.id);
      } else {
        await tagService.ativar(selectedTag.id);
      }
      setDeleteModalOpen(false);
      carregarTags(currentPage, busca);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(mensagem);
    }
  };

  return (
    <PrivateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>
            <p className="text-gray-600 mt-2">
              {loading ? 'Carregando...' : `${totalItems} ${totalItems === 1 ? 'categoria encontrada' : 'categorias encontradas'}`}
            </p>
          </div>
          <Link
            to="/admin/categorias/criar"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0C2856] text-white font-medium rounded-lg hover:bg-[#195CE3] transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Categoria
          </Link>
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

        {/* Filtro e Busca */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div>
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="busca"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  placeholder="Digite o nome da categoria..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleBuscar}
                disabled={loading}
                className="flex-1 cursor-pointer bg-[#0C2856] text-white px-4 py-2 rounded-md hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
              <button
                onClick={handleLimparBusca}
                disabled={loading}
                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Tabela/Cards */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Criação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tag.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tag.ativo ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tag.dataCriacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/categorias/editar/${tag.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        {tag.ativo ? (
                          <button
                            onClick={() => handleInativar(tag)}
                            className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                            title="Inativar"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAtivar(tag)}
                            className="text-green-600 cursor-pointer hover:text-green-900 transition-colors"
                            title="Ativar"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {tags.map((tag) => (
              <div key={tag.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 flex-1">
                    {tag.nome}
                  </h3>
                  {tag.ativo ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 text-green-800">
                      Ativo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 text-red-800">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="font-medium">Data:</span> {new Date(tag.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/categorias/editar/${tag.id}`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </Link>
                  {tag.ativo ? (
                    <button
                      onClick={() => handleInativar(tag)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      Inativar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAtivar(tag)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                      Ativar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && tags.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando uma nova categoria.</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Carregando categorias...</p>
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalItems > itemsPerPage && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de <span className="font-medium">{totalItems}</span> resultados
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
              <button
                onClick={() => carregarTags(currentPage - 1, busca)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 cursor-pointer border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{Math.ceil(totalItems / itemsPerPage)}</span>
              </span>
              <button
                onClick={() => carregarTags(currentPage + 1, busca)}
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || loading}
                className="px-3 py-1 cursor-pointer border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmarAcao}
        title={modalAction === 'inativar' ? 'Inativar Categoria' : 'Ativar Categoria'}
        message={
          modalAction === 'inativar'
            ? `Tem certeza que deseja inativar a categoria "${selectedTag?.nome}"?`
            : `Tem certeza que deseja ativar a categoria "${selectedTag?.nome}"?`
        }
        confirmText={modalAction === 'inativar' ? 'Inativar' : 'Ativar'}
        cancelText="Cancelar"
      />
    </PrivateLayout>
  );
};

