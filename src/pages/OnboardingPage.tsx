import { useState } from 'react';
import { Gauge, ChevronRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import type { Platform } from '../lib/types';

interface OnboardingPageProps {
  onComplete: () => void;
}

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'uber', label: 'Uber' },
  { id: '99', label: '99' },
  { id: 'loggi', label: 'Loggi' },
  { id: 'indriver', label: 'InDriver' },
  { id: 'outro', label: 'Outro' },
];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { user } = useAuth();
  const { setProfile, setVehicleParams } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('uber');
  const [monthlyLiving, setMonthlyLiving] = useState('2000');
  const [vehicleName, setVehicleName] = useState('Meu Carro');
  const [monthlyRent, setMonthlyRent] = useState('0');
  const [monthlyInsurance, setMonthlyInsurance] = useState('0');
  const [monthlyFinancing, setMonthlyFinancing] = useState('0');
  const [monthlyMaintenance, setMonthlyMaintenance] = useState('150');
  const [costPerKm, setCostPerKm] = useState('0.40');
  const [monthlyFood, setMonthlyFood] = useState('400');
  const [otherMonthly, setOtherMonthly] = useState('0');

  const steps = ['Identificação', 'Seu Veículo', 'Custos Fixos'];

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const profileData = {
        id: user.id,
        name,
        platform,
        monthly_living_cost: parseFloat(monthlyLiving) || 2000,
        plan: 'free' as const,
        onboarding_complete: true,
      };
      const { data: p, error: pe } = await supabase.from('profiles').upsert(profileData).select().single();
      if (pe) throw pe;
      setProfile(p);

      const paramsData = {
        user_id: user.id,
        vehicle_name: vehicleName,
        monthly_rent: parseFloat(monthlyRent) || 0,
        monthly_insurance: parseFloat(monthlyInsurance) || 0,
        monthly_financing: parseFloat(monthlyFinancing) || 0,
        monthly_maintenance: parseFloat(monthlyMaintenance) || 150,
        cost_per_km: parseFloat(costPerKm) || 0.40,
        monthly_food: parseFloat(monthlyFood) || 400,
        other_monthly: parseFloat(otherMonthly) || 0,
        daily_hours_target: 8,
        monthly_km_target: 3000,
        scale_fund_rate: 0.15,
      };
      const { data: v, error: ve } = await supabase.from('vehicle_params').insert(paramsData).select().single();
      if (ve) throw ve;
      setVehicleParams(v);

      await supabase.from('scale_fund').insert({ user_id: user.id, balance: 0 });
      onComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configuração.');
    } finally {
      setLoading(false);
    }
  };

  const n = (v: string) => v.replace(',', '.');

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00b4d8]/15 border border-[#00b4d8]/30 mb-3">
            <Gauge size={22} className="text-[#00b4d8]" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wider">CABINE</h1>
          <p className="text-[#8888a0] text-sm mt-1">Calibração inicial</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition-all ${
                i < step ? 'bg-[#00e676] border-[#00e676] text-[#0a0a0f]'
                  : i === step ? 'border-[#00b4d8] text-[#00b4d8]'
                  : 'border-[#1e1e2a] text-[#44445a]'
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'text-[#f0f0f5]' : 'text-[#44445a]'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-[#00e676]' : 'bg-[#1e1e2a]'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#111118] border border-[#1e1e2a] rounded-xl p-6">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[#f0f0f5] font-semibold text-lg mb-1">Como você quer ser chamado?</h2>
                <p className="text-[#8888a0] text-sm">Identificação do operador no painel.</p>
              </div>
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Nome</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-2">Plataforma principal</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setPlatform(id)}
                      className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                        platform === id
                          ? 'border-[#00b4d8] bg-[#00b4d8]/15 text-[#00b4d8]'
                          : 'border-[#1e1e2a] text-[#8888a0] hover:border-[#2a2a3a]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Custo mensal de vida (R$)</label>
                <input
                  type="number"
                  value={monthlyLiving}
                  onChange={e => setMonthlyLiving(e.target.value)}
                  placeholder="2000"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
                <p className="text-[#44445a] text-xs mt-1">Aluguel, alimentação, contas. Usado para calcular Capacidade de Pausa.</p>
              </div>
              <button
                disabled={!name.trim()}
                onClick={() => setStep(1)}
                className="w-full bg-[#00b4d8] disabled:opacity-30 text-[#0a0a0f] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[#f0f0f5] font-semibold text-lg mb-1">Seu veículo</h2>
                <p className="text-[#8888a0] text-sm">Dados do veículo de operação.</p>
              </div>
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Nome do veículo</label>
                <input
                  value={vehicleName}
                  onChange={e => setVehicleName(e.target.value)}
                  placeholder="Ex: HB20 2022"
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Aluguel/mês (R$)</label>
                  <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Financiamento/mês</label>
                  <input type="number" value={monthlyFinancing} onChange={e => setMonthlyFinancing(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Seguro/mês (R$)</label>
                  <input type="number" value={monthlyInsurance} onChange={e => setMonthlyInsurance(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Custo/km (R$)</label>
                  <input type="number" step="0.01" value={costPerKm} onChange={e => setCostPerKm(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 border border-[#1e1e2a] text-[#8888a0] py-3 rounded-lg text-sm hover:border-[#2a2a3a] transition-all">
                  Voltar
                </button>
                <button onClick={() => setStep(2)} className="flex-1 bg-[#00b4d8] text-[#0a0a0f] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  Próximo <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[#f0f0f5] font-semibold text-lg mb-1">Consumo de Operação fixo</h2>
                <p className="text-[#8888a0] text-sm">Custos mensais rateados automaticamente por dia.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Manutenção/mês (R$)</label>
                  <input type="number" value={monthlyMaintenance} onChange={e => setMonthlyMaintenance(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Alimentação/mês (R$)</label>
                  <input type="number" value={monthlyFood} onChange={e => setMonthlyFood(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1.5">Outros custos fixos/mês (R$)</label>
                  <input type="number" value={otherMonthly} onChange={e => setOtherMonthly(n(e.target.value))}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors" />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1e1e2a]">
                <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Custo fixo diário estimado</p>
                <p className="text-[#00b4d8] font-bold text-xl">
                  R$ {((parseFloat(monthlyRent)||0) + (parseFloat(monthlyInsurance)||0) + (parseFloat(monthlyFinancing)||0) + (parseFloat(monthlyMaintenance)||150) + (parseFloat(monthlyFood)||400) + (parseFloat(otherMonthly)||0)).toFixed(2).replace('.', ',')} <span className="text-sm text-[#8888a0] font-normal">/ 30 dias</span>
                </p>
              </div>

              {error && <p className="text-[#f44336] text-sm">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-[#1e1e2a] text-[#8888a0] py-3 rounded-lg text-sm hover:border-[#2a2a3a] transition-all">
                  Voltar
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1 bg-[#00e676] disabled:opacity-50 text-[#0a0a0f] font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Salvando...' : 'Iniciar Cabine'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
