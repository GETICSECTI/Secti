import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { TagSelector } from '../../../components/admin/TagSelector';
import { legislacaoService } from '../../../services/legislacaoService';

export const CriarLegislacao = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    tagId: null as number | null,
    dataPublicacao: new Date().toISOString().split('T')[0],
    caminho: '',
    arquivo: null as File | null,
  });

  const [previewArquivo, setPreviewArquivo] = useState<{
    nome: string;
    nomeComExtensao: string;
    tamanho: string;
    tipo: 'pdf' | 'xls' | 'xlsx' | 'csv' | 'outro';
  } | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData(prev => ({
        ...prev,
        arquivo: null,
      }));
      setPreviewArquivo(null);
      return;
    }

    // Validar tipo de arquivo
    const extensao = file.name.split('.').pop()?.toLowerCase();
    const tiposPermitidos = ['pdf', 'xls', 'xlsx', 'csv'];

    if (!extensao || !tiposPermitidos.includes(extensao)) {
      setErro('Por favor, selecione um arquivo PDF, XLS, XLSX ou CSV');
      return;
    }

    // Validar tamanho máximo (ex: 10MB)
    const tamanhoMaximo = 10 * 1024 * 1024;
    if (file.size > tamanhoMaximo) {
      setErro('O arquivo não pode ter mais de 10MB');
      return;
    }

    setErro(null);

    // Extrair nome sem extensão
    const nomeArquivo = file.name.substring(0, file.name.lastIndexOf('.'));

    setFormData(prev => ({
      ...prev,
      arquivo: file,
    }));

    setPreviewArquivo({
      nome: nomeArquivo,
      nomeComExtensao: file.name,
      tamanho: formatFileSize(file.size),
      tipo: extensao as 'pdf' | 'xls' | 'xlsx' | 'csv',
    });
  };

  const handleRemoverArquivo = () => {
    setFormData(prev => ({
      ...prev,
      arquivo: null,
    }));
    setPreviewArquivo(null);
    const input = document.getElementById('arquivo-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro(null);
    setSucesso(null);

    // Validações
    if (!formData.titulo || formData.titulo.trim().length === 0) {
      setErro('Por favor, informe o título');
      return;
    }

    if (!formData.dataPublicacao) {
      setErro('Por favor, informe a data de publicação');
      return;
    }

    if (!formData.arquivo) {
      setErro('Por favor, selecione um arquivo');
      return;
    }

    setIsSubmitting(true);

    try {
      await legislacaoService.cadastrar({
        titulo: formData.titulo,
        dataPublicacao: formData.dataPublicacao,
        caminho: formData.caminho || undefined,
        arquivo: formData.arquivo,
        tagIds: formData.tagId ? [formData.tagId] : undefined,
      });

      setSucesso('Legislação criada com sucesso!');

      // Aguardar um momento para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/admin/legislacao');
      }, 1500);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao criar legislação';
      setErro(mensagemErro);
      setIsSubmitting(false);
    }
  };

  const getIconeTipo = (tipo: string) => {
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
        return null;
    }
  };

  return (
    <PrivateLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Legislação</h1>
            <p className="text-gray-600 mt-2">Preencha os campos abaixo para criar uma nova legislação</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/legislacao')}
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
                <h3 className="text-sm font-medium text-red-800">Erro ao criar legislação</h3>
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
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent"
              placeholder="Digite o título da legislação"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 3 caracteres, máximo 200 caracteres</p>
          </div>

          {/* Tag */}
          <div>
            <TagSelector
              value={formData.tagId}
              onChange={(tagId) => setFormData(prev => ({ ...prev, tagId }))}
              label="Tag"
              required
            />
          </div>

          {/* Data de Publicação */}
          <div>
            <label htmlFor="dataPublicacao" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Publicação <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dataPublicacao"
              value={formData.dataPublicacao}
              onChange={(e) => setFormData(prev => ({ ...prev, dataPublicacao: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Selecione a data de publicação da legislação</p>
          </div>

          {/* Caminho (Opcional) */}
          <div>
            <label htmlFor="caminho" className="block text-sm font-medium text-gray-700 mb-2">
              Caminho
            </label>
            <input
              type="text"
              id="caminho"
              value={formData.caminho}
              onChange={(e) => setFormData(prev => ({ ...prev, caminho: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2856] focus:border-transparent"
              placeholder="Digite o caminho (opcional)"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">Opcional, máximo 500 caracteres</p>
          </div>

          {/* Upload de Arquivo */}
          <div>
            <label htmlFor="arquivo-input" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Arquivo da Legislação <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Formatos aceitos: PDF, XLS, XLSX, CSV (máximo 10MB)
            </p>

            {!previewArquivo ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                <label htmlFor="arquivo-input" className="cursor-pointer">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-[#0C2856]">Clique aqui</span> ou arraste um arquivo
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PDF, XLS, XLSX ou CSV (máximo 10MB)</p>
                </label>
                <input
                  id="arquivo-input"
                  type="file"
                  accept=".pdf,.xls,.xlsx,.csv"
                  onChange={handleArquivoChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getIconeTipo(previewArquivo.tipo)}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 wrap-break-word">
                        {previewArquivo.nome}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {previewArquivo.tipo.toUpperCase()} • {previewArquivo.tamanho}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoverArquivo}
                    className="text-red-600 cursor-pointer hover:text-red-900 transition-colors shrink-0"
                    title="Remover arquivo"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('arquivo-input') as HTMLInputElement;
                    if (input) input.click();
                  }}
                  className="mt-4 px-3 py-2 text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Alterar arquivo
                </button>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0C2856] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando...' : 'Criar Legislação'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/legislacao')}
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
