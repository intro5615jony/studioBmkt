import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 border-t border-[#CE892C]/30 bg-[#43210D] text-[#F3EDE0] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation & Contact Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Studio B Marketing Logo" 
                className="h-8 w-auto object-contain" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
                }}
              />
              <div className="fallback-logo hidden flex items-center gap-2">
                <div className="w-8 h-8 clip-hex bg-[#FFC400] flex items-center justify-center text-[#43210D] font-black text-base font-heading">B</div>
                <span className="text-[#F3EDE0] font-black text-lg uppercase font-heading">Studio B Marketing</span>
              </div>
            </div>
            <p className="text-[#F3EDE0]/70 text-xs leading-relaxed max-w-xs mx-auto md:mx-0 font-sans font-medium">
              Studio B Marketing é um estúdio criativo e estratégico especializado em branding, design, marketing e experiências digitais para marcas que querem crescer com identidade.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start font-sans text-xs">
            <p className="text-[#FFC400] uppercase tracking-wider font-bold mb-1">// NAVEGAÇÃO</p>
            <Link to="/cases" className="text-[#F3EDE0]/80 hover:text-[#FFC400] transition-colors">Cases</Link>
            <Link to="/quem-somos" className="text-[#F3EDE0]/80 hover:text-[#FFC400] transition-colors">Quem Somos</Link>
            <a href="/#servicos" className="text-[#F3EDE0]/80 hover:text-[#FFC400] transition-colors">Serviços</a>
            <Link to="/segmentos" className="text-[#F3EDE0]/80 hover:text-[#FFC400] transition-colors">Segmentos</Link>
            <Link to="/blog" className="text-[#F3EDE0]/80 hover:text-[#FFC400] transition-colors">Blog & Insights</Link>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start text-xs font-sans">
            <p className="text-[#FFC400] uppercase tracking-wider font-bold mb-1">// ATENDIMENTO DIRETO</p>
            <a href="https://wa.me/5511966558126" target="_blank" rel="noopener noreferrer" className="text-[#F3EDE0]/80 hover:text-[#FFC400] flex items-center gap-2 transition-colors">
              <MessageCircle size={14} className="text-[#FFC400]" />
              <span>+55 11 9 6655-8126</span>
            </a>
            <a href="https://wa.me/5511977273445" target="_blank" rel="noopener noreferrer" className="text-[#F3EDE0]/80 hover:text-[#FFC400] flex items-center gap-2 transition-colors">
              <MessageCircle size={14} className="text-[#FFC400]" />
              <span>+55 11 9 7727-3445</span>
            </a>
            <a href="https://www.instagram.com/refurtadomkt" target="_blank" rel="noopener noreferrer" className="text-[#F3EDE0]/80 hover:text-[#FFC400] flex items-center gap-2 transition-colors">
              <Instagram size={14} className="text-[#FFC400]" />
              <span>@refurtadomkt</span>
            </a>
            <a href="mailto:contato@studiobmkt.com.br" className="text-[#F3EDE0]/80 hover:text-[#FFC400] flex items-center gap-2 transition-colors">
              <Mail size={14} className="text-[#FFC400]" />
              <span>contato@studiobmkt.com.br</span>
            </a>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#F3EDE0]/10 text-center text-[11px] font-sans text-[#F3EDE0]/50 font-medium">
          © 2026 STUDIO B MARKETING // ESTÚDIO CRIATIVO & BRANDING AUTORAL. TODOS OS DIREITOS RESERVADOS.
        </div>

      </div>
    </footer>
  );
};
