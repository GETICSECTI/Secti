import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteModal } from './DeleteModal';

export interface ProjetoAdmin {
  id: number;
  titulo: string;
  descricao?: string;
  fotoCapaCaminho?: string;
  logoCaminho?: string;
  url?: string;
  ativo: boolean;
  dataCriacao: string;
}

interface TabelaProjetosProps {
  projetos: ProjetoAdmin[];
  onDelete: (id: number) => void;
  onActivate?: (id: number) => void;
  emptyMessage?: string;
}

export const TabelaProjetos = ({ projetos, onDelete, onActivate, emptyMessage }: TabelaProjetosProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState<ProjetoAdmin | null>(null);

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (ativo: boolean) => {
    return ativo ? 'Ativo' : 'Inativo';
  };

  const handleDelete = (id: number, titulo: string) => {
    setSelectedProjeto({ id, titulo } as ProjetoAdmin);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProjeto) {
      onDelete(selectedProjeto.id);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projetos.map((projeto) => (
              <tr key={projeto.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {projeto.titulo}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {projeto.descricao || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(projeto.dataCriacao).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(projeto.ativo)}`}>
                    {getStatusLabel(projeto.ativo)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/projetos/editar/${projeto.id}`}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    {!projeto.ativo && onActivate && (
                      <button
                        onClick={() => onActivate(projeto.id)}
                        className="text-purple-600 cursor-pointer hover:text-purple-900 transition-colors"
                        title="Ativar"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {projeto.ativo && (
                    <button
                      onClick={() => handleDelete(projeto.id, projeto.titulo)}
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                      title="Inativar"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        {projetos.map((projeto) => (
          <div key={projeto.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">
                {projeto.titulo}
              </h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(projeto.ativo)}`}>
                {getStatusLabel(projeto.ativo)}
              </span>
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Descrição:</span> {projeto.descricao || '-'}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Data:</span> {new Date(projeto.dataCriacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/projetos/editar/${projeto.id}`}
                className="flex-1 text-center bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Editar
              </Link>
              {!projeto.ativo && onActivate && (
                <button
                  onClick={() => onActivate(projeto.id)}
                  className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  Ativar
                </button>
              )}
              {projeto.ativo && (
              <button
                onClick={() => handleDelete(projeto.id, projeto.titulo)}
                className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Inativar
              </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projetos.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8 4M7 9l6 3.5m6-3.5l-6 3.5" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum projeto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage || 'Comece criando um novo projeto.'}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedProjeto && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Inativar projeto "${selectedProjeto.titulo}"`}
          message="Tem certeza que deseja inativar este projeto?"
        />
      )}
    </div>
  );
};

