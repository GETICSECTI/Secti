import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { transparenciaService, type TransparenciaSubmenu } from '../../../services/transparenciaService';
import { handleApiError } from '../../../utils/errorHandler';

export const ListarTransparencia = () => {
  const [transparenciasTotal, setTransparenciasTotal] = useState<TransparenciaSubmenu[]>([]);
  const [transparencias, setTransparencias] = useState<TransparenciaSubmenu[]>([]);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Carregar transparências da API (uma única vez)
  const carregarTransparencias = useCallback(async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const response = await transparenciaService.listarAdmin();

      // Validar resposta e garantir que itens é sempre um array
      const itensResposta = Array.isArray(response.itens) ? response.itens : [];
      setTransparenciasTotal(itensResposta);
      setTotalItems(itensResposta.length);
      setCurrentPage(1);
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErro(mensagemErro);
      setTransparenciasTotal([]);
      setTransparencias([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar filtros e paginação
  useEffect(() => {
    // Filtrar por busca e status
    const itemsFiltrados = transparenciasTotal.filter((item) => {
      const matchBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                         item.url.toLowerCase().includes(busca.toLowerCase()) ||
                         (item.descricao && item.descricao.toLowerCase().includes(busca.toLowerCase()));

      const matchStatus = filtroStatus === 'Todos' ||
                          (filtroStatus === 'Ativos' && item.ativo) ||
                          (filtroStatus === 'Inativos' && !item.ativo);

      return matchBusca && matchStatus;
    });

    setTotalItems(itemsFiltrados.length);
    setCurrentPage(1);

    // Paginar
    const inicio = (1 - 1) * itemsPerPage;
    const fim = inicio + itemsPerPage;
    setTransparencias(itemsFiltrados.slice(inicio, fim));
  }, [busca, filtroStatus, transparenciasTotal, itemsPerPage]);

  // Atualizar paginação quando página muda
  useEffect(() => {
    const itemsFiltrados = transparenciasTotal.filter((item) => {
      const matchBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                         item.url.toLowerCase().includes(busca.toLowerCase()) ||
                         (item.descricao && item.descricao.toLowerCase().includes(busca.toLowerCase()));

      const matchStatus = filtroStatus === 'Todos' ||
                          (filtroStatus === 'Ativos' && item.ativo) ||
                          (filtroStatus === 'Inativos' && !item.ativo);

      return matchBusca && matchStatus;
    });

    const inicio = (currentPage - 1) * itemsPerPage;
    const fim = inicio + itemsPerPage;
    setTransparencias(itemsFiltrados.slice(inicio, fim));
  }, [currentPage, busca, filtroStatus, transparenciasTotal, itemsPerPage]);

  useEffect(() => {
    carregarTransparencias();
  }, [carregarTransparencias]);

  const handleToggleStatus = async (id: number, ativo: boolean) => {
    try {
      if (ativo) {
        await transparenciaService.suspender(id);
      } else {
        await transparenciaService.habilitar(id);
      }
      // Recarregar dados
      await carregarTransparencias();
    } catch (error) {
      const mensagemErro = handleApiError(error);
      setErro(mensagemErro);
    }
  };

  return (
    <PrivateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Transparência</h1>
            <p className="text-gray-600 mt-2">
              {isLoading ? 'Carregando...' : `${totalItems} ${totalItems === 1 ? 'item encontrado' : 'itens encontrados'}`}
            </p>
          </div>
          <Link
            to="/admin/transparencia/criar"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#0C2856] text-white font-medium rounded-lg hover:bg-[#195CE3] transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Item
          </Link>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro ao carregar itens</h3>
                <p className="text-sm text-red-700 mt-1">{erro}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
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
                  placeholder="Digite o título, URL ou descrição..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="block w-full cursor-pointer px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              >
                <option value="Todos">Todos</option>
                <option value="Ativos">Ativos</option>
                <option value="Inativos">Inativos</option>
              </select>
            </div>
          </div>

          {/* Botão Limpar */}
          <div className="mt-4">
            <button
              onClick={() => {
                setBusca('');
                setFiltroStatus('Todos');
                setCurrentPage(1);
              }}
              className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">Carregando itens...</p>
          </div>
        ) : transparencias.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum item encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente ajustar os filtros de busca' : 'Crie um novo item para começar'}
            </p>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
            <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transparencias.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.ordem}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.titulo}</div>
                        {item.descricao && (
                          <div className="text-sm text-gray-500 mt-1">{item.descricao}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/transparencia/editar/${item.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(item.id, item.ativo)}
                            className={`${
                              item.ativo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                            title={item.ativo ? 'Suspender' : 'Habilitar'}
                          >
                            {item.ativo ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
              {transparencias.map((item) => (
                <div key={item.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.titulo}</h3>
                      {item.descricao && (
                        <p className="text-sm text-gray-500 mt-1">{item.descricao}</p>
                      )}
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        item.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Ordem:</span>
                      <span className="text-gray-900">{item.ordem}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">URL:</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline ml-2 break-all"
                      >
                        {item.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Criado em:</span>
                      <span className="text-gray-900">
                        {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/admin/transparencia/editar/${item.id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(item.id, item.ativo)}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-md ${
                        item.ativo
                          ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                          : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                      }`}
                    >
                      {item.ativo ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Suspender
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Habilitar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalItems > itemsPerPage && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de <span className="font-medium">{totalItems}</span> resultados
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="px-3 py-1 cursor-pointer border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{Math.ceil(totalItems / itemsPerPage)}</span>
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || isLoading}
                    className="px-3 py-1 cursor-pointer border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PrivateLayout>
  );
};
