import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteModal } from './DeleteModal';

export interface NoticiaAdmin {
  id: number;
  slug: string;
  titulo: string;
  autor: string;
  dataPublicacao: string;
  status: 'Publicada' | 'Rascunho' | 'Arquivada';
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

interface TabelaNoticiasProps {
  noticias: NoticiaAdmin[];
  onDelete: (id: number) => void;
  onActivate?: (id: number) => void;
  emptyMessage?: string;
}

export const TabelaNoticias = ({ noticias, onDelete, onActivate, emptyMessage }: TabelaNoticiasProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState<NoticiaAdmin | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicada':
        return 'bg-green-100 text-green-800';
      case 'Rascunho':
        return 'bg-yellow-100 text-yellow-800';
      case 'Arquivada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: number, titulo: string) => {
    setSelectedNoticia({ id, titulo } as NoticiaAdmin);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedNoticia) {
      onDelete(selectedNoticia.id);
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
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
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
            {noticias.map((noticia) => (
              <tr key={noticia.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {noticia.titulo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{noticia.autor}</div>
                </td>
                <td className="px-6 py-4">
                  {noticia.tags && noticia.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {noticia.tags.map((tag) => (
                        <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag.nome}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{noticia.dataPublicacao}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(noticia.status)}`}>
                    {noticia.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/noticias/visualizar/${noticia.slug}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Visualizar"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/admin/noticias/editar/${noticia.slug}`}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    {(noticia.status === 'Rascunho' || noticia.status === 'Arquivada') && onActivate && (
                      <button
                        onClick={() => onActivate(noticia.id)}
                        className="text-purple-600 cursor-pointer hover:text-purple-900 transition-colors"
                        title="Publicar"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {noticia.status === 'Publicada' && (
                    <button
                      onClick={() => handleDelete(noticia.id, noticia.titulo)}
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                      title={noticia.status === 'Publicada' ? 'Despublicar' : 'Excluir'}
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
        {noticias.map((noticia) => (
          <div key={noticia.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">
                {noticia.titulo}
              </h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(noticia.status)}`}>
                {noticia.status}
              </span>
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Autor:</span> {noticia.autor}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Data:</span> {noticia.dataPublicacao}
              </p>
              {noticia.tags && noticia.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {noticia.tags.map((tag) => (
                    <span key={tag.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag.nome}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/noticias/visualizar/${noticia.slug}`}
                className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Visualizar
              </Link>
              <Link
                to={`/admin/noticias/editar/${noticia.slug}`}
                className="flex-1 text-center bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Editar
              </Link>
              {(noticia.status === 'Rascunho' || noticia.status === 'Arquivada') && onActivate && (
                <button
                  onClick={() => onActivate(noticia.id)}
                  className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  Publicar
                </button>
              )}
              {noticia.status === 'Publicada' && (
              <button
                onClick={() => handleDelete(noticia.id, noticia.titulo)}
                className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Arquivar
              </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {noticias.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notícia encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage || 'Comece criando uma nova notícia.'}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedNoticia && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Arquivar notícia "${selectedNoticia.titulo}"`}
          message="Tem certeza que deseja arquivar esta notícia?"
        />
      )}
    </div>
  );
};
