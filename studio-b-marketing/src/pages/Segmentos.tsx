import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  MessageCircle, 
  Stethoscope, 
  Building2, 
  Sparkles, 
  Layout, 
  Share2, 
  Compass, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { MarketingTelecom } from './MarketingTelecom';

interface SegmentosProps {
  onOpenModal: () => void;
  defaultSegment?: string;
}

export const Segmentos: React.FC<SegmentosProps> = ({ onOpenModal, defaultSegment = 'telecom' }) => {
  const { segmentId } = useParams<{ segmentId?: string }>();
  const navigate = useNavigate();

  const activeSegment = segmentId || defaultSegment;

  const segmentList = [
    { id: 'telecom', label: 'Telecom & Tecnologia', icon: <Wifi size={18} /> },
    { id: 'saude-clinicas', label: 'Saúde & Clínicas', icon: <Stethoscope size={18} /> },
    { id: 'servicos-b2b', label: 'Serviços & B2B', icon: <Building2 size={18} /> },
    { id: 'outros', label: 'Outros Segmentos', icon: <Sparkles size={18} /> }
  ];

  const handleSelectSegment = (id: string) => {
    navigate(`/segmentos/${id}`);
  };

  return (
    <div className="pt-28 pb-16 bg-[#F3EDE0] text-[#43210D]">
      
      {/* Top Header & Segment Selector */}
      <section className="px-6 pt-8 pb-12 border-b border-[#CE892C]/30 bg-white/40">
        <div className="max-w-7xl mx-auto text-center">
          
          <span className="px-4 py-1.5 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-widest inline-block font-sans mb-4 shadow-sm">
            SEGMENTOS DE ATUAÇÃO
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight mb-4 font-heading">
            Estratégia e Design Aplicados ao <span className="text-[#E17541]">Seu Mercado</span>
          </h1>

          <p className="text-[#43210D]/80 text-sm sm:text-base font-sans font-medium max-w-2xl mx-auto mb-10">
            Conheça como o Studio B Marketing adapta sua inteligência criativa, posicionamento e execução para atender os desafios específicos de cada setor.
          </p>

          {/* Segment Selector Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {segmentList.map((item) => {
              const isSelected = activeSegment === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSegment(item.id)}
                  className={`px-5 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider font-sans transition-all flex items-center gap-2.5 cursor-pointer border-2 ${
                    isSelected
                      ? 'bg-[#43210D] text-[#FFC400] border-[#43210D] shadow-lg scale-105'
                      : 'bg-white text-[#43210D] border-[#CE892C]/40 hover:border-[#FFC400] hover:bg-[#FFC400]/10'
                  }`}
                >
                  <span className={isSelected ? 'text-[#FFC400]' : 'text-[#E17541]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- SEGMENT CONTENT AREA --- */}
      <div>
        {activeSegment === 'telecom' && (
          <MarketingTelecom onOpenModal={onOpenModal} />
        )}

        {activeSegment === 'saude-clinicas' && (
          <div className="animate-fade-in">
            {/* HERO */}
            <section className="relative px-6 py-16 sm:py-20 overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10 text-center">
                <span className="px-4 py-1.5 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-widest inline-block font-sans mb-6 shadow-sm">
                  ESPECIALIZAÇÃO // SAÚDE & CLÍNICAS
                </span>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] leading-[1.15] tracking-tight mb-6 font-heading max-w-4xl mx-auto">
                  Comunicação de <span className="text-[#E17541] underline decoration-[#FFC400] decoration-4 underline-offset-4">Alta Percepção</span> para Médicos, Clínicas e Saúde.
                </h2>

                <p className="text-base sm:text-lg text-[#43210D]/85 leading-relaxed font-sans font-medium mb-8 max-w-3xl mx-auto">
                  Unimos sofisticação visual, ética médica e posicionamento estratégico para construir marcas médicas desejadas e transmitir máxima confiança aos seus pacientes.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={onOpenModal}
                    className="px-8 py-4 rounded-full bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg hover:shadow-xl font-sans border border-[#CE892C]/40 cursor-pointer"
                  >
                    <span>SOLICITAR DIAGNÓSTICO PARA MINHA CLÍNICA</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <a
                    href="https://wa.me/5511966558126?text=Olá! Gostaria de conversar sobre um projeto para minha clínica/área de saúde."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-white text-[#43210D] border-2 border-[#CE892C]/50 hover:border-[#FFC400] hover:bg-[#FFC400]/10 transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 font-sans shadow-sm"
                  >
                    <MessageCircle size={18} className="text-[#25D366]" />
                    <span>FALAR NO WHATSAPP</span>
                  </a>
                </div>
              </div>
            </section>

            {/* PILLARS FOR SAUDE */}
            <section className="py-16 px-6 border-t border-[#CE892C]/30 bg-[#F3EDE0]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-[#43210D] font-heading mb-4">
                    Soluções sob medida para o segmento de <span className="text-[#E17541]">Saúde</span>
                  </h3>
                  <p className="text-[#43210D]/80 text-sm font-sans font-medium">
                    Respeitamos as diretrizes éticas da saúde construindo uma presença forte e memorável.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] p-8 rounded-3xl shadow-xl">
                    <h4 className="text-2xl font-extrabold text-[#F3EDE0] mb-3 font-heading">
                      Branding & Identidade Médica
                    </h4>
                    <p className="text-[#F3EDE0]/80 text-xs sm:text-sm leading-relaxed font-sans mb-6">
                      Desenvolvimento de logos, marcas e papelaria de luxo para consultórios e clínicas de especialidades.
                    </p>
                    <ul className="space-y-2.5 font-sans text-xs text-[#F3EDE0]/90 border-t border-[#CE892C]/20 pt-4">
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Manual de Identidade Visual e Tipografia</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Sinalização Interna & Recepção</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Papelaria Premium e Envelopes Especiais</li>
                    </ul>
                  </div>

                  <div className="bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] p-8 rounded-3xl shadow-xl">
                    <h4 className="text-2xl font-extrabold text-[#F3EDE0] mb-3 font-heading">
                      Web Design & Presença Digital
                    </h4>
                    <p className="text-[#F3EDE0]/80 text-xs sm:text-sm leading-relaxed font-sans mb-6">
                      Sites elegantes com navegação fluida, agendamento online e apresentação clara dos tratamentos.
                    </p>
                    <ul className="space-y-2.5 font-sans text-xs text-[#F3EDE0]/90 border-t border-[#CE892C]/20 pt-4">
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Sites Institucionais & Landing Pages de Tratamentos</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Integração com Agendamento e WhatsApp</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Design Responsivo e Otimização SEO</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSegment === 'servicos-b2b' && (
          <div className="animate-fade-in">
            {/* HERO */}
            <section className="relative px-6 py-16 sm:py-20 overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10 text-center">
                <span className="px-4 py-1.5 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-widest inline-block font-sans mb-6 shadow-sm">
                  ESPECIALIZAÇÃO // SERVIÇOS & B2B
                </span>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] leading-[1.15] tracking-tight mb-6 font-heading max-w-4xl mx-auto">
                  Estratégia e Design para <span className="text-[#E17541] underline decoration-[#FFC400] decoration-4 underline-offset-4">Empresas Corporativas</span> e Negócios B2B.
                </h2>

                <p className="text-base sm:text-lg text-[#43210D]/85 leading-relaxed font-sans font-medium mb-8 max-w-3xl mx-auto">
                  Traduzimos a complexidade dos seus serviços em propostas comerciais de alto impacto, branding consistente e presença digital que gera autoridade no mercado.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={onOpenModal}
                    className="px-8 py-4 rounded-full bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg hover:shadow-xl font-sans border border-[#CE892C]/40 cursor-pointer"
                  >
                    <span>SOLICITAR DIAGNÓSTICO B2B</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <a
                    href="https://wa.me/5511966558126?text=Olá! Gostaria de conversar sobre um projeto B2B/Serviços com o Studio B."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-white text-[#43210D] border-2 border-[#CE892C]/50 hover:border-[#FFC400] hover:bg-[#FFC400]/10 transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 font-sans shadow-sm"
                  >
                    <MessageCircle size={18} className="text-[#25D366]" />
                    <span>FALAR NO WHATSAPP</span>
                  </a>
                </div>
              </div>
            </section>

            {/* PILLARS FOR B2B */}
            <section className="py-16 px-6 border-t border-[#CE892C]/30 bg-[#F3EDE0]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-[#43210D] font-heading mb-4">
                    Soluções estratégicas para empresas de <span className="text-[#E17541]">Serviços & B2B</span>
                  </h3>
                  <p className="text-[#43210D]/80 text-sm font-sans font-medium">
                    Aumente o valor percebido das suas ofertas e fortaleça sua equipe comercial.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] p-8 rounded-3xl shadow-xl">
                    <h4 className="text-2xl font-extrabold text-[#F3EDE0] mb-3 font-heading">
                      Apresentações Comerciais & Pitch Decks
                    </h4>
                    <p className="text-[#F3EDE0]/80 text-xs sm:text-sm leading-relaxed font-sans mb-6">
                      Materiais de alto nível corporativo para fechar grandes contratos e encantar tomadores de decisão.
                    </p>
                    <ul className="space-y-2.5 font-sans text-xs text-[#F3EDE0]/90 border-t border-[#CE892C]/20 pt-4">
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Decks Comerciais Institucionais</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Propostas Comerciais Otimizadas</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Mídia Kits e Relatórios Corporativos</li>
                    </ul>
                  </div>

                  <div className="bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] p-8 rounded-3xl shadow-xl">
                    <h4 className="text-2xl font-extrabold text-[#F3EDE0] mb-3 font-heading">
                      Rebranding & Posicionamento
                    </h4>
                    <p className="text-[#F3EDE0]/80 text-xs sm:text-sm leading-relaxed font-sans mb-6">
                      Modernização visual e alinhamento de linguagem para empresas em fase de expansão ou consolidação.
                    </p>
                    <ul className="space-y-2.5 font-sans text-xs text-[#F3EDE0]/90 border-t border-[#CE892C]/20 pt-4">
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Arquitetura e Linguagem de Marca</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Sites e Portais B2B</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#FFC400]" /> Comunicação para Eventos e Feiras</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSegment === 'outros' && (
          <div className="animate-fade-in">
            {/* HERO */}
            <section className="relative px-6 py-16 sm:py-20 overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10 text-center">
                <span className="px-4 py-1.5 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-widest inline-block font-sans mb-6 shadow-sm">
                  ESPECIALIZAÇÃO // OUTROS SEGMENTOS
                </span>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] leading-[1.15] tracking-tight mb-6 font-heading max-w-4xl mx-auto">
                  Soluções Autorais para <span className="text-[#E17541] underline decoration-[#FFC400] decoration-4 underline-offset-4">Marcas Audaciosas</span> de Diversos Setores.
                </h2>

                <p className="text-base sm:text-lg text-[#43210D]/85 leading-relaxed font-sans font-medium mb-8 max-w-3xl mx-auto">
                  Seja no varejo de alto padrão, mercado imobiliário, educação ou consultorias, aplicamos nosso método autoral de branding e estratégia para destacar sua marca com autenticidade.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={onOpenModal}
                    className="px-8 py-4 rounded-full bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg hover:shadow-xl font-sans border border-[#CE892C]/40 cursor-pointer"
                  >
                    <span>SOLICITAR PROPOSTA PERSONALIZADA</span>
                    <ArrowUpRight size={18} />
                  </button>

                  <a
                    href="https://wa.me/5511966558126?text=Olá! Gostaria de conversar sobre um projeto personalizado com o Studio B."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-white text-[#43210D] border-2 border-[#CE892C]/50 hover:border-[#FFC400] hover:bg-[#FFC400]/10 transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 font-sans shadow-sm"
                  >
                    <MessageCircle size={18} className="text-[#25D366]" />
                    <span>FALAR NO WHATSAPP</span>
                  </a>
                </div>
              </div>
            </section>

            {/* CUSTOM SOLUTIONS */}
            <section className="py-16 px-6 border-t border-[#CE892C]/30 bg-[#F3EDE0]">
              <div className="max-w-7xl mx-auto text-center">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#43210D] font-heading mb-4">
                  Como Trabalhamos com o <span className="text-[#E17541]">Seu Segmento</span>
                </h3>
                <p className="text-[#43210D]/80 text-sm font-sans font-medium max-w-2xl mx-auto mb-10">
                  Independente do seu nicho, realizamos uma imersão completa para mapear o posicionamento ideal e criar projetos únicos.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  <div className="p-6 rounded-2xl bg-white border border-[#CE892C]/30 shadow-sm">
                    <span className="text-[#E17541] font-bold font-heading text-lg block mb-2">01. Imersão</span>
                    <p className="text-xs text-[#43210D]/80 font-sans font-medium">Entendimento profundo do modelo de negócio, concorrência e diferencial competitivo.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#CE892C]/30 shadow-sm">
                    <span className="text-[#E17541] font-bold font-heading text-lg block mb-2">02. Posicionamento</span>
                    <p className="text-xs text-[#43210D]/80 font-sans font-medium">Definição da essência visual e verbal para destacar sua marca no mercado.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#CE892C]/30 shadow-sm">
                    <span className="text-[#E17541] font-bold font-heading text-lg block mb-2">03. Criação</span>
                    <p className="text-xs text-[#43210D]/80 font-sans font-medium">Desenvolvimento autoral sem fórmulas prontas ou bancos de modelos genéricos.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#CE892C]/30 shadow-sm">
                    <span className="text-[#E17541] font-bold font-heading text-lg block mb-2">04. Ativação</span>
                    <p className="text-xs text-[#43210D]/80 font-sans font-medium">Entrega de arquivos prontos e diretrizes claras para implementação em todos os canais.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

    </div>
  );
};
