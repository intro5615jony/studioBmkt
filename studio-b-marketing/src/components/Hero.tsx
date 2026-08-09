import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onOpenModal: () => void;
}

const PHRASES = [
  "conecta pessoas.",
  "move o mercado.",
  "constrói autoridade."
];

export const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  // Smooth Parallax setup for background light orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Top-Right Orb
  const orbTopRightX = useTransform(smoothX, [-0.5, 0.5], [60, -60]);
  const orbTopRightY = useTransform(smoothY, [-0.5, 0.5], [60, -60]);

  // Bottom-Left Orb
  const orbBottomLeftX = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
  const orbBottomLeftY = useTransform(smoothY, [-0.5, 0.5], [-60, 60]);

  // Typewriter State
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState(PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = PHRASES[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === fullText) {
      // Pause 2 seconds at full phrase
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && currentText === '') {
      // Switch to next phrase when empty
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    } else {
      // Typing or deleting animation speed
      const speed = isDeleting ? 45 : 85;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const x = (e.clientX / clientWidth) - 0.5;
    const y = (e.clientY / clientHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] pt-36 pb-20 overflow-hidden bg-[#F3EDE0] text-[#43210D] bg-honeycomb-pattern flex items-center justify-center"
    >
      {/* Dynamic Parallax Glow Orbs */}
      <motion.div 
        style={{ x: orbTopRightX, y: orbTopRightY }}
        className="absolute top-10 right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FFC400]/30 via-[#E17541]/20 to-transparent blur-[120px] pointer-events-none z-0"
      />
      <motion.div 
        style={{ x: orbBottomLeftX, y: orbBottomLeftY }}
        className="absolute bottom-10 left-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#CE892C]/25 via-[#F8C84D]/20 to-transparent blur-[130px] pointer-events-none z-0"
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10 w-full text-center flex flex-col items-center">
        
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#43210D] leading-[1.18] tracking-tight mb-6 font-heading max-w-4xl text-center"
        >
          Marketing, Design e Estratégia para marcas que querem ir além.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#43210D]/85 text-base sm:text-lg font-medium leading-relaxed mb-10 max-w-2xl font-sans"
        >
          O Studio B Marketing une estratégia, criatividade e design para construir marcas fortes, desejadas e relevantes. Da identidade à presença digital, criamos soluções que conectam posicionamento, comunicação e crescimento.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={onOpenModal}
            className="w-full sm:w-auto bg-[#FFC400] text-[#43210D] hover:bg-[#43210D] hover:text-[#FFC400] transition-all duration-300 px-8 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-xl font-sans border-2 border-[#FFC400]"
          >
            <span>VAMOS CRIAR ALGO ÚNICO</span>
            <ArrowUpRight size={18} />
          </button>

          <Link 
            to="/cases"
            className="w-full sm:w-auto bg-transparent text-[#43210D] hover:bg-[#FFC400] hover:border-[#FFC400] transition-all duration-300 px-8 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#43210D] font-sans shadow-sm"
          >
            <span>CONHEÇA NOSSOS CASES</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

