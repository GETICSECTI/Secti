import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../../../layouts/PrivateLayout';
import { PerguntasFrequentesForm, type PerguntaFrequente } from '../../../components/admin/PerguntasFrequentesForm';
import { ImageUpload } from '../../../components/admin/ImageUpload';
import { projetosService, validarProjeto } from '../../../services/projetosService';
import { handleApiError } from '../../../utils/errorHandler';
import { LinkModal } from '../../../components/admin/LinkModal';
import sanitizeHtml from '../../../utils/sanitizeHtml';

export const CriarProjeto = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    url: '',
  });
  const [fotoCapaUrl, setFotoCapaUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [perguntasFrequentes, setPerguntasFrequentes] = useState<PerguntaFrequente[]>([]);
  const [fotoCapaFile, setFotoCapaFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fotoCapaPreview, setFotoCapaPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Editor states for descrição (match NoticiaForm behavior)
  const [tipoConteudo, setTipoConteudo] = useState<'simples' | 'rico'>('simples');
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedMarkersRef = useRef<{ startId: string; endId: string } | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInitialUrl, setLinkInitialUrl] = useState<string>('');
  const [linkInitialText, setLinkInitialText] = useState<string>('');

  useEffect(() => {
    // when switching to simples, set editor HTML from formData.descricao
    if (tipoConteudo === 'simples') {
      requestAnimationFrame(() => {
        if (editorRef.current) editorRef.current.innerHTML = sanitizeHtml(formData.descricao);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoConteudo]);

  const applyFormat = (command: string, value?: string) => {
    try {
      document.execCommand(command, false, value);
      if (editorRef.current) setFormData(prev => ({ ...prev, descricao: editorRef.current!.innerHTML }));
    } catch (err) {
      console.warn('format error', err);
    }
  };

  const handleInsertLink = () => {
    const sel = window.getSelection();
    let selText = '';
    savedMarkersRef.current = null;
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer) && !range.collapsed) {
        const uid = `m${Date.now()}${Math.floor(Math.random() * 10000)}`;
        const startId = `sel-start-${uid}`;
        const endId = `sel-end-${uid}`;
        const startMarker = document.createElement('span');
        const endMarker = document.createElement('span');
        startMarker.id = startId;
        endMarker.id = endId;
        startMarker.style.display = 'none';
        endMarker.style.display = 'none';

        const endRange = range.cloneRange();
        endRange.collapse(false);
        endRange.insertNode(endMarker);
        const startRange = range.cloneRange();
        startRange.collapse(true);
        startRange.insertNode(startMarker);

        savedMarkersRef.current = { startId, endId };
        selText = sel.toString();
      }
    }
    setLinkInitialText(selText);
    setLinkInitialUrl('https://');
    setIsLinkModalOpen(true);
  };

  const handleLinkConfirm = (url: string, text: string) => {
    if (!editorRef.current) { setIsLinkModalOpen(false); return; }

    let finalUrl = url.trim();
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;

    editorRef.current.focus();

    const escapeHtml = (str: string) => {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    if (savedMarkersRef.current && editorRef.current) {
      const { startId, endId } = savedMarkersRef.current;
      const startMarker = document.getElementById(startId);
      const endMarker = document.getElementById(endId);
      try {
        if (startMarker && endMarker && editorRef.current.contains(startMarker) && editorRef.current.contains(endMarker)) {
          const range = document.createRange();
          range.setStartAfter(startMarker);
          range.setEndBefore(endMarker);
          const contents = range.extractContents();
          const a = document.createElement('a');
          a.classList.add('LinkNoticia');
          a.setAttribute('href', finalUrl);
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.appendChild(contents);
          range.insertNode(a);
          startMarker.remove();
          endMarker.remove();
          const after = document.createRange();
          after.setStartAfter(a);
          after.collapse(true);
          const sel2 = window.getSelection();
          if (sel2) { sel2.removeAllRanges(); sel2.addRange(after); }
          if (editorRef.current) setFormData(prev => ({ ...prev, descricao: editorRef.current!.innerHTML }));
        } else {
          if (text && text.trim().length > 0) {
            applyFormat('insertHTML', `<a class="LinkNoticia" href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
          } else {
            applyFormat('insertHTML', `<a class="LinkNoticia" href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(finalUrl)}</a>`);
          }
        }
      } catch (error) {
        console.warn('insert link markers fallback', error);
        applyFormat('createLink', finalUrl);
        // ensure class on created link
        setTimeout(() => {
          if (editorRef.current) {
            const a = editorRef.current.querySelector(`a[href^="${finalUrl}"]`);
            if (a) a.classList.add('LinkNoticia');
            setFormData(prev => ({ ...prev, descricao: editorRef.current!.innerHTML }));
          }
        }, 0);
      }
      savedMarkersRef.current = null;
    } else {
      if (text && text.trim().length > 0) {
        applyFormat('insertHTML', `<a class="LinkNoticia" href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
      } else {
        applyFormat('insertHTML', `<a class="LinkNoticia" href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(finalUrl)}</a>`);
      }
    }

    setIsLinkModalOpen(false);
  };

  const clearSavedMarkers = () => {
    if (savedMarkersRef.current && editorRef.current) {
      const { startId, endId } = savedMarkersRef.current;
      const s = document.getElementById(startId);
      const e = document.getElementById(endId);
      if (s) s.remove();
      if (e) e.remove();
    }
    savedMarkersRef.current = null;
  };

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
    } else {
      setLogoFile(null);
      setLogoUrl('');
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const perguntasPayload = perguntasFrequentes.map((p, index) => ({
        pergunta: p.pergunta,
        resposta: p.resposta,
        ordem: index,
      }));

      // obter descrição correta (HTML) dependendo do modo
      const descricaoRaw = tipoConteudo === 'simples' ? (editorRef.current ? editorRef.current.innerHTML : formData.descricao) : formData.descricao;
      const descricaoParaEnviar = sanitizeHtml(descricaoRaw);

      // Validar dados
      const errosValidacao = validarProjeto({
        titulo: formData.titulo,
        descricao: descricaoParaEnviar,
        url: formData.url,
        perguntasFrequentes: perguntasPayload,
        fotoCapa: fotoCapaFile || undefined,
        logo: logoFile || undefined,
      });

      if (errosValidacao.length > 0) {
        setError(errosValidacao.join(' '));
        setLoading(false);
        return;
      }

      // Enviar dados
      await projetosService.cadastrar({
        titulo: formData.titulo,
        descricao: descricaoParaEnviar,
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
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Projeto</h1>
          <p className="text-gray-600 mt-2">Preencha o formulário abaixo para cadastrar um novo projeto</p>
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

          {/* Descrição - substituído por editor rico/simples */}
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>

            <div className="flex items-center justify-between mb-2">
              <div />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipoConteudo('simples')}
                  className={`px-3 cursor-pointer py-1 text-sm rounded-md transition-colors ${
                    tipoConteudo === 'simples' ? 'bg-[#0C2856] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Conteúdo Simples
                </button>
                <button
                  type="button"
                  onClick={() => setTipoConteudo('rico')}
                  className={`px-3 cursor-pointer py-1 text-sm rounded-md transition-colors ${
                    tipoConteudo === 'rico' ? 'bg-[#0C2856] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Conteúdo Rico (HTML)
                </button>
              </div>
            </div>

            {tipoConteudo === 'simples' && (
              <div className="flex flex-wrap gap-2 mb-2">
                <button type="button" onClick={() => applyFormat('formatBlock', 'h3')} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Título</button>
                <button type="button" onClick={() => applyFormat('formatBlock', 'p')} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Parágrafo</button>
                <button type="button" onClick={() => applyFormat('bold')} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Negrito</button>
                <button type="button" onClick={() => applyFormat('italic')} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Itálico</button>
                <button type="button" onClick={() => applyFormat('insertUnorderedList')} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Lista</button>
                <button type="button" onClick={handleInsertLink} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Link</button>
                <button type="button" onClick={() => applyFormat('insertHTML', '<br/>')} className="cursor-pointer px-2 py-1 bg-gray-100 rounded-md text-sm">Quebra (&lt;br/&gt;)</button>
              </div>
            )}

            {tipoConteudo === 'simples' ? (
              <div
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline
                suppressContentEditableWarning
                onInput={() => {
                  if (editorRef.current) setFormData(prev => ({ ...prev, descricao: editorRef.current!.innerHTML }));
                }}
                className="editor-content min-h-40 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent bg-white"
              />
            ) : (
              <textarea
                id="descricao"
                name="descricao"
                rows={6}
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
                placeholder="Digite a descrição do projeto"
              />
            )}

            <p className="mt-1 text-sm text-gray-500">Use o modo simples para formatar rapidamente ou o modo HTML para editar diretamente.</p>
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
              isSubmitting={loading}
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
            disabled={loading}
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
            disabled={loading}
            imageClassName="w-32 h-32 object-contain"
          />

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer bg-[#0C2856] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Criar Projeto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/projetos')}
              disabled={loading}
              className="flex-1 cursor-pointer border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <LinkModal
        isOpen={isLinkModalOpen}
        initialUrl={linkInitialUrl}
        initialText={linkInitialText}
        onConfirm={handleLinkConfirm}
        onClose={() => { clearSavedMarkers(); setIsLinkModalOpen(false); }}
      />
    </PrivateLayout>
  );
};

