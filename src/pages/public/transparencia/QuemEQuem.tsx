import { PublicLayout } from '../../../layouts/PublicLayout.tsx';
import { HeroSection } from '../../../components/HeroSection.tsx';
import { useSEO } from '../../../utils/useSEO.ts';
import { useState } from 'react';

interface Pessoa {
  nome: string;
  cargo: string;
  diretoria: string;
  telefone?: string;
  email?: string;
  tipo: 'secretario' | 'secretario-executivo' | 'diretor' | 'gerente';
  /** Rótulo exibido no badge do card. Se omitido, usa o padrão do tipo. */
  labelBadge?: string;
}

const equipe: Pessoa[] = [
  // Secretária
  {
    nome: 'Mauricélia Vidal Montenegro',
    cargo: 'Secretária de Ciência, Tecnologia e Inovação',
    diretoria: 'Gabinete da Secretária',
    telefone: '(81) 3183-5550',
    email: 'mauricelia.montenegro@secti.pe.gov.br',
    tipo: 'secretario',
    labelBadge: 'Secretária',
  },

  // Secretários Executivos
  {
    nome: 'Kenys Bonatti Maziero',
    cargo: 'Secretário Executivo de Ciência, Tecnologia e Inovação',
    diretoria: 'Gabinete da Secretária',
    telefone: '(81) 3183-5550',
    email: 'kenys.bonatti@secti.pe.gov.br',
    tipo: 'secretario-executivo',
    labelBadge: 'Secretário Executivo',
  },
  {
    nome: 'Teresa Maria de Medeiros Maciel',
    cargo: 'Secretária Executiva de Ciência, Tecnologia e Inovação',
    diretoria: 'Gabinete da Secretária',
    telefone: '(81) 3183-5550',
    email: 'teresa.maciel@secti.pe.gov.br',
    tipo: 'secretario-executivo',
    labelBadge: 'Secretária Executiva',
  },

  // Diretores
  {
    nome: 'Obionor Nóbrega',
    cargo: 'Diretor de Avanço Tecnológico',
    diretoria: 'Diretoria de Avanço Tecnológico',
    telefone: '(81) 3183-5550',
    email: 'obionor.nobrega@secti.pe.gov.br',
    tipo: 'diretor',
  },
  {
    nome: 'César Augusto Souza de Andrade',
    cargo: 'Diretor de Inovação',
    diretoria: 'Diretoria de Inovação',
    telefone: '(81) 3183-5550',
    email: 'cesar.souza@secti.pe.gov.br',
    tipo: 'diretor',
  },
  {
    nome: 'Marília Mesquita de Amorim Figueiredo',
    cargo: 'Diretora de Formação Tecnológica',
    diretoria: 'Diretoria de Formação Tecnológica',
    telefone: '(81) 3183-5550',
    email: 'marilia.mesquita@secti.pe.gov.br',
    tipo: 'diretor',
  },
  {
      nome: 'Diogo Lopes de Oliveira',
      cargo: 'Diretor de Sensibilização e Difusão Científica',
      diretoria: 'Diretoria de Sensibilização e Difusão Científica',
      telefone: '(81) 3183-5550',
      email: 'diogo.lopes@secti.pe.gov.br',
      tipo: 'diretor',
  },

  // Gerentes
  {
    nome: 'Noemia Carneiro de Araújo Resende',
    cargo: 'Gerente Especial de Controle Interno',
    diretoria: 'Gerência Especial de Controle Interno',
    telefone: '(81) 3183-5550',
    email: 'noemia.resende@secti.pe.gov.br',
    tipo: 'gerente',
  },
  {
    nome: 'Rosângela Maria Gonçalves Guerra',
    cargo: 'Gerente de Gestão Financeira e Orçamentária',
    diretoria: 'Gerência de Gestão Financeira e Orçamentária',
    telefone: '(81) 3183-5550',
    email: 'rosangela.guerra@secti.pe.gov.br',
    tipo: 'gerente',
  },
  {
    nome: 'Lorena Ferreira de Araújo',
    cargo: 'Gerente Geral de Apoio Técnico e Jurídico',
    diretoria: 'Gerência Geral de Apoio Técnico e Jurídico',
    telefone: '(81) 3183-5550',
    email: 'lorena.faraujo@secti.pe.gov.br',
    tipo: 'gerente',
  },
  {
    nome: 'Jéssica Paloma Lima de Santana',
    cargo: 'Gerente de Comunicação',
    diretoria: 'Gerência de Comunicação',
    telefone: '(81) 3183-5550',
    email: 'jessica.lima@secti.pe.gov.br',
    tipo: 'gerente',
  },
  {
      nome: 'Eduardo de Oliveira Cardoso',
      cargo: 'Gerente de Tecnologia da Informação e Comunicação',
      diretoria: 'Gerência de Tecnologia da Informação e Comunicação',
      telefone: '(81) 3183-5550',
      email: 'eduardo.ocardoso@secti.pe.gov.br',
      tipo: 'gerente',
  },
  {
      nome: 'Felipe Guerra Lago',
      cargo: 'Gerente Administrativo',
      diretoria: 'Gerência Administrativa',
      telefone: '(81) 3183-5550',
      email: 'felipe.guerra@secti.pe.gov.br',
      tipo: 'gerente',
  },
];

