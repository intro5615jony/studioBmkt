import React from 'react';
import { motion } from 'motion/react';
import { Palette, Share2, Layout, TrendingUp, Layers, Compass, ArrowUpRight } from 'lucide-react';

interface ServicesBentoProps {
  onOpenModal: () => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onOpenModal }) => {
  const modules = [
    {
      id: '01',
      title: 'BRANDING & IDENTIDADE VISUAL',
      desc: 'Construção e evolução de marcas, identidades visuais e sistemas de comunicação que traduzem a essência do negócio e fortalecem sua percepção de valor.',
      icon: <Palette size={32} className="text-[#43210D] group-hover:text-[#FFC400] transition-colors" />,
      colSpan: 'lg:col-span-4',
      highlights: ['IDENTIDADE VISUAL', 'REBRANDING', 'MANUAL DE MARCA', 'DIREÇÃO DE ARTE']
    },
    {
      id: '02',
      title: 'SOCIAL MEDIA & CONTEÚDO ESTRATÉGICO',
      desc: 'Planejamento, criação e gestão de conteúdo para construir presença, relacionamento e autoridade nas redes sociais.',
      icon: <Share2 size={32} className="text-[#43210D] group-hover:text-[#E17541] transition-colors" />,
      colSpan: 'lg:col-span-4',
      highlights: ['PLANEJAMENTO', 'CONTEÚDO', 'DESIGN PARA REDES SOCIAIS', 'GESTÃO DE REDES']
    },
    {
      id: '03',
      title: 'WEB DESIGN & DESENVOLVIMENTO',
      desc: 'Sites institucionais e landing pages desenvolvidos para unir experiência, identidade, performance e conversão.',
      icon: <Layout size={32} className="text-[#43210D] group-hover:text-[#FFC400] transition-colors" />,
      colSpan: 'lg:col-span-4',
      highlights: ['SITES INSTITUCIONAIS', 'LANDING PAGES', 'UX/UI', 'RESPONSIVIDADE']
    },
    {
      id: '04',
      title: 'MARKETING & PERFORMANCE',
      desc: 'Estratégias e campanhas digitais orientadas a objetivos, geração de oportunidades e crescimento.',
      icon: <TrendingUp size={32} className="text-[#F3EDE0] group-hover:text-[#FFC400] transition-colors" />,
      colSpan: 'lg:col-span-4',
      isDark: true,
      highlights: ['TRÁFEGO PAGO', 'CAMPANHAS', 'GERAÇÃO DE LEADS', 'ESTRATÉGIA DIGITAL']
    },
    {
      id: '05',
      title: 'DESIGN & COMUNICAÇÃO VISUAL',
      desc: 'Criação de materiais digitais e impressos, apresentações, campanhas, comunicação para eventos e outros pontos de contato da marca.',
      icon: <Layers size={32} className="text-[#43210D] group-hover:text-[#E17541] transition-colors" />,
      colSpan: 'lg:col-span-4',
      highlights: ['DESIGN GRÁFICO', 'MATERIAIS IMPRESSOS', 'EVENTOS', 'APRESENTAÇÕES']
    },
    {
      id: '06',
      title: 'CONSULTORIA & POSICIONAMENTO',
      desc: 'Diagnóstico e direcionamento estratégico para marcas que precisam organizar sua comunicação, posicionamento e presença no mercado.',
      icon: <Compass size={32} className="text-[#43210D] group-hover:text-[#FFC400] transition-colors" />,
      colSpan: 'lg:col-span-4',
      highlights: ['POSICIONAMENTO', 'AUDITORIA DE MARCA', 'ESTRATÉGIA', 'CONSULTORIA']
    }
  ];

  return (
    <section id="servicos" className="py-24 bg-[#F3EDE0] text-[#43210D] border-t border-[#CE892C]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#CE892C]/30 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight font-heading">
              Soluções pensadas para <span className="text-[#E17541]">transformar marcas e negócios.</span>
            </h2>
          </div>
          <p className="text-[#43210D]/80 text-xs sm:text-sm font-sans font-medium max-w-md">
            Estratégia, criatividade e execução reunidas para construir marcas mais fortes, profissionais e competitivas.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {modules.map((mod) => (
            <motion.div 
              key={mod.id}
              whileHover={{ y: -6 }}
              className={`group p-8 sm:p-10 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl ${mod.colSpan} ${
                mod.isDark 
                  ? 'bg-[#43210D] text-[#F3EDE0] border-[#CE892C]' 
                  : 'bg-white/90 backdrop-blur-sm text-[#43210D] border-[#CE892C]/30 hover:border-[#FFC400]'
              }`}
            >
              <div>
                {/* Header Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all group-hover:scale-105 ${
                    mod.isDark ? 'bg-[#31180A] border border-[#CE892C]/40' : 'bg-[#F3EDE0] border border-[#CE892C]/30'
                  }`}>
                    {mod.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className={`text-xl sm:text-2xl font-extrabold mb-4 font-heading leading-tight ${
                  mod.isDark ? 'text-[#F3EDE0]' : 'text-[#43210D]'
                }`}>
                  {mod.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-sans font-medium ${
                  mod.isDark ? 'text-[#F3EDE0]/80' : 'text-[#43210D]/80'
                }`}>
                  {mod.desc}
                </p>

                {/* Highlights List */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {mod.highlights.map((item, hIdx) => (
                    <span 
                      key={hIdx} 
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider font-sans ${
                        mod.isDark 
                          ? 'bg-[#31180A] text-[#FFC400] border border-[#CE892C]/30' 
                          : 'bg-[#F3EDE0] text-[#43210D]/80 border border-[#CE892C]/30'
                      }`}
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className={`pt-6 border-t flex items-center justify-between ${
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
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
