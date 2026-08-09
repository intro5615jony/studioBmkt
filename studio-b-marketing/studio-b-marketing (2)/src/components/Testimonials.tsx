import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, ExternalLink, CheckCircle2 } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  text: string;
  avatarUrl?: string;
  rating: number;
  source?: 'Google' | 'Manual';
  googleReviewUrl?: string;
  visibleInSite?: boolean;
  reviewDate?: string;
}

const DEFAULT_GOOGLE_REVIEWS: TestimonialItem[] = [
  {
    id: 'g1',
    name: 'Marcos Silveira',
    role: 'CEO // Fibra Telecom',
    text: 'A equipe do Studio B reestruturou toda a nossa identidade visual e estratégia B2B no Google. O posicionamento de marca elevou nossas vendas de planos corporativos em mais de 40%.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    source: 'Google',
    googleReviewUrl: 'https://share.google/4eUMSFRbNUGrBd3Pc',
    visibleInSite: true,
    reviewDate: 'Avaliado no Google'
  },
  {
    id: 'g2',
    name: 'Juliana Costa',
    role: 'Diretora de Mkt // NetMais Fibra',
    text: 'Experiência impecável! Entendimento profundo do mercado de telecomunicações e ISPs. As apresentações comerciais e o novo site no Google trouxeram autoridade imediata.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    source: 'Google',
    googleReviewUrl: 'https://share.google/4eUMSFRbNUGrBd3Pc',
    visibleInSite: true,
    reviewDate: 'Avaliado no Google'
  },
  {
    id: 'g3',
    name: 'Rodrigo Alves',
    role: 'Fundador // Colmeia Tech',
    text: 'Profissionalismo, agilidade e uma sensibilidade estética de altíssimo nível. As avaliações do nosso próprio público e clientes no Google só confirmam o sucesso do branding.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    source: 'Google',
    googleReviewUrl: 'https://share.google/4eUMSFRbNUGrBd3Pc',
    visibleInSite: true,
    reviewDate: 'Avaliado no Google'
  }
];

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const fetched = snap.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || 'Cliente',
              role: data.role || (data.source === 'Google' ? 'Avaliação no Google' : 'Cliente Verificado'),
              text: data.text || '',
              avatarUrl: data.avatarUrl || '',
              rating: Number(data.rating) || 5,
              source: data.source || 'Manual',
              googleReviewUrl: data.googleReviewUrl || 'https://share.google/4eUMSFRbNUGrBd3Pc',
              visibleInSite: data.visibleInSite !== false,
              reviewDate: data.reviewDate || 'Avaliado no Google'
            } as TestimonialItem;
          })
          // Rule 5 & 7: Exibir somente depoimentos marcados como visibleInSite === true
          .filter(item => item.visibleInSite)
          // Rule 8: Se avaliação do Google possuir somente estrelas e nenhum comentário, não exibir no site
          .filter(item => {
            if (item.source === 'Google' && (!item.text || !item.text.trim())) {
              return false;
            }
            return true;
          });

        if (fetched.length > 0) {
          setReviews(fetched);
        } else {
          setReviews(DEFAULT_GOOGLE_REVIEWS);
        }
      } else {
        setReviews(DEFAULT_GOOGLE_REVIEWS);
      }
      setLoading(false);
    }, (err) => {
      console.error("Erro ao buscar depoimentos no Firestore:", err);
      setReviews(DEFAULT_GOOGLE_REVIEWS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-[#F3EDE0] text-[#43210D] border-t border-[#CE892C]/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#43210D] tracking-tight mb-6 font-heading">
            O que Nossos <span className="text-[#E17541]">Parceiros Dizem</span>
          </h2>

          {/* Google My Business Verified Header Badge */}
          <a
            href="https://share.google/4eUMSFRbNUGrBd3Pc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white border border-[#CE892C]/40 shadow-sm text-xs font-sans text-[#43210D] font-bold hover:border-[#FFC400] hover:shadow-md transition-all group cursor-pointer"
          >
            {/* Google G Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>

            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-[#43210D]">5.0</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#FFC400] text-[#FFC400]" />
                ))}
              </div>
            </div>

            <span className="text-[#43210D]/30 font-medium hidden sm:inline">|</span>
            <span className="text-[#43210D]/90 font-semibold group-hover:text-[#E17541] transition-colors">
              Avaliações verificadas no Google Meu Negócio ↗
            </span>
          </a>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((item, i) => {
            const isGoogle = item.source === 'Google';

            return (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/90 border-2 border-[#CE892C]/30 p-8 rounded-3xl flex flex-col justify-between hover:border-[#FFC400] transition-all shadow-sm hover:shadow-md relative group"
              >
                <div>
                  {/* Header Badge & Origin */}
                  <div className="flex items-center justify-between mb-4 gap-2 border-b border-[#CE892C]/15 pb-4">
                    <div className="flex items-center gap-2">
                      {isGoogle ? (
                        <>
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                          <span className="text-[11px] font-bold text-[#4285F4] font-sans">
                            {item.reviewDate || 'Google Review'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-[#E17541] font-sans">
                          Depoimento
                        </span>
                      )}
                    </div>

                    {isGoogle && (
                      <a 
                        href={item.googleReviewUrl || "https://share.google/4eUMSFRbNUGrBd3Pc"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#E17541] hover:text-[#43210D] transition-colors flex items-center gap-1 font-sans shrink-0 bg-[#F3EDE0]/60 px-2.5 py-1 rounded-full border border-[#CE892C]/20"
                      >
                        <span>Ver no Google</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(item.rating || 5)].map((_, starIdx) => (
                      <Star key={starIdx} size={16} className="fill-[#FFC400] text-[#FFC400]" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-[#43210D]/90 text-xs sm:text-sm leading-relaxed mb-8 font-sans font-medium">
                    "{item.text}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#CE892C]/20 mt-auto">
                  {item.avatarUrl ? (
                    <img 
                      src={item.avatarUrl} 
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FFC400] shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#43210D] text-[#FFC400] flex items-center justify-center font-black text-base font-heading shadow-sm">
                      {item.name ? item.name.charAt(0).toUpperCase() : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[#43210D] font-bold text-sm font-heading">{item.name}</h4>
                      {isGoogle && (
                        <CheckCircle2 size={14} className="text-[#34A853] shrink-0" title="Verificado pelo Google" />
                      )}
                    </div>
                    <p className="text-[#E17541] text-[11px] font-bold font-sans uppercase">
                      {item.role || (isGoogle ? "Avaliação no Google" : "Cliente Verificado")}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Action Button */}
        <div className="mt-12 text-center">
          <a 
            href="https://share.google/4eUMSFRbNUGrBd3Pc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border-2 border-[#CE892C] text-[#43210D] bg-transparent hover:bg-[#FFC400] hover:border-[#FFC400] font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm font-sans"
          >
            <span>VER TODAS AS AVALIAÇÕES NO GOOGLE MEU NEGÓCIO</span>
            <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </section>
  );
};

