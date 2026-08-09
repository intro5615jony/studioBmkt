import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  confirmPasswordReset,
  verifyPasswordResetCode,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  Timestamp,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { sendCustomAuthEmail } from '../lib/emailClient';
import ThemeToggle from '../components/ThemeToggle';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  FolderKanban, 
  MessageSquare, 
  FileText, 
  Mail, 
  Users, 
  LogOut, 
  Plus, 
  Upload,
  Trash2, 
  Edit2, 
  Copy,
  Save, 
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Zap,
  Target,
  Instagram,
  Award,
  BarChart3,
  Rocket,
  Globe,
  Sparkles,
  Camera,
  Video,
  Megaphone,
  Search,
  Share2,
  Smartphone,
  Monitor,
  PenTool,
  Palette,
  Layers,
  Compass,
  Heart,
  Star,
  Eye,
  EyeOff,
  MoreVertical,
  Check,
  Sun,
  Moon,
  Inbox,
  Menu,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Phone,
  Lock,
  Unlock,
  Key,
  ShieldAlert,
  Send,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_BRANDS } from '../data/defaultBrands';

// --- Types ---

type Tab = 'dashboard' | 'leads' | 'brands' | 'services' | 'projects' | 'testimonials' | 'blog' | 'newsletter' | 'users';

interface ProposalLead {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  segment?: string;
  services?: string[];
  message?: string;
  source?: string;
  status?: 'Novo' | 'Em Atendimento' | 'Concluído' | 'Arquivado';
  createdAt?: any;
}

interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'editor';
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  agencyRole?: string;
  siteRole?: 'admin' | 'editor';
  birthDate?: string;
  permissions?: string;
  accessStatus?: 'Convite enviado' | 'Ativo' | 'Acesso bloqueado';
}

import { getAppBaseUrl } from '../lib/appUrl';

const getActionCodeSettings = () => ({
  url: `${getAppBaseUrl()}/admin/definir-senha`,
  handleCodeInApp: true,
});

// --- Components ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  if ((window as any).showAdminToast) {
    (window as any).showAdminToast('Erro ao salvar no banco de dados. Verifique suas permissões.', 'error');
  }
  
  throw new Error(JSON.stringify(errInfo));
};

