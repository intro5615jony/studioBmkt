import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { blogPosts } from '../data/posts';

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

function getStaticSEOForPath(pathname: string): SEOConfig {
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

  // Cases list
  if (pathname === '/cases' || pathname === '/cases/') {
    return {
      title: 'Cases e Projetos | Studio B Marketing',
      description: 'Confira nossos cases de sucesso em estratégia, branding, design e crescimento digital.',
      robots: 'index, follow',
    };
  }

  // Blog list
  if (pathname === '/blog' || pathname === '/blog/') {
    return {
      title: 'Blog de Marketing, Design e Estratégia | Studio B',
      description: 'Artigos, análises e tendências sobre marketing digital, branding, inteligência criativa e comunicação.',
      robots: 'index, follow',
    };
  }

  // Home or default
  return DEFAULT_SEO;
}

function getCanonicalUrl(pathname: string): string {
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  let targetPath = cleanPath;
  if (cleanPath === '/sobre') {
    targetPath = '/quem-somos';
  } else if (cleanPath === '/segmentos') {
    targetPath = '/marketing-para-telecom';
  }

  return targetPath === '/' ? `${SITE_BASE_URL}/` : `${SITE_BASE_URL}${targetPath}`;
}

// Helpers for updating meta tags cleanly and removing duplicates
function setMetaTag(
  selector: string,
  createFn: () => HTMLElement,
  updateFn: (el: HTMLElement) => void
) {
  const elements = Array.from(document.querySelectorAll(selector));
  let targetEl: HTMLElement;

  if (elements.length > 0) {
    targetEl = elements[0] as HTMLElement;
    // Remove any duplicate tags to guarantee strictly ONE tag in head
    for (let i = 1; i < elements.length; i++) {
      elements[i].remove();
    }
  } else {
    targetEl = createFn();
    document.head.appendChild(targetEl);
  }
  updateFn(targetEl);
}

function updateMetaByName(name: string, content: string) {
  setMetaTag(
    `meta[name="${name}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute('name', name);
      return el;
    },
    (el) => el.setAttribute('content', content)
  );
}

function updateMetaByProperty(property: string, content: string) {
  setMetaTag(
    `meta[property="${property}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute('property', property);
      return el;
    },
    (el) => el.setAttribute('content', content)
  );
}

export function SEOManager() {
  const { pathname } = useLocation();
  const [dynamicSEO, setDynamicSEO] = useState<SEOConfig | null>(null);

  useEffect(() => {
    let isMounted = true;
    setDynamicSEO(null);

    // Check for dynamic blog post route: /blog/:id
    if (pathname.startsWith('/blog/') && pathname !== '/blog/' && pathname !== '/blog') {
      const id = pathname.replace('/blog/', '').replace(/\/$/, '');
      if (id) {
        // 1. Check local static blogPosts first
        const staticPost = blogPosts.find((p) => p.id === id);
        if (staticPost) {
          setDynamicSEO({
            title: `${staticPost.title} | Studio B Marketing`,
            description: staticPost.description || DEFAULT_SEO.description,
            robots: 'index, follow',
          });
        } else {
          // 2. Fetch from Firestore if not found in static list
          getDoc(doc(db, 'posts', id))
            .then((snap) => {
              if (isMounted && snap.exists()) {
                const data = snap.data();
                setDynamicSEO({
                  title: `${data.title || 'Artigo'} | Studio B Marketing`,
                  description: data.description || DEFAULT_SEO.description,
                  robots: 'index, follow',
                });
              }
            })
            .catch((err) => {
              console.error('Error fetching post for SEO:', err);
            });
        }
      }
    }

    // Check for dynamic case/project route: /cases/:slug
    if (pathname.startsWith('/cases/') && pathname !== '/cases/' && pathname !== '/cases') {
      const slug = pathname.replace('/cases/', '').replace(/\/$/, '');
      if (slug) {
        // Fetch from Firestore
        const q = query(collection(db, 'projects'), where('slug', '==', slug));
        getDocs(q)
          .then((snap) => {
            if (isMounted && !snap.empty) {
              const data = snap.docs[0].data();
              setDynamicSEO({
                title: `${data.title || 'Case'} | Studio B Marketing`,
                description: data.shortDescription || data.description || DEFAULT_SEO.description,
                robots: 'index, follow',
              });
            } else {
              // Fallback to fetch by doc ID
              return getDoc(doc(db, 'projects', slug)).then((docSnap) => {
                if (isMounted && docSnap.exists()) {
                  const data = docSnap.data();
                  setDynamicSEO({
                    title: `${data.title || 'Case'} | Studio B Marketing`,
                    description: data.shortDescription || data.description || DEFAULT_SEO.description,
                    robots: 'index, follow',
                  });
                }
              });
            }
          })
          .catch((err) => {
            console.error('Error fetching project for SEO:', err);
          });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    const seo = dynamicSEO || getStaticSEOForPath(pathname);

    // 1. Document Title
    document.title = seo.title;

    // 2. Meta Description & Robots (guaranteed strictly ONE in head)
    updateMetaByName('description', seo.description);
    updateMetaByName('robots', seo.robots);

    // 3. Open Graph
    updateMetaByProperty('og:title', seo.title);
    updateMetaByProperty('og:description', seo.description);
    updateMetaByProperty('og:image', `${SITE_BASE_URL}/og-image.jpg`);

    // 4. Twitter Cards
    updateMetaByName('twitter:title', seo.title);
    updateMetaByName('twitter:description', seo.description);
    updateMetaByName('twitter:image', `${SITE_BASE_URL}/og-image.jpg`);

    // 5. Canonical URL & og:url (guaranteed strictly ONE in head)
    const canonicalUrl = getCanonicalUrl(pathname);

    setMetaTag(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        return link;
      },
      (el) => el.setAttribute('href', canonicalUrl)
    );

    updateMetaByProperty('og:url', canonicalUrl);
  }, [pathname, dynamicSEO]);

  return null;
}
