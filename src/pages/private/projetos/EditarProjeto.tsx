import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { PerguntasFrequentesForm, type PerguntaFrequente } from '../../../components/admin/PerguntasFrequentesForm';
import { ImageUpload } from '../../../components/admin/ImageUpload';
import { projetosService, validarProjeto } from '../../../services/projetosService';
import { handleApiError } from '../../../utils/errorHandler';

export const EditarProjeto = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    url: '',
    fotoCapaCaminho: '',
    logoCaminho: '',
  });
  const [fotoCapaUrl, setFotoCapaUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [perguntasFrequentes, setPerguntasFrequentes] = useState<PerguntaFrequente[]>([]);
  const [fotoCapaFile, setFotoCapaFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fotoCapaPreview, setFotoCapaPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProjeto = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('ID do projeto inválido');
          return;
        }

        const projeto = await projetosService.buscarPorId(parseInt(id));
        setFormData({
          titulo: projeto.titulo,
          descricao: projeto.descricao || '',
          url: projeto.url || '',
          fotoCapaCaminho: projeto.fotoCapaCaminho || '',
          logoCaminho: projeto.logoCaminho || '',
        });

        // Carregar perguntas frequentes
        if (projeto.perguntasFrequentes && projeto.perguntasFrequentes.length > 0) {
          const perguntas: PerguntaFrequente[] = projeto.perguntasFrequentes.map((p, index) => ({
            id: p.id?.toString() || `pf-${index}-${Date.now()}`,
            pergunta: p.pergunta || '',
            resposta: p.resposta || '',
          }));
          setPerguntasFrequentes(perguntas);
        } else {
          setPerguntasFrequentes([]);
        }

        if (projeto.fotoCapaCaminho) {
          setFotoCapaPreview(projeto.fotoCapaCaminho);
        }
        if (projeto.logoCaminho) {
          setLogoPreview(projeto.logoCaminho);
        }
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProjeto();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleImageUrlChange = (value: string, type: 'fotoCapa' | 'logo') => {
    if (type === 'fotoCapa') {
      setFotoCapaUrl(value);
      setFotoCapaFile(null);
      if (value) {
        setFotoCapaPreview(value);
      }
    } else {
      setLogoUrl(value);
      setLogoFile(null);
      if (value) {
        setLogoPreview(value);
      }
    }
  };

  const handleRemoveImage = (type: 'fotoCapa' | 'logo') => {
    if (type === 'fotoCapa') {
      setFotoCapaFile(null);
      setFotoCapaUrl('');
      setFotoCapaPreview(null);
      setFormData(prev => ({
        ...prev,
        fotoCapaCaminho: '',
      }));
    } else {
      setLogoFile(null);
      setLogoUrl('');
      setLogoPreview(null);
      setFormData(prev => ({
        ...prev,
        logoCaminho: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);

      const perguntasPayload = perguntasFrequentes.map((p, index) => ({
        pergunta: p.pergunta,
        resposta: p.resposta,
        ordem: index,
      }));

      console.log('[EditarProjeto] Estado dos arquivos:', {
        fotoCapaFile: fotoCapaFile ? `${fotoCapaFile.name} (${fotoCapaFile.size} bytes)` : 'null',
        logoFile: logoFile ? `${logoFile.name} (${logoFile.size} bytes)` : 'null',
        fotoCapaUrl,
        logoUrl,
      });

      // Validar dados
      const errosValidacao = validarProjeto({
        titulo: formData.titulo,
        descricao: formData.descricao,
        url: formData.url,
        perguntasFrequentes: perguntasPayload,
        fotoCapa: fotoCapaFile || undefined,
        logo: logoFile || undefined,
      });

      if (errosValidacao.length > 0) {
        setError(errosValidacao.join(' '));
        setSaving(false);
        return;
      }

      if (!id) {
        setError('ID do projeto inválido');
        setSaving(false);
        return;
      }

      console.log('[EditarProjeto] Enviando para o service:', {
        titulo: formData.titulo,
        fotoCapa: fotoCapaFile || undefined,
        logo: logoFile || undefined,
      });

      // Enviar dados
      await projetosService.editar(parseInt(id), {
        titulo: formData.titulo,
        descricao: formData.descricao,
        url: formData.url,
        perguntasFrequentes: perguntasPayload,
        fotoCapa: fotoCapaFile || undefined,
        logo: logoFile || undefined,
      });

      navigate('/admin/projetos');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PrivateLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C2856]"></div>
          <span className="ml-2 text-gray-600">Carregando projeto...</span>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Projeto</h1>
          <p className="text-gray-600 mt-2">Atualize as informações do projeto</p>
        </div>

        {/* Erro */}
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              placeholder="Digite o título do projeto"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              placeholder="Digite a descrição do projeto"
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          {/* Perguntas Frequentes */}
          <div className="border-t border-gray-200 pt-6">
            <PerguntasFrequentesForm
              perguntas={perguntasFrequentes}
              onChange={setPerguntasFrequentes}
              isSubmitting={saving}
            />
          </div>

          {/* Foto de Capa */}
          <ImageUpload
            label="Foto de Capa"
            description="opcional"
            value={fotoCapaUrl}
            onUrlChange={(value) => handleImageUrlChange(value, 'fotoCapa')}
            onFileChange={(file) => {
              if (file) {
                setFotoCapaFile(file);
                setFotoCapaUrl('');
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFotoCapaPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              } else {
                setFotoCapaFile(null);
                setFotoCapaPreview(null);
              }
            }}
            onRemove={() => handleRemoveImage('fotoCapa')}
            preview={fotoCapaPreview}
            optional
            disabled={saving}
            imageClassName="w-full h-64 object-cover"
          />

          {/* Logo */}
          <ImageUpload
            label="Logo"
            description="opcional"
            value={logoUrl}
            onUrlChange={(value) => handleImageUrlChange(value, 'logo')}
            onFileChange={(file) => {
              if (file) {
                setLogoFile(file);
                setLogoUrl('');
                const reader = new FileReader();
                reader.onloadend = () => {
                  setLogoPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              } else {
                setLogoFile(null);
                setLogoPreview(null);
              }
            }}
            onRemove={() => handleRemoveImage('logo')}
            preview={logoPreview}
            optional
            disabled={saving}
            imageClassName="w-32 h-32 object-contain"
          />

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#0C2856] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/projetos')}
              disabled={saving}
              className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
};

