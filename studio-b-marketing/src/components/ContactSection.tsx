import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Send, Loader2, CheckCircle, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    segment: 'Telecom & Tecnologia',
    modules: [] as string[],
    message: ''
  });

  const [errors, setErrors] = useState<{
    name?: string;
    company?: string;
    whatsapp?: string;
    email?: string;
  }>({});

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const availableModules = [
    'Branding & Identidade Visual',
    'Social Media & Conteúdo Estratégico',
    'Web Design & Desenvolvimento',
    'Marketing & Performance',
    'Design & Comunicação Visual',
    'Consultoria & Posicionamento'
  ];

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const handleModuleToggle = (mod: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(mod)
        ? prev.modules.filter(m => m !== mod)
        : [...prev.modules, mod]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validar os campos obrigatórios
    const newErrors: { name?: string; company?: string; whatsapp?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, informe seu nome.';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Por favor, informe sua empresa.';
    }

    const whatsappDigits = formData.whatsapp.replace(/\D/g, '');
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Por favor, informe seu WhatsApp.';
    } else if (whatsappDigits.length < 10) {
      newErrors.whatsapp = 'Informe um WhatsApp válido com DDD.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, informe seu e-mail.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('loading');
    try {
      // 2. Criar novo registro de Lead no Firestore com todos os dados
      await addDoc(collection(db, 'proposals'), {
        name: formData.name.trim(),
        company: formData.company.trim(),
        whatsapp: formData.whatsapp.trim(),
        phone: formData.whatsapp.trim(),
        email: formData.email.trim(),
        segment: formData.segment || 'Telecom & Tecnologia',
        services: formData.modules,
        message: formData.message.trim(),
        // 4. Registrar data e hora automaticamente
        createdAt: Timestamp.now(),
        // 5. Registrar página/origem do formulário
        source: window.location.pathname || '/',
        // 6. Definir status inicial como "Novo"
        status: 'Novo'
      });

      // 7. Somente após salvamento bem-sucedido: mostrar sucesso e limpar formulário
      setStatus('success');
      setFormData({
        name: '',
        company: '',
        whatsapp: '',
        email: '',
        segment: 'Telecom & Tecnologia',
        modules: [],
        message: ''
      });
      setErrors({});
    } catch (err) {
      console.error("Erro ao salvar lead no banco de dados:", err);
      // Se ocorrer erro ao salvar: NÃO perde os dados preenchidos
      setStatus('error');
    }
  };

  return (
    <section id="contato" className="py-24 bg-[#43210D] text-[#F3EDE0] relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-honeycomb-dark opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Details & Brand Info */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F3EDE0] tracking-tight leading-tight mb-6 font-heading">
              Sua marca está pronta para o próximo nível?
            </h2>

            <p className="text-[#F3EDE0]/80 text-sm sm:text-base leading-relaxed mb-8 font-sans font-medium">
              Conte para a gente onde sua empresa está e onde você quer chegar. O Studio B Marketing transforma esse objetivo em estratégia, comunicação e execução.
            </p>

            {/* Direct Contact Channels */}
            <div className="space-y-4 font-sans text-xs sm:text-sm mb-10">
              
              <a 
                href="https://wa.me/5511966558126?text=Olá! Vim pelo site do Studio B e gostaria de conversar sobre um projeto." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#31180A] border border-[#CE892C]/40 hover:border-[#FFC400] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFC400] text-[#43210D] flex items-center justify-center font-bold">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[#FFC400] font-bold text-xs uppercase">ATENDIMENTO WHATSAPP</p>
                  <p className="text-[#F3EDE0] font-bold">+55 11 9 6655-8126</p>
                </div>
              </a>

              <a 
                href="mailto:contato@studiobmkt.com.br"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#31180A] border border-[#CE892C]/40 hover:border-[#FFC400] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E17541] text-white flex items-center justify-center font-bold">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[#FFC400] font-bold text-xs uppercase">E-MAIL OFICIAL</p>
                  <p className="text-[#F3EDE0] font-bold">contato@studiobmkt.com.br</p>
                </div>
              </a>

            </div>

            <div className="p-6 rounded-2xl bg-[#31180A] border border-[#CE892C]/30 text-xs font-sans text-[#F3EDE0]/70 font-medium">
              <p className="text-[#FFC400] font-bold uppercase mb-1">// PROPOSTAS EM ATÉ 24H ÚTEIS</p>
              Analisamos cada projeto individualmente com o diretor de arte e equipe estratégica.
            </div>

          </div>

          {/* Right Column: Humanized Form */}
          <div className="lg:col-span-7 bg-[#31180A] border-2 border-[#CE892C]/50 p-8 sm:p-12 rounded-3xl shadow-2xl">
            
            <h3 className="text-2xl font-extrabold text-[#F3EDE0] mb-2 font-heading">
              Formulário de Projeto
            </h3>
            <p className="text-[#F3EDE0]/70 text-xs font-sans mb-8 font-medium">
              Preencha os campos abaixo para recebermos seu briefing inicial.
            </p>

            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-[#FFC400] text-[#43210D] text-center font-sans">
                <CheckCircle className="mx-auto mb-3" size={48} />
                <h4 className="text-2xl font-extrabold font-heading mb-2">Proposta Enviada com Sucesso!</h4>
                <p className="text-xs font-bold font-sans max-w-md mx-auto mb-6">
                  Nossa equipe de estratégia visual entrará em contato em breve para dar sequência ao seu projeto.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 rounded-full bg-[#43210D] text-[#FFC400] text-xs font-extrabold uppercase font-sans"
                >
                  ENVIAR OUTRO MENSAGEM
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                
                {/* Nome & Empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                      Seu Nome *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: undefined});
                      }}
                      placeholder="Ex: Roberto Furtado"
                      className={`w-full bg-[#43210D] border ${errors.name ? 'border-red-400' : 'border-[#CE892C]/40'} rounded-xl px-4 py-3 text-xs text-[#F3EDE0] placeholder:text-[#F3EDE0]/30 focus:outline-none focus:border-[#FFC400]`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-[11px] mt-1.5 font-sans font-semibold">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                      Sua Empresa *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.company}
                      onChange={(e) => {
                        setFormData({...formData, company: e.target.value});
                        if (errors.company) setErrors({...errors, company: undefined});
                      }}
                      placeholder="Ex: Minha Empresa"
                      className={`w-full bg-[#43210D] border ${errors.company ? 'border-red-400' : 'border-[#CE892C]/40'} rounded-xl px-4 py-3 text-xs text-[#F3EDE0] placeholder:text-[#F3EDE0]/30 focus:outline-none focus:border-[#FFC400]`}
                    />
                    {errors.company && (
                      <p className="text-red-400 text-[11px] mt-1.5 font-sans font-semibold">{errors.company}</p>
                    )}
                  </div>
                </div>

                {/* WhatsApp & E-mail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                      SEU WHATSAPP *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.whatsapp}
                      onChange={(e) => {
                        const masked = formatWhatsApp(e.target.value);
                        setFormData({...formData, whatsapp: masked});
                        if (errors.whatsapp) setErrors({...errors, whatsapp: undefined});
                      }}
                      placeholder="Ex: (11) 99999-9999"
                      className={`w-full bg-[#43210D] border ${errors.whatsapp ? 'border-red-400' : 'border-[#CE892C]/40'} rounded-xl px-4 py-3 text-xs text-[#F3EDE0] placeholder:text-[#F3EDE0]/30 focus:outline-none focus:border-[#FFC400]`}
                    />
                    {errors.whatsapp && (
                      <p className="text-red-400 text-[11px] mt-1.5 font-sans font-semibold">{errors.whatsapp}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                      SEU E-MAIL *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({...formData, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: undefined});
                      }}
                      placeholder="Ex: contato@empresa.com.br"
                      className={`w-full bg-[#43210D] border ${errors.email ? 'border-red-400' : 'border-[#CE892C]/40'} rounded-xl px-4 py-3 text-xs text-[#F3EDE0] placeholder:text-[#F3EDE0]/30 focus:outline-none focus:border-[#FFC400]`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-[11px] mt-1.5 font-sans font-semibold">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Segmento */}
                <div>
                  <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                    QUAL É O SEGMENTO DA SUA EMPRESA?
                  </label>
                  <select 
                    value={formData.segment}
                    onChange={(e) => setFormData({...formData, segment: e.target.value})}
                    className="w-full bg-[#43210D] border border-[#CE892C]/40 rounded-xl px-4 py-3 text-xs text-[#F3EDE0] focus:outline-none focus:border-[#FFC400]"
                  >
                    <option value="Telecom & Tecnologia">Telecom & Tecnologia</option>
                    <option value="Saúde & Clínicas">Saúde & Clínicas</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Comércio & Varejo">Comércio & Varejo</option>
                    <option value="B2B">B2B</option>
                    <option value="Indústria">Indústria</option>
                    <option value="Educação">Educação</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Módulos Desejados */}
                <div>
                  <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                    Módulos Desejados (Selecione um ou mais)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableModules.map((mod) => {
                      const isSelected = formData.modules.includes(mod);
                      return (
                        <button
                          type="button"
                          key={mod}
                          onClick={() => handleModuleToggle(mod)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors font-sans border ${
                            isSelected 
                              ? 'bg-[#FFC400] text-[#43210D] border-[#FFC400]' 
                              : 'bg-[#43210D] text-[#F3EDE0]/80 border-[#CE892C]/40 hover:border-[#FFC400]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{mod}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mensagem / Briefing */}
                <div>
                  <label className="block text-xs font-bold text-[#FFC400] uppercase mb-2">
                    Mensagem / Resumo do Projeto
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Conte-nos um pouco sobre o momento da sua empresa, objetivos e prazos desejados..."
                    className="w-full bg-[#43210D] border border-[#CE892C]/40 rounded-xl p-4 text-xs text-[#F3EDE0] placeholder:text-[#F3EDE0]/30 focus:outline-none focus:border-[#FFC400]"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#FFC400] text-[#43210D] hover:bg-white transition-all py-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg font-sans"
                >
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <span>INICIAR UM PROJETO</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-red-300 text-xs text-center font-sans font-bold">
                    Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.
                  </p>
                )}

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
