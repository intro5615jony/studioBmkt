import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface ServiceModule {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  colSpan?: string;
  isDark?: boolean;
  highlights: string[];
}

interface ServicesBentoProps {
  onOpenModal: () => void;
}

export const DEFAULT_MODULES: ServiceModule[] = [
  {
    id: '01',
    title: 'BRANDING & IDENTIDADE VISUAL',
    desc: 'Construção e evolução de marcas, identidades visuais e sistemas de comunicação que traduzem a essência do negócio e fortalecem sua percepção de valor.',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    colSpan: 'lg:col-span-4',
    highlights: ['IDENTIDADE VISUAL', 'REBRANDING', 'MANUAL DE MARCA', 'DIREÇÃO DE ARTE']
  },
  {
    id: '02',
    title: 'SOCIAL MEDIA & CONTEÚDO ESTRATÉGICO',
    desc: 'Planejamento, criação e gestão de conteúdo para construir presença, relacionamento e autoridade nas redes sociais.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    colSpan: 'lg:col-span-4',
    highlights: ['PLANEJAMENTO', 'CONTEÚDO', 'DESIGN PARA REDES SOCIAIS', 'GESTÃO DE REDES']
  },
  {
    id: '03',
    title: 'WEB DESIGN & DESENVOLVIMENTO',
    desc: 'Sites institucionais e landing pages desenvolvidos para unir experiência, identidade, performance e conversão.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    colSpan: 'lg:col-span-4',
    highlights: ['SITES INSTITUCIONAIS', 'LANDING PAGES', 'UX/UI', 'RESPONSIVIDADE']
  },
  {
    id: '04',
    title: 'MARKETING & PERFORMANCE',
    desc: 'Estratégias e campanhas digitais orientadas a objetivos, geração de oportunidades e crescimento.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    colSpan: 'lg:col-span-4',
    isDark: true,
    highlights: ['TRÁFEGO PAGO', 'CAMPANHAS', 'GERAÇÃO DE LEADS', 'ESTRATÉGIA DIGITAL']
  },
  {
    id: '05',
    title: 'DESIGN & COMUNICAÇÃO VISUAL',
    desc: 'Criação de materiais digitais e impressos, apresentações, campanhas, comunicação para eventos e outros pontos de contato da marca.',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=80',
    colSpan: 'lg:col-span-4',
    highlights: ['DESIGN GRÁFICO', 'MATERIAIS IMPRESSOS', 'EVENTOS', 'APRESENTAÇÕES']
  },
  {
    id: '06',
    title: 'CONSULTORIA & POSICIONAMENTO',
    desc: 'Diagnóstico e direcionamento estratégico para marcas que precisam organizar sua comunicação, posicionamento e presença no mercado.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    colSpan: 'lg:col-span-4',
    highlights: ['POSICIONAMENTO', 'AUDITORIA DE MARCA', 'ESTRATÉGIA', 'CONSULTORIA']
  }
];

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onOpenModal }) => {
  const [modules, setModules] = useState<ServiceModule[]>(DEFAULT_MODULES);

  useEffect(() => {
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const fetchedDocs = snap.docs.map((docSnap, index) => {
            const data = docSnap.data();
            const fallback = DEFAULT_MODULES[index] || DEFAULT_MODULES[0];
            return {
              id: docSnap.id,
              title: (data.title || fallback.title).toUpperCase(),
              desc: data.description || fallback.desc,
              imageUrl: data.imageUrl || fallback.imageUrl,
              colSpan: 'lg:col-span-4',
              isDark: data.isDark !== undefined 
                ? data.isDark 
                : (data.title?.toLowerCase().includes('performance') || fallback.isDark),
              highlights: data.highlights || fallback.highlights || []
            };
          });
          setModules(fetchedDocs);
        }
      }, () => {});
      return () => unsubscribe();
    } catch {
      // Usar os módulos padrão em caso de erro ou offline
    }
  }, []);

  return (
    <section id="servicos" className="py-20 sm:py-24 bg-[#F3EDE0] text-[#43210D] border-t border-[#CE892C]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#CE892C]/30 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight font-heading">
              Soluções pensadas para <span className="text-[#E17541]">transformar marcas e negócios.</span>
            </h2>
          </div>
          <p className="text-[#43210D]/80 text-xs sm:text-sm font-sans font-medium max-w-md">
            Estratégia, criatividade e execução reunidas para construir marcas mais fortes, profissionais e competitivas.
          </p>
        </div>

        {/* Bento Grid Layout - 3 por linha em Desktop (lg:col-span-4), 1 por linha em Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          {modules.map((mod) => (
            <motion.div 
              key={mod.id}
              whileHover={{ y: -6 }}
              className={`group rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl ${mod.colSpan || 'lg:col-span-4'} ${
                mod.isDark 
                  ? 'bg-[#43210D] text-[#F3EDE0] border-[#CE892C]' 
                  : 'bg-white/95 backdrop-blur-sm text-[#43210D] border-[#CE892C]/30 hover:border-[#FFC400]'
              }`}
            >
              {/* Card Container - Single visual piece */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden shrink-0">
                <img 
                  src={mod.imageUrl} 
                  alt={mod.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {/* Degradê vertical suave fundindo a imagem ao fundo do card */}
                <div 
                  className={`absolute inset-0 ${
                    mod.isDark 
                      ? 'bg-gradient-to-b from-transparent via-[#43210D]/60 via-50% to-[#43210D]' 
                      : 'bg-gradient-to-b from-transparent via-white/60 via-50% to-white'
                  }`} 
                />
              </div>

              {/* Conteúdo do Card - Sobreposto suavemente ao degradê */}
              <div className="p-6 sm:p-8 pt-0 relative z-10 flex flex-col justify-between flex-1 -mt-10 sm:-mt-12">
                <div>
                  {/* 2. Título do serviço */}
                  <h3 className={`text-xl sm:text-2xl font-extrabold mb-3.5 font-heading leading-tight tracking-tight ${
                    mod.isDark ? 'text-[#F3EDE0]' : 'text-[#43210D]'
                  }`}>
                    {mod.title}
                  </h3>

                  {/* 3. Descrição */}
                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-sans font-medium ${
                    mod.isDark ? 'text-[#F3EDE0]/85' : 'text-[#43210D]/80'
                  }`}>
                    {mod.desc}
                  </p>

                  {/* 4. Tags */}
                  {mod.highlights && mod.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                      {mod.highlights.map((item, hIdx) => (
                        <span 
                          key={hIdx} 
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider font-sans ${
                            mod.isDark 
                              ? 'bg-[#31180A] text-[#FFC400] border border-[#CE892C]/30' 
                              : 'bg-[#F3EDE0] text-[#43210D]/90 border border-[#CE892C]/30'
                          }`}
                        >
                          • {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Linha divisória & 6. SOLICITAR ESTE MÓDULO */}
                <div className={`pt-5 sm:pt-6 border-t flex items-center justify-between mt-auto ${
                  mod.isDark ? 'border-[#CE892C]/30' : 'border-[#CE892C]/20'
                }`}>
                  <button 
                    onClick={onOpenModal}
                    className={`text-xs font-bold uppercase tracking-wider font-sans inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform cursor-pointer ${
                      mod.isDark ? 'text-[#FFC400] hover:text-white' : 'text-[#E17541] hover:text-[#43210D]'
                    }`}
                  >
                    <span>SOLICITAR ESTE MÓDULO</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

