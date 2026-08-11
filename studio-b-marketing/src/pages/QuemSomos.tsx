import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, MessageCircle, Layers, MessageSquare, CheckCircle2, ShieldCheck, Sparkles, Users, Compass, Zap } from 'lucide-react';

interface QuemSomosProps {
  onOpenModal: () => void;
}

export const QuemSomos: React.FC<QuemSomosProps> = ({ onOpenModal }) => {
  const pilares = [
    {
      title: 'Organização',
      icon: <Layers className="w-7 h-7 text-[#E17541]" />,
      desc: 'Processos claros para que a criatividade flua sem caos e com entregas pontuais.'
    },
    {
      title: 'Comunicação',
      icon: <MessageSquare className="w-7 h-7 text-[#FFC400]" />,
      desc: 'Traduzimos conceitos técnicos complexos em mensagens simples, diretas e marcantes.'
    },
    {
      title: 'Eficiência',
      icon: <Zap className="w-7 h-7 text-[#E17541]" />,
      desc: 'Estratégias visuais pensadas para gerar percepção de autoridade e resultado comercial real.'
    },
    {
      title: 'Colaboração',
      icon: <Users className="w-7 h-7 text-[#FFC400]" />,
      desc: 'Não somos uma fábrica de artes estáticas. Somos o braço criativo e estratégico do seu negócio.'
    }
  ];

  const diferenciais = [
    {
      id: '01',
      title: 'Estratégia antes da execução',
      desc: 'Antes de criar, entendemos seu negócio, público, objetivos e momento. Porque uma boa comunicação começa muito antes do design.'
    },
    {
      id: '02',
      title: 'Direção Criativa & Branding',
      desc: 'Cada projeto é pensado para construir identidade, diferenciação e consistência — sem fórmulas prontas ou soluções genéricas.'
    },
    {
      id: '03',
      title: 'Atendimento Direto & Estratégico',
      desc: 'Você acompanha o projeto de perto e conversa diretamente com quem pensa, cria e executa a estratégia da sua marca.'
    }
  ];

  return (
    <div className="pt-28 pb-16 bg-[#F3EDE0] text-[#43210D]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative px-6 py-16 sm:py-20 overflow-hidden border-b border-[#CE892C]/30 bg-gradient-to-b from-[#F3EDE0] to-white/40">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold text-[#43210D] leading-[1.15] tracking-tight mb-6 font-heading"
          >
            Design autoral, inteligência estratégica e <span className="text-[#E17541] underline decoration-[#FFC400] decoration-4 underline-offset-4">paixão pelo que criamos.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-xl text-[#43210D]/85 leading-relaxed font-sans font-medium max-w-3xl mx-auto"
          >
            O Studio B Marketing nasceu da inquietação contra o marketing genérico e as fórmulas prontas de agências tradicionais. Unimos o rigor técnico da comunicação B2B e corporativa com um olhar estético apurado e autêntico.
          </motion.p>

        </div>
      </section>

      {/* --- NOVA SEÇÃO: QUEM FAZ O STUDIO B --- */}
      <section className="py-20 sm:py-28 px-6 bg-[#F3EDE0] border-b border-[#CE892C]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* 01 — REBECA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Text Column (60-65% on desktop -> col-span-7) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-4"
            >
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] font-heading tracking-tight leading-tight">
                Prazer, eu sou a Rebeca.
              </h2>

              <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#E17541] font-sans">
                Fundadora &amp; Diretora Criativa
              </p>

              <div className="space-y-4 text-sm sm:text-base text-[#43210D]/85 font-sans font-medium leading-relaxed pt-2">
                <p>
                  Minha trajetória no marketing sempre esteve entre dois mundos: <span className="font-bold text-[#E17541]">estratégia e criação</span>. Foi justamente dessa combinação que nasceu o <span className="font-bold text-[#43210D]">Studio B</span> — um estúdio pensado para transformar ideias, marcas e negócios através de uma comunicação que tenha intenção.
                </p>
                <p>
                  Ao longo da minha trajetória, passei por diferentes áreas do marketing, incluindo <span className="font-bold text-[#43210D]">design, social media, eventos, comunicação B2B, criação de sites</span> e projetos ligados principalmente aos mercados de <span className="font-bold text-[#E17541]">tecnologia e telecom</span>.
                </p>
                <p>
                  Essa visão multidisciplinar é o que levo para cada projeto do Studio B: não criar apenas algo bonito, mas <span className="font-bold text-[#E17541]">construir algo que faça sentido</span> para a marca, para o negócio e para quem está do outro lado.
                </p>
              </div>
            </motion.div>

            {/* Photo Column (35-40% on desktop -> col-span-5) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-2 border-[#CE892C]/40 bg-[#43210D]">
                <img
                  src="/FOTO REBECA.jpeg"
                  alt="Rebeca - Fundadora & Diretora Criativa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>

          {/* DIVISOR */}
          <div className="my-16 sm:my-24">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E17541]/60 to-transparent" />
          </div>

          {/* 02 — JOÃO PEDRO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Photo Column (35-40% on desktop -> col-span-5) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex justify-center lg:justify-start"
            >
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-2 border-[#CE892C]/40 bg-[#43210D]">
                <img
                  src="/FOTO JOAO.png"
                  alt="João Pedro - Comercial & Soluções Digitais"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Text Column (60-65% on desktop -> col-span-7) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-7 space-y-4"
            >
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] font-heading tracking-tight leading-tight">
                Prazer, eu sou o João Pedro.
              </h2>

              <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#E17541] font-sans">
                COMERCIAL &amp; SOLUÇÕES DIGITAIS
              </p>

              <div className="space-y-4 text-sm sm:text-base text-[#43210D]/85 font-sans font-medium leading-relaxed pt-2">
                <p>
                  Minha trajetória profissional começou na <span className="font-bold text-[#E17541]">área comercial</span>, onde desenvolvi meu olhar para negócios, relacionamento e para entender as necessidades de cada cliente. Depois, passei pela área de <span className="font-bold text-[#E17541]">T.I.</span> e segui para <span className="font-bold text-[#E17541]">desenvolvimento de sistemas</span>, unindo cada vez mais tecnologia e visão de negócio.
                </p>
                <p>
                  Hoje, estou à frente da área <span className="font-bold text-[#E17541]">Comercial do Studio B Marketing</span> e também participo da construção de <span className="font-bold text-[#E17541]">sites, sistemas e soluções digitais</span>, além de contribuir para o <span className="font-bold text-[#E17541]">posicionamento de marcas no digital</span>.
                </p>
                <p>
                  Também atuo na frente comercial do Studio B Marketing, ajudando a entender as necessidades de cada negócio e transformá-las em <span className="font-bold text-[#E17541]">projetos e soluções que realmente façam sentido para cada cliente</span>.
                </p>
                <p>
                  Enquanto a criação e a estratégia de comunicação ganham forma, ajudo a <span className="font-bold text-[#E17541]">transformar ideias em soluções digitais e oportunidades de negócio</span>.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* --- SEÇÃO 02: A ESSÊNCIA DA NOSSA COLMEIA (PILARES) --- */}
      <section className="py-20 px-6 border-b border-[#CE892C]/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight font-heading">
              Nossos Pilares de <span className="text-[#E17541]">Atuação</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pilares.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-8 rounded-3xl bg-white/90 border-2 border-[#CE892C]/40 hover:border-[#FFC400] transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F3EDE0] border border-[#CE892C]/30 flex items-center justify-center mb-6 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#43210D] mb-3 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-[#43210D]/80 text-xs sm:text-sm font-sans font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- SEÇÃO 03: MANIFESTO AUTORAL (CARD ESCURO DE CONTRASTE) --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="p-8 sm:p-14 rounded-3xl bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] shadow-2xl relative overflow-hidden text-center">
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="text-2xl sm:text-4xl font-extrabold text-[#FFC400] leading-snug mb-8 font-heading">
                "Acreditamos que marcas técnicas não precisam ser chatas. E marcas criativas não podem ser superficiais."
              </p>

              <div className="w-16 h-1 bg-[#E17541] mx-auto rounded-full mb-8" />

              <p className="text-sm sm:text-base text-[#F3EDE0]/90 leading-relaxed font-sans font-medium">
                Seja na estruturação da comunicação de uma empresa de tecnologia, no design para saúde ou no rebranding de uma marca autoral, nosso compromisso é o mesmo: construir universos visuais marcantes que diferenciam empresas comuns de líderes de mercado.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* --- SEÇÃO 04: POR QUE O STUDIO B MARKETING (EDITORIAL MINIMALISTA) --- */}
      <section className="py-20 sm:py-28 px-6 bg-white/60 border-t border-b border-[#CE892C]/30">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight font-heading">
              Por que o <span className="text-[#E17541]">Studio B Marketing</span>?
            </h2>
          </div>

          <div className="divide-y divide-[#CE892C]/30 border-t border-b border-[#CE892C]/30">
            {diferenciais.map((bloc) => (
              <div 
                key={bloc.id}
                className="py-10 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
              >
                <div className="md:col-span-2">
                  <span className="text-3xl sm:text-5xl font-extrabold text-[#E17541] font-heading tracking-wider block">
                    {bloc.id}
                  </span>
                </div>
                <div className="md:col-span-10 space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#43210D] font-heading leading-tight">
                    {bloc.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#43210D]/85 font-sans font-medium leading-relaxed max-w-3xl">
                    {bloc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- SEÇÃO 05: CHAMADA FINAL (CTA DE CONTATO) --- */}
      <section className="py-20 px-6 bg-[#43210D] text-[#F3EDE0] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F3EDE0] tracking-tight mb-6 font-heading leading-tight">
            Pronto para transformar a percepção da sua <span className="text-[#FFC400]">marca</span>?
          </h2>

          <p className="text-base sm:text-lg text-[#F3EDE0]/85 max-w-xl mx-auto mb-10 font-sans font-medium">
            Vamos tomar um café digital e entender o momento do seu negócio.
          </p>

          <button
            onClick={onOpenModal}
            className="px-9 py-4.5 rounded-full bg-[#FFC400] text-[#43210D] hover:bg-white transition-all font-extrabold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2.5 shadow-xl hover:shadow-2xl font-sans cursor-pointer"
          >
            <span>INICIAR UM PROJETO</span>
            <ArrowUpRight size={18} />
          </button>

        </div>
      </section>

    </div>
  );
};
