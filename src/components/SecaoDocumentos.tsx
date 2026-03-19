import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type DocumentoItem = {
  id?: string | number;
  titulo: string;
  capa: string;
  arquivo: string;
};

type SecaoDocumentosProps = {
  documentos: DocumentoItem[];
};

export const SecaoDocumentos: React.FC<SecaoDocumentosProps> = ({ documentos }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Detectar tamanho da tela
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validDocumentos = useMemo(() => Array.isArray(documentos) ? documentos : [], [documentos]);
  const count = validDocumentos.length;
  const itemsPerView = isMobile ? 1 : 4;
  const gap = 16;
  const slideCount = Math.ceil(count / itemsPerView);

  const loadedRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    validDocumentos.forEach((d, i) => {
      if (d?.capa && !loadedRef.current.has(i)) {
        const img = new Image();
        img.onload = () => loadedRef.current.add(i);
        img.onerror = () => loadedRef.current.add(i);
        img.src = d.capa;
      }
    });
  }, [validDocumentos]);

  const goTo = useCallback((i: number) => {
    if (slideCount === 0) return;
    const target = ((i % slideCount) + slideCount) % slideCount;
    setIndex(target);
  }, [slideCount]);

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (slideCount <= 1) return;
    timerRef.current = window.setInterval(() => goTo(index + 1), 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slideCount, goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, index]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = viewportRef.current?.clientWidth ?? 0;
      setViewportWidth(w);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cardWidth = isMobile
      ? viewportWidth
      : (viewportWidth ? Math.max(0, (viewportWidth - gap * (itemsPerView - 1)) / itemsPerView) : 0);

  const slideWidth = isMobile
      ? viewportWidth
      : (cardWidth ? (itemsPerView * cardWidth + gap * (itemsPerView - 1)) : viewportWidth);

  if (!count) {
    return (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-gray-700">Não há documentos</p>
          </div>
        </section>
    );
  }

  return (
      <section className="py-12" aria-roledescription="carousel">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-[#0C2856] mb-4">Documentos e Relatórios</h2>
            <p className="text-lg text-gray-700">
              Confira relatórios, documentos de referência e arquivos técnicos que guiam a atuação da SECTI com o ecossistema local de tecnologia, inovação e produtividade.
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto px-8 md:px-0">
            <div className="overflow-hidden w-full py-12" ref={viewportRef}>
              <div
                  className={`flex z-20 transition-transform duration-1000 ease-in-out ${isMobile ? 'gap-0' : 'gap-4'}`}
                  style={{ transform: `translateX(-${index * slideWidth}px)` }}
              >
                {validDocumentos.map((doc, idx) => (
                    <a
                        key={doc.id ?? idx}
                        href={doc.arquivo}
                        download
                        className="block relative z-10 transform-gpu will-change-transform transition-transform duration-200 hover:scale-110 hover:z-50 bg-white rounded-lg shadow-md overflow-hidden shrink-0 w-full"
                        style={{
                          minWidth: cardWidth ? `${cardWidth}px` : undefined,
                          maxWidth: cardWidth ? `${cardWidth}px` : undefined,
                          flex: cardWidth ? `0 0 ${cardWidth}px` : undefined,
                        }}
                    >
                      <img
                          src={doc.capa}
                          alt={`Capa do documento ${doc.titulo}`}
                          className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-[#0C2856] text-center">{doc.titulo}</h3>
                      </div>
                    </a>
                ))}
              </div>
            </div>

            {slideCount > 1 && (
                <>
                  <button
                      onClick={prev}
                      aria-label="Anterior"
                      className="absolute cursor-pointer left-0 md:-left-12 top-1/2 -translate-y-1/2 z-40 p-2 transition duration-200 hover:scale-110 text-white rounded-full bg-black/30 hover:bg-black/50"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                      onClick={next}
                      aria-label="Próximo"
                      className="absolute cursor-pointer right-0 md:-right-12 top-1/2 -translate-y-1/2 z-40 p-2 transition duration-200 hover:scale-110 text-white rounded-full bg-black/30 hover:bg-black/50"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-6 z-40 flex gap-2">
                    {Array.from({ length: slideCount }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Ir para slide ${i + 1}`}
                            className={`w-3 h-3 cursor-pointer rounded-full transition-all ${i === index ? 'bg-[#0C2856] scale-125' : 'bg-gray-400'}`}
                        />
                    ))}
                  </div>
                </>)}
          </div>
        </div>
      </section>);
};
