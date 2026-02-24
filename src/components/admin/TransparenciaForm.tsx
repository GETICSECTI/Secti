import { useState, useEffect } from 'react';

interface TransparenciaFormData {
  titulo: string;
  url: string;
  descricao: string;
  ordem: number;
}

interface TransparenciaFormProps {
  initialData?: Partial<TransparenciaFormData>;
  onSubmit: (data: TransparenciaFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const TransparenciaForm = ({ initialData, onSubmit, isSubmitting }: TransparenciaFormProps) => {
  const [formData, setFormData] = useState<TransparenciaFormData>({
    titulo: '',
    url: '',
    descricao: '',
    ordem: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData })); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ordem' ? (value === '' ? 0 : Number(value)) : value,
    }));
    // Limpar erro do campo ao editar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (formData.titulo.trim().length < 3) {
      newErrors.titulo = 'Título deve ter no mínimo 3 caracteres';
    } else if (formData.titulo.trim().length > 100) {
      newErrors.titulo = 'Título deve ter no máximo 100 caracteres';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL é obrigatória';
    } else if (formData.url.trim().length > 500) {
      newErrors.url = 'URL deve ter no máximo 500 caracteres';
    }

    if (formData.descricao && formData.descricao.length > 200) {
      newErrors.descricao = 'Descrição deve ter no máximo 200 caracteres';
    }

    if (formData.ordem < 0 || formData.ordem > 9999) {
      newErrors.ordem = 'Ordem deve estar entre 0 e 9999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      titulo: formData.titulo.trim(),
      url: formData.url.trim(),
      descricao: formData.descricao.trim() || '',
      ordem: formData.ordem,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent ${
            errors.titulo ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ex: Relatório de Gestão Fiscal"
          maxLength={100}
        />
        {errors.titulo && (
          <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.titulo.length}/100 caracteres
        </p>
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent ${
            errors.url ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ex: https://transparencia.pe.gov.br/relatorio-fiscal"
          maxLength={500}
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.url.length}/500 caracteres
        </p>
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
          onChange={handleChange}
          rows={3}
          className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent ${
            errors.descricao ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Descrição opcional do item..."
          maxLength={200}
        />
        {errors.descricao && (
          <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.descricao.length}/200 caracteres
        </p>
      </div>

      {/* Ordem */}
      <div>
        <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-2">
          Ordem de Exibição
        </label>
        <input
          type="number"
          id="ordem"
          name="ordem"
          value={formData.ordem}
          onChange={handleChange}
          min={0}
          max={9999}
          className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent ${
            errors.ordem ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="0"
        />
        {errors.ordem && (
          <p className="mt-1 text-sm text-red-600">{errors.ordem}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Define a ordem de exibição no menu (quanto menor, mais acima)
        </p>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 cursor-pointer sm:flex-none px-6 py-2 bg-[#0C2856] text-white font-medium rounded-md hover:bg-[#195CE3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
