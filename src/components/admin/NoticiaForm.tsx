import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tagService, type Tag } from '../../services/tagService';
import { handleApiError } from '../../utils/errorHandler';
import { LinkModal } from './LinkModal';
import DOMPurify from 'dompurify';

interface NoticiaFormData {
  titulo: string;
  slug: string;
  autor: string;
  resumo: string;
  conteudo: string;
  imagemDestaque: string;
  imagemArquivo: File | null;
  status: 'Publicada' | 'Rascunho' | 'Arquivada';
  destaque: boolean;
  tagId: number | null;
}

interface NoticiaFormProps {
  initialData?: Partial<NoticiaFormData>;
  onSubmit: (data: NoticiaFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const NoticiaForm = ({ initialData, onSubmit, isSubmitting }: NoticiaFormProps) => {
  const navigate = useNavigate();
  const [tipoConteudo, setTipoConteudo] = useState<'simples' | 'rico'>('simples');
  const [errosValidacao, setErrosValidacao] = useState<string[]>([]);


  const [formData, setFormData] = useState<NoticiaFormData>({
    titulo: '',
    slug: '',
    autor: '',
    resumo: '',
    conteudo: '',
    imagemDestaque: '',
    imagemArquivo: null,
    status: 'Rascunho',
    destaque: false,
    tagId: null,
  });

  // referência para o textarea do conteúdo (usado no modo 'simples' para inserir tags e br)
  const conteudoRef = useRef<HTMLTextAreaElement | null>(null);
  // editorRef para contentEditable (modo simples)
  const editorRef = useRef<HTMLDivElement | null>(null);
  // salva a seleção (Range) antes de abrir o modal para restaurar depois
  const savedSelectionRef = useRef<Range | null>(null);
  // markers ref to store inserted marker ids
  const savedMarkersRef = useRef<{ startId: string; endId: string } | null>(null);
  // guarda o HTML original (se existir) para poder restaurar quando alternar para modo rico
  const originalHtmlRef = useRef<string | null>(null);

  // utilitários de conversão
  const htmlToPlain = (html?: string | null) => {
    if (!html) return '';
    let s = String(html);
    // transformar <br> em quebra de linha
    s = s.replace(/<br\s*\/?>(\s*)/gi, '\n');
    // transformar finais de blocos em quebra de linha
    s = s.replace(/<\/(p|div|h[1-6]|li|ul|ol)>/gi, '\n');
    // remover todas as tags restantes
    s = s.replace(/<[^>]+>/g, '');
    // decodificar entidades HTML
    if (typeof document !== 'undefined') {
      const txt = document.createElement('textarea');
      txt.innerHTML = s;
      s = txt.value;
    }
    // Normalizar múltiplas quebras em no máximo duas
    s = s.replace(/\n\s*\n+/g, '\n\n');
    return s;
  };

  const plainToHtml = (plain?: string | null) => {
    if (!plain) return '';
    // normalizar quebras e converter em <br/>
    const p = String(plain).replace(/\r\n/g, '\n');
    // duplas quebras podem indicar parágrafos — transformar em </p><p>
    const withParagraphs = p.replace(/\n\n+/g, '</p><p>');
    // envolver em <p> se houver paragrafos e retornar
    return '<p>' + withParagraphs.replace(/\n/g, '<br/>') + '</p>';
  };

  const [tags, setTags] = useState<Tag[]>([]);
  // Link modal state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInitialUrl, setLinkInitialUrl] = useState<string>('');
  const [linkInitialText, setLinkInitialText] = useState<string>('');
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [erroCarregandoTags, setErroCarregandoTags] = useState<string | null>(null);

  useEffect(() => {
    const carregarTags = async () => {
      try {
        setIsLoadingTags(true);
        setErroCarregandoTags(null);
        const response = await tagService.listarPublico({ nome: undefined, pagina: 1, itensPorPagina: 1000 });
        const mapped = (response.tags || []).map(t => ({ id: t.id, nome: t.nome, ativo: true, dataCriacao: '' }));
        const tagsOrdenadas = [...mapped].sort((a, b) => a.nome.localeCompare(b.nome));
        setTags(tagsOrdenadas);
      } catch (error) {
        const mensagem = handleApiError(error);
        setErroCarregandoTags(mensagem);
      } finally {
        setIsLoadingTags(false);
      }
    };

    carregarTags();
  }, []);

  useEffect(() => {
    if (initialData) {
      // se o conteúdo inicial tiver tags HTML, armazena o HTML original e, se estivermos em modo simples,
      // converte para texto limpo (sem tags) antes de preencher o textarea
      const conteudoInicial = (initialData as Partial<NoticiaFormData>).conteudo as string | undefined;
      if (conteudoInicial && /<[^>]+>/g.test(conteudoInicial)) {
        originalHtmlRef.current = conteudoInicial;
        // preenche state.conteudo apenas se for modo rico; se for simples vamos setar o editor innerHTML
        if (tipoConteudo === 'simples') {
          setFormData(prev => ({ ...prev, ...initialData, conteudo: htmlToPlain(conteudoInicial) }));
          // set editor HTML on next tick
          requestAnimationFrame(() => {
            if (editorRef.current) editorRef.current.innerHTML = DOMPurify.sanitize(conteudoInicial);
          });
        } else {
          setFormData(prev => ({ ...prev, ...initialData, conteudo: conteudoInicial }));
        }
      } else {
        setFormData(prev => ({ ...prev, ...initialData }));
      }
    }
  }, [initialData, tipoConteudo]);

  // Quando o editor muda para o modo 'simples' ou 'rico', faz conversões apropriadas
  useEffect(() => {
    if (tipoConteudo === 'simples') {
      // colocar o HTML atual no editor (se tivermos originalHtmlRef use-o, senão converte o formData.conteudo)
      const toSet = originalHtmlRef.current ?? plainToHtml(formData.conteudo);
      requestAnimationFrame(() => {
        if (editorRef.current) editorRef.current.innerHTML = toSet || '';
      });
    } else {
      // modo rico: pegar innerHTML do editor e colocar em formData.conteudo (HTML bruto)
      const currHtml = editorRef.current ? editorRef.current.innerHTML : formData.conteudo;
      setFormData(prev => ({ ...prev, conteudo: currHtml || '' }));
      // atualizar originalHtmlRef com o html atual
      originalHtmlRef.current = currHtml || null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoConteudo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-gerar slug quando o título mudar
    if (name === 'titulo') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }


      // Criar preview usando FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
      };
      reader.readAsDataURL(file);

      // Atualizar estado imediatamente com o arquivo e preview
      setFormData(prev => ({
        ...prev,
        imagemArquivo: file,
        imagemDestaque: URL.createObjectURL(file),
      }));

    }
  };

  // Aplica formatação no editor contentEditable (modo simples)
  const applyFormat = (command: string, value?: string) => {
    try {
      // execCommand ainda funciona para operações básicas em contentEditable
      document.execCommand(command, false, value);
      // sincroniza conteúdo para state
      if (editorRef.current) {
        setFormData(prev => ({ ...prev, conteudo: editorRef.current!.innerHTML }));
      }
    } catch (err) {
      console.warn('format error', err);
    }
  };

  const handleInsertLink = () => {
    // abrir modal com preservação da seleção usando marcadores DOM
    const sel = window.getSelection();
    let selText = '';
    savedSelectionRef.current = null;
    savedMarkersRef.current = null;
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer) && !range.collapsed) {
        // create unique ids
        const uid = `m${Date.now()}${Math.floor(Math.random() * 10000)}`;
        const startId = `sel-start-${uid}`;
        const endId = `sel-end-${uid}`;
        const startMarker = document.createElement('span');
        const endMarker = document.createElement('span');
        startMarker.id = startId;
        endMarker.id = endId;
        // keep markers invisible
        startMarker.style.display = 'none';
        endMarker.style.display = 'none';

        // insert end marker first
        const endRange = range.cloneRange();
        endRange.collapse(false);
        endRange.insertNode(endMarker);
        // insert start marker
        const startRange = range.cloneRange();
        startRange.collapse(true);
        startRange.insertNode(startMarker);

        // save markers
        savedMarkersRef.current = { startId, endId };
        // also save a clone of range for fallback
        savedSelectionRef.current = range.cloneRange();
        selText = sel.toString();
      }
    }
    setLinkInitialText(selText);
    setLinkInitialUrl('https://');
    setIsLinkModalOpen(true);
  };

  const handleLinkConfirm = (url: string, text: string) => {
    if (!editorRef.current) { setIsLinkModalOpen(false); return; }

    // normalize url
    let finalUrl = url.trim();
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;

    editorRef.current.focus();

    const escapeHtml = (str: string) => {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    // If markers exist, use them to build range
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
          // remove markers
          startMarker.remove();
          endMarker.remove();
          // move caret after anchor
          const after = document.createRange();
          after.setStartAfter(a);
          after.collapse(true);
          const sel2 = window.getSelection();
          if (sel2) { sel2.removeAllRanges(); sel2.addRange(after); }
          if (editorRef.current) setFormData(prev => ({ ...prev, conteudo: editorRef.current!.innerHTML }));
        } else {
          // fallback if markers not found
          if (text && text.trim().length > 0) {
            applyFormat('insertHTML', `<a class="LinkNoticia" href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
          } else {
            applyFormat('insertHTML', `<a class="LinkNoticia" href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(finalUrl)}</a>`);
          }
        }
      } catch (error) {
        console.warn('insert link markers fallback', error);
        // final fallback
        applyFormat('createLink', finalUrl);
      }
      savedMarkersRef.current = null;
    } else {
      // no markers: simple insertion
      if (text && text.trim().length > 0) {
        applyFormat('insertHTML', `<a href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
      } else {
        applyFormat('insertHTML', `<a href="${escapeHtml(finalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(finalUrl)}</a>`);
      }
    }

    setIsLinkModalOpen(false);
  };

  // ensure markers are removed if modal closed
  const clearSavedMarkers = () => {
    if (savedMarkersRef.current && editorRef.current) {
      const { startId, endId } = savedMarkersRef.current;
      const s = document.getElementById(startId);
      const e = document.getElementById(endId);
      if (s) s.remove();
      if (e) e.remove();
    }
    savedMarkersRef.current = null;
    savedSelectionRef.current = null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[NoticiaForm] handleSubmit - Estado atual:', {
      titulo: formData.titulo,
      autor: formData.autor,
      imagemArquivo: formData.imagemArquivo ? `${formData.imagemArquivo.name} (${formData.imagemArquivo.size} bytes)` : 'null',
      imagemDestaque: formData.imagemDestaque || 'vazio',
    });

    // Validações do frontend (espelham validações do backend)
    const erros: string[] = [];

    // Título: obrigatório, mínimo 3 caracteres
    if (!formData.titulo || formData.titulo.trim().length < 3) {
      erros.push('Título é obrigatório e deve ter no mínimo 3 caracteres.');
    }

    // Conteúdo: obrigatório, mínimo 10 caracteres
    const conteudoTextLength = tipoConteudo === 'simples' ? (editorRef.current?.textContent || '').trim().length : (formData.conteudo || '').trim().length;
    if (!conteudoTextLength || conteudoTextLength < 10) {
      erros.push('Conteúdo é obrigatório e deve ter no mínimo 10 caracteres.');
    }

    // Imagem de capa: opcional, mas se fornecida deve ser URL válida
    // Aceita: http://, https:// ou blob: (para uploads locais)
    if (formData.imagemDestaque && formData.imagemDestaque.trim() !== '') {
      const urlPattern = /^(https?:\/\/|blob:).+/i;
      if (!urlPattern.test(formData.imagemDestaque)) {
        erros.push('A URL da imagem de capa deve ser uma URL válida (http:// ou https://)');
      }
    }

    if (erros.length > 0) {
      setErrosValidacao(erros);
      return;
    }

    setErrosValidacao([]);

    // Converter conteúdo para HTML quando estiver no modo 'simples'
    let conteudoParaEnviar: string;
    if (tipoConteudo === 'simples') {
      // pegar o HTML gerado pelo editor (contentEditable)
      conteudoParaEnviar = editorRef.current ? DOMPurify.sanitize(editorRef.current.innerHTML) : (formData.conteudo || '');
    } else {
      conteudoParaEnviar = DOMPurify.sanitize(formData.conteudo || '');
    }

    console.log('[NoticiaForm] Chamando onSubmit com dados:', {
      ...formData,
      conteudo: formData.imagemArquivo ? `File(${formData.imagemArquivo.name})` : 'null',
      // mostrar tamanho do conteudo enviado para debug
      conteudoParaEnviarPreview: conteudoParaEnviar.substring(0, 200) + (conteudoParaEnviar.length > 200 ? '...' : ''),
    });

    await onSubmit({ ...formData, conteudo: conteudoParaEnviar });
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erros de Validação */}
      {errosValidacao.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-900">Por favor, corrija os seguintes erros:</p>
              <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                {errosValidacao.map((erro, index) => (
                  <li key={index}>{erro}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Card Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
            Título da Notícia <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            minLength={3}
            value={formData.titulo}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
            placeholder="Digite o título da notícia"
          />
          <p className="mt-1 text-sm text-gray-500">
            Mínimo de 3 caracteres. ({formData.titulo.length}/3+)
          </p>
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL) <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent bg-gray-50"
            placeholder="slug-da-noticia"
          />
          <p className="mt-1 text-sm text-gray-500">
            URL: /noticias/{formData.slug || 'slug-da-noticia'}
          </p>
        </div>

        {/* Autor */}
        <div>
          <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-2">
            Autor <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="autor"
            name="autor"
            required
            value={formData.autor}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
            placeholder="Nome do autor"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tag <span className="text-red-600">*</span>
          </label>
          {isLoadingTags ? (
            <p className="text-sm text-gray-500">Carregando tags...</p>
          ) : erroCarregandoTags ? (
            <p className="text-sm text-red-600">{erroCarregandoTags}</p>
          ) : tags.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma tag disponível</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`tag-${tag.id}`}
                    name="tagId"
                    value={tag.id.toString()}
                    checked={formData.tagId === tag.id}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        tagId: parseInt(e.target.value),
                      }));
                    }}
                    className="w-4 h-4 text-[#195CE3] border-gray-300 focus:ring-[#195CE3] cursor-pointer"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                    {tag.nome}
                  </label>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Selecione a tag que melhor descreve o conteúdo da notícia.
          </p>
        </div>

        {/* Upload de Imagem ou URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagem de Capa <span className="text-gray-400">(opcional)</span>
          </label>

          {/* Opção de URL */}
          <div className="mb-4">
            <label htmlFor="imagemUrl" className="block text-xs font-medium text-gray-600 mb-1">
              URL da Imagem (http:// ou https://)
            </label>
            <input
              type="url"
              id="imagemUrl"
              name="imagemDestaque"
              value={formData.imagemDestaque}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {/* OU Upload de arquivo */}
          <div className="relative">
            <p className="text-xs text-gray-500 mb-2 text-center">— ou faça upload de um arquivo —</p>
            <input
              type="file"
              id="imagemArquivo"
              name="imagemArquivo"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#195CE3] transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-[#195CE3] hover:text-[#0C2856]">Clique para selecionar</span> ou arraste e solte
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF até 5MB
              </p>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB{initialData ? '. Deixe em branco para manter a imagem atual.' : ''}
          </p>

          {formData.imagemDestaque && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Preview:</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imagemArquivo: null, imagemDestaque: '' }))}
                  className="text-sm cursor-pointer text-red-600 hover:text-red-700 font-medium"
                >
                  Remover imagem
                </button>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.imagemDestaque}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Imagem+Inválida';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div>
          <label htmlFor="resumo" className="block text-sm font-medium text-gray-700 mb-2">
            Resumo <span className="text-gray-400">(opcional)</span>
          </label>
          <textarea
            id="resumo"
            name="resumo"
            rows={3}
            value={formData.resumo}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
            placeholder="Breve resumo da notícia (aparecerá nas listagens)"
          />
        </div>

        {/* Conteúdo */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700">
              Conteúdo <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTipoConteudo('simples')}
                className={`px-3 cursor-pointer py-1 text-sm rounded-md transition-colors ${
                  tipoConteudo === 'simples'
                    ? 'bg-[#0C2856] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Conteúdo Simples
              </button>
              <button
                type="button"
                onClick={() => setTipoConteudo('rico')}
                className={`px-3 cursor-pointer py-1 text-sm rounded-md transition-colors ${
                  tipoConteudo === 'rico'
                    ? 'bg-[#0C2856] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Conteúdo Rico (HTML)
              </button>
            </div>
          </div>

          {/* Toolbar para modo simples */}
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

          {/* Editor: contentEditable para modo simples; textarea para modo rico (HTML) */}
          {tipoConteudo === 'simples' ? (
            <div
              ref={editorRef}
              contentEditable
              role="textbox"
              aria-multiline
              suppressContentEditableWarning
              onInput={() => {
                if (editorRef.current) setFormData(prev => ({ ...prev, conteudo: editorRef.current!.innerHTML }));
              }}
              className="editor-content min-h-60 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent bg-white"
            />
          ) : (
            <textarea
              id="conteudo"
              name="conteudo"
              required
              rows={15}
              ref={conteudoRef}
              value={formData.conteudo}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent font-mono text-sm`}
              placeholder="<p>Conteúdo da notícia em HTML...</p>"
            />
          )}
           <p className="mt-1 text-sm text-gray-500">
            {tipoConteudo === 'simples' ? (
              'Modo texto simples: aplique formatação pela barra (negrito, itálico, título, lista, link).'
            ) : (
              'Modo HTML: edite o HTML diretamente: <p>, <h3>, <ul>, <li>, <strong>, <em>, etc.'
            )}
            {' '}Mínimo de 10 caracteres. {(tipoConteudo === 'simples' ? (editorRef.current?.textContent || '').length : formData.conteudo.length)}/10+
           </p>
         </div>

        {/* Destaque */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="destaque"
            name="destaque"
            checked={formData.destaque}
            onChange={(e) => setFormData(prev => ({ ...prev, destaque: e.target.checked }))}
            className="w-5 h-5 text-[#195CE3] border-gray-300 rounded focus:ring-[#195CE3] cursor-pointer"
          />
          <label htmlFor="destaque" className="text-sm font-medium text-gray-700 cursor-pointer">
            Marcar como destaque
          </label>
          <span className="text-xs text-gray-500">
            (Notícias em destaque aparecem na página inicial)
          </span>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-600">*</span>
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
          >
            <option value="Rascunho">Rascunho</option>
            <option value="Publicada">Publicada</option>
            <option value="Arquivada">Arquivada</option>
          </select>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/noticias')}
          className="px-6 py-3 border cursor-pointer border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#0C2856] cursor-pointer text-white rounded-lg font-semibold hover:bg-[#195CE3] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
              Salvando...
            </span>
          ) : (
            initialData ? 'Atualizar Notícia' : 'Salvar Notícia'
          )}
        </button>
      </div>

    </form>
    <LinkModal
      isOpen={isLinkModalOpen}
      initialUrl={linkInitialUrl}
      initialText={linkInitialText}
      onConfirm={handleLinkConfirm}
      onClose={() => { clearSavedMarkers(); setIsLinkModalOpen(false); }}
    />
    </>
  );
};
