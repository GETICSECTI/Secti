import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

export type SlideItem = {
  id?: string | number;
  image: string;
  title?: string;
  description?: string;
  button?: {
    text: string;
    href: string;
    target?: string;} | null;
};

type SecaoSlideProps = {
  slides: SlideItem[];
  autoplay?: boolean;
  interval?: number;
};

export const SecaoSlide: React.FC<SecaoSlideProps> = ({ slides, autoplay = true, interval = 6000 }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const indexRef = useRef(index);
  useEffect(() => { indexRef.current = index; }, [index]);

  const validSlides = useMemo(() => Array.isArray(slides) ? slides : [], [slides]);
  const count = validSlides.length;

  // Preload todas as imagens
  const loadedRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    validSlides.forEach((s, i) => {
      if (s?.image && !loadedRef.current.has(i)) {
        const img = new Image();
        img.onload = () => loadedRef.current.add(i);
        img.onerror = () => loadedRef.current.add(i);
        img.src = s.image;
      }
    });
  }, [validSlides]);

  const goTo = useCallback((i: number) => {
    if (count === 0) return;
    const target = ((i % count) + count) % count;
    setIndex(target);
  }, [count]);

  const next = () => goTo(indexRef.current + 1);
  const prev = () => goTo(indexRef.current - 1);

  // Autoplay
  useEffect(() => {
    if (!autoplay || count <= 1) return;
    timerRef.current = window.setInterval(() => {
      goTo(indexRef.current + 1);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, interval, goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(indexRef.current - 1);
      if (e.key === 'ArrowRight') goTo(indexRef.current + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  if (!count) return null;

  return (
      <section ref={containerRef} className="relative w-full h-[50dvh] overflow-hidden bg-black" aria-roledescription="carousel">
        {/* Renderiza TODOS os slides sobrepostos; só o ativo fica opacity-100 */}
        {validSlides.map((s, idx) => {
          const isActive = idx === index;

          return (
              <div
                  key={s.id ?? idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${count}`}
                  aria-hidden={!isActive}
                  onTouchStart={isActive ? onTouchStart : undefined}
                  onTouchEnd={isActive ? onTouchEnd : undefined}
              >
                <img
                    src={s.image}
                    alt={s.title ?? ''}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className={`relative z-20 w-full h-full flex items-center justify-center px-4 text-center transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="max-w-3xl">
                    {s.title && <h2 className="text-white text-4xl sm:text-5xl font-bold mb-4 drop-shadow">{s.title}</h2>}
                    {s.description && <p className="text-white text-lg sm:text-xl mb-6 drop-shadow">{s.description}</p>}
                    {s.button && (
                        <a
                            href={s.button.href}
                            target={s.button.target ?? '_self'}
                            rel={s.button.target === '_blank' ? 'noopener noreferrer' : undefined}
                            className="inline-block bg-[#0C2856] hover:bg-[#195CE3] transition duration-200 text-white px-6 py-3 rounded-3xl text-sm font-medium"
                            tabIndex={isActive ? 0 : -1}
                        >
                          {s.button.text}
                        </a>
                    )}
                  </div>
                </div>
              </div>
          );
        })}

        {count > 1 && (
            <>
              <button
                  onClick={prev}
                  aria-label="Anterior"
                  className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 z-30 p-2 transition duration-200 hover:scale-110 text-white rounded-full bg-black/30 hover:bg-black/50"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                  onClick={next}
                  aria-label="Próximo"
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white rounded-full bg-black/30 hover:bg-black/50 hover:scale-110 transition duration-200"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-30 flex gap-2">
                {validSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Ir para slide ${i + 1}`}
                        className={`w-3 h-3 cursor-pointer rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                ))}
              </div>
            </>
        )}
      </section>
  );
};
