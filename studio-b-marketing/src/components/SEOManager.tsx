import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title: string;
  description: string;
  robots: string;
}

const DEFAULT_SEO: SEOConfig = {
  title: 'Studio B Marketing | Estratégia, Design e Soluções Digitais',
  description: 'Estratégia, design, social media, sites e soluções digitais para marcas que buscam posicionamento, criatividade e resultados.',
  robots: 'index, follow',
};

function getSEOForPath(pathname: string): SEOConfig {
  // Private / Admin Routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return {
      title: 'Painel Administrativo | Studio B Marketing',
      description: 'Área administrativa restrita do Studio B Marketing.',
      robots: 'noindex, nofollow',
    };
  }

  // Quem Somos
  if (pathname === '/quem-somos' || pathname === '/sobre') {
    return {
      title: 'Quem Somos | Studio B Marketing',
      description: 'Conheça a história e a equipe por trás do Studio B Marketing, especialista em posicionamento de marca, design e soluções digitais.',
      robots: 'index, follow',
    };
  }

  // Serviços & Segmentos
  if (
    pathname === '/marketing-para-telecom' ||
    pathname === '/segmentos' ||
    pathname.startsWith('/segmentos/')
  ) {
    return {
      title: 'Serviços de Marketing e Soluções Digitais | Studio B',
      description: 'Soluções estratégicas de marketing, branding e comunicação para empresas de tecnologia, telecom e mercado corporativo.',
      robots: 'index, follow',
    };
  }

  // Cases
  if (pathname === '/cases' || pathname.startsWith('/cases/')) {
    return {
      title: 'Cases e Projetos | Studio B Marketing',
      description: 'Confira nossos cases de sucesso em estratégia, branding, design e crescimento digital.',
      robots: 'index, follow',
    };
  }

  // Blog
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    return {
      title: 'Blog de Marketing, Design e Estratégia | Studio B',
      description: 'Artigos, análises e tendências sobre marketing digital, branding, inteligência criativa e comunicação.',
      robots: 'index, follow',
    };
  }

  // Home
  return DEFAULT_SEO;
}

export function SEOManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSEOForPath(pathname);

    // 1. Title
    document.title = seo.title;

    // Helper function for updating meta tags
    const updateMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description & Robots
    updateMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    updateMetaTag('meta[name="robots"]', 'name', 'robots', seo.robots);

    // 3. Open Graph
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', 'https://www.studiobmkt.com.br/og-image.jpg');

    // 4. Twitter
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', 'https://www.studiobmkt.com.br/og-image.jpg');

    // 5. Canonical URL & og:url
    const siteBaseUrl = import.meta.env.VITE_SITE_URL || 'https://www.studiobmkt.com.br';
    const normalizedBaseUrl = siteBaseUrl.replace(/\/$/, '');
    const canonicalUrl = `${normalizedBaseUrl}${pathname === '/' ? '/' : pathname}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // og:url
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  }, [pathname]);

  return null;
}
