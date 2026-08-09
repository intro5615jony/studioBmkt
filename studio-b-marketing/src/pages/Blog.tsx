import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { blogPosts } from '../data/posts';

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');

  const categories = [
    'TODOS',
    'MARKETING',
    'BRANDING',
    'DESIGN',
    'IA',
    'NEGÓCIOS',
    'TELECOM'
  ];

  useEffect(() => {
    const q = query(
      collection(db, 'posts'), 
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      const docsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docsData.length > 0) {
        setPosts(docsData);
      } else {
        setPosts(blogPosts.map(p => ({ ...p, imageUrl: p.image })));
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore posts error:", err);
      setPosts(blogPosts.map(p => ({ ...p, imageUrl: p.image })));
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'TODOS') return posts;

    return posts.filter(post => {
      const cat = (post.category || '').toUpperCase();
      const tags = (post.tags || []).map((t: string) => t.toUpperCase());
      const title = (post.title || '').toUpperCase();

      if (activeCategory === 'MARKETING') {
        return cat.includes('MARKETING') || tags.some((t: string) => t.includes('MARKETING'));
      }
      if (activeCategory === 'BRANDING') {
        return cat.includes('BRANDING') || tags.some((t: string) => t.includes('BRANDING'));
      }
      if (activeCategory === 'DESIGN') {
        return cat.includes('DESIGN') || tags.some((t: string) => t.includes('DESIGN') || t.includes('UX') || t.includes('UI'));
      }
      if (activeCategory === 'IA') {
        return cat.includes('IA') || cat.includes('INTELIGÊNCIA') || tags.some((t: string) => t.includes('IA') || t.includes('AI') || t.includes('INTELIGÊNCIA'));
      }
      if (activeCategory === 'NEGÓCIOS') {
        return cat.includes('NEGÓCIOS') || cat.includes('B2B') || tags.some((t: string) => t.includes('NEGÓCIOS') || t.includes('B2B') || t.includes('SEO') || t.includes('TRÁFEGO'));
      }
      if (activeCategory === 'TELECOM') {
        return cat.includes('TELECOM') || cat.includes('ISP') || tags.some((t: string) => t.includes('TELECOM') || t.includes('ISP'));
      }
      return cat === activeCategory || tags.includes(activeCategory);
    });
  }, [activeCategory, posts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EDE0] flex items-center justify-center">
        <Loader2 className="text-[#FFC400] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EDE0] text-[#43210D] font-sans pt-24 bg-honeycomb-pattern">
      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="px-3.5 py-1 rounded-full bg-[#E17541] text-white text-xs font-bold uppercase tracking-wider mb-4 inline-block font-sans">
            EDITORIAL & INSIGHTS // STUDIO B
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-heading text-[#43210D]">
            Pensamento & <span className="text-[#E17541]">Estratégia</span>
          </h1>
          <p className="text-[#43210D]/80 text-base max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            Conteúdos sobre marketing, branding, design, tecnologia, inteligência artificial e os bastidores de construir marcas relevantes.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14 max-w-4xl mx-auto font-sans">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FFC400] text-[#43210D] border-[#FFC400] shadow-md'
                  : 'bg-white text-[#43210D]/70 border-[#CE892C]/30 hover:border-[#FFC400] hover:text-[#43210D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-md transition-all group cursor-pointer border-2 border-[#CE892C]/30 hover:border-[#FFC400] flex flex-col hover:-translate-y-1"
            >
              <div className="h-56 relative overflow-hidden bg-[#43210D]">
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[#43210D] flex items-center justify-center text-[#F3EDE0]/30 font-sans text-xs">
                    [MÍDIA EDITORIAL]
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#43210D] text-[#FFC400] border border-[#FFC400]/40 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase font-sans">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col">
                <h3 className="text-xl font-extrabold mb-3 leading-tight group-hover:text-[#E17541] transition-colors font-heading text-[#43210D]">
                  {post.title}
                </h3>
                <p className="text-[#43210D]/80 text-xs leading-relaxed mb-6 flex-1 font-sans font-medium line-clamp-3">
                  {post.description}
                </p>
                
                {/* Post Tags */}
                <div className="flex flex-wrap gap-2 mb-6 font-sans">
                  {post.tags && post.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[10px] font-bold text-[#E17541] uppercase tracking-tight flex items-center gap-1 bg-[#E17541]/10 px-2.5 py-0.5 rounded-full border border-[#E17541]/20">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#CE892C]/20 text-xs font-bold text-[#43210D]/60 font-sans">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.time}</span>
                  </div>
                  <ArrowRight size={16} className="text-[#FFC400] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#43210D]/60 font-sans text-sm font-bold uppercase tracking-widest">Nenhum artigo encontrado para esta tag.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
