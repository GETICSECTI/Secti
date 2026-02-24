import React from 'react';
import { Link } from 'react-router-dom';

export type NoticiaItem = {
  id?: string | number;
  slug: string;
  titulo: string;
  categoria?: string;
  autor?: string;
  data?: string;
  resumo?: string;
  imagem: string;
  link: string;
  tags?: Array<{
    id: number;
    nome: string;
  }>;
};

type SecaoNoticiasProps = {
  noticiaDestaque: NoticiaItem;
  noticias: NoticiaItem[]; // máximo 3
};

export const SecaoNoticias: React.FC<SecaoNoticiasProps> = ({ noticiaDestaque, noticias }) => {
  return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da seção */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0C2856] mb-2">Notícias</h2>
              <div className="h-1 w-20 bg-[#195CE3]"></div>
            </div>
            <Link to="/noticias" className="text-[#195CE3] hover:text-[#0C2856] font-medium transition duration-200">
              Ver todas as notícias →
            </Link>
          </div>

          {/* Notícia Destaque */}
          <div className="mb-8 bg-white md:bg-transparent md:shadow-none rounded-2xl shadow-md overflow-hidden">
            <a href={noticiaDestaque.link} className="block">
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1 gap-0">
                {/* Imagem à esquerda */}
                <div className="h-64 md:max-h-200">
                  <img
                      src={noticiaDestaque.imagem}
                      alt={noticiaDestaque.titulo}
                      className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Conteúdo à direita */}
                <div className="p-6 flex flex-col justify-center md:h-full">
                  {noticiaDestaque.tags && noticiaDestaque.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {noticiaDestaque.tags.map((tag) => (
                        <span key={tag.id} className="inline-block text-xs font-semibold text-[#195CE3] uppercase bg-blue-50 px-2 py-1 rounded mb-2">
                          {tag.nome}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-[#0C2856] mb-3 hover:text-[#195CE3] transition duration-200">
                    {noticiaDestaque.titulo}
                  </h3>
                  {(noticiaDestaque.autor || noticiaDestaque.data) && (
                      <p className="text-sm text-gray-600 mb-3">
                        {noticiaDestaque.autor && <>Por <span className="font-medium">{noticiaDestaque.autor}</span></>}
                        {noticiaDestaque.autor && noticiaDestaque.data && <> • </>}
                        {noticiaDestaque.data && <span>{noticiaDestaque.data}</span>}
                      </p>
                  )}
                  {noticiaDestaque.resumo && (
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {noticiaDestaque.resumo}
                      </p>
                  )}
                  <span className="inline-block text-[#0C2856] hover:text-[#195CE3] font-medium transition duration-200">
                  Leia mais →
                </span>
                </div>
              </div>
            </a>
          </div>

          {/* Três notícias menores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {noticias.slice(0, 3).map((noticia) => (
                <div key={noticia.id ?? noticia.titulo} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                  <a href={noticia.link} className="block">
                    <div className="h-48">
                      <img
                          src={noticia.imagem}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      {noticia.tags && noticia.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {noticia.tags.map((tag) => (
                            <span key={tag.id} className="inline-block text-xs font-semibold text-[#195CE3] uppercase bg-blue-50 px-2 py-1 rounded mb-2">
                              {tag.nome}
                            </span>
                          ))}
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-gray-900 hover:text-[#195CE3] transition duration-200 mb-2">
                        {noticia.titulo}
                      </h4>
                      {noticia.data && (
                          <p className="text-xs text-gray-500">{noticia.data}</p>
                      )}
                    </div>
                  </a>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};
