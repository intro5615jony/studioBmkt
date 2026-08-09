import React from 'react';
import { motion } from 'motion/react';
import { Wifi, ShieldCheck, Zap, Users, ArrowUpRight, CheckCircle2, MessageCircle, BarChart3, Radio, Server, Layers, PhoneCall, Sparkles } from 'lucide-react';
import { Testimonials } from '../components/Testimonials';

interface MarketingTelecomProps {
  onOpenModal: () => void;
}

export const MarketingTelecom: React.FC<MarketingTelecomProps> = ({ onOpenModal }) => {
  const pillars = [
    {
      id: 'isp',
      icon: <Wifi className="w-8 h-8 text-[#FFC400]" />,
      badge: 'B2C & EXPANSÃO',
      title: 'Provedores ISPs & Campanhas de Fibra',
      description: 'Estruturamos a comunicação visual para aceleração de vendas de planos residenciais e ocupação rápida de CTOs (Caixas de Terminação Óptica).',
      bullets: [
        'Design para Envelopamento de Frota & Material PAP (Porta a Porta)',
        'Campanhas de Lançamento de Novos Bairros & Cidades',
        'Landing Pages de Alta Conversão para Assinatura Online',
        'Comunicação de PDV, Envelopes de Contrato & Unifomização'
      ]
    },
    {
      id: 'b2b',
      icon: <ShieldCheck className="w-8 h-8 text-[#E17541]" />,
      badge: 'AUTORIDADE & VENDAS',
      title: 'Blindagem B2B & Link Dedicado',
      description: 'Desenvolvemos apresentações corporativas e materiais estratégicos para a equipe comercial fechar contratos B2B de alto valor ticket médio.',
      bullets: [
        'Apresentações Comerciais Institucionais & Propostas Padrão B2B',
        'Estratégia de Posicionamento para Eventos (Abrint, Redes&Cia, Abralimp)',
        'E-books de Segurança de Rede & Soluções Corporativas',
        'Régua de Relacionamento para Redução de Churn Corporativo'
      ]
    },
    {
      id: 'agilidade',
      icon: <Zap className="w-8 h-8 text-[#FFC400]" />,
      badge: 'PROCESSO DESCOMPLICADO',
      title: 'Agilidade Criativa Sem Caos',
      description: 'O setor de telecom não pode esperar semanas por uma alteração. Nosso método garante entregas rápidas e alinhadas ao ritmo de vendas.',
      bullets: [
        'Demanda sob medida sem gargalos burocráticos',
        'Padronização de arquivos para rápida impressão em gráficas locais',
        'Templates editáveis para mídias sociais e avisos urgentes de rede',
        'Suporte próximo e alinhamento direto com diretores e marketing'
      ]
    },
    {
      id: 'audacia',
      icon: <Users className="w-8 h-8 text-[#E17541]" />,
      badge: 'REBRANDING B2B',
      title: 'Marcas Audaciosas & Infraestrutura',
      description: 'Transformamos provedores regionais em marcas fortes e respeitadas, prontas para competir de igual para igual com grandes operadoras nacionais.',
      bullets: [
        'Projetos de Rebranding Completo com Manual de Marca',
        'Posicionamento de Mercado baseado em Percepção de Valor',
        'Sinalização de Prédios, Sede, Data Centers e Tower Sites',
        'Arquitetura de Marca para Múltiplos Serviços (Voz, TV, Nuvem, TI)'
      ]
    }
  ];

  const deliverables = [
    { title: 'Identidade Visual & Rebranding', desc: 'Logos, paletas de cores, tipografia e diretrizes completas de marca.' },
    { title: 'Frota & Material de Campo', desc: 'Layouts de veículos, uniformes, crachás e kits de instalação.' },
    { title: 'Apresentações B2B & Mídia Kit', desc: 'Pitch decks corporativos para vendas de Link Dedicado e Trânsito IP.' },
    { title: 'Landing Pages & Mídia Digital', desc: 'Páginas otimizadas para captação de leads e vendas de planos.' },
    { title: 'Material para Feiras e Eventos', desc: 'Stands, backdrops, folders e brindes institucionais para eventos de telecom.' },
    { title: 'Guia de Comunicação Interna', desc: 'Treinamento de marca para atendimento, suporte e técnicos de campo.' }
  ];

  return (
    <div className="pt-28 pb-16 bg-[#F3EDE0] text-[#43210D]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative px-6 py-16 sm:py-24 overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFC400]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-widest inline-block font-sans mb-6 shadow-sm">
                ESPECIALIZAÇÃO // TELECOM & ISPS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold text-[#43210D] leading-[1.12] tracking-tight mb-6 font-heading"
            >
              Conhecemos o Universo da <span className="text-[#E17541] underline decoration-[#FFC400] decoration-4 underline-offset-4">Fibra</span>, da Retenção e do B2B.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-[#43210D]/85 leading-relaxed font-sans font-medium mb-8 max-w-3xl mx-auto"
            >
              Traduzimos infraestrutura técnica em percepção de valor e autoridade. Não vendemos apenas layouts estéticos — desenhamos estratégias visuais de comunicação que reduzem o churn, aumentam o ticket médio e blindam a sua marca no mercado regional e nacional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={onOpenModal}
                className="px-8 py-4 rounded-full bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-lg hover:shadow-xl font-sans border border-[#CE892C]/40 cursor-pointer"
              >
                <span>AGENDAR DIAGNÓSTICO PARA MEU PROVEDOR</span>
                <ArrowUpRight size={18} />
              </button>

              <a
                href="https://wa.me/5511966558126?text=Olá! Quero saber mais sobre o marketing para Telecom e Provedores de Fibra."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-white text-[#43210D] border-2 border-[#CE892C]/50 hover:border-[#FFC400] hover:bg-[#FFC400]/10 transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 font-sans shadow-sm"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                <span>FALAR NO WHATSAPP</span>
              </a>
            </motion.div>

          </div>

          {/* Core Feature Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] shadow-2xl">
            <div className="text-center p-4 border-r border-[#CE892C]/20 last:border-none">
              <span className="block text-2xl sm:text-4xl font-extrabold font-heading text-[#FFC400] mb-1">+40%</span>
              <span className="text-[11px] sm:text-xs text-[#F3EDE0]/80 font-bold uppercase font-sans">Conversão B2B</span>
            </div>
            <div className="text-center p-4 border-r border-[#CE892C]/20 last:border-none">
              <span className="block text-2xl sm:text-4xl font-extrabold font-heading text-[#E17541] mb-1">-25%</span>
              <span className="text-[11px] sm:text-xs text-[#F3EDE0]/80 font-bold uppercase font-sans">Churn Percebido</span>
            </div>
            <div className="text-center p-4 border-r border-[#CE892C]/20 last:border-none">
              <span className="block text-2xl sm:text-4xl font-extrabold font-heading text-[#FFC400] mb-1">100%</span>
              <span className="text-[11px] sm:text-xs text-[#F3EDE0]/80 font-bold uppercase font-sans">Linguagem Telecom</span>
            </div>
            <div className="text-center p-4">
              <span className="block text-2xl sm:text-4xl font-extrabold font-heading text-[#E17541] mb-1">Agilidade</span>
              <span className="text-[11px] sm:text-xs text-[#F3EDE0]/80 font-bold uppercase font-sans">Sem Gargalos</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- THE 4 PILLARS SECTION --- */}
      <section className="py-20 px-6 border-t border-[#CE892C]/30 bg-[#F3EDE0]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-wider mb-3 inline-block font-sans shadow-sm">
              METODOLOGIA DE ALTO IMPACTO
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight mb-4 font-heading">
              Os 4 Pilares do <span className="text-[#E17541]">Marketing para Telecom</span>
            </h2>
            <p className="text-[#43210D]/80 text-sm sm:text-base font-sans font-medium">
              Conheça as frentes em que atuamos para estruturar marcas sólidas e campanhas que vendem planos de internet e serviços corporativos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#31180A] border border-[#CE892C]/50 flex items-center justify-center shadow-inner">
                      {p.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#CE892C]/30 text-[#FFC400] text-[10px] font-bold uppercase tracking-widest font-sans border border-[#CE892C]/40">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#F3EDE0] mb-3 font-heading">
                    {p.title}
                  </h3>

                  <p className="text-[#F3EDE0]/80 text-xs sm:text-sm leading-relaxed font-sans font-medium mb-6">
                    {p.description}
                  </p>

                  <ul className="space-y-3 font-sans text-xs sm:text-sm text-[#F3EDE0]/90 mb-8 border-t border-[#CE892C]/20 pt-6">
                    {p.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#FFC400] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onOpenModal}
                  className="w-full py-3.5 rounded-xl bg-[#31180A] hover:bg-[#FFC400] text-[#FFC400] hover:text-[#43210D] border border-[#CE892C]/40 hover:border-[#FFC400] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 font-sans cursor-pointer"
                >
                  <span>SABER MAIS SOBRE {p.title.split(' ')[0].toUpperCase()}</span>
                  <ArrowUpRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- WHAT WE DELIVER (ENTREGÁVEIS) --- */}
      <section className="py-20 px-6 bg-white/70 border-t border-b border-[#CE892C]/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-wider mb-3 inline-block font-sans shadow-sm">
              PACOTE COMPLETO DE DESIGN & ESTRATÉGIA
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight mb-4 font-heading">
              O que Entregamos para o <span className="text-[#E17541]">Seu Provedor</span>
            </h2>
            <p className="text-[#43210D]/80 text-sm sm:text-base font-sans font-medium">
              Soluções integradas de branding, comunicação comercial e marketing digital desenhadas especificamente para operadoras e provedores de internet.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverables.map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#F3EDE0] border border-[#CE892C]/30 hover:border-[#FFC400] transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E17541] text-white flex items-center justify-center font-bold font-heading mb-4 text-sm shadow-sm">
                    0{idx + 1}
                  </div>
                  <h4 className="text-lg font-bold text-[#43210D] mb-2 font-heading">
                    {item.title}
                  </h4>
                  <p className="text-[#43210D]/80 text-xs sm:text-sm font-sans font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- GOOGLE REVIEWS IN TELECOM (TESTIMONIALS) --- */}
      <Testimonials />

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 px-6 bg-[#43210D] text-[#F3EDE0] relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <span className="px-4 py-1.5 rounded-full bg-[#FFC400] text-[#43210D] text-xs font-extrabold uppercase tracking-widest inline-block font-sans mb-6">
            PRONTO PARA ELEVAR SEU PROVEDOR DE NÍVEL?
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F3EDE0] tracking-tight mb-6 font-heading leading-tight">
            Vamos Transformar a Percepção de Marca da Sua <span className="text-[#FFC400]">Operadora</span>
          </h2>

          <p className="text-base sm:text-lg text-[#F3EDE0]/85 max-w-2xl mx-auto mb-10 font-sans font-medium">
            Agende uma conversa sem compromisso com nossos especialistas em branding para telecom. Analisamos sua comunicação atual e apresentamos um plano personalizado de evolução.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenModal}
              className="px-9 py-4 rounded-full bg-[#FFC400] text-[#43210D] hover:bg-white transition-all font-extrabold text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-xl hover:shadow-2xl font-sans cursor-pointer"
            >
              <span>SOLICITAR PROPOSTA TELECOM</span>
              <ArrowUpRight size={18} />
            </button>

            <a
              href="https://wa.me/5511966558126?text=Olá! Quero agendar um diagnóstico para o meu provedor de internet com o Studio B."
              target="_blank"
              rel="noopener noreferrer"
              className="px-9 py-4 rounded-full bg-transparent border-2 border-[#CE892C] text-[#F3EDE0] hover:bg-[#FFC400] hover:text-[#43210D] hover:border-[#FFC400] transition-all font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 font-sans"
            >
              <MessageCircle size={18} />
              <span>FALAR DIRETO NO WHATSAPP</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
