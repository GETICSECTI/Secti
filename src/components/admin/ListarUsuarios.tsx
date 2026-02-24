import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteModal } from './DeleteModal';
import { type UsuarioListItem } from '../../services/usuarioService';

export type { UsuarioListItem };

interface ListarUsuariosProps {
  usuarios: UsuarioListItem[];
  onSuspend: (id: number) => void;
  onEnable: (id: number) => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showHeader?: boolean;
}

export const ListarUsuarios = ({
  usuarios,
  onSuspend,
  onEnable,
  emptyStateTitle = 'Nenhum usuário encontrado',
  emptyStateDescription = 'Não há usuários cadastrados no momento.',
  showHeader = true,
}: ListarUsuariosProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'suspend' | 'enable'>('suspend');
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioListItem | null>(null);

  const handleSuspend = (usuario: UsuarioListItem) => {
    setSelectedUsuario(usuario);
    setModalAction('suspend');
    setDeleteModalOpen(true);
  };

  const handleEnable = (usuario: UsuarioListItem) => {
    setSelectedUsuario(usuario);
    setModalAction('enable');
    setDeleteModalOpen(true);
  };

  const confirmAction = () => {
    if (selectedUsuario) {
      if (modalAction === 'suspend') {
        onSuspend(selectedUsuario.id);
      } else {
        onEnable(selectedUsuario.id);
      }
      setDeleteModalOpen(false);
      setSelectedUsuario(null);
    }
  };

  if (usuarios.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyStateTitle}</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyStateDescription}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {showHeader && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Usuários Cadastrados</h3>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
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
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{usuario.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {usuario.perfilNome}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {usuario.status === 3 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    ) : usuario.status === 2 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Suspenso
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {usuario.ativo && (
                        <Link
                          to={`/admin/usuarios/editar/${usuario.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      )}
                      {usuario.ativo ? (
                        <button
                          onClick={() => handleSuspend(usuario)}
                          className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                          title="Suspender"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ) : usuario.status !== 3 ? (
                        <button
                          onClick={() => handleEnable(usuario)}
                          className="text-green-600 cursor-pointer hover:text-green-900 transition-colors"
                          title="Habilitar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">
                  {usuario.nome}
                </h3>
                {usuario.status === 3 ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-purple-100 text-purple-800">
                    Admin
                  </span>
                ) : usuario.status === 2 ? (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 text-red-800">
                    Suspenso
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-green-100 text-green-800">
                    Ativo
                  </span>
                )}
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Email:</span> {usuario.email}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Perfil:</span> {usuario.perfilNome}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Data:</span> {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {usuario.ativo && (
                  <Link
                    to={`/admin/usuarios/editar/${usuario.id}`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </Link>
                )}
                {usuario.ativo ? (
                  <button
                    onClick={() => handleSuspend(usuario)}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Suspender
                  </button>
                ) : usuario.status !== 3 ? (
                  <button
                    onClick={() => handleEnable(usuario)}
                    className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    Habilitar
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUsuario(null);
        }}
        onConfirm={confirmAction}
        title={modalAction === 'suspend' ? 'Suspender Usuário' : 'Habilitar Usuário'}
        message={
          modalAction === 'suspend'
            ? `Tem certeza de que deseja suspender o usuário "${selectedUsuario?.nome}"? Ele não poderá fazer login.`
            : `Tem certeza de que deseja habilitar o usuário "${selectedUsuario?.nome}"?`
        }
        confirmText={modalAction === 'suspend' ? 'Suspender' : 'Habilitar'}
        cancelText="Cancelar"
      />
    </>
  );
};
