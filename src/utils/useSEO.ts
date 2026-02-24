import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
}

/**
 * Hook para gerenciar SEO sem dependências externas
 * Manipula dinamicamente as meta tags do document.head
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {

    // Define o título da página
    document.title = `${config.title} | SECTI Pernambuco`;

    // Helper para atualizar ou criar meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.name = name;
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Meta tags padrão
    updateMeta('description', config.description);
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');
    updateMeta('robots', 'index, follow');

    if (config.keywords) {
      updateMeta('keywords', config.keywords);
    }

    // Open Graph
    updateMeta('og:title', config.title, true);
    updateMeta('og:description', config.description, true);
    updateMeta('og:type', config.ogType || 'website', true);

    if (config.canonical) {
      updateMeta('og:url', config.canonical, true);

      // Link canonical
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = config.canonical;
    }

    if (config.ogImage) {
      updateMeta('og:image', config.ogImage, true);
    }

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', config.title);
    updateMeta('twitter:description', config.description);

    if (config.ogImage) {
      updateMeta('twitter:image', config.ogImage);
    }

    // Cleanup: Remover tags ao desmontar (opcional)
    return () => {
      // Você pode manter ou remover dependendo da preferência
      // document.title = 'SECTI Pernambuco';
    };
  }, [config]);
};

