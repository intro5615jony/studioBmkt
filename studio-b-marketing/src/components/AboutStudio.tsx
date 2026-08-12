import React from 'react';
import { motion } from 'motion/react';
import { Layers, MessageSquare, Target, Compass, Sparkles } from 'lucide-react';

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
        <div className="p-8 sm:p-12 rounded-3xl bg-[#43210D] text-[#F3EDE0] border-2 border-[#FFC400] shadow-2xl mb-0 text-center relative overflow-hidden">
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

      </div>
    </section>
  );
};
