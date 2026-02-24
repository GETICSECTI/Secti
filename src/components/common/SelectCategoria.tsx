import { useState, useEffect } from 'react';
import { tagService } from '../../services/tagService';
import type { Tag } from '../../services/tagService';

interface SelectCategoriaProps {
  value: string;
  onChange: (value: string) => void;
  valueType?: 'id' | 'name';
  required?: boolean;
  className?: string;
  id?: string;
}

export const SelectCategoria = ({
  value,
  onChange,
  valueType = 'name',
  required = false,
  id,
}: SelectCategoriaProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.listar({ apenasAtivas: true });
        setTags(response.itens);
      } catch (err) {
        console.error('Erro ao carregar tags:', err);
        setError('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading) {
    return (
      <select id={id} disabled className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent">
        <option>Carregando categorias...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select id={id} disabled className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent">
        <option>{error}</option>
      </select>
    );
  }

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent"
      required={required}
    >
      <option value="">Selecione uma categoria</option>
      {tags.map((tag) => (
        <option key={tag.id} value={valueType === 'id' ? tag.id.toString() : tag.nome}>
          {tag.nome}
        </option>
      ))}
    </select>
  );
};