const resizeImage = (base64Str: string, maxWidth = 400, maxHeight = 400): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const Modal = ({ isOpen, onClose, title, children, size = 'default' }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, size?: 'default' | 'large' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--color-ink)]/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] w-full ${size === 'large' ? 'max-w-4xl' : 'max-w-2xl'} overflow-hidden shadow-2xl`}
      >
        <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[var(--color-ink)]/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] w-full max-w-md p-8 text-center shadow-2xl"
      >
        <AlertCircle className="text-[var(--color-error)] mx-auto mb-6" size={48} />
        <h3 className="text-xl font-black mb-2">{title}</h3>
        <p className="text-[var(--color-ink)]/40 mb-8">{message}</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-[var(--color-ink)]/40 hover:bg-[var(--color-surface-hover)] transition-all">Cancelar</button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="flex-1 bg-[var(--color-error)] text-[var(--color-bg)] py-3 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Quill: any = ReactQuill;

// --- Sub-component for Password Setup / Reset Page ---
const SetPasswordForm = ({ oobCode, onGoToLogin }: { oobCode: string | null; onGoToLogin: () => void }) => {
  const [verifying, setVerifying] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [oobCodeError, setOobCodeError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setOobCodeError("Este link expirou ou já foi utilizado.");
      setVerifying(false);
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setVerifiedEmail(email);
        setVerifying(false);
      })
      .catch((err) => {
        console.error("Error verifying reset code:", err);
        setOobCodeError("Este link expirou ou já foi utilizado.");
        setVerifying(false);
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (newPassword.length < 8) {
      setFormError("A senha deve conter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("As senhas não coincidem. Digite novamente.");
      return;
    }

    if (!oobCode) {
      setFormError("Código inválido. Solicite um novo link.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);

      if (verifiedEmail) {
        try {
          const { getDocs, where, query: fsQuery } = await import('firebase/firestore');
          const usersRef = collection(db, 'users');
          const q = fsQuery(usersRef, where('email', '==', verifiedEmail));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            await updateDoc(userDocRef, {
              accessStatus: 'Ativo',
              updatedAt: serverTimestamp()
            });
          }
        } catch (fErr) {
          console.warn("Could not update Firestore user status automatically:", fErr);
        }
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Password reset submission error:", err);
      if (err.code === 'auth/expired-action-code' || err.code === 'auth/invalid-action-code') {
        setOobCodeError("Este link expirou ou já foi utilizado.");
      } else {
        setFormError(err.message || "Erro ao salvar a senha. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE0] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[460px] bg-white border-2 border-[#CE892C]/30 rounded-3xl p-6 sm:p-10 shadow-xl my-auto">
        
        {/* LOGO STUDIO B MARKETING */}
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Studio B Marketing Logo" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-logo');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="fallback-logo hidden flex items-center gap-2">
            <div className="w-9 h-9 clip-hex bg-[#FFC400] flex items-center justify-center text-[#43210D] font-black text-lg font-heading shadow-sm">B</div>
            <div className="leading-tight">
              <span className="font-black text-lg tracking-tight uppercase font-heading text-[#43210D] block">
                Studio <span className="text-[#E17541]">B</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#E17541] font-sans block">
                Marketing
              </span>
            </div>
          </div>
        </div>

        {verifying ? (
          <div className="text-center py-8">
            <Loader2 size={40} className="animate-spin text-[#CE892C] mx-auto mb-4" />
            <p className="text-sm font-bold text-[#43210D]/70 font-sans">Verificando link de acesso...</p>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#43210D] font-heading mb-2">
                Senha criada com sucesso.
              </h2>
              <p className="text-xs sm:text-sm text-[#43210D]/70 font-sans leading-relaxed">
                Sua senha foi configurada com sucesso. Agora você já pode entrar no painel administrativo com seu e-mail e nova senha.
              </p>
            </div>
            <button
              onClick={onGoToLogin}
              className="w-full bg-[#FFC400] hover:bg-[#E17541] text-[#43210D] hover:text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              IR PARA O LOGIN
            </button>
          </div>
        ) : oobCodeError ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle size={36} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#43210D] font-heading mb-2">
                Link Expirado ou Já Utilizado
              </h2>
              <p className="text-xs sm:text-sm text-[#43210D]/70 font-sans leading-relaxed">
                Este link expirou ou já foi utilizado. Por segurança, os links de configuração possuem validade temporária.
              </p>
            </div>
            <button
              onClick={onGoToLogin}
              className="w-full bg-[#43210D] text-white font-extrabold py-3.5 px-6 rounded-2xl hover:bg-[#5a2e13] transition-all shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              SOLICITAR NOVO LINK
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#43210D] font-heading tracking-tight mb-2">
                Configure sua Senha
              </h1>
              <p className="text-xs sm:text-sm text-[#43210D]/70 font-sans leading-relaxed">
                {verifiedEmail ? `Definindo acesso para ${verifiedEmail}` : 'Crie sua senha de acesso ao painel do Studio B Marketing.'}
              </p>
            </div>

            {formError && (
              <div className="mb-6 p-4 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-2 font-sans">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43210D]/80 uppercase tracking-wider mb-2 font-sans">
                  NOVA SENHA
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/40 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541] focus:bg-white transition-all font-sans pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#43210D]/50 hover:text-[#43210D] transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43210D]/80 uppercase tracking-wider mb-2 font-sans">
                  CONFIRMAR NOVA SENHA
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/40 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541] focus:bg-white transition-all font-sans pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#43210D]/50 hover:text-[#43210D] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFC400] hover:bg-[#E17541] text-[#43210D] hover:text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-md uppercase tracking-wider text-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] font-heading"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>SALVANDO SENHA...</span>
                    </>
                  ) : (
                    'SALVAR SENHA'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-component for Admin Login ---
const AdminLoginForm = ({ onGoogleLogin }: { onGoogleLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !validateEmail(cleanEmail) || !password) {
      setLoginError('E-mail ou senha inválidos.');
      return;
    }

    setIsSubmitting(true);
    try {
      try {
        if (rememberMe) {
          await setPersistence(auth, browserLocalPersistence);
        } else {
          await setPersistence(auth, browserSessionPersistence);
        }
      } catch (pErr) {
        console.warn('Persistence setting warning:', pErr);
      }
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (error: any) {
      console.error('Email login error:', error);
      setLoginError('E-mail ou senha inválidos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendCustomAuthEmail({
        type: 'reset_password',
        email: cleanEmail,
      });
      if (res && res.success) {
        setForgotSuccess(true);
      } else {
        const errorMsg = res?.error || 'Erro ao enviar e-mail pelo servidor SMTP. Verifique as configurações.';
        alert(`Erro ao enviar e-mail: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error('Password reset link trigger error:', error);
      alert('Erro ao solicitar redefinição de senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE0] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[460px] bg-white border-2 border-[#CE892C]/30 rounded-3xl p-6 sm:p-10 shadow-xl my-auto">
        
        {/* LOGO STUDIO B MARKETING */}
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Studio B Marketing Logo" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.fallback-logo');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="fallback-logo hidden flex items-center gap-2">
            <div className="w-9 h-9 clip-hex bg-[#FFC400] flex items-center justify-center text-[#43210D] font-black text-lg font-heading shadow-sm">B</div>
            <div className="leading-tight">
              <span className="font-black text-lg tracking-tight uppercase font-heading text-[#43210D] block">
                Studio <span className="text-[#E17541]">B</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#E17541] font-sans block">
                Marketing
              </span>
            </div>
          </div>
        </div>

        {isForgotPassword ? (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#43210D] font-heading tracking-tight mb-2">
                Recuperação de Senha
              </h1>
              <p className="text-xs sm:text-sm text-[#43210D]/70 font-sans leading-relaxed">
                Informe o seu e-mail cadastrado para receber o link de recuperação.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium leading-relaxed font-sans text-center">
                  Se existir uma conta vinculada a este e-mail, enviaremos as instruções para redefinição de senha.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full bg-[#43210D] text-white font-bold py-3.5 rounded-xl hover:bg-[#5a2e13] transition-all text-xs font-heading uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} /> Voltar para o Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#43210D] uppercase tracking-wider mb-2 font-sans">
                    E-MAIL
                  </label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/40 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#43210D] placeholder:text-[#43210D]/40 focus:outline-none focus:border-[#E17541] focus:ring-1 focus:ring-[#E17541] transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FFC400] hover:bg-[#E17541] text-[#43210D] hover:text-white transition-all font-extrabold uppercase py-3.5 rounded-xl shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider font-heading active:scale-[0.99] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    'ENVIAR LINK DE RECUPERAÇÃO'
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-[#43210D]/70 hover:text-[#43210D] text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Voltar para o Login
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* HEADINGS */}
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#43210D] font-heading tracking-tight mb-2">
                Bem-vinda ao Studio B Marketing
              </h1>
              <p className="text-xs sm:text-sm text-[#43210D]/70 font-sans leading-relaxed">
                Acesse o painel administrativo para gerenciar conteúdos, leads e projetos.
              </p>
            </div>

            {/* FEEDBACK MESSAGES */}
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center flex items-center justify-center gap-2 font-sans">
                <AlertCircle size={15} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43210D] uppercase tracking-wider mb-2 font-sans">
                  E-MAIL
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/40 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-[#43210D] placeholder:text-[#43210D]/40 focus:outline-none focus:border-[#E17541] focus:ring-1 focus:ring-[#E17541] transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43210D] uppercase tracking-wider mb-2 font-sans">
                  SENHA
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Digite sua senha"
                    className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/40 rounded-xl pl-4 pr-11 py-3.5 text-xs sm:text-sm text-[#43210D] placeholder:text-[#43210D]/40 focus:outline-none focus:border-[#E17541] focus:ring-1 focus:ring-[#E17541] transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#43210D]/50 hover:text-[#43210D] transition-colors p-1 cursor-pointer"
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* MANTER-ME CONECTADA & ESQUECI MINHA SENHA */}
              <div className="flex items-center justify-between pt-1 pb-2 text-xs font-sans">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#43210D]/80 hover:text-[#43210D]">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#CE892C]/40 text-[#E17541] focus:ring-[#E17541] accent-[#E17541] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium">Manter-me conectada</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setIsForgotPassword(true);
                  }}
                  className="text-[#E17541] hover:text-[#43210D] font-bold transition-colors bg-transparent border-0 p-0 cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FFC400] hover:bg-[#E17541] text-[#43210D] hover:text-white transition-all font-extrabold uppercase py-3.5 rounded-xl shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider font-heading active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'ENTRAR'
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center my-6 text-xs font-bold text-[#43210D]/40 uppercase tracking-widest font-sans before:flex-1 before:border-t before:border-[#CE892C]/30 after:flex-1 after:border-t after:border-[#CE892C]/30 before:mr-3 after:ml-3">
              OU
            </div>

            {/* GOOGLE LOGIN */}
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full bg-white border border-[#CE892C]/40 text-[#43210D] hover:bg-[#F3EDE0]/50 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-sans active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const Admin = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    (window as any).showAdminToast = showToast;
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Check if user exists in our 'users' collection by UID
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setAdminData(userDoc.data() as AdminUser);
          } else {
            // Check if there's a pre-created user with this email
            if (currentUser.email === 'contatorebecafurtado@gmail.com') {
              const [firstName, ...lastNameParts] = (currentUser.displayName || 'Rebeca Furtado').split(' ');
              const newAdmin: AdminUser = {
                uid: currentUser.uid,
                email: currentUser.email!,
                role: 'admin',
                displayName: currentUser.displayName || 'Rebeca Furtado',
                photoURL: currentUser.photoURL || '',
                firstName: firstName || 'Rebeca',
                lastName: lastNameParts.join(' ') || 'Furtado',
                agencyRole: 'Administrador',
                siteRole: 'admin',
                birthDate: '1990-01-01',
                permissions: 'Acesso total ao sistema'
              };
              await setDoc(doc(db, 'users', currentUser.uid), newAdmin);
              setAdminData(newAdmin);
            } else {
              // Check if the user was added by email but hasn't logged in yet
              const usersRef = collection(db, 'users');
              // We'll use a snapshot to find the user by email since we don't have their UID as doc ID yet
              // In a real app, we'd use a query, but we need to handle the case where the doc ID is random
              const { getDocs, where, query: fsQuery } = await import('firebase/firestore');
              const q = fsQuery(usersRef, where('email', '==', currentUser.email));
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                const existingUserDoc = querySnapshot.docs[0];
                const userData = existingUserDoc.data() as AdminUser;
                
                // Update the document to use the UID as the ID for future lookups
                // and add the UID to the data
                const updatedData = {
                  ...userData,
                  uid: currentUser.uid,
                  photoURL: currentUser.photoURL || userData.photoURL || '',
                  updatedAt: serverTimestamp()
                };
                
                await setDoc(doc(db, 'users', currentUser.uid), updatedData);
                // Optionally delete the old document with random ID
                await deleteDoc(doc(db, 'users', existingUserDoc.id));
                
                setAdminData(updatedData);
              } else {
                setAdminData(null);
              }
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
          setAdminData(null);
        }
      } else {
        setAdminData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showAdminToast = showToast;
    }
  }, []);

  const isSetPasswordRoute = window.location.pathname.includes('/admin/definir-senha') || new URLSearchParams(window.location.search).get('oobCode') !== null;

  if (isSetPasswordRoute) {
    const oobCode = new URLSearchParams(window.location.search).get('oobCode');
    return (
      <SetPasswordForm 
        oobCode={oobCode} 
        onGoToLogin={() => {
          window.location.href = '/admin';
        }} 
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="text-[var(--color-accent)] animate-spin" size={48} />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginForm onGoogleLogin={handleLogin} />;
  }

  if (adminData && adminData.accessStatus === 'Acesso bloqueado') {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#CE892C]/30 rounded-3xl p-10 text-center shadow-2xl">
          <ShieldAlert className="text-red-500 mx-auto mb-6 shrink-0" size={64} />
          <h1 className="text-2xl font-black text-[#43210D] font-heading mb-4">Acesso Bloqueado</h1>
          <p className="text-[#43210D]/70 mb-8 leading-relaxed text-sm">Sua conta de acesso foi bloqueada por um administrador. Entre em contato para reativar o seu acesso.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#43210D] text-white font-extrabold py-3.5 px-6 rounded-2xl hover:bg-[#5a2e13] transition-all shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <LogOut size={18} /> Sair do Painel
          </button>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#CE892C]/30 rounded-3xl p-10 text-center shadow-2xl">
          <AlertCircle className="text-amber-500 mx-auto mb-6 shrink-0" size={64} />
          <h1 className="text-2xl font-black text-[#43210D] font-heading mb-4">Acesso Negado</h1>
          <p className="text-[#43210D]/70 mb-8 leading-relaxed text-sm">Você não tem permissão para acessar esta área. Entre em contato com o administrador.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-[#43210D] text-white font-extrabold py-3.5 px-6 rounded-2xl hover:bg-[#5a2e13] transition-all shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Inbox },
    { id: 'brands', label: 'Marcas', icon: ImageIcon },
    { id: 'services', label: 'Serviços', icon: Briefcase },
    { id: 'projects', label: 'Projetos', icon: FolderKanban },
    { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'users', label: 'Usuários', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex transition-colors duration-300 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-300 ${
          toast.type === 'success' ? 'bg-[var(--color-success)] text-white' : 'bg-[var(--color-error)] text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 flex flex-col z-30`}>
        <div className="p-5 flex items-center justify-between border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-accent-gradient rounded-xl flex-shrink-0 flex items-center justify-center text-[var(--color-on-accent)] font-black text-xl shadow-sm font-heading">
              B
            </div>
            {isSidebarOpen && (
              <div className="leading-tight truncate">
                <span className="font-heading font-black text-sm block text-[var(--color-ink)]">Studio B</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-secondary)]">Marketing</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex p-1.5 rounded-lg text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-all"
            title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            <ChevronLeft size={18} className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-accent-gradient text-[var(--color-on-accent)] font-bold shadow-md' 
                  : 'text-[var(--color-ink)]/60 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm tracking-wide">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 p-3.5 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-xl transition-all font-semibold"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight font-heading text-[var(--color-ink)]">
              {activeTab === 'leads' ? 'Leads & Propostas' : activeTab === 'dashboard' ? 'Painel de Controle' : menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-[var(--color-ink)]/60 text-sm mt-1">
              {activeTab === 'dashboard' && 'Visão geral do desempenho e conteúdos do Studio B Marketing.'}
              {activeTab === 'leads' && 'Acompanhe as propostas e contatos recebidos através do site.'}
              {activeTab === 'brands' && 'Gerencie as marcas e empresas parceiras exibidas no site.'}
              {activeTab === 'services' && 'Gerencie os serviços e soluções oferecidas.'}
              {activeTab === 'projects' && 'Gerencie os cases e portfólio de projetos.'}
              {activeTab === 'testimonials' && 'Gerencie os depoimentos dos clientes.'}
              {activeTab === 'blog' && 'Crie e edite artigos do blog.'}
              {activeTab === 'newsletter' && 'Gerencie a lista de e-mails inscritos.'}
              {activeTab === 'users' && 'Gerencie os usuários e administradores do painel.'}
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <ThemeToggle />
            <div className="flex items-center gap-3 bg-[var(--color-surface)] px-4 py-2.5 rounded-2xl border border-[var(--color-border)] shadow-xs">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[var(--color-ink)]">{user.displayName}</p>
                <p className="text-[10px] text-[var(--color-secondary)] font-semibold uppercase tracking-wider">{adminData.role}</p>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-9 h-9 rounded-xl border border-[var(--color-border)] object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] text-[var(--color-on-accent)] font-bold flex items-center justify-center text-xs font-heading">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] p-6 sm:p-8 min-h-[600px] shadow-xs">
          {activeTab === 'dashboard' && <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'leads' && <LeadsManager />}
          {activeTab === 'brands' && <BrandsManager />}
          {activeTab === 'services' && <ServicesManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'newsletter' && <NewsletterManager />}
          {activeTab === 'users' && <UsersManager currentUser={adminData} />}
        </div>
      </main>
    </div>
  );
};

// --- Sub-components for Managers ---

const DashboardOverview = ({ onNavigate }: { onNavigate?: (tab: Tab) => void }) => {
  const [stats, setStats] = useState({
    brands: 0,
    services: 0,
    projects: 0,
    posts: 0,
    newsletter: 0,
    proposals: 0,
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const collections = ['brands', 'services', 'projects', 'posts', 'newsletter', 'proposals'];
    const unsubscribes = collections.map(col => 
      onSnapshot(collection(db, col), (snap) => {
        setStats(prev => ({ ...prev, [col]: snap.size }));
      })
    );
    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const seedInitialData = async () => {
    setSeedMessage(null);
    setIsSeeding(true);
    try {
      // Seed Services
      const initialServices = [
        { title: 'Social Media', iconName: 'Instagram', order: 0, description: 'Gestão estratégica de redes sociais focada em engajamento, autoridade e conversão de seguidores em clientes.' },
        { title: 'Tráfego Pago', iconName: 'Target', order: 1, description: 'Campanhas de alta performance no Google Ads e Meta Ads para escalar seu faturamento de forma previsível.' },
        { title: 'Branding', iconName: 'Award', order: 2, description: 'Criação de identidades visuais memoráveis e posicionamento de marca que conecta emocionalmente com seu público.' },
        { title: 'Web Design', iconName: 'Globe', order: 3, description: 'Landing Pages e sites institucionais de alto impacto visual, otimizados para conversão e experiência do usuário.' },
        { title: 'SEO Estratégico', iconName: 'Search', order: 4, description: 'Otimização completa para mecanismos de busca, garantindo que sua marca seja encontrada por quem realmente busca sua solução.' },
        { title: 'Consultoria', iconName: 'Rocket', order: 5, description: 'Acompanhamento estratégico personalizado para identificar gargalos e acelerar o crescimento do seu negócio digital.' },
      ];

      for (const service of initialServices) {
        await addDoc(collection(db, 'services'), service);
      }

      // Seed Brands
      for (const brand of DEFAULT_BRANDS) {
        await addDoc(collection(db, 'brands'), {
          name: brand.name,
          logoUrl: brand.logoUrl,
          url: brand.url || '',
          status: brand.status || 'Ativa',
          order: brand.order
        });
      }

      setSeedMessage({ type: 'success', text: 'Dados iniciais restaurados com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao semear dados:', error);
      setSeedMessage({ 
        type: 'error', 
        text: error.message?.includes('permission') 
          ? 'Erro de permissão. Verifique se você é um administrador.' 
          : 'Erro ao restaurar dados. Tente novamente.' 
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const statCards = [
    { label: 'Leads & Propostas', value: stats.proposals, icon: Inbox, color: 'text-[var(--color-secondary)]', tab: 'leads' },
    { label: 'Marcas', value: stats.brands, icon: ImageIcon, color: 'text-[var(--color-stat-blue)]', tab: 'brands' },
    { label: 'Serviços', value: stats.services, icon: Briefcase, color: 'text-[var(--color-success)]', tab: 'services' },
    { label: 'Projetos', value: stats.projects, icon: FolderKanban, color: 'text-[var(--color-stat-purple)]', tab: 'projects' },
    { label: 'Posts do Blog', value: stats.posts, icon: FileText, color: 'text-[var(--color-stat-orange)]', tab: 'blog' },
    { label: 'Inscritos Newsletter', value: stats.newsletter, icon: Mail, color: 'text-[var(--color-stat-pink)]', tab: 'newsletter' },
  ];

  return (
    <div className="space-y-12">
      <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-8 rounded-3xl shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-heading mb-2">Configuração Inicial</h3>
            <p className="text-[var(--color-ink)]/60 text-sm">Restaure as marcas e serviços padrão caso o banco de dados esteja vazio.</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={seedInitialData}
              disabled={isSeeding}
              className="bg-accent-gradient text-[var(--color-on-accent)] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSeeding ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Restaurar Dados Iniciais
            </button>
            {seedMessage && (
              <p className={`text-xs font-bold ${seedMessage.type === 'success' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                {seedMessage.text}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div 
            key={stat.label} 
            onClick={() => onNavigate && onNavigate(stat.tab as Tab)}
            className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-8 rounded-3xl flex items-center justify-between group hover:border-[var(--color-accent)] transition-all cursor-pointer shadow-xs"
          >
            <div>
              <p className="text-[var(--color-ink)]/60 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-4xl font-black font-heading text-[var(--color-ink)]">{stat.value}</p>
            </div>
            <div className={`p-4 bg-[var(--color-surface)] rounded-2xl ${stat.color} group-hover:bg-accent-gradient group-hover:text-[var(--color-on-accent)] transition-all shadow-xs`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getWhatsAppUrl = (phoneStr?: string) => {
  if (!phoneStr) return '#';
  const digits = phoneStr.replace(/\D/g, '');
  if (!digits) return '#';
  const fullDigits = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${fullDigits}`;
};

const LeadsManager = () => {
  const [leads, setLeads] = useState<ProposalLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ProposalLead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const q = query(collection(db, 'proposals'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProposalLead)));
      setLoading(false);
    });
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: ProposalLead['status']) => {
    try {
      await updateDoc(doc(db, 'proposals', leadId), { status: newStatus });
      if ((window as any).showAdminToast) {
        (window as any).showAdminToast('Status do lead atualizado com sucesso!', 'success');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `proposals/${leadId}`);
    }
  };

  const handleDelete = async () => {
    if (leadToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'proposals', leadToDelete));
        if ((window as any).showAdminToast) {
          (window as any).showAdminToast('Lead removido com sucesso!', 'success');
        }
        setLeadToDelete(null);
        if (selectedLead?.id === leadToDelete) {
          setIsDetailModalOpen(false);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `proposals/${leadToDelete}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter || (!lead.status && statusFilter === 'Novo');
      const phoneVal = lead.whatsapp || lead.phone || '';
      const matchesSearch = searchTerm === '' || 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phoneVal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.segment?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchTerm]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold font-heading">Leads & Propostas</h3>
          <p className="text-[var(--color-ink)]/60 text-sm">Gerencie os contatos recebidos pelo formulário de projeto/contato do site.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[var(--color-surface-muted)] px-4 py-2 rounded-full text-xs font-bold text-[var(--color-ink)] border border-[var(--color-border)] shadow-xs">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'} recebidos
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--color-surface-muted)] p-4 rounded-2xl border border-[var(--color-border)]">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/40" />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa, email, whatsapp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['todos', 'Novo', 'Em Atendimento', 'Concluído', 'Arquivado'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] shadow-xs' 
                  : 'bg-[var(--color-surface)] text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {status === 'todos' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-surface-muted)] rounded-3xl border border-[var(--color-border)]">
          <Inbox size={48} className="mx-auto mb-4 text-[var(--color-ink)]/20" />
          <h4 className="font-bold text-lg mb-1 font-heading">Nenhum lead encontrado</h4>
          <p className="text-[var(--color-ink)]/50 text-sm">Nenhum formulário de contato atende aos critérios da busca.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink)]/60 text-xs uppercase tracking-widest">
                  <th className="p-6">Nome / Empresa</th>
                  <th className="p-6">Segmento</th>
                  <th className="p-6">Serviços Desejados</th>
                  <th className="p-6">Data</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredLeads.map((lead) => {
                  const currentStatus = lead.status || 'Novo';
                  const leadPhone = lead.whatsapp || lead.phone;
                  return (
                    <tr key={lead.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-sm text-[var(--color-ink)]">{lead.name}</p>
                          <p className="text-xs text-[var(--color-ink)]/60">{lead.company}</p>
                          {lead.email && <p className="text-[11px] text-[var(--color-ink)]/40 mt-0.5">{lead.email}</p>}
                          {leadPhone && (
                            <a
                              href={getWhatsAppUrl(leadPhone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#25D366] hover:text-[#1eb855] hover:underline mt-1 transition-colors"
                              title="Conversar no WhatsApp"
                            >
                              <Phone size={12} className="shrink-0" />
                              <span>{leadPhone}</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-block bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 rounded-lg text-xs font-semibold text-[var(--color-ink)]">
                          {lead.segment || 'Não informado'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {lead.services && lead.services.length > 0 ? (
                            lead.services.map((srv, idx) => (
                              <span key={idx} className="bg-[var(--color-accent)]/20 text-[var(--color-ink)] border border-[var(--color-accent)]/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {srv}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[var(--color-ink)]/40">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-xs text-[var(--color-ink)]/60 whitespace-nowrap">
                        {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recente'}
                      </td>
                      <td className="p-6 whitespace-nowrap">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as ProposalLead['status'])}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold outline-none border transition-all ${
                            currentStatus === 'Novo' ? 'bg-amber-100 border-amber-300 text-amber-900' :
                            currentStatus === 'Em Atendimento' ? 'bg-blue-100 border-blue-300 text-blue-900' :
                            currentStatus === 'Concluído' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' :
                            'bg-gray-200 border-gray-300 text-gray-700'
                          }`}
                        >
                          <option value="Novo">Novo</option>
                          <option value="Em Atendimento">Em Atendimento</option>
                          <option value="Concluído">Concluído</option>
                          <option value="Arquivado">Arquivado</option>
                        </select>
                      </td>
                      <td className="p-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsDetailModalOpen(true);
                            }}
                            title="Ver Detalhes"
                            className="p-2 text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-xl transition-all"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setLeadToDelete(lead.id);
                              setIsConfirmOpen(true);
                            }}
                            title="Excluir Lead"
                            className="p-2 text-[var(--color-ink)]/40 hover:text-[var(--color-error)] hover:bg-[var(--color-surface)] rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes do Lead"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-[var(--color-surface-muted)] p-6 rounded-2xl border border-[var(--color-border)]">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Nome</p>
                <p className="font-bold text-lg text-[var(--color-ink)]">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Empresa</p>
                <p className="font-bold text-lg text-[var(--color-ink)]">{selectedLead.company}</p>
              </div>
              {selectedLead.email && (
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">E-mail</p>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{selectedLead.email}</p>
                </div>
              )}
              {(selectedLead.whatsapp || selectedLead.phone) && (
                <div>
                  <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Telefone / WhatsApp</p>
                  <p className="text-sm font-semibold text-[var(--color-ink)] mb-1.5">{selectedLead.whatsapp || selectedLead.phone}</p>
                  <a
                    href={getWhatsAppUrl(selectedLead.whatsapp || selectedLead.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1eb855] text-white font-bold text-xs transition-all shadow-xs"
                  >
                    <Phone size={13} />
                    <span>FALAR NO WHATSAPP</span>
                  </a>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Segmento</p>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{selectedLead.segment || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Origem / Página</p>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{selectedLead.source || '/'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Data de Recebimento</p>
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  {selectedLead.createdAt?.toDate ? selectedLead.createdAt.toDate().toLocaleString('pt-BR') : 'Recente'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Serviços de Interesse</p>
              <div className="flex flex-wrap gap-2">
                {selectedLead.services && selectedLead.services.length > 0 ? (
                  selectedLead.services.map((srv, idx) => (
                    <span key={idx} className="bg-[var(--color-accent)] text-[var(--color-on-accent)] text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                      {srv}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[var(--color-ink)]/50">Nenhum serviço selecionado</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Mensagem / Resumo do Projeto</p>
              <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed text-[var(--color-ink)]">
                {selectedLead.message || 'Sem mensagem adicional.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--color-ink)]/60">Alterar Status:</span>
                <select
                  value={selectedLead.status || 'Novo'}
                  onChange={(e) => {
                    const newStatus = e.target.value as ProposalLead['status'];
                    setSelectedLead({ ...selectedLead, status: newStatus });
                    handleUpdateStatus(selectedLead.id, newStatus);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold outline-none border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-ink)]"
                >
                  <option value="Novo">Novo</option>
                  <option value="Em Atendimento">Em Atendimento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setLeadToDelete(selectedLead.id);
                  setIsConfirmOpen(true);
                }}
                className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Trash2 size={16} /> Excluir Lead
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Lead"
        message="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

const BrandsManager = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<any>(null);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'brands'), orderBy('order', 'asc'));
    return onSnapshot(q, (snap) => {
      setBrands(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBrand?.name) return;
    setIsSaving(true);
    try {
      const data = {
        name: currentBrand.name.trim(),
        logoUrl: currentBrand.logoUrl || '',
        url: currentBrand.url ? currentBrand.url.trim() : '',
        status: currentBrand.status || 'Ativa',
        order: typeof currentBrand.order === 'number' ? currentBrand.order : brands.length
      };

      if (currentBrand.id) {
        await updateDoc(doc(db, 'brands', currentBrand.id), data);
      } else {
        await addDoc(collection(db, 'brands'), data);
      }
      if ((window as any).showAdminToast) (window as any).showAdminToast('Marca salva com sucesso!');
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, currentBrand.id ? OperationType.UPDATE : OperationType.CREATE, 'brands');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (brand: any) => {
    try {
      const newStatus = brand.status === 'Oculta' ? 'Ativa' : 'Oculta';
      await updateDoc(doc(db, 'brands', brand.id), { status: newStatus });
      if ((window as any).showAdminToast) (window as any).showAdminToast(`Marca "${brand.name}" alterada para ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'brands');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= brands.length) return;
    try {
      const currentDoc = brands[index];
      const targetDoc = brands[targetIndex];
      const currentOrder = typeof currentDoc.order === 'number' ? currentDoc.order : index;
      const targetOrder = typeof targetDoc.order === 'number' ? targetDoc.order : targetIndex;

      await updateDoc(doc(db, 'brands', currentDoc.id), { order: targetOrder });
      await updateDoc(doc(db, 'brands', targetDoc.id), { order: currentOrder });
      if ((window as any).showAdminToast) (window as any).showAdminToast('Ordem atualizada!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'brands');
    }
  };

  const handleDelete = async () => {
    if (brandToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'brands', brandToDelete));
        if ((window as any).showAdminToast) (window as any).showAdminToast('Marca excluída com sucesso!');
        setBrandToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'brands');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeImage(reader.result as string, 400, 400);
        setCurrentBrand({ ...currentBrand, logoUrl: resized });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatFileNameToTitle = (fileName: string) => {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const cleanName = nameWithoutExt.replace(/[-_]+/g, ' ').trim();
    return cleanName
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLoading(true);
      const fileList = Array.from(files) as File[];
      
      try {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const reader = new FileReader();
          
          const rawUrl = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          const logoUrl = await resizeImage(rawUrl, 400, 400);
          const name = formatFileNameToTitle(file.name);
          
          await addDoc(collection(db, 'brands'), {
            name,
            logoUrl,
            url: '',
            status: 'Ativa',
            order: brands.length + i
          });
        }
        if ((window as any).showAdminToast) (window as any).showAdminToast(`${fileList.length} marcas enviadas com sucesso!`);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'brands');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold">Gerenciar Marcas</h3>
          <p className="text-sm text-[var(--color-ink)]/60">Controle as marcas parceiras exibidas no carrossel do site público.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="file"
              multiple
              accept="image/*"
              onChange={handleBulkUpload}
              className="hidden"
              id="bulk-brand-upload"
            />
            <label 
              htmlFor="bulk-brand-upload"
              className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-surface-hover)] transition-all cursor-pointer text-sm"
            >
              <Upload size={18} /> Upload em Massa
            </label>
          </div>
          <button 
            onClick={() => {
              setCurrentBrand({ name: '', logoUrl: '', url: '', status: 'Ativa', order: brands.length + 1 });
              setIsModalOpen(true);
            }}
            className="bg-accent-gradient text-[var(--color-on-accent)] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all text-sm"
          >
            <Plus size={18} /> Adicionar Marca
          </button>
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-12 rounded-3xl text-center">
          <ImageIcon className="mx-auto text-[var(--color-ink)]/30 mb-4" size={48} />
          <h4 className="text-lg font-bold mb-2">Nenhuma marca cadastrada</h4>
          <p className="text-sm text-[var(--color-ink)]/60 max-w-md mx-auto mb-6">
            Adicione manualmente ou use o Upload em Massa para carregar logos de parceiros.
          </p>
          <button 
            onClick={() => {
              setCurrentBrand({ name: '', logoUrl: '', url: '', status: 'Ativa', order: 1 });
              setIsModalOpen(true);
            }}
            className="bg-[var(--color-accent)] text-[var(--color-bg)] px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus size={18} /> Cadastrar Primeira Marca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand, idx) => {
            const isHidden = brand.status === 'Oculta';
            return (
              <div 
                key={brand.id} 
                className={`bg-[var(--color-surface-muted)] border ${isHidden ? 'border-amber-500/30 opacity-75' : 'border-[var(--color-border)]'} p-5 rounded-3xl flex flex-col justify-between group relative transition-all hover:border-[var(--color-accent)]/50 shadow-sm`}
              >
                {/* Header badges: Order and Status */}
                <div className="flex items-center justify-between mb-3 text-xs font-bold">
                  <span className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)]/70 px-2.5 py-1 rounded-lg">
                    #{typeof brand.order === 'number' ? brand.order : idx + 1}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(brand)}
                    className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-all ${
                      isHidden 
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                    title="Clique para alternar o status"
                  >
                    {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    {brand.status || 'Ativa'}
                  </button>
                </div>

                {/* Logo Box */}
                <div className="w-full h-28 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center p-4 mb-3 border border-[var(--color-border)] relative overflow-hidden">
                  {brand.logoUrl ? (
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="font-bold text-sm text-[var(--color-ink)]/60 text-center">{brand.name}</span>
                  )}
                </div>

                {/* Info & URL */}
                <div className="mb-4">
                  <h4 className="font-bold text-base truncate">{brand.name}</h4>
                  {brand.url ? (
                    <a 
                      href={brand.url.startsWith('http') ? brand.url : `https://${brand.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 truncate mt-0.5"
                    >
                      <ExternalLink size={12} className="shrink-0" />
                      <span className="truncate">{brand.url}</span>
                    </a>
                  ) : (
                    <p className="text-xs text-[var(--color-ink)]/40 italic">Sem URL externa</p>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-xs">
                  {/* Reordering Up / Down */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, 'up')}
                      className="p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all"
                      title="Mover para cima"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      disabled={idx === brands.length - 1}
                      onClick={() => handleMoveOrder(idx, 'down')}
                      className="p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all"
                      title="Mover para baixo"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        setCurrentBrand(brand);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all"
                      title="Editar Marca"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        setBrandToDelete(brand.id);
                        setIsConfirmOpen(true);
                      }}
                      className="p-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-error)] hover:text-white transition-all"
                      title="Excluir Marca"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentBrand?.id ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Nome da Marca *</label>
            <input 
              type="text" required
              value={currentBrand?.name || ''}
              onChange={(e) => setCurrentBrand({ ...currentBrand, name: e.target.value })}
              placeholder="Ex: Netmais Fibra"
              className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Logo da Marca</label>
            <div className="flex flex-col gap-3">
              {currentBrand?.logoUrl && (
                <div className="w-full h-24 bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl p-3 flex items-center justify-center">
                  <img src={currentBrand.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="relative">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="brand-logo-upload"
                />
                <label 
                  htmlFor="brand-logo-upload"
                  className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all text-sm font-bold"
                >
                  <Upload size={18} className="text-[var(--color-accent)]" />
                  <span>{currentBrand?.logoUrl ? 'Alterar Imagem do Logo' : 'Selecionar Imagem do Logo'}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">URL da Marca (Opcional)</label>
            <input 
              type="text"
              value={currentBrand?.url || ''}
              onChange={(e) => setCurrentBrand({ ...currentBrand, url: e.target.value })}
              placeholder="https://empresa.com.br"
              className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Status</label>
              <select 
                value={currentBrand?.status || 'Ativa'}
                onChange={(e) => setCurrentBrand({ ...currentBrand, status: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              >
                <option value="Ativa">Ativa (Exibir no site)</option>
                <option value="Oculta">Oculta (Ocultar do site)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Ordem de Exibição</label>
              <input 
                type="number"
                value={typeof currentBrand?.order === 'number' ? currentBrand.order : 0}
                onChange={(e) => setCurrentBrand({ ...currentBrand, order: parseInt(e.target.value) || 0 })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] py-3.5 rounded-xl font-bold transition-all hover:brightness-110 disabled:opacity-50 mt-2"
          >
            {isSaving ? 'Salvando...' : 'Salvar Marca'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Marca"
        message="Tem certeza que deseja excluir esta marca? Ela será removida permanentemente e deixará de aparecer no site público."
      />
    </div>
  );
};

const ServicesManager = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const availableIcons = [
    { name: 'Target', icon: Target },
    { name: 'Instagram', icon: Instagram },
    { name: 'Award', icon: Award },
    { name: 'BarChart3', icon: BarChart3 },
    { name: 'Zap', icon: Zap },
    { name: 'Rocket', icon: Rocket },
    { name: 'Globe', icon: Globe },
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Camera', icon: Camera },
    { name: 'Video', icon: Video },
    { name: 'Megaphone', icon: Megaphone },
    { name: 'Search', icon: Search },
    { name: 'Share2', icon: Share2 },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Monitor', icon: Monitor },
    { name: 'PenTool', icon: PenTool },
    { name: 'Palette', icon: Palette },
    { name: 'Layers', icon: Layers },
    { name: 'Compass', icon: Compass },
    { name: 'Heart', icon: Heart },
    { name: 'Star', icon: Star },
    { name: 'CheckCircle2', icon: CheckCircle2 },
  ];

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    return onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        title: currentService.title,
        description: currentService.description,
        iconName: currentService.iconName,
        order: currentService.order || services.length
      };

      if (currentService.id) {
        await updateDoc(doc(db, 'services', currentService.id), data);
      } else {
        await addDoc(collection(db, 'services'), data);
      }
      setIsModalOpen(false);
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Serviço salvo com sucesso!', 'success');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `services/${currentService?.id || 'new'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (serviceToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'services', serviceToDelete));
        if ((window as any).showAdminToast) (window as any).showAdminToast('Serviço excluído com sucesso!');
        setServiceToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'services');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getIcon = (name: string) => {
    const iconObj = availableIcons.find(i => i.name === name);
    const IconComp = iconObj ? iconObj.icon : Zap;
    return <IconComp size={24} />;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Gerenciar Serviços</h3>
        <button 
          onClick={() => {
            setCurrentService({ title: '', description: '', iconName: 'Zap', order: services.length });
            setIsModalOpen(true);
          }}
          className="bg-accent-gradient text-[var(--color-on-accent)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Novo Serviço
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-6 rounded-3xl flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-accent-gradient rounded-xl flex items-center justify-center text-[var(--color-on-accent)]">
                {getIcon(service.iconName)}
              </div>
              <div>
                <h4 className="font-bold">{service.title}</h4>
                <p className="text-[var(--color-ink)]/40 text-sm">{service.description.substring(0, 100)}...</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setCurrentService(service);
                  setIsModalOpen(true);
                }}
                className="p-3 bg-[var(--color-surface-hover)] rounded-xl hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] transition-all"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => {
                  setServiceToDelete(service.id);
                  setIsConfirmOpen(true);
                }}
                className="p-3 bg-[var(--color-surface-hover)] rounded-xl hover:bg-[var(--color-error)] hover:text-[var(--color-on-error)] transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentService?.id ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Título do Serviço</label>
            <input 
              type="text" required
              value={currentService?.title || ''}
              onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
              className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Ícone</label>
            <div className="grid grid-cols-4 gap-4">
              {availableIcons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCurrentService({ ...currentService, iconName: item.name })}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-center ${
                    currentService?.iconName === item.name 
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--color-bg)]' 
                      : 'bg-[var(--color-surface-muted)] border-[var(--color-border)] text-[var(--color-ink)]/40 hover:border-[var(--color-ink)]/20'
                  }`}
                >
                  <item.icon size={24} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Descrição</label>
            <textarea 
              required
              value={currentService?.description || ''}
              onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
              className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 h-32 focus:border-[var(--color-accent)] outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] py-4 rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Serviço'}
          </button>
        </form>
      </Modal>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Serviço"
        message="Tem certeza que deseja excluir este serviço?"
      />
    </div>
  );
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Publicado' | 'Rascunho'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    return onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar projetos no Admin:", error);
      setLoading(false);
    });
  }, []);

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleOpenNew = () => {
    const nextOrder = projects.length > 0 ? Math.max(...projects.map(p => Number(p.order) || 0)) + 1 : 1;
    setCurrentProject({
      client: '',
      title: '',
      slug: '',
      category: 'BRANDING',
      segment: '',
      imageUrl: '',
      galleryText: '',
      shortDescription: '',
      fullDescription: '',
      challenge: '',
      solution: '',
      servicesText: '',
      tagsText: '',
      externalLink: '',
      results: '',
      status: 'Publicado',
      highlightHome: false,
      order: nextOrder
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: any) => {
    setCurrentProject({
      ...proj,
      client: proj.client || '',
      title: proj.title || '',
      slug: proj.slug || '',
      category: proj.category || 'BRANDING',
      segment: proj.segment || '',
      imageUrl: proj.imageUrl || '',
      galleryText: Array.isArray(proj.gallery) ? proj.gallery.join('\n') : (proj.gallery || ''),
      shortDescription: proj.shortDescription || proj.description || '',
      fullDescription: proj.fullDescription || '',
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      servicesText: Array.isArray(proj.services) ? proj.services.join(', ') : (proj.services || ''),
      tagsText: Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || ''),
      externalLink: proj.externalLink || '',
      results: proj.results || proj.result || '',
      status: proj.status || 'Publicado',
      highlightHome: Boolean(proj.highlightHome === true || proj.highlightHome === 'Sim'),
      order: Number(proj.order) || 1
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject.title || !currentProject.title.trim()) {
      alert('Por favor, informe o título do projeto.');
      return;
    }

    setIsSaving(true);
    try {
      const derivedSlug = currentProject.slug && currentProject.slug.trim() 
        ? generateSlugFromTitle(currentProject.slug) 
        : generateSlugFromTitle(currentProject.title);

      // Parse arrays safely
      const galleryArray = currentProject.galleryText
        ? currentProject.galleryText.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];

      const servicesArray = currentProject.servicesText
        ? currentProject.servicesText.split(',').flatMap((s: string) => s.split('\n')).map((s: string) => s.trim()).filter(Boolean)
        : [];

      const tagsArray = currentProject.tagsText
        ? currentProject.tagsText.split(',').flatMap((s: string) => s.split('\n')).map((s: string) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        client: currentProject.client ? currentProject.client.trim() : '',
        title: currentProject.title.trim(),
        slug: derivedSlug,
        category: currentProject.category || 'BRANDING',
        segment: currentProject.segment ? currentProject.segment.trim() : '',
        imageUrl: currentProject.imageUrl ? currentProject.imageUrl.trim() : '',
        gallery: galleryArray,
        shortDescription: currentProject.shortDescription ? currentProject.shortDescription.trim() : '',
        fullDescription: currentProject.fullDescription ? currentProject.fullDescription.trim() : '',
        challenge: currentProject.challenge ? currentProject.challenge.trim() : '',
        solution: currentProject.solution ? currentProject.solution.trim() : '',
        services: servicesArray,
        tags: tagsArray,
        externalLink: currentProject.externalLink ? currentProject.externalLink.trim() : '',
        results: currentProject.results ? currentProject.results.trim() : '',
        status: currentProject.status || 'Publicado',
        highlightHome: Boolean(currentProject.highlightHome),
        order: Number(currentProject.order) || 1,
        updatedAt: serverTimestamp()
      };

      if (currentProject.id) {
        await updateDoc(doc(db, 'projects', currentProject.id), payload);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      setIsModalOpen(false);
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Projeto salvo com sucesso!', 'success');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${currentProject?.id || 'new'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (proj: any) => {
    try {
      setIsSaving(true);
      const baseSlug = proj.slug || generateSlugFromTitle(proj.title || 'projeto');
      const duplicatedData = {
        client: proj.client || '',
        title: `Cópia de ${proj.title || 'Projeto'}`,
        slug: `${baseSlug}-copia-${Math.floor(Math.random() * 1000)}`,
        category: proj.category || 'BRANDING',
        segment: proj.segment || '',
        imageUrl: proj.imageUrl || '',
        gallery: Array.isArray(proj.gallery) ? proj.gallery : [],
        shortDescription: proj.shortDescription || proj.description || '',
        fullDescription: proj.fullDescription || '',
        challenge: proj.challenge || '',
        solution: proj.solution || '',
        services: Array.isArray(proj.services) ? proj.services : [],
        tags: Array.isArray(proj.tags) ? proj.tags : [],
        externalLink: proj.externalLink || '',
        results: proj.results || proj.result || '',
        status: 'Rascunho', // Duplicated project starts as Draft
        highlightHome: false,
        order: (Number(proj.order) || 0) + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'projects'), duplicatedData);
      if ((window as any).showAdminToast) {
        (window as any).showAdminToast('Projeto duplicado como Rascunho com sucesso!');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects/duplicate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (projectToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'projects', projectToDelete));
        if ((window as any).showAdminToast) (window as any).showAdminToast('Projeto excluído com sucesso!');
        setProjectToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'projects');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Filter status
      if (statusFilter === 'Publicado' && p.status === 'Rascunho') return false;
      if (statusFilter === 'Rascunho' && p.status !== 'Rascunho') return false;

      // Filter search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const clientMatch = (p.client || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        return titleMatch || clientMatch || catMatch;
      }

      return true;
    });
  }, [projects, statusFilter, searchQuery]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-6 rounded-3xl">
        <div>
          <h3 className="text-2xl font-bold">Gerenciar Projetos / Cases</h3>
          <p className="text-xs text-[var(--color-ink)]/60 mt-1">
            Projetos publicados aqui alimentam a página pública <code className="font-mono text-[var(--color-accent)]">/cases</code> e a seção Destaque da Home.
          </p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="bg-accent-gradient text-[var(--color-on-accent)] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm shadow-md shrink-0 cursor-pointer"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2">
          {(['Todos', 'Publicado', 'Rascunho'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === tab
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)] shadow-sm'
                  : 'bg-[var(--color-surface-muted)] text-[var(--color-ink)]/70 border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab === 'Todos' ? `Todos (${projects.length})` : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/40" />
          <input
            type="text"
            placeholder="Buscar por cliente, título ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[var(--color-accent)] outline-none"
          />
        </div>
      </div>

      {/* Table / Cards List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-12 rounded-3xl text-center">
          <FolderKanban className="mx-auto text-[var(--color-ink)]/30 mb-3" size={48} />
          <h4 className="text-lg font-bold mb-1">Nenhum projeto encontrado</h4>
          <p className="text-xs text-[var(--color-ink)]/60 max-w-md mx-auto mb-4">
            {searchQuery || statusFilter !== 'Todos'
              ? 'Tente mudar os filtros de pesquisa.'
              : 'Clique em + NOVO PROJETO para cadastrar o primeiro case.'}
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[11px] font-extrabold uppercase text-[var(--color-ink)]/50 tracking-wider bg-[var(--color-surface)]">
                  <th className="p-4 pl-6">Capa</th>
                  <th className="p-4">Cliente / Projeto</th>
                  <th className="p-4">Categoria / Segmento</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Destaque Home</th>
                  <th className="p-4 text-center">Ordem</th>
                  <th className="p-4 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-xs font-medium">
                {filteredProjects.map((p) => {
                  const isPublished = p.status === 'Publicado' || p.status === undefined;
                  const isHighlight = p.highlightHome === true || p.highlightHome === 'Sim';
                  const slug = p.slug || p.id;

                  return (
                    <tr key={p.id} className="hover:bg-[var(--color-surface-hover)]/50 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="p-4 pl-6">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shrink-0">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--color-ink)]/40 font-bold">
                              Sem Capa
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Client / Title */}
                      <td className="p-4 max-w-xs">
                        <p className="font-extrabold text-[var(--color-accent)] text-[11px] uppercase tracking-wider">{p.client || 'Cliente não especificado'}</p>
                        <h4 className="font-bold text-sm text-[var(--color-ink)] truncate">{p.title}</h4>
                        <p className="text-[10px] text-[var(--color-ink)]/40 font-mono">/cases/{slug}</p>
                      </td>

                      {/* Category / Segment */}
                      <td className="p-4">
                        <span className="inline-block font-extrabold text-[10px] px-2.5 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] uppercase">
                          {p.category || 'Geral'}
                        </span>
                        {p.segment && (
                          <p className="text-[10px] text-[var(--color-ink)]/60 mt-1">{p.segment}</p>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {isPublished ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>

                      {/* Destaque Badge */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          isHighlight
                            ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/30'
                            : 'bg-[var(--color-surface)] text-[var(--color-ink)]/40 border-[var(--color-border)]'
                        }`}>
                          {isHighlight ? 'Sim' : 'Não'}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="p-4 text-center font-bold text-[var(--color-ink)]/70">
                        {p.order || 1}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => window.open(`/cases/${slug}`, '_blank')}
                            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-all text-[var(--color-ink)]/70"
                            title="Visualizar Case no Site"
                          >
                            <ExternalLink size={15} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all text-[var(--color-ink)]/70"
                            title="Duplicar como Rascunho"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all text-[var(--color-ink)]/70"
                            title="Editar Projeto"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setProjectToDelete(p.id);
                              setIsConfirmOpen(true);
                            }}
                            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-error)] hover:text-white transition-all text-[var(--color-ink)]/70"
                            title="Excluir Projeto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentProject?.id ? 'Editar Case de Projeto' : 'Novo Case de Projeto'}
      >
        <form onSubmit={handleSave} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Status & Destaque */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Status *</label>
              <select
                value={currentProject?.status || 'Publicado'}
                onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              >
                <option value="Publicado">Publicado (Visível no site)</option>
                <option value="Rascunho">Rascunho (Oculto do site)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Destaque na Home</label>
              <select
                value={currentProject?.highlightHome ? 'Sim' : 'Não'}
                onChange={(e) => setCurrentProject({ ...currentProject, highlightHome: e.target.value === 'Sim' })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              >
                <option value="Não">Não (Apenas na página /cases)</option>
                <option value="Sim">Sim (Exibir na Home e em /cases)</option>
              </select>
            </div>

            {/* Cliente */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Cliente</label>
              <input 
                type="text"
                placeholder="Ex: Fibra Telecom, Colmeia Tech"
                value={currentProject?.client || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, client: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Categoria */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Categoria *</label>
              <select
                value={currentProject?.category || 'BRANDING'}
                onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              >
                <option value="BRANDING">BRANDING</option>
                <option value="SOCIAL MEDIA">SOCIAL MEDIA</option>
                <option value="WEB">WEB</option>
                <option value="TELECOM & TECH">TELECOM & TECH</option>
                <option value="OUTROS SEGMENTOS">OUTROS SEGMENTOS</option>
              </select>
            </div>

            {/* Título */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Título do Projeto *</label>
              <input 
                type="text" required
                placeholder="Ex: Redesign de Marca & Retenção de Fibra"
                value={currentProject?.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = !currentProject?.slug || currentProject?.slug === generateSlugFromTitle(currentProject.title || '')
                    ? generateSlugFromTitle(val)
                    : currentProject.slug;
                  setCurrentProject({ ...currentProject, title: val, slug: autoSlug });
                }}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Slug & Order */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">URL / Slug do Case</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="ex: fibra-telecom-redesign"
                  value={currentProject?.slug || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, slug: generateSlugFromTitle(e.target.value) })}
                  className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-mono focus:border-[var(--color-accent)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCurrentProject({ ...currentProject, slug: generateSlugFromTitle(currentProject.title || '') })}
                  className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-bold shrink-0 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                  title="Gerar automaticamente do título"
                >
                  Auto
                </button>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Ordem de Exibição</label>
              <input 
                type="number"
                value={currentProject?.order || 1}
                onChange={(e) => setCurrentProject({ ...currentProject, order: Number(e.target.value) })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Segmento */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Segmento</label>
              <input 
                type="text"
                placeholder="Ex: Provedor de Internet (ISP), SaaS"
                value={currentProject?.segment || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, segment: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Imagem de Capa */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">URL da Imagem de Capa</label>
              <input 
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={currentProject?.imageUrl || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Descrição Curta */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Descrição Curta (Resumo para o card)</label>
              <textarea 
                rows={2}
                placeholder="Uma breve introdução sobre o projeto..."
                value={currentProject?.shortDescription || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, shortDescription: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Desafio & Solução */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">O Desafio</label>
              <textarea 
                rows={3}
                placeholder="Qual era o problema enfrentado pelo cliente?"
                value={currentProject?.challenge || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, challenge: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">A Solução</label>
              <textarea 
                rows={3}
                placeholder="O que o Studio B desenvolveu para resolver?"
                value={currentProject?.solution || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, solution: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Descrição Completa */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Descrição Completa do Case</label>
              <textarea 
                rows={4}
                placeholder="Detalhamento aprofundado para a página individual do case..."
                value={currentProject?.fullDescription || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, fullDescription: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Serviços & Tags */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Serviços Realizados (Separados por vírgula)</label>
              <input 
                type="text"
                placeholder="Rebranding, Ocupação de Fibra, Web Design"
                value={currentProject?.servicesText || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, servicesText: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Tags (Separadas por vírgula)</label>
              <input 
                type="text"
                placeholder="Telecom, Branding, Saas"
                value={currentProject?.tagsText || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, tagsText: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            {/* Galeria & Link Externo */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Galeria de Imagens (Uma URL por linha)</label>
              <textarea 
                rows={3}
                placeholder="https://..."
                value={currentProject?.galleryText || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, galleryText: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-mono focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Link Externo (Opcional)</label>
              <input 
                type="text"
                placeholder="https://site-do-cliente.com"
                value={currentProject?.externalLink || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, externalLink: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/50 uppercase tracking-wider mb-1.5">Resultados Reais (Somente dados reais)</label>
              <input 
                type="text"
                placeholder="Ex: Aumento de 35% na ocupação de rede"
                value={currentProject?.results || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, results: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm font-medium focus:border-[var(--color-accent)] outline-none"
              />
            </div>

          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] py-3.5 rounded-xl font-bold hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Projeto'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Projeto"
        message="Tem certeza que deseja excluir este projeto? Ele será removido permanentemente da base de dados e de todas as páginas do site."
      />
    </div>
  );
};

const TestimonialsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<any>(null);
  const [filter, setFilter] = useState<'Todos' | 'Google' | 'Manuais' | 'Visiveis' | 'Ocultos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [missingVars, setMissingVars] = useState<string[]>([]);
  
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'googleReviews'), (docSnap) => {
      if (docSnap.exists()) {
        setLastSyncAt(docSnap.data().lastSyncAt);
      }
    });

    return () => {
      unsubTestimonials();
      unsubSettings();
    };
  }, []);

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/google-reviews/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (!res.ok || data.configured === false) {
        setMissingVars(data.missingVars || [
          'GOOGLE_BUSINESS_ACCOUNT_ID',
          'GOOGLE_BUSINESS_LOCATION_ID',
          'GOOGLE_CLIENT_ID',
          'GOOGLE_CLIENT_SECRET',
          'GOOGLE_REFRESH_TOKEN'
        ]);
        setIsConfigModalOpen(true);
        return;
      }

      const reviews = data.reviews || [];
      let newCount = 0;
      let updatedCount = 0;

      for (const rev of reviews) {
        const existing = items.find(item => item.googleReviewId === rev.googleReviewId);
        if (existing) {
          await updateDoc(doc(db, 'testimonials', existing.id), {
            name: rev.authorName || existing.name,
            avatarUrl: rev.authorPhoto || existing.avatarUrl || '',
            rating: rev.rating || existing.rating || 5,
            text: rev.comment || '',
            updatedAt: serverTimestamp()
          });
          updatedCount++;
        } else {
          await addDoc(collection(db, 'testimonials'), {
            googleReviewId: rev.googleReviewId,
            name: rev.authorName || 'Cliente do Google',
            avatarUrl: rev.authorPhoto || '',
            rating: rev.rating || 5,
            text: rev.comment || '',
            role: 'Avaliação no Google',
            source: 'Google',
            visibleInSite: false, // Por padrão, novas avaliações entram ocultas
            reviewDate: rev.reviewDate || new Date().toLocaleDateString('pt-BR'),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          newCount++;
        }
      }

      await setDoc(doc(db, 'settings', 'googleReviews'), {
        lastSyncAt: serverTimestamp()
      }, { merge: true });

      const syncMsg = `Sincronização com Google concluída!\n${newCount} novas avaliações encontradas.\n${updatedCount} avaliações atualizadas.`;
      if ((window as any).showAdminToast) {
        (window as any).showAdminToast(syncMsg);
      } else {
        alert(syncMsg);
      }
    } catch (error) {
      console.error('Erro ao sincronizar com o Google:', error);
      if ((window as any).showAdminToast) {
        (window as any).showAdminToast('Erro de conexão com a API do Google.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleVisibility = async (item: any) => {
    try {
      const currentStatus = item.visibleInSite !== false;
      const newStatus = !currentStatus;
      await updateDoc(doc(db, 'testimonials', item.id), {
        visibleInSite: newStatus,
        updatedAt: serverTimestamp()
      });
      if ((window as any).showAdminToast) {
        (window as any).showAdminToast(`Status alterado: Exibir no site = ${newStatus ? 'Sim' : 'Não'}`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'testimonials');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: currentItem.name ? currentItem.name.trim() : 'Anônimo',
        role: currentItem.role ? currentItem.role.trim() : 'Cliente',
        text: currentItem.text ? currentItem.text.trim() : '',
        avatarUrl: currentItem.avatarUrl ? currentItem.avatarUrl.trim() : '',
        rating: Number(currentItem.rating) || 5,
        source: currentItem.source || 'Manual',
        visibleInSite: currentItem.visibleInSite !== false,
        updatedAt: serverTimestamp()
      };

      if (currentItem.id) {
        await updateDoc(doc(db, 'testimonials', currentItem.id), payload);
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      if ((window as any).showAdminToast) (window as any).showAdminToast('Depoimento salvo com sucesso!');
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, currentItem.id ? OperationType.UPDATE : OperationType.CREATE, 'testimonials');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'testimonials', itemToDelete));
        if ((window as any).showAdminToast) (window as any).showAdminToast('Depoimento excluído com sucesso!');
        setItemToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'testimonials');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const formattedLastSync = useMemo(() => {
    if (!lastSyncAt) return 'Nenhuma';
    try {
      const date = lastSyncAt?.toDate ? lastSyncAt.toDate() : new Date(lastSyncAt);
      return date.toLocaleString('pt-BR');
    } catch (e) {
      return 'Nenhuma';
    }
  }, [lastSyncAt]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Filter by source / visibility
      if (filter === 'Google' && item.source !== 'Google') return false;
      if (filter === 'Manuais' && item.source === 'Google') return false;
      if (filter === 'Visiveis' && item.visibleInSite === false) return false;
      if (filter === 'Ocultos' && item.visibleInSite !== false) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(q);
        const textMatch = item.text?.toLowerCase().includes(q);
        const roleMatch = item.role?.toLowerCase().includes(q);
        return nameMatch || textMatch || roleMatch;
      }

      return true;
    });
  }, [items, filter, searchQuery]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-6 rounded-3xl">
        <div>
          <h3 className="text-2xl font-bold">Depoimentos & Avaliações</h3>
          <p className="text-xs sm:text-sm text-[var(--color-ink)]/60 mt-1 flex items-center gap-2">
            <span>Última sincronização com Google:</span>
            <span className="font-bold text-[var(--color-accent)]">{formattedLastSync}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncGoogle}
            disabled={isSyncing}
            className="bg-[var(--color-surface)] border border-[#4285F4]/40 text-[#4285F4] hover:bg-[#4285F4]/10 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-sm disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isSyncing ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>{isSyncing ? 'Sincronizando...' : 'SINCRONIZAR GOOGLE'}</span>
          </button>

          <button 
            onClick={() => {
              setCurrentItem({ name: '', role: '', text: '', avatarUrl: '', rating: 5, source: 'Manual', visibleInSite: true });
              setIsModalOpen(true);
            }}
            className="bg-accent-gradient text-[var(--color-on-accent)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all text-sm shadow-md"
          >
            <Plus size={18} />
            <span>NOVO DEPOIMENTO</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {(['Todos', 'Google', 'Manuais', 'Visiveis', 'Ocultos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                filter === tab 
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)] border-[var(--color-accent)] shadow-sm' 
                  : 'bg-[var(--color-surface-muted)] text-[var(--color-ink)]/70 border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab === 'Visiveis' ? 'Visíveis no site' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/40" />
          <input
            type="text"
            placeholder="Buscar por nome ou texto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[var(--color-accent)] outline-none"
          />
        </div>
      </div>

      {/* Testimonials List */}
      {filteredItems.length === 0 ? (
        <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-12 rounded-3xl text-center">
          <MessageSquare className="mx-auto text-[var(--color-ink)]/30 mb-3" size={48} />
          <h4 className="text-lg font-bold mb-1">Nenhum depoimento encontrado</h4>
          <p className="text-xs text-[var(--color-ink)]/60 max-w-md mx-auto">
            {searchQuery || filter !== 'Todos'
              ? 'Tente ajustar os filtros de busca para encontrar depoimentos.'
              : 'Cadastre um novo depoimento manual ou clique em Sincronizar Google.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => {
            const isGoogle = item.source === 'Google';
            const isVisible = item.visibleInSite !== false;
            const hasText = Boolean(item.text && item.text.trim());

            return (
              <div 
                key={item.id} 
                className={`bg-[var(--color-surface-muted)] border ${
                  isVisible ? 'border-[var(--color-border)]' : 'border-amber-500/30 opacity-80'
                } p-6 rounded-3xl flex flex-col justify-between relative group shadow-sm transition-all hover:border-[var(--color-accent)]/50`}
              >
                <div>
                  {/* Card Header: Source Badge & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Source Badge */}
                    {isGoogle ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-[#4285F4] border border-blue-500/20 text-[11px] font-extrabold uppercase">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        GOOGLE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)]/70 text-[11px] font-extrabold uppercase">
                        MANUAL
                      </span>
                    )}

                    {/* Exibir no site Toggle Badge */}
                    <button
                      onClick={() => handleToggleVisibility(item)}
                      className={`px-3 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        isVisible
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                      title="Clique para alternar se este depoimento é exibido no site"
                    >
                      {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>Exibir no site: {isVisible ? 'Sim' : 'Não'}</span>
                    </button>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(item.rating || 5)].map((_, starIdx) => (
                      <Star key={starIdx} size={14} className="fill-[#FFC400] text-[#FFC400]" />
                    ))}
                  </div>

                  {/* Comment Body */}
                  <div className="mb-6">
                    {hasText ? (
                      <p className="text-sm text-[var(--color-ink)]/80 italic leading-relaxed">
                        "{item.text}"
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--color-ink)]/40 italic bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)]">
                        (Sem comentário textual - avaliação apenas por estrelas)
                      </p>
                    )}
                  </div>
                </div>

                {/* Author Info & Actions Footer */}
                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 mt-auto">
                  <div className="flex items-center gap-3">
                    {item.avatarUrl ? (
                      <img 
                        src={item.avatarUrl} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)] shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent)] font-extrabold rounded-full flex items-center justify-center text-sm shrink-0">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'G'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-[var(--color-ink)]">{item.name}</h4>
                      <p className="text-[var(--color-ink)]/50 text-xs">{item.role || 'Cliente'}</p>
                    </div>
                  </div>

                  {/* Edit / Delete Actions */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        setCurrentItem(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-all"
                      title="Editar Depoimento"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        setItemToDelete(item.id);
                        setIsConfirmOpen(true);
                      }}
                      className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-error)] hover:text-white transition-all"
                      title="Excluir Depoimento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Testimonial Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentItem?.id ? 'Editar Depoimento' : 'Novo Depoimento'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Origem</label>
              <select
                value={currentItem?.source || 'Manual'}
                onChange={(e) => setCurrentItem({ ...currentItem, source: e.target.value })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              >
                <option value="Manual">Manual</option>
                <option value="Google">Google</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Exibir no Site</label>
              <select
                value={currentItem?.visibleInSite !== false ? 'Sim' : 'Não'}
                onChange={(e) => setCurrentItem({ ...currentItem, visibleInSite: e.target.value === 'Sim' })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              >
                <option value="Sim">Sim (Publicar)</option>
                <option value="Não">Não (Oculto)</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Nome do Avaliador *</label>
              <input 
                type="text" required
                value={currentItem?.name || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="Ex: Carlos Silva"
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Cargo / Empresa</label>
              <input 
                type="text"
                value={currentItem?.role || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                placeholder="Ex: CEO // Empresa"
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Nota (Estrelas)</label>
              <select
                value={currentItem?.rating || 5}
                onChange={(e) => setCurrentItem({ ...currentItem, rating: Number(e.target.value) })}
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              >
                <option value={5}>5 Estrelas (Excelente)</option>
                <option value={4}>4 Estrelas (Muito Bom)</option>
                <option value={3}>3 Estrelas (Bom)</option>
                <option value={2}>2 Estrelas (Regular)</option>
                <option value={1}>1 Estrela (Ruim)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">URL da Foto / Avatar</label>
              <input 
                type="text"
                value={currentItem?.avatarUrl || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Depoimento / Comentário</label>
              <textarea 
                value={currentItem?.text || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, text: e.target.value })}
                placeholder="Escreva ou edite o depoimento do cliente..."
                className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 h-32 focus:border-[var(--color-accent)] outline-none text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] py-3.5 rounded-xl font-bold transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Depoimento'}
          </button>
        </form>
      </Modal>

      {/* Google Config Setup Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configuração do Google Business Profile"
      >
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3 text-amber-600 text-xs sm:text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Integração Real com Google Business Profile em Espera</p>
              <p className="opacity-90">
                Para buscar avaliações reais e automatizadas, são necessárias as credenciais da API do Google Business Profile no arquivo de ambiente (<code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">.env</code>). Nenhuma avaliação falsa foi gerada.
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]/60 mb-2">
              Variáveis de Ambiente Necessárias:
            </h5>
            <ul className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-3 rounded-xl font-mono text-xs space-y-1 text-[var(--color-ink)]/80">
              {missingVars.map(varName => (
                <li key={varName} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{varName}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-ink)]/80 space-y-2">
            <p className="font-bold text-[var(--color-ink)]">Passos para ativar no Google Cloud Platform:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Acesse o Google Cloud Console e ative a <strong>My Business Business Information API</strong> & <strong>My Business Reviews API</strong>.</li>
              <li>Crie um <strong>Client ID OAuth 2.0</strong> e obtenha o <strong>Client Secret</strong> e o <strong>Refresh Token</strong> com escopo do Google My Business.</li>
              <li>Insira o <strong>Account ID</strong> e <strong>Location ID</strong> do perfil do Studio B Marketing.</li>
            </ol>
          </div>

          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] py-3 rounded-xl font-bold text-sm"
          >
            Entendido
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Depoimento"
        message="Tem certeza que deseja excluir este depoimento? Ele será removido permanentemente e deixará de aparecer no site."
      />
    </div>
  );
};

const BlogManager = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Improved slug generation
      const generateSlug = (text: string) => {
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/-+/g, '-') // Replace multiple - with single -
          .trim();
      };

      const data = {
        ...currentPost,
        updatedAt: serverTimestamp(),
        createdAt: currentPost.id ? currentPost.createdAt : serverTimestamp(),
        tags: typeof currentPost.tags === 'string' ? currentPost.tags.split(',').map((t: string) => t.trim()) : currentPost.tags,
        slug: currentPost.slug || generateSlug(currentPost.title),
        publishedAt: currentPost.publishedAt || new Date().toISOString()
      };

      if (currentPost.id) {
        await updateDoc(doc(db, 'posts', currentPost.id), data);
      } else {
        await addDoc(collection(db, 'posts'), data);
      }
      setView('list');
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Post salvo com sucesso!', 'success');
      }
    } catch (error) {
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Erro ao salvar post.', 'error');
      }
      handleFirestoreError(error, OperationType.WRITE, `posts/${currentPost?.id || 'new'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (postToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'posts', postToDelete));
        if ((window as any).showAdminToast) (window as any).showAdminToast('Post excluído com sucesso!');
        setPostToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'posts');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPost({ ...currentPost, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.insertEmbed(range?.index || 0, 'image', reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  const videoHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.insertEmbed(range?.index || 0, 'video', reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler
      }
    }
  };

  if (view === 'editor') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="p-2 hover:bg-[var(--color-surface-hover)] rounded-xl transition-all"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold">{currentPost?.id ? 'Editar Post' : 'Novo Post'}</h3>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('list')}
              className="px-6 py-3 rounded-xl font-bold text-[var(--color-ink)]/40 hover:bg-[var(--color-surface-hover)] transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-accent-gradient text-[var(--color-on-accent)] px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : (currentPost?.published ? 'Publicar Post' : 'Salvar Post')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Main Content Card */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-3">Título do Post</label>
                <input 
                  type="text" required
                  placeholder="Digite um título impactante..."
                  value={currentPost?.title || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-2xl px-6 py-4 text-xl font-bold focus:border-[var(--color-accent)] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-3">Conteúdo</label>
                <div className="quill-container bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-2xl overflow-hidden min-h-[500px]">
                  <Quill 
                    ref={quillRef}
                    theme="snow"
                    value={currentPost?.content || ''}
                    onChange={(content) => setCurrentPost({ ...currentPost, content })}
                    modules={quillModules}
                    className="h-[450px]"
                  />
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Search size={20} className="text-[var(--color-accent)]" />
                <h4 className="font-bold text-lg">Configurações de SEO</h4>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Slug (URL amigável)</label>
                  <input 
                    type="text"
                    placeholder="ex: como-fazer-marketing-digital"
                    value={currentPost?.slug || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Meta Title</label>
                  <input 
                    type="text"
                    value={currentPost?.metaTitle || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, metaTitle: e.target.value })}
                    className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Meta Description</label>
                  <textarea 
                    value={currentPost?.metaDescription || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, metaDescription: e.target.value })}
                    className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 h-24 focus:border-[var(--color-accent)] outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Sidebar Settings */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-8 space-y-6 shadow-sm sticky top-8">
              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-4">Imagem de Capa</label>
                <div className="space-y-4">
                  {currentPost?.imageUrl ? (
                    <div className="relative group aspect-video rounded-2xl overflow-hidden border border-[var(--color-border)]">
                      <img src={currentPost.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label htmlFor="post-image-upload" className="cursor-pointer p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all">
                          <ImageIcon size={24} className="text-white" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="post-image-upload" className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all cursor-pointer group">
                      <Upload size={32} className="text-[var(--color-ink)]/20 group-hover:text-[var(--color-accent)] mb-2" />
                      <span className="text-xs font-bold text-[var(--color-ink)]/40 group-hover:text-[var(--color-accent)]">Upload de Imagem</span>
                    </label>
                  )}
                  <input 
                    type="file"
                    id="post-image-upload"
                    accept="image/*"
                    onChange={handlePostImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Tags</label>
                <input 
                  type="text"
                  placeholder="marketing, design, tech..."
                  value={currentPost?.tags || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value })}
                  className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest mb-2">Agendamento</label>
                <div className="relative">
                  <input 
                    type="datetime-local"
                    value={currentPost?.publishedAt?.slice(0, 16) || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, publishedAt: e.target.value })}
                    className="w-full bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:border-[var(--color-accent)] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold">Status do Post</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${currentPost?.published ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' : 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]/40'}`}>
                    {currentPost?.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="published"
                    checked={currentPost?.published || false}
                    onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <label htmlFor="published" className="text-sm font-bold">Publicar post imediatamente</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Gerenciar Blog</h3>
        <button 
          onClick={() => {
            setCurrentPost({ title: '', description: '', content: '', imageUrl: '', tags: '', published: false, publishedAt: new Date().toISOString() });
            setView('editor');
          }}
          className="bg-accent-gradient text-[var(--color-on-accent)] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Novo Post
        </button>
      </div>

      <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Post</th>
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-ink)]/40 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-surface-hover)] overflow-hidden flex-shrink-0">
                      {post.imageUrl && <img src={post.imageUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{post.title}</h4>
                      <p className="text-[var(--color-ink)]/40 text-xs line-clamp-1">{post.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${post.published ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' : 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]/40'}`}>
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--color-ink)]/40 text-xs">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : (post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recent')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setCurrentPost({ ...post, tags: post.tags?.join(', ') || '' });
                        setView('editor');
                      }}
                      className="p-2 text-[var(--color-ink)]/40 hover:text-[var(--color-accent)] transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setPostToDelete(post.id);
                        setIsConfirmOpen(true);
                      }}
                      className="p-2 text-[var(--color-ink)]/40 hover:text-[var(--color-error)] transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Post"
        message="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

const NewsletterManager = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'newsletter'), orderBy('subscribedAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setEmails(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const handleDelete = async () => {
    if (emailToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'newsletter', emailToDelete));
        if ((window as any).showAdminToast) (window as any).showAdminToast('Email removido com sucesso!');
        setEmailToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'newsletter');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Inscritos na Newsletter</h3>
        <span className="bg-[var(--color-surface-muted)] px-4 py-2 rounded-full text-xs font-bold">{emails.length} total</span>
      </div>

      <div className="overflow-hidden border border-[var(--color-border)] rounded-3xl">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-surface-muted)] text-[var(--color-ink)]/40 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-6">E-mail</th>
              <th className="p-6">Data de Inscrição</th>
              <th className="p-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {emails.map(e => (
              <tr key={e.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="p-6 font-bold">{e.email}</td>
                <td className="p-6 text-[var(--color-ink)]/40 text-xs">
                  {e.subscribedAt?.toDate ? e.subscribedAt.toDate().toLocaleString('pt-BR') : 'Recente'}
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => {
                      setEmailToDelete(e.id);
                      setIsConfirmOpen(true);
                    }}
                    className="p-2 text-[var(--color-ink)]/20 hover:text-[var(--color-error)] transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remover Email"
        message="Tem certeza que deseja remover este email da lista de newsletter?"
      />
    </div>
  );
};

const UsersManager = ({ currentUser }: { currentUser: AdminUser }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [resendConfirmUser, setResendConfirmUser] = useState<any | null>(null);
  const [resetConfirmUser, setResetConfirmUser] = useState<any | null>(null);
  const [blockConfirmUser, setBlockConfirmUser] = useState<any | null>(null);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    agencyRole: '',
    siteRole: 'editor',
    birthDate: '',
    permissions: '',
    photoURL: ''
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeImage(reader.result as string);
        if (isEdit) {
          setEditingUser({ ...editingUser, photoURL: resized });
        } else {
          setNewUser({ ...newUser, photoURL: resized });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole, siteRole: newRole });
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Cargo atualizado com sucesso!', 'success');
      }
    } catch (error) {
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Erro ao atualizar cargo.', 'error');
      }
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      setIsSaving(true);
      try {
        await deleteDoc(doc(db, 'users', userToDelete));
        if (typeof window !== 'undefined' && (window as any).showAdminToast) {
          (window as any).showAdminToast('Usuário removido com sucesso!', 'success');
        }
        setUserToDelete(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userToDelete}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const cleanEmail = newUser.email.trim();

    try {
      await addDoc(collection(db, 'users'), {
        ...newUser,
        email: cleanEmail,
        displayName: `${newUser.firstName} ${newUser.lastName}`,
        role: newUser.siteRole,
        accessStatus: 'Convite enviado',
        createdAt: serverTimestamp(),
      });

      let emailSentSuccess = false;
      let emailError = '';
      try {
        const res = await sendCustomAuthEmail({
          type: 'invite',
          email: cleanEmail,
          firstName: newUser.firstName,
        });
        if (res && res.success) {
          emailSentSuccess = true;
        } else {
          emailError = res?.error || 'Não foi possível enviar e-mail via SMTP.';
        }
      } catch (sendErr: any) {
        console.warn("Could not dispatch initial invite email:", sendErr);
        emailError = sendErr?.message || 'Erro de conexão SMTP.';
      }

      setIsAddModalOpen(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        agencyRole: '',
        siteRole: 'editor',
        birthDate: '',
        permissions: '',
        photoURL: ''
      });

      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        if (emailSentSuccess) {
          (window as any).showAdminToast('Usuário criado com sucesso. O e-mail com o link de acesso foi enviado via SMTP.', 'success');
        } else {
          (window as any).showAdminToast(`Usuário cadastrado, porém o e-mail não foi enviado via SMTP: ${emailError}`, 'warning');
        }
      }
    } catch (error) {
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Erro ao adicionar usuário. Verifique se o e-mail é válido.', 'error');
      }
      handleFirestoreError(error, OperationType.CREATE, 'users');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendAccessLink = async (userObj: any) => {
    try {
      const userFirstName = userObj.firstName || (userObj.displayName ? userObj.displayName.split(' ')[0] : '');
      const res = await sendCustomAuthEmail({
        type: 'invite',
        email: userObj.email.trim(),
        firstName: userFirstName,
      });
      if (res && res.success) {
        if (typeof window !== 'undefined' && (window as any).showAdminToast) {
          (window as any).showAdminToast('Um novo e-mail de convite foi enviado via SMTP com sucesso.', 'success');
        }
      } else {
        const errorMsg = res?.error || 'Erro no envio do e-mail SMTP.';
        if (typeof window !== 'undefined' && (window as any).showAdminToast) {
          (window as any).showAdminToast(`Falha ao enviar e-mail: ${errorMsg}`, 'error');
        }
      }
    } catch (err: any) {
      console.error("Error resending access link:", err);
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Não foi possível reenviar o e-mail via SMTP.', 'error');
      }
    } finally {
      setResendConfirmUser(null);
    }
  };

  const handleSendResetPasswordLink = async (userObj: any) => {
    try {
      const userFirstName = userObj.firstName || (userObj.displayName ? userObj.displayName.split(' ')[0] : '');
      const res = await sendCustomAuthEmail({
        type: 'reset_password',
        email: userObj.email.trim(),
        firstName: userFirstName,
      });
      if (res && res.success) {
        if (typeof window !== 'undefined' && (window as any).showAdminToast) {
          (window as any).showAdminToast('Link de redefinição enviado com sucesso via SMTP.', 'success');
        }
      } else {
        const errorMsg = res?.error || 'Erro no envio do e-mail SMTP.';
        if (typeof window !== 'undefined' && (window as any).showAdminToast) {
          (window as any).showAdminToast(`Falha ao enviar e-mail: ${errorMsg}`, 'error');
        }
      }
    } catch (err: any) {
      console.error("Error sending reset password link:", err);
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Não foi possível enviar o link de redefinição via SMTP.', 'error');
      }
    } finally {
      setResetConfirmUser(null);
    }
  };

  const handleToggleAccessBlock = async (userObj: any) => {
    const isCurrentlyBlocked = userObj.accessStatus === 'Acesso bloqueado';
    const newStatus = isCurrentlyBlocked ? 'Ativo' : 'Acesso bloqueado';

    try {
      await updateDoc(doc(db, 'users', userObj.id), {
        accessStatus: newStatus,
        updatedAt: serverTimestamp()
      });
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast(
          isCurrentlyBlocked ? 'Acesso do usuário reativado com sucesso!' : 'Acesso do usuário bloqueado.',
          'success'
        );
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userObj.id}`);
    } finally {
      setBlockConfirmUser(null);
    }
  };

  const handleEditUser = (user: any) => {
    const [firstName, ...lastNameParts] = (user.displayName || '').split(' ');
    setEditingUser({
      email: '',
      agencyRole: '',
      birthDate: '',
      permissions: '',
      photoURL: '',
      ...user,
      firstName: user.firstName || firstName || '',
      lastName: user.lastName || lastNameParts.join(' ') || '',
      siteRole: user.siteRole || user.role || 'editor',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { id, ...userData } = editingUser;
      await updateDoc(doc(db, 'users', id), {
        ...userData,
        displayName: `${userData.firstName} ${userData.lastName}`,
        role: userData.siteRole,
        updatedAt: serverTimestamp(),
      });
      setIsEditModalOpen(false);
      setEditingUser(null);
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Usuário atualizado com sucesso!', 'success');
      }
    } catch (error) {
      if (typeof window !== 'undefined' && (window as any).showAdminToast) {
        (window as any).showAdminToast('Erro ao atualizar usuário. Verifique o console.', 'error');
      }
      handleFirestoreError(error, OperationType.UPDATE, `users/${editingUser.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertCircle size={48} className="text-[var(--color-ink)]/20 mb-4" />
        <p className="text-[var(--color-ink)]/40">Apenas administradores podem gerenciar usuários.</p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[var(--color-accent)]" size={48} /></div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold font-heading">Gerenciar Usuários</h3>
          <p className="text-xs text-[var(--color-ink)]/50 mt-1">
            Cadastre novos administradores e controle acessos à plataforma.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white px-6 py-3 rounded-xl font-extrabold flex items-center gap-2 hover:scale-105 transition-all shadow-md text-xs uppercase font-heading cursor-pointer"
        >
          <Plus size={20} /> Novo Usuário
        </button>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F3EDE0]/60 text-[#43210D]/70 text-[11px] uppercase tracking-wider font-extrabold border-b border-[var(--color-border)]">
              <tr>
                <th className="p-5">Usuário</th>
                <th className="p-5">E-mail</th>
                <th className="p-5">Cargo Agência</th>
                <th className="p-5">Cargo Site</th>
                <th className="p-5">Status do Acesso</th>
                <th className="p-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {users.map(u => {
                const status = u.accessStatus || 'Ativo';
                return (
                  <tr key={u.id} className="hover:bg-[#F3EDE0]/20 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.displayName} className="w-9 h-9 rounded-full object-cover border border-[#CE892C]/30 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#FFC400] text-[#43210D] flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                            {u.displayName?.[0] || u.email?.[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-bold block text-sm text-[#43210D]">{u.displayName || 'Sem nome'}</span>
                          {u.birthDate && (
                            <span className="text-[#43210D]/50 text-[10px]">
                              Nasc: {new Date(u.birthDate).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-[#43210D]/80 font-medium">{u.email}</td>
                    <td className="p-5 text-[#43210D]/80 font-medium">{u.agencyRole || '-'}</td>
                    <td className="p-5">
                      <select 
                        value={u.siteRole || u.role || 'editor'}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        disabled={u.uid === currentUser.uid}
                        className="bg-[#F3EDE0]/50 border border-[#CE892C]/30 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[#E17541] disabled:opacity-50 text-[#43210D] cursor-pointer"
                      >
                        <option value="admin">Administrador</option>
                        <option value="editor">Editor</option>
                      </select>
                    </td>
                    <td className="p-5">
                      {status === 'Convite enviado' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <Send size={12} className="shrink-0" />
                          <span>Convite enviado</span>
                        </span>
                      ) : status === 'Acesso bloqueado' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-300">
                          <Lock size={12} className="shrink-0" />
                          <span>Acesso bloqueado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <Check size={12} className="shrink-0" />
                          <span>Ativo</span>
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {status === 'Convite enviado' && (
                          <button
                            onClick={() => setResendConfirmUser(u)}
                            className="px-2.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Reenviar link de acesso"
                          >
                            <Send size={12} />
                            <span className="hidden xl:inline">Reenviar link</span>
                          </button>
                        )}

                        {status === 'Ativo' && (
                          <button
                            onClick={() => setResetConfirmUser(u)}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Enviar link para redefinir senha"
                          >
                            <Key size={12} />
                            <span className="hidden xl:inline">Redefinir senha</span>
                          </button>
                        )}

                        {u.uid !== currentUser.uid && (
                          <button
                            onClick={() => setBlockConfirmUser(u)}
                            className={`p-2 rounded-lg transition-colors border cursor-pointer ${
                              status === 'Acesso bloqueado'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                            title={status === 'Acesso bloqueado' ? 'Reativar acesso' : 'Bloquear acesso'}
                          >
                            {status === 'Acesso bloqueado' ? <Unlock size={15} /> : <Lock size={15} />}
                          </button>
                        )}

                        <button 
                          onClick={() => handleEditUser(u)}
                          className="p-2 text-[#43210D]/60 hover:text-[#E17541] hover:bg-[#F3EDE0]/50 rounded-lg transition-colors cursor-pointer"
                          title="Editar usuário"
                        >
                          <Edit2 size={16} />
                        </button>

                        {u.uid !== currentUser.uid && (
                          <button 
                            onClick={() => {
                              setUserToDelete(u.id);
                              setIsConfirmOpen(true);
                            }}
                            className="p-2 text-[#43210D]/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Adicionar Novo Usuário"
      >
        <form onSubmit={handleAddUser} className="space-y-6 font-sans">
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#F3EDE0] border-2 border-dashed border-[#CE892C]/40 flex items-center justify-center overflow-hidden">
                {newUser.photoURL ? (
                  <img src={newUser.photoURL} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-[#43210D]/30" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Upload size={20} />
                <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, false)} className="hidden" />
              </label>
            </div>
            <span className="text-[10px] font-bold text-[#43210D]/60 uppercase tracking-widest">Foto de Perfil</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Nome *</label>
              <input 
                required
                type="text"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
                placeholder="Ex: João"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Sobrenome *</label>
              <input 
                required
                type="text"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
                placeholder="Ex: Silva"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">E-mail *</label>
            <input 
              required
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
              placeholder="email@exemplo.com"
            />
            <p className="text-[11px] text-[#43210D]/60">
              Um e-mail com o link de acesso e criação de senha será enviado automaticamente para este endereço.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Cargo na Agência *</label>
              <input 
                required
                type="text"
                value={newUser.agencyRole}
                onChange={(e) => setNewUser({ ...newUser, agencyRole: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
                placeholder="Ex: Designer Sênior"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Cargo no Site *</label>
              <select 
                value={newUser.siteRole}
                onChange={(e) => setNewUser({ ...newUser, siteRole: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541] cursor-pointer"
              >
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Data de Nascimento *</label>
            <input 
              required
              type="date"
              value={newUser.birthDate}
              onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })}
              className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Ações / Permissões</label>
            <textarea 
              value={newUser.permissions}
              onChange={(e) => setNewUser({ ...newUser, permissions: e.target.value })}
              className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541] min-h-[90px]"
              placeholder="Descreva o que este usuário pode fazer..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-[#43210D]/60 hover:bg-[#F3EDE0] transition-all text-xs uppercase"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white px-6 py-3 rounded-xl font-extrabold transition-all shadow-md disabled:opacity-50 uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'ADICIONAR USUÁRIO'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }} 
        title="Editar Usuário"
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="space-y-6 font-sans">
            <div className="flex flex-col items-center gap-4 mb-2">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-[#F3EDE0] border-2 border-dashed border-[#CE892C]/40 flex items-center justify-center overflow-hidden">
                  {editingUser.photoURL ? (
                    <img src={editingUser.photoURL} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={32} className="text-[#43210D]/30" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Upload size={20} />
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} className="hidden" />
                </label>
              </div>
              <span className="text-[10px] font-bold text-[#43210D]/60 uppercase tracking-widest">Foto de Perfil</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Nome *</label>
                <input 
                  required
                  type="text"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Sobrenome *</label>
                <input 
                  required
                  type="text"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">E-mail *</label>
              <input 
                required
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Cargo na Agência *</label>
                <input 
                  required
                  type="text"
                  value={editingUser.agencyRole}
                  onChange={(e) => setEditingUser({ ...editingUser, agencyRole: e.target.value })}
                  className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Cargo no Site *</label>
                <select 
                  value={editingUser.siteRole}
                  onChange={(e) => setEditingUser({ ...editingUser, siteRole: e.target.value })}
                  className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541] cursor-pointer"
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Data de Nascimento *</label>
              <input 
                required
                type="date"
                value={editingUser.birthDate}
                onChange={(e) => setEditingUser({ ...editingUser, birthDate: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#43210D]/70 uppercase tracking-widest">Ações / Permissões</label>
              <textarea 
                value={editingUser.permissions}
                onChange={(e) => setEditingUser({ ...editingUser, permissions: e.target.value })}
                className="w-full bg-[#F3EDE0]/40 border border-[#CE892C]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#43210D] outline-none focus:border-[#E17541] min-h-[90px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-[#43210D]/60 hover:bg-[#F3EDE0] transition-all text-xs uppercase"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#FFC400] text-[#43210D] hover:bg-[#E17541] hover:text-white px-6 py-3 rounded-xl font-extrabold transition-all shadow-md disabled:opacity-50 uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer font-heading"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'SALVAR ALTERAÇÕES'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Resend Link Modal */}
      {resendConfirmUser && (
        <ConfirmModal
          isOpen={!!resendConfirmUser}
          onClose={() => setResendConfirmUser(null)}
          onConfirm={() => handleResendAccessLink(resendConfirmUser)}
          title="Reenviar Link de Acesso"
          message={`Enviar um novo link de configuração de senha para ${resendConfirmUser.email}?`}
        />
      )}

      {/* Confirm Reset Link Modal */}
      {resetConfirmUser && (
        <ConfirmModal
          isOpen={!!resetConfirmUser}
          onClose={() => setResetConfirmUser(null)}
          onConfirm={() => handleSendResetPasswordLink(resetConfirmUser)}
          title="Redefinir Senha do Usuário"
          message={`Enviar link de redefinição de senha para ${resetConfirmUser.email}?`}
        />
      )}

      {/* Confirm Block/Unblock Access Modal */}
      {blockConfirmUser && (
        <ConfirmModal
          isOpen={!!blockConfirmUser}
          onClose={() => setBlockConfirmUser(null)}
          onConfirm={() => handleToggleAccessBlock(blockConfirmUser)}
          title={blockConfirmUser.accessStatus === 'Acesso bloqueado' ? "Reativar Acesso" : "Bloquear Acesso"}
          message={
            blockConfirmUser.accessStatus === 'Acesso bloqueado'
              ? `Tem certeza que deseja reativar o acesso de ${blockConfirmUser.displayName || blockConfirmUser.email}?`
              : `Tem certeza que deseja bloquear o acesso de ${blockConfirmUser.displayName || blockConfirmUser.email}? O usuário não conseguirá entrar no painel.`
          }
        />
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        message="Tem certeza que deseja remover este usuário do sistema? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default Admin;
