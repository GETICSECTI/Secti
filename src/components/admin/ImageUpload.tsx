import type { ReactNode } from 'react';

interface ImageUploadProps {
  label: string;
  description?: string;
  value: string | null;
  onUrlChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  preview: string | null;
  imageClassName?: string;
  optional?: boolean;
  disabled?: boolean;
  helpText?: ReactNode;
}

export const ImageUpload = ({
  label,
  description,
  value,
  onUrlChange,
  onFileChange,
  onRemove,
  preview,
  imageClassName = 'w-full h-64 object-cover',
  optional = true,
  disabled = false,
  helpText,
}: ImageUploadProps) => {
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

      onFileChange(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {!optional && <span className="text-red-600">*</span>}
        {description && <span className="text-gray-400 font-normal"> ({description})</span>}
      </label>

      {/* Opção de URL */}
      <div className="mb-4">
        <label htmlFor={`image-url-${label}`} className="block text-xs font-medium text-gray-600 mb-1">
          URL da Imagem (http:// ou https://)
        </label>
        <input
          type="url"
          id={`image-url-${label}`}
          value={value || ''}
          onChange={handleUrlChange}
          disabled={disabled}
          className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent disabled:bg-gray-100"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      {/* OU Upload de arquivo */}
      <div className="relative">
        <p className="text-xs text-gray-500 mb-2 text-center">— ou faça upload de um arquivo —</p>
        <input
          type="file"
          id={`image-file-${label}`}
          name={`image-file-${label}`}
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#195CE3] transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 disabled:cursor-not-allowed">
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
      {helpText ? (
        <div className="mt-1 text-sm text-gray-500">{helpText}</div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">
          Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
        </p>
      )}

      {/* Preview da Imagem */}
      {preview && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Preview:</span>
            <button
              type="button"
              onClick={onRemove}
              className="text-sm cursor-pointer text-red-600 hover:text-red-700 font-medium"
            >
              Remover imagem
            </button>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className={imageClassName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Imagem+Inválida';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

