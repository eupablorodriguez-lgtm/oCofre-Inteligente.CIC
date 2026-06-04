import { useState } from 'react';
import { Save, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/index';
import { calcDailyFixedCost, formatCurrency } from '../lib/calculations';
import type { Platform } from '../lib/types';

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'uber', label: 'Uber' },
  { id: '99', label: '99' },
  { id: 'loggi', label: 'Loggi' },
  { id: 'indriver', label: 'InDriver' },
  { id: 'outro', label: 'Outro' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, setProfile, vehicleParams, setVehicleParams } = useApp();

  const [pName, setPName] = useState(profile?.name || '');
  const [pPlatform, setPPlatform] = useState<Platform>(profile?.platform || 'uber');
  const [pLiving, setPLiving] = useState(String(profile?.monthly_living_cost || 2000));
  const [vRent, setVRent] = useState(String(vehicleParams?.monthly_rent || 0));
  const [vMaintenance, setVMaintenance] = useState(String(vehicleParams?.monthly_maintenance || 150));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const n = (v: string) => parseFloat(v.replace(',', '.')) || 0;

  const handleSave = async () => {
    if (!user) return;
    setError('');
    setLoading(true);
    try {
      if (profile) {
        const profileUpdate = {
          name: pName,
          platform: pPlatform,
          monthly_living_cost: n(pLiving),
          updated_at: new Date().toISOString(),
        };
        const { data: p, error: pe } = await supabase.from('profiles').update(profileUpdate).eq('id', user.id).select().single();
        if (pe) throw pe;
        setProfile({ ...profile, ...p });
      }

      if (vehicleParams) {
        const paramsUpdate = {
          monthly_rent: n(vRent),
          monthly_maintenance: n(vMaintenance),
          updated_at: new Date().toISOString(),
        };
        const { data: v, error: ve } = await supabase.from('vehicle_params').update(paramsUpdate).eq('id', vehicleParams.id).select().single();
        if (ve) throw ve;
        setVehicleParams({ ...vehicleParams, ...v });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const dailyFixed = vehicleParams ? calcDailyFixedCost({
    ...vehicleParams,
    monthly_rent: n(vRent),
    monthly_maintenance: n(vMaintenance),
  } as any) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#f0f0f5] text-2xl font-bold">Configurações</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-lg text-sm transition-all ${
            saved ? 'bg-[#00e676] text-[#0a0a0f]' : 'bg-[#00b4d8] hover:bg-[#00c9f0] text-[#0a0a0f]'
          } disabled:opacity-50`}
        >
          {saved ? <><Check size={14} /> Salvo</> : <><Save size={14} /> Salvar</>}
        </button>
      </div>

      {/* Profile */}
      <Card className="p-4">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Você</p>
        <div className="space-y-3">
          <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Seu nome"
            className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors"
          />
          <div>
            <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-2">Plataforma</label>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPPlatform(id)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    pPlatform === id ? 'border-[#00b4d8] bg-[#00b4d8]/15 text-[#00b4d8]' : 'border-[#1e1e2a] text-[#8888a0] hover:border-[#2a2a3a]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <input type="number" value={pLiving} onChange={e => setPLiving(e.target.value)} placeholder="2000"
            className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors"
          />
          <p className="text-[#44445a] text-xs">Custo mensal de vida</p>
        </div>
      </Card>

      {/* Vehicle */}
      <Card className="p-4">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Veículo</p>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-[#8888a0] mb-1">Aluguel/mês (R$)</label>
            <input type="number" value={vRent} onChange={e => setVRent(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8888a0] mb-1">Manutenção/mês (R$)</label>
            <input type="number" value={vMaintenance} onChange={e => setVMaintenance(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors"
            />
          </div>
        </div>
      </Card>

      {/* Custo fixo preview */}
      <Card className="p-4 bg-[#00b4d8]/10 border border-[#00b4d8]/20">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest">Custo fixo diário</p>
        <p className="text-[#00b4d8] text-2xl font-bold mt-1">{formatCurrency(dailyFixed)}</p>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-[#f44336] text-sm bg-[#f44336]/10 border border-[#f44336]/20 rounded-lg px-3 py-2">
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}
