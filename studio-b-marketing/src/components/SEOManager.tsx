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

const SITE_BASE_URL = 'https://www.studiobmkt.com.br';

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

function getCanonicalUrl(pathname: string): string {
  // Clean pathname: strip trailing slashes
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  let targetPath = cleanPath;
  if (cleanPath === '/sobre') {
    targetPath = '/quem-somos';
  } else if (cleanPath === '/segmentos') {
    targetPath = '/marketing-para-telecom';
  }

  return targetPath === '/' ? `${SITE_BASE_URL}/` : `${SITE_BASE_URL}${targetPath}`;
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
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', `${SITE_BASE_URL}/og-image.jpg`);

    // 4. Twitter
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `${SITE_BASE_URL}/og-image.jpg`);

    // 5. Canonical URL & og:url
    const canonicalUrl = getCanonicalUrl(pathname);

    // Guarantee strictly ONE <link rel="canonical"> in document.head
    const canonicalLinks = Array.from(document.querySelectorAll('link[rel="canonical"]'));
    let canonicalLink: HTMLLinkElement;

    if (canonicalLinks.length > 0) {
      canonicalLink = canonicalLinks[0] as HTMLLinkElement;
      // Remove any duplicate canonical links if they exist
      for (let i = 1; i < canonicalLinks.length; i++) {
        canonicalLinks[i].remove();
      }
    } else {
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
