import React from 'react';
import { motion } from 'motion/react';
import { Layers, MessageSquare, Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutStudio: React.FC = () => {
  const manifestoPillars = [
    {
      icon: <Layers className="text-[#FFC400]" size={28} />,
      title: 'Organização',
      desc: 'Processos claros para transformar estratégia e criatividade em entregas consistentes.',
      number: '01'
    },
    {
      icon: <MessageSquare className="text-[#E17541]" size={28} />,
      title: 'Comunicação',
      desc: 'Transformamos ideias e objetivos em mensagens simples, relevantes e marcantes.',
      number: '02'
    },
    {
      icon: <Target className="text-[#FFC400]" size={28} />,
      title: 'Eficiência',
      desc: 'Estratégias pensadas para gerar percepção de valor e resultados para o negócio.',
      number: '03'
    },
    {
      icon: <Compass className="text-[#E17541]" size={28} />,
      title: 'Colaboração',
      desc: 'Não somos apenas fornecedores. Somos o braço criativo e estratégico da sua marca.',
      number: '04'
    }
  ];

  const mosaicImages = [
    {
      title: 'Rascunhos & Design Autoral',
      tag: 'PROCESSOS',
      url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Fotografia & Produção',
      tag: 'BASTIDORES',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Figma & Sistemas Visuais',
      tag: 'UI/UX & BRANDING',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="metodo" className="py-24 bg-[#F3EDE0] text-[#43210D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight leading-tight mb-6 font-heading">
            Design autoral, estratégia e criatividade para construir marcas relevantes.
          </h2>
          <p className="text-[#43210D]/80 text-base font-medium leading-relaxed font-sans">
            O Studio B Marketing nasceu para fugir do marketing genérico e das fórmulas prontas. Unimos estratégia, direção criativa e execução para transformar negócios em marcas com identidade, consistência e presença.
          </p>
        </div>

        {/* Manifesto Pillars (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {manifestoPillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#CE892C]/30 hover:border-[#FFC400] transition-all flex flex-col justify-between shadow-sm hover:shadow-xl relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#43210D] flex items-center justify-center shadow-md">
                    {pillar.icon}
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-[#43210D] mb-3 font-heading">
                  {pillar.title}
                </h3>
                <p className="text-[#43210D]/80 text-xs sm:text-sm font-medium leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statement / High-Impact Quote Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#43210D] text-[#F3EDE0] border-2 border-[#FFC400] shadow-2xl mb-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto">
            <Sparkles className="mx-auto text-[#FFC400] mb-4" size={32} />
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F3EDE0] leading-snug font-heading mb-6">
              "Acreditamos que estratégia sem criatividade passa despercebida. E criatividade sem estratégia não constrói marcas."
            </blockquote>
            <p className="text-[#FFC400] text-xs font-extrabold uppercase tracking-widest font-sans">
              // FILOSOFIA DO STUDIO B MARKETING
            </p>
          </div>
        </div>

        {/* Visual Mosaic (Bastidores / Studio Behind-the-scenes) */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#CE892C]/30">
            <div>
              <span className="text-xs font-bold text-[#E17541] uppercase tracking-wider font-sans">
                CULTURA & PROCESSOS
              </span>
              <h3 className="text-2xl font-extrabold text-[#43210D] font-heading">
                Mosaico Visual & Bastidores
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono-tech font-bold text-[#43210D]/60 uppercase">
              // STUDIO B CREATIVE LAB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mosaicImages.map((item, idx) => (
              <div 
                key={idx}
                className="group relative rounded-3xl overflow-hidden border-2 border-[#CE892C]/30 hover:border-[#FFC400] transition-all aspect-[4/3] bg-[#43210D] shadow-md"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#43210D] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <span className="bg-[#E17541] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block font-sans">
                    {item.tag}
                  </span>
                  <p className="text-sm font-extrabold text-[#F3EDE0] font-heading leading-tight">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
