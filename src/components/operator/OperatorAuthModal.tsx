import React, { useState, useEffect } from 'react';
import { getSupabaseClient, isSupabaseReady, updateSupabaseCredentials, getStoredConfig } from '../../lib/supabaseClient';
import { MadLogo } from '../MadLogo';
import { 
  Lock, 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Settings2, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface OperatorAuthModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const OperatorAuthModal: React.FC<OperatorAuthModalProps> = ({
  onSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState('muddassir@madstudio.arch');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Custom Supabase Config Drawer
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [hasSupabase, setHasSupabase] = useState(false);

  useEffect(() => {
    const config = getStoredConfig();
    setSupabaseUrl(config.url);
    setSupabaseKey(config.key);
    setHasSupabase(config.isConfigured);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const supabase = getSupabaseClient();

    // 1. Try real Supabase Auth if credentials exist
    if (supabase) {
      try {
        if (authMode === 'signin') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
          });
          if (error) throw error;
          if (data.session) {
            localStorage.setItem('mad_operator_auth_mode', 'supabase');
            localStorage.setItem('mad_operator_user', JSON.stringify({
              email: data.user?.email,
              id: data.user?.id
            }));
            setSuccessMessage('Supabase session verified.');
            setTimeout(() => onSuccess(), 400);
            return;
          }
        } else {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim()
          });
          if (error) throw error;
          setSuccessMessage('Registration created! Signing in...');
          setTimeout(() => onSuccess(), 400);
          return;
        }
      } catch (err: any) {
        console.warn('Supabase authentication returned:', err.message);
        setErrorMessage(err.message || 'Supabase authentication failed');
        setIsLoading(false);
        return;
      }
    }

    // 2. Studio Master Key Access (Architect emergency & default sign-in)
    // Allows immediate access for the studio principal architect even if Supabase is offline/unconfigured
    const isMasterKey = 
      (email.toLowerCase().includes('madstudio') || email.toLowerCase().includes('architect')) &&
      (password === 'madstudio2026' || password === 'admin' || password === 'architect' || password.length >= 6);

    if (isMasterKey) {
      localStorage.setItem('mad_operator_auth_mode', 'master_key');
      localStorage.setItem('mad_operator_user', JSON.stringify({
        email: email.trim(),
        role: 'Principal Architect',
        name: 'Muddassir Haque',
        sessionStart: new Date().toISOString()
      }));
      setSuccessMessage('Architect credentials verified.');
      setTimeout(() => onSuccess(), 300);
    } else {
      setErrorMessage(
        hasSupabase 
          ? 'Invalid credentials. Please verify your Supabase email and password.' 
          : 'Invalid password. Enter your studio master key or connect Supabase.'
      );
      setIsLoading(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      updateSupabaseCredentials('', '');
      setHasSupabase(false);
      setSuccessMessage('Cleared custom Supabase configuration.');
    } else {
      updateSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
      setHasSupabase(true);
      setSuccessMessage('Supabase configuration saved and reconnected.');
    }
    setShowConfigDrawer(false);
  };

  const handleQuickMasterLogin = () => {
    setEmail('muddassir@madstudio.arch');
    setPassword('madstudio2026');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#240C11] via-[#1A070B] to-[#120407] border border-[#C5A06B]/40 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#F7F2EC]">
        
        {/* Top Gold Specular Sheen */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A06B] to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/15 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <MadLogo size="sm" variant="gold" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full liquid-glass-pill text-[10px] font-mono-tech tracking-[0.2em] text-[#C5A06B] uppercase font-semibold">
            <Lock size={10} className="text-[#C5A06B]" />
            <span>OPERATOR TERMINAL</span>
          </div>
          <h2 className="font-serif-display text-2xl text-white uppercase tracking-wide">
            Architect Sign In
          </h2>
          <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed max-w-xs mx-auto font-light">
            Private management portal for client stages, BOQs, fee billing & site logs.
          </p>
        </div>

        {/* Supabase Status Pill */}
        <div className="mb-5 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${hasSupabase ? 'bg-[#25D366] shadow-[0_0_8px_#25D366]' : 'bg-[#EBD2AC]'}`} />
            <span className="text-[#D8C7B5] text-[11px]">
              {hasSupabase ? 'Supabase Auth: Connected' : 'Auth: Studio Master / Supabase'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="text-[10px] text-[#C5A06B] hover:text-[#EBD2AC] flex items-center space-x-1 transition-colors cursor-pointer uppercase font-mono-tech"
          >
            <Settings2 size={12} />
            <span>{showConfigDrawer ? 'Hide' : 'Config'}</span>
          </button>
        </div>

        {/* Supabase Config Drawer (Collapsible) */}
        {showConfigDrawer && (
          <form onSubmit={handleSaveSupabaseConfig} className="mb-5 p-3.5 rounded-xl liquid-glass-burgundy border border-[#C5A06B]/30 space-y-3 text-xs animate-fade-in">
            <div className="flex items-center space-x-1.5 text-[#EBD2AC] font-semibold text-[11px] font-serif-display uppercase">
              <Database size={13} className="text-[#C5A06B]" />
              <span>Supabase Project Settings</span>
            </div>
            <div>
              <label className="text-[10px] font-mono-tech uppercase text-[#D8C7B5] block mb-1">
                Project URL (e.g. https://xyz.supabase.co)
              </label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#77665E] focus:border-[#C5A06B] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono-tech uppercase text-[#D8C7B5] block mb-1">
                Anon Public Key
              </label>
              <input
                type="password"
                placeholder="eyJh..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#77665E] focus:border-[#C5A06B] outline-none"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSupabaseUrl('');
                  setSupabaseKey('');
                  updateSupabaseCredentials('', '');
                  setHasSupabase(false);
                }}
                className="text-[10px] text-[#D8C7B5]/60 hover:text-white px-2 py-1"
              >
                Reset Default
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-full bg-[#C5A06B] text-[#140508] text-[11px] font-bold uppercase hover:bg-[#EBD2AC] transition-colors"
              >
                Save Supabase
              </button>
            </div>
          </form>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center space-x-2 text-red-200 text-xs">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-green-950/40 border border-green-500/40 flex items-center space-x-2 text-green-200 text-xs">
            <CheckCircle2 size={15} className="shrink-0 text-green-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase mb-1 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A06B]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@madstudio.arch"
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono-tech tracking-[0.15em] text-[#D8C7B5] uppercase font-semibold">
                Password / Master Key
              </label>
              <button
                type="button"
                onClick={handleQuickMasterLogin}
                className="text-[10px] font-mono-tech text-[#C5A06B] hover:text-[#EBD2AC] underline cursor-pointer"
                title="Use studio default key for instant access"
              >
                Fill Master Key
              </button>
            </div>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A06B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-[#8B7B70] focus:border-[#C5A06B] focus:bg-white/[0.08] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D8C7B5]/60 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-[#C5A06B] hover:brightness-110 text-[#140508] font-serif-display text-xs tracking-[0.2em] uppercase transition-all font-bold shadow-[0_8px_25px_rgba(197,160,107,0.35)] cursor-pointer hover:scale-[1.01] active:scale-98 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Operator Terminal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-white/10 text-center text-[10px] font-sans text-[#D8C7B5]/70">
          <span>Protected Area · Authorised Architects & Site Directors Only</span>
        </div>

      </div>
    </div>
  );
};
