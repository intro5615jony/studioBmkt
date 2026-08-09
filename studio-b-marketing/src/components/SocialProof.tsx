import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_BRANDS, BrandItem } from '../data/defaultBrands';

export const SocialProof: React.FC = () => {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const q = query(collection(db, 'brands'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedBrands = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Marca',
            logoUrl: data.logoUrl || '',
            url: data.url || '',
            status: data.status || 'Ativa',
            order: typeof data.order === 'number' ? data.order : 0
          } as BrandItem;
        });
        setBrands(fetchedBrands);
      } else {
        setBrands([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar marcas no site público:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter only active brands
  const activeBrands = useMemo(() => {
    const list = brands.length > 0 ? brands : DEFAULT_BRANDS;
    return list.filter(b => b.status === 'Ativa' || b.status === 'active' || !b.status);
  }, [brands]);

  // Multiply list for seamless infinite marquee scrolling
  const marqueeBrands = useMemo(() => {
    if (activeBrands.length === 0) return [];
    let list = [...activeBrands];
    // Ensure we have at least 12 items for smooth looping
    while (list.length < 12) {
      list = [...list, ...activeBrands];
    }
    return [...list, ...list];
  }, [activeBrands]);

  return (
    <section className="py-16 bg-[#F3EDE0] text-[#43210D] border-t border-b border-[#CE892C]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Marquee Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E17541] font-sans">
            MARCAS QUE CONFIAM NO STUDIO B MARKETING
          </span>
        </div>

        {/* Infinite Logo Marquee Carousel */}
        <div className="relative w-full overflow-hidden py-2 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 sm:before:w-28 before:bg-gradient-to-r before:from-[#F3EDE0] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 sm:after:w-28 after:bg-gradient-to-l after:from-[#F3EDE0] after:to-transparent">
          <div className="animate-marquee flex items-center gap-6 sm:gap-8">
            {marqueeBrands.map((brand, idx) => {
              const cardContent = (
                <div className="h-16 sm:h-20 px-6 sm:px-8 py-3 rounded-2xl bg-white/60 border border-[#CE892C]/25 hover:border-[#FFC400] transition-all duration-300 flex items-center justify-center group shrink-0 cursor-pointer shadow-sm hover:shadow-md hover:bg-white hover:scale-105 text-[#43210D]/75 hover:text-[#FFC400]">
                  {brand.logoUrl ? (
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="max-h-10 sm:max-h-12 max-w-[160px] w-auto h-auto object-contain transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="font-heading font-black text-sm sm:text-base tracking-tight text-[#43210D]">
                      {brand.name}
                    </span>
                  )}
                </div>
              );

              if (brand.url && brand.url.trim()) {
                return (
                  <a 
                    key={`${brand.id || brand.name}-${idx}`}
                    href={brand.url.startsWith('http') ? brand.url : `https://${brand.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={brand.name}
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <React.Fragment key={`${brand.id || brand.name}-${idx}`}>
                  {cardContent}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};


