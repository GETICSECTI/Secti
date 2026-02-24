import { useState } from 'react';
import { DeleteModal } from './DeleteModal';
import { downloadRelatorio } from '../../services/relatoriosService';
import { formatarDataBrasileira } from '../../utils/dateUtils';

export interface Relatorio {
  id: number;
  nome: string;
  tipo: 'pdf' | 'xls' | 'xlsx' | 'csv' | 'outro';
  categoria: string;
  dataPublicacao: string;
  caminhoArquivo?: string;
  nomeArquivo?: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
}

interface ListarRelatoriosProps {
  relatorios: Relatorio[];
  onDelete: (id: number) => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  showHeader?: boolean;
  downloadFn?: (caminhoArquivo: string, nomeArquivo?: string) => Promise<void>;
}

export const ListarRelatorios = ({
  relatorios,
  onDelete,
  emptyStateTitle = 'Nenhum relatório encontrado',
  emptyStateDescription = 'Não há relatórios cadastrados no momento.',
  showHeader = true,
  downloadFn = downloadRelatorio,
}: ListarRelatoriosProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRelatorio, setSelectedRelatorio] = useState<Relatorio | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async (relatorio: Relatorio) => {
    if (!relatorio.caminhoArquivo) return;

    setDownloadError(null);
    setDownloadingId(relatorio.id);
    try {
      await downloadFn(relatorio.caminhoArquivo, relatorio.nomeArquivo);
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      setDownloadError('Erro ao baixar o relatório. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getIconForType = (tipo: Relatorio['tipo']) => {
    switch (tipo) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        );
      case 'xls':
      case 'xlsx':
        return (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        );
      case 'csv':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        );
    }
  };

  const handleDelete = (id: number, nome: string) => {
    setSelectedRelatorio({ id, nome } as Relatorio);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRelatorio) {
      onDelete(selectedRelatorio.id);
      setDeleteModalOpen(false);
      setSelectedRelatorio(null);
    }
  };

  if (relatorios.length === 0) {
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyStateTitle}</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyStateDescription}</p>
      </div>
    );
  }

  return (
    <>
      {/* Alerta de erro de download */}
      {downloadError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-700">{downloadError}</p>
            </div>
            <button
              onClick={() => setDownloadError(null)}
              className="text-red-600 hover:text-red-800 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {showHeader && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Relatórios Cadastrados</h3>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relatório
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Publicação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relatorios.map((relatorio) => (
                <tr key={relatorio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0">{getIconForType(relatorio.tipo)}</div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{relatorio.nome}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {relatorio.tags && relatorio.tags.length > 0
                        ? relatorio.tags.map((tag) => tag.nome).join(', ')
                        : 'Sem tags'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarDataBrasileira(relatorio.dataPublicacao)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-500 uppercase">{relatorio.tipo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {relatorio.caminhoArquivo && (
                        <button
                          onClick={() => handleDownload(relatorio)}
                          disabled={downloadingId === relatorio.id}
                          className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Download"
                        >
                          {downloadingId === relatorio.id ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(relatorio.id, relatorio.nome)}
                        className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                        title="Excluir"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {relatorios.map((relatorio) => (
            <div key={relatorio.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {getIconForType(relatorio.tipo)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{relatorio.nome}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="uppercase font-medium">{relatorio.tipo}</span>
                      <span>•</span>
                      <span>Publicado em: {formatarDataBrasileira(relatorio.dataPublicacao)}</span>
                      {relatorio.tags && relatorio.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span>Tags: {relatorio.tags.map((tag) => tag.nome).join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {relatorio.caminhoArquivo && (
                    <button
                      onClick={() => handleDownload(relatorio)}
                      disabled={downloadingId === relatorio.id}
                      className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Download"
                    >
                      {downloadingId === relatorio.id ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(relatorio.id, relatorio.nome)}
                    className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                    title="Excluir"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRelatorio(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Relatório"
        message={`Tem certeza de que deseja excluir o relatório "${selectedRelatorio?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
};

