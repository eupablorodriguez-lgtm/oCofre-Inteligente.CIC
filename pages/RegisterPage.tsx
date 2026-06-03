import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Wallet, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

type Props = {
  onSwitchToLogin: () => void;
};

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRules = [
    { label: 'Pelo menos 8 caracteres', valid: password.length >= 8 },
    { label: 'Letra maiuscula', valid: /[A-Z]/.test(password) },
    { label: 'Numero ou simbolo', valid: /[0-9!@#$%^&*]/.test(password) },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }
    if (!passwordRules.every(r => r.valid)) {
      setError('A senha nao atende aos requisitos minimos.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este e-mail ja esta cadastrado. Tente fazer login.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#0F1419] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Wallet size={24} color="#fff" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Driver<span className="text-emerald-400">Bank</span>
            </h1>
          </div>

          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Comece agora.<br />
            <span className="text-emerald-400">100% gratuito.</span>
          </h2>

          <p className="text-[#A0A0B8] text-base leading-relaxed mb-16">
            Junte-se a mais de 1.200 motoristas que estão economizando inteligentemente e atingindo suas metas financeiras.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            {[
              '💰 Poupança automática por meta',
              '🤖 Recomendações personalizadas de IA',
              '📊 Relatórios financeiros detalhados',
              '🎯 Acompanhamento de metas em tempo real',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                </div>
                <p className="text-white/80 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Wallet size={22} color="#fff" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Driver<span className="text-emerald-400">Bank</span>
            </h1>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Criar nova conta</h1>
            <p className="text-[#6B6B85] text-sm">Preencha os dados abaixo para comecar</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-4 pr-12 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {passwordRules.map(rule => (
                    <div key={rule.label} className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className={rule.valid ? 'text-emerald-400' : 'text-white/20'}
                      />
                      <span className={`text-xs ${rule.valid ? 'text-emerald-400' : 'text-white/40'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 transition-all duration-200 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Criar minha conta
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-[#6B6B85] text-sm">
              Ja possui uma conta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>

          <p className="text-center text-white/20 text-xs mt-8">
            Ao criar uma conta, voce concorda com os Termos de Uso e Politica de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
