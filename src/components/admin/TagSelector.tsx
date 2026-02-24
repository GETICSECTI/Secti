import { useState, useEffect } from 'react';
import { tagService, type Tag } from '../../services/tagService';
import { handleApiError } from '../../utils/errorHandler';

interface TagSelectorProps {
  value: number | null;
  onChange: (tagId: number | null) => void;
  required?: boolean;
  label?: string;
}

export const TagSelector = ({
  value,
  onChange,
  required = false,
  label = 'Tag',
}: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tagService.listar({
          apenasAtivas: true,
          pagina: 1,
          itensPorPagina: 1000,
        });
        const tagsOrdenadas = [...response.itens].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setTags(tagsOrdenadas);
      } catch (err) {
        const mensagem = handleApiError(err);
        setError(mensagem);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando tags...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : tags.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma tag disponível</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center">
              <input
                type="radio"
                id={`tag-${tag.id}`}
                name="tag"
                value={tag.id.toString()}
                checked={value === tag.id}
                onChange={() => onChange(tag.id)}
                className="w-4 h-4 text-[#195CE3] border-gray-300 focus:ring-[#195CE3] cursor-pointer"
              />
              <label
                htmlFor={`tag-${tag.id}`}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {tag.nome}
              </label>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500">
        Selecione a tag que melhor descreve este item.
      </p>
    </div>
  );
};

