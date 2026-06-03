import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Wallet, User, Phone, DollarSign, ArrowRight, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ProfileSetupPage() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [dados, setDados] = useState({
    nome: '',
    telefone: '',
    renda_diaria: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { num: 1, label: 'Seu Perfil' },
    { num: 2, label: 'Seus Ganhos' },
  ];

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!dados.nome.trim()) { setError('Nome completo e obrigatorio.'); return; }
      setStep(2);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!dados.renda_diaria) {
      setError('Preencha seu ganho medio diario para continuar.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user!.id,
      nome: dados.nome.trim(),
      telefone: dados.telefone.trim(),
      renda_diaria: parseFloat(dados.renda_diaria),
      profile_complete: true,
    });
    if (error) {
      setError('Erro ao salvar perfil. Tente novamente.');
    } else {
      await refreshProfile();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#0F1419] flex flex-col relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5 backdrop-blur-sm relative z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} color="#fff" strokeWidth={2} />
            </div>
            <span className="text-white font-bold text-base">
              Driver<span className="text-emerald-400">Bank</span>
            </span>
          </div>
          <span className="text-white/40 text-xs">Configuracao de perfil</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center gap-0 mb-8">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        step > s.num
                          ? 'bg-emerald-500 text-white'
                          : step === s.num
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium whitespace-nowrap ${
                        step >= s.num ? 'text-white' : 'text-white/40'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-4 transition-all duration-300 ${
                        step > s.num ? 'bg-emerald-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center mb-4">
                    <User size={22} className="text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Comece aqui</h2>
                  <p className="text-white/60 text-sm">Nos diga quem voce e</p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                      Nome completo *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        value={dados.nome}
                        onChange={e => setDados({ ...dados, nome: e.target.value })}
                        placeholder="Ex: Carlos Eduardo Silva"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                      WhatsApp (opcional)
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="tel"
                        value={dados.telefone}
                        onChange={e => setDados({ ...dados, telefone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 transition-all duration-200 mt-8"
                >
                  Continuar
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="mb-8">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center mb-4">
                    <DollarSign size={22} className="text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Seus ganhos</h2>
                  <p className="text-white/60 text-sm">Nos ajude a calcular suas metas</p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                    Ganho medio diario (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={dados.renda_diaria}
                      onChange={e => setDados({ ...dados, renda_diaria: e.target.value })}
                      placeholder="Ex: 250,00"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2">Media dos ultimos 30 dias de trabalho</p>
                </div>

                {dados.renda_diaria && (
                  <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-white/70 text-xs mb-2">Com essa renda, voce pode economizar:</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-emerald-400 font-bold">5 dias</p>
                        <p className="text-white/40 text-xs">R$ {(parseFloat(dados.renda_diaria) * 5 * 0.3).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-emerald-400 font-bold">10 dias</p>
                        <p className="text-white/40 text-xs">R$ {(parseFloat(dados.renda_diaria) * 10 * 0.3).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-emerald-400 font-bold">30 dias</p>
                        <p className="text-white/40 text-xs">R$ {(parseFloat(dados.renda_diaria) * 30 * 0.3).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold rounded-xl py-4 transition-all duration-200"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-[2] bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Comcar a economizar
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-white/20 text-xs mt-6">
            Seus dados sao 100% protegidos e nunca compartilhados.
          </p>
        </div>
      </div>
    </div>
  );
}
