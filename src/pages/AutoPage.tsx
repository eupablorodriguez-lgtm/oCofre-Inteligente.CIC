import { useState } from 'react';
import { Gauge, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onAuth: () => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onAuth();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      if (msg.includes('Invalid login')) setError('Email ou senha incorretos.');
      else if (msg.includes('already registered')) setError('Email já cadastrado. Faça login.');
      else if (msg.includes('Password should be')) setError('Senha deve ter pelo menos 6 caracteres.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#00b4d8]/15 border border-[#00b4d8]/30 mb-4">
            <Gauge size={28} className="text-[#00b4d8]" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-wider">CABINE</h1>
          <p className="text-[#8888a0] text-sm mt-1 tracking-widest">SUA FROTA É VOCÊ</p>
          <p className="text-[#8888a0] text-sm mt-3">
            {mode === 'login'
              ? 'Acesse seu painel operacional'
              : 'Descubra seu líquido real em 15 segundos'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
          <div className="flex mb-6 bg-[#0a0a0f] rounded-lg p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === m
                    ? 'bg-[#00b4d8] text-[#0a0a0f]'
                    : 'text-[#8888a0] hover:text-[#f0f0f5]'
                }`}
              >
                {m === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8888a0] hover:text-[#f0f0f5] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#f44336]/10 border border-[#f44336]/30 rounded-lg text-[#f44336] text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00b4d8] hover:bg-[#00c9f0] disabled:opacity-50 text-[#0a0a0f] font-bold py-3 rounded-lg transition-all duration-200 text-sm tracking-wide"
            >
              {loading ? 'Aguarde...' : mode === 'login' ? 'Acessar Cabine' : 'Iniciar Operação'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#44445a] text-xs mt-6">
          Sistema operacional para motoristas autônomos
        </p>
      </div>
    </div>
  );
}