const tipoBadge: Record<Pessoa['tipo'], { label: string; classes: string; iconPath: string }> = {
  secretario: {
    label: 'Secretário(a)',
    classes: 'bg-[#0C2856] text-white',
    iconPath:
      'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5zm0-7l-9-5 9-5 9 5-9 5z',
  },
  'secretario-executivo': {
    label: 'Secretário Executivo',
    classes: 'bg-[#0C2856] text-white',
    iconPath:
      'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5zm0-7l-9-5 9-5 9 5-9 5z',
  },
  diretor: {
    label: 'Diretor(a)',
    classes: 'bg-[#195CE3] text-white',
    iconPath:
      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
  },
  gerente: {
    label: 'Gerente',
    classes: 'bg-sky-500 text-white',
    iconPath:
      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
};

type Filtro = 'todos' | Pessoa['tipo'];

const filtros: { label: string; value: Filtro }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Secretário(a)', value: 'secretario' },
  { label: 'Secretário Executivo', value: 'secretario-executivo' },
  { label: 'Diretores', value: 'diretor' },
  { label: 'Gerentes', value: 'gerente' },
];

const Avatar = ({ nome, tipo }: { nome: string; tipo: Pessoa['tipo'] }) => {
  const initials = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const bgColor =
    tipo === 'secretario' || tipo === 'secretario-executivo'
      ? 'bg-[#0C2856]'
      : tipo === 'diretor'
      ? 'bg-[#195CE3]'
      : 'bg-sky-500';

  return (
    <div
      className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0`}
    >
      {initials === 'AI' ? (
        <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ) : (
        initials
      )}
    </div>
  );
};

export const QuemEQuem = () => {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [busca, setBusca] = useState('');

  useSEO({
    title: 'Quem é Quem',
    description:
      'Conheça os gestores da SECTI-PE: secretária, diretores e gerentes com nome, cargo, diretoria, telefone e e-mail.',
    canonical: 'https://secti.pe.gov.br/transparencia/quem-e-quem',
    keywords: 'Quem é Quem, SECTI, gestores, diretores, gerentes, secretária, Pernambuco',
  });

  const pessoasFiltradas = equipe.filter((p) => {
    const matchFiltro = filtro === 'todos' || p.tipo === filtro;
    const termo = busca.toLowerCase();
    const matchBusca =
      !busca ||
      p.nome.toLowerCase().includes(termo) ||
      p.cargo.toLowerCase().includes(termo) ||
      p.diretoria.toLowerCase().includes(termo);
    return matchFiltro && matchBusca;
  });

  const porNome = (a: Pessoa, b: Pessoa) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });

  // Group by tipo for display order (alfabético dentro de cada grupo)
  const secretarios = pessoasFiltradas.filter((p) => p.tipo === 'secretario').sort(porNome);
  const secretariosExecutivos = pessoasFiltradas.filter((p) => p.tipo === 'secretario-executivo').sort(porNome);
  const diretores = pessoasFiltradas.filter((p) => p.tipo === 'diretor').sort(porNome);
  const gerentes = pessoasFiltradas.filter((p) => p.tipo === 'gerente').sort(porNome);

  const renderCard = (pessoa: Pessoa) => {
    const badge = tipoBadge[pessoa.tipo];
    return (
      <div
        key={`${pessoa.nome}-${pessoa.cargo}`}
        className="bg-white rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group"
      >
        {/* Top accent bar */}
        <div
          className={`h-1.5 w-full ${
            pessoa.tipo === 'secretario' || pessoa.tipo === 'secretario-executivo'
              ? 'bg-[#0C2856]'
              : pessoa.tipo === 'diretor'
              ? 'bg-[#195CE3]'
              : 'bg-sky-500'
          }`}
        />

        <div className="p-6">
          {/* Header: Avatar + Nome + Cargo */}
          <div className="flex items-start gap-4 mb-5">
            <Avatar nome={pessoa.nome} tipo={pessoa.tipo} />
            <div className="min-w-0">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${badge.classes}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.iconPath} />
                </svg>
                {pessoa.labelBadge ?? badge.label}
              </span>
              <h3 className="text-base font-bold text-[#0C2856] leading-snug">{pessoa.nome}</h3>
              <p className="text-sm text-[#195CE3] font-medium mt-0.5 leading-snug">{pessoa.cargo}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-4" />

          {/* Diretoria */}
          <div className="flex items-start gap-2 mb-3">
            <svg
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-sm text-gray-700 leading-snug">{pessoa.diretoria}</span>
          </div>

          {/* Telefone */}
          {pessoa.telefone && (
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                href={`tel:${pessoa.telefone.replace(/\D/g, '')}`}
                className="text-sm text-gray-700 hover:text-[#195CE3] transition-colors"
              >
                {pessoa.telefone}
              </a>
            </div>
          )}

          {/* Email */}
          {pessoa.email && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href={`mailto:${pessoa.email}`}
                className="text-sm text-gray-700 hover:text-[#195CE3] transition-colors truncate"
              >
                {pessoa.email}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <PublicLayout>
      <HeroSection title="Quem é Quem" subtitle="Conheça os gestores da SECTI-PE" />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">

            {/* Intro */}
            <div className="mb-10 text-center">
              <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                Transparência na gestão pública. Conheça os responsáveis pela condução das políticas de ciência,
                tecnologia e inovação do Estado de Pernambuco.
              </p>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Busca */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por nome, cargo ou diretoria..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#195CE3] focus:border-transparent bg-white"
                />
              </div>

              {/* Filtro de tipo */}
              <div className="flex gap-2 flex-wrap">
                {filtros.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFiltro(f.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      filtro === f.value
                        ? 'bg-[#0C2856]  text-white border-[#0C2856]'
                        : 'bg-white cursor-pointer text-gray-700 border-gray-300 hover:border-[#195CE3] hover:text-[#195CE3]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nenhum resultado */}
            {pessoasFiltradas.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Nenhum resultado encontrado</p>
                <p className="text-sm mt-1">Tente ajustar os filtros ou o termo de busca.</p>
              </div>
            )}

            {/* Secretária */}
            {secretarios.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-[#0C2856] rounded-full" />
                  <h2 className="text-2xl font-bold text-[#0C2856]">Secretário(a)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secretarios.map(renderCard)}
                </div>
              </div>
            )}

            {/* Secretários Executivos */}
            {secretariosExecutivos.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-[#0C2856] rounded-full" />
                  <h2 className="text-2xl font-bold text-[#0C2856]">Secretários Executivos</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secretariosExecutivos.map(renderCard)}
                </div>
              </div>
            )}

            {/* Diretores */}
            {diretores.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-[#195CE3] rounded-full" />
                  <h2 className="text-2xl font-bold text-[#0C2856]">Diretores</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {diretores.map(renderCard)}
                </div>
              </div>
            )}

            {/* Gerentes */}
            {gerentes.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-sky-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-[#0C2856]">Gerentes</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gerentes.map(renderCard)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

