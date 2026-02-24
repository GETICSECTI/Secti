import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { documentosService } from '../../../services/documentosService';
import { TagSelector } from '../../../components/admin/TagSelector';

export const CriarDocumentos = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    titulo: string;
    descricao: string;
    dataPublicacao: string;
    tagIds: number[];
    arquivo: File | null;
  }>({
    titulo: '',
    descricao: '',
    dataPublicacao: '',
    tagIds: [],
    arquivo: null,
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
      setFormData((prev) => ({
        ...prev,
        arquivo: null,
      }));
      setPreviewArquivo(null);
      return;
    }

    const extensao = file.name.split('.').pop()?.toLowerCase();
    const tiposPermitidos = ['pdf', 'xls', 'xlsx', 'csv'];

    if (!extensao || !tiposPermitidos.includes(extensao)) {
      setErro('Por favor, selecione um arquivo PDF, XLS, XLSX ou CSV');
      return;
    }

    const tamanhoMaximo = 10 * 1024 * 1024;
    if (file.size > tamanhoMaximo) {
      setErro('O arquivo nao pode ter mais de 10MB');
      return;
    }

    setErro(null);

    const nomeArquivo = file.name.substring(0, file.name.lastIndexOf('.'));

    setFormData((prev) => ({
      ...prev,
      arquivo: file,
    }));

    setPreviewArquivo({
      nome: nomeArquivo,
      nomeComExtensao: file.name,
      tamanho: formatFileSize(file.size),
      tipo: (extensao as 'pdf' | 'xls' | 'xlsx' | 'csv') ?? 'outro',
    });
  };

  const handleRemoverArquivo = () => {
    setFormData((prev) => ({
      ...prev,
      arquivo: null,
    }));
    setPreviewArquivo(null);
    const input = document.getElementById('arquivo-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const formatDateForApi = (dateValue: string): string => {
    if (!dateValue) return '';
    const [year, month, day] = dateValue.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErro(null);
    setSucesso(null);

    if (!formData.titulo.trim()) {
      setErro('Titulo e obrigatorio');
      return;
    }

    if (!formData.dataPublicacao) {
      setErro('Data de publicacao e obrigatoria');
      return;
    }

    if (!formData.arquivo) {
      setErro('Por favor, selecione um arquivo');
      return;
    }

    setIsSubmitting(true);

    try {
      await documentosService.cadastrar({
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim() || undefined,
        dataPublicacao: formatDateForApi(formData.dataPublicacao),
        tagIds: formData.tagIds,
        arquivo: formData.arquivo,
      });

      setSucesso('Documento criado com sucesso!');

      setTimeout(() => {
        navigate('/admin/documentos');
      }, 1500);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao criar documento';
      setErro(mensagemErro);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'xls':
      case 'xlsx':
      case 'csv':
        return (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <PrivateLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Documento</h1>
            <p className="text-gray-600 mt-2">Preencha os campos abaixo para criar um novo documento</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/documentos')}
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
                <h3 className="text-sm font-medium text-red-800">Erro ao criar documento</h3>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Informacoes do Documento */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Titulo <span className="text-red-500">*</span>
              </label>
              <input
                id="titulo"
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                placeholder="Digite o titulo do documento"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#195CE3] focus:border-transparent outline-none transition-colors"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descricao
              </label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descricao do documento (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#195CE3] focus:border-transparent outline-none transition-colors"
                maxLength={500}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="dataPublicacao" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Publicacao <span className="text-red-500">*</span>
              </label>
              <input
                id="dataPublicacao"
                type="date"
                value={formData.dataPublicacao}
                onChange={(e) => setFormData((prev) => ({ ...prev, dataPublicacao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#195CE3] focus:border-transparent outline-none transition-colors"
                required
              />
            </div>

            <div>
              <TagSelector
                label="Tags"
                value={formData.tagIds.length > 0 ? formData.tagIds[0] : null}
                onChange={(tagId) => setFormData(prev => ({ ...prev, tagIds: tagId ? [tagId] : [] }))}
              />
            </div>
          </div>

          {/* Upload de Arquivo */}
          <div>
            <label htmlFor="arquivo-input" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Arquivo do Documento <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              O nome e tipo de arquivo serao extraidos automaticamente do arquivo enviado
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
                  <p className="text-xs text-gray-500 mt-1">PDF, XLS, XLSX ou CSV (maximo 10MB)</p>
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

          {/* Botoes */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0C2856] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando...' : 'Criar Documento'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/documentos')}
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
