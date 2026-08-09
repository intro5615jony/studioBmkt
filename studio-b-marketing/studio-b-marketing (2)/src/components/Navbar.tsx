import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'CASES', href: '/cases', isExternal: true },
    { name: 'QUEM SOMOS', href: '/quem-somos', isExternal: true },
    { name: 'SERVIÇOS', href: '/#servicos' },
    { name: 'SEGMENTOS', href: '/segmentos', isExternal: true },
    { name: 'BLOG', href: '/blog', isExternal: true },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 pt-4 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3.5 rounded-full transition-all duration-300 flex justify-between items-center bg-[#43210D]/95 backdrop-blur-md text-[#F3EDE0] border border-[#CE892C]/40 shadow-2xl">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
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
            <div className="w-8 h-8 clip-hex bg-[#FFC400] flex items-center justify-center text-[#43210D] font-black text-base font-heading shadow-sm">B</div>
            <span className="font-black text-lg tracking-tight uppercase font-heading text-[#F3EDE0]">
              Studio <span className="text-[#FFC400]">B</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            link.isExternal ? (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-xs font-extrabold transition-colors uppercase tracking-wider font-sans text-[#F3EDE0]/90 hover:text-[#FFC400]"
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-xs font-extrabold transition-colors uppercase tracking-wider font-sans text-[#F3EDE0]/90 hover:text-[#FFC400]"
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center">
          <button 
            onClick={onOpenModal}
            className="bg-[#FFC400] text-[#43210D] hover:bg-[#F3EDE0] hover:text-[#43210D] transition-all px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg font-sans border border-[#CE892C]/40"
          >
            <span>VAMOS CRIAR ALGO ÚNICO</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[#F3EDE0] hover:text-[#FFC400] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 w-full bg-[#43210D] text-[#F3EDE0] border border-[#CE892C]/40 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              link.isExternal ? (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-base font-bold text-[#F3EDE0] hover:text-[#FFC400] transition-colors font-heading"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-base font-bold text-[#F3EDE0] hover:text-[#FFC400] transition-colors font-heading"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenModal();
              }}
              className="bg-[#FFC400] text-[#43210D] w-full py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 font-sans shadow-md"
            >
              <span>VAMOS CRIAR ALGO ÚNICO</span>
              <ArrowUpRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
