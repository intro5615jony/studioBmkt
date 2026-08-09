import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';
import { MarketingTelecom } from './pages/MarketingTelecom';
import { Cases } from './pages/Cases';
import { CaseDetail } from './pages/CaseDetail';
import { QuemSomos } from './pages/QuemSomos';
import { Segmentos } from './pages/Segmentos';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Star, User, Clock, ArrowRight, MessageCircle, Mail, ChevronRight, X, ExternalLink } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { AboutStudio } from './components/AboutStudio';
import { ServicesBento } from './components/ServicesBento';
import { Portfolio } from './components/Portfolio';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// --- Scroll To Top Helper ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// --- Page Transition Wrapper ---
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

import { blogPosts } from './data/posts';

// --- HOME BLOG SECTION ---
const HomeBlogSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snap) => {
      const docsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docsData.length > 0) {
        setPosts(docsData);
      } else {
        setPosts(blogPosts.slice(0, 3).map(p => ({ ...p, imageUrl: p.image })));
      }
      setLoading(false);
    }, (err) => {
      console.error("Posts fetch error:", err);
      setPosts(blogPosts.slice(0, 3).map(p => ({ ...p, imageUrl: p.image })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-[#F3EDE0] text-[#43210D] border-t border-[#CE892C]/30">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#CE892C]/30">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-wider mb-4 inline-block font-sans shadow-sm">
              EDITORIAL // INSIGHTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight font-heading">
              Artigos & <span className="text-[#E17541]">Estratégia</span>
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="text-xs font-bold uppercase tracking-wider text-[#E17541] hover:text-[#43210D] transition-colors flex items-center gap-2 mt-4 md:mt-0 font-sans"
          >
            <span>VER TODOS OS ARTIGOS</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group bg-white rounded-3xl overflow-hidden border-2 border-[#CE892C]/30 hover:border-[#FFC400] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div className="h-48 relative overflow-hidden bg-[#43210D]">
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 font-sans text-xs">
                    [EDITORIAL STUDIO B]
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#43210D] text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase font-sans">
                    {post.category || 'Estratégia'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-extrabold mb-3 leading-snug group-hover:text-[#E17541] transition-colors font-heading text-[#43210D]">
                  {post.title}
                </h3>
                <p className="text-[#43210D]/70 text-xs leading-relaxed mb-6 flex-1 font-sans line-clamp-3 font-medium">
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#CE892C]/20 text-[10px] text-[#43210D]/60 font-sans font-bold">
                  <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Studio B'}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.time || '5 min'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- Home Component ---
const Home = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <>
      <Hero onOpenModal={onOpenModal} />
      <SocialProof />
      <AboutStudio />
      <ServicesBento onOpenModal={onOpenModal} />
      <Portfolio />
      <Testimonials />
      <HomeBlogSection />
      <ContactSection />
    </>
  );
};

// --- App Root ---
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <AppContent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Router>
  );
}

function AppContent({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#F3EDE0] text-[#43210D] font-sans selection:bg-[#FFC400] selection:text-[#43210D]">
      {!isAdmin && <Navbar onOpenModal={() => setIsModalOpen(true)} />}
      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/cases" element={<Cases onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/cases/:slug" element={<CaseDetail onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/quem-somos" element={<QuemSomos onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/sobre" element={<QuemSomos onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/marketing-para-telecom" element={<Segmentos defaultSegment="telecom" onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/segmentos" element={<Segmentos defaultSegment="telecom" onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/segmentos/:segmentId" element={<Segmentos defaultSegment="telecom" onOpenModal={() => setIsModalOpen(true)} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </PageTransition>
      </main>
      {!isAdmin && <Footer />}
      
      {/* Global Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#43210D]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-[#43210D] text-[#F3EDE0] border-2 border-[#CE892C] rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-[#F3EDE0]/60 hover:text-[#F3EDE0] transition-colors"
              >
                <X size={22} />
              </button>

              <div className="text-center mb-8">
                <span className="px-3.5 py-1 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-wider mb-3 inline-block font-sans">
                  CONTATO // PROJETOS
                </span>
                <h3 className="text-2xl font-extrabold text-[#F3EDE0] mb-2 font-heading">
                  Iniciar Projeto com o <span className="text-[#FFC400]">Studio B Marketing</span>
                </h3>
                <p className="text-[#F3EDE0]/80 text-xs font-sans font-medium">
                  Escolha o canal de sua preferência para conversarmos sobre o seu projeto.
                </p>
              </div>

              <div className="flex flex-col gap-4 font-sans">
                <a 
                  href="https://wa.me/5511966558126?text=Olá! Gostaria de conversar com a equipe do Studio B sobre um projeto de branding ou comunicação." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-[#31180A] border border-[#CE892C]/40 p-5 rounded-2xl hover:border-[#FFC400] transition-all text-left"
                >
                  <div className="w-10 h-10 bg-[#FFC400] rounded-xl flex items-center justify-center text-[#43210D] font-bold">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <p className="text-[#F3EDE0] font-bold text-sm">Conversar no WhatsApp</p>
                    <p className="text-[#F3EDE0]/60 text-xs">+55 11 9 6655-8126</p>
                  </div>
                  <ChevronRight className="ml-auto text-[#FFC400] group-hover:translate-x-1 transition-transform" size={18} />
                </a>

                <a 
                  href="mailto:contato@studiobmkt.com.br"
                  className="group flex items-center gap-4 bg-[#31180A] border border-[#CE892C]/40 p-5 rounded-2xl hover:border-[#FFC400] transition-all text-left"
                >
                  <div className="w-10 h-10 bg-[#E17541] text-white rounded-xl flex items-center justify-center font-bold">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[#F3EDE0] font-bold text-sm">Enviar por E-mail</p>
                    <p className="text-[#F3EDE0]/60 text-xs">contato@studiobmkt.com.br</p>
                  </div>
                  <ChevronRight className="ml-auto text-[#FFC400] group-hover:translate-x-1 transition-transform" size={18} />
                </a>
              </div>

              <p className="text-center mt-6 text-[11px] font-sans text-[#F3EDE0]/50 uppercase font-bold">
                STUDIO B // BRANDING, DESIGN & ESTRATÉGIA
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Honeycomb WhatsApp Button */}
      <a 
        href="https://wa.me/5511966558126" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 clip-hex bg-[#FFC400] text-[#43210D] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
        title="Conversar no WhatsApp"
      >
        <MessageCircle size={28} className="relative z-10" />
      </a>
    </div>
  );
}
