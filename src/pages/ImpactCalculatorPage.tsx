import { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/index';
import { calcImpactInHours, calcImpactInPauseDays, formatCurrency } from '../lib/calculations';

export default function ImpactCalculatorPage() {
  const { profile, shifts } = useApp();
  const [amount, setAmount] = useState('');

  const avgNetPerHour = useMemo(() => {
    const withHours = shifts.filter(s => s.hours_worked > 0 && s.net_real > 0);
    if (withHours.length === 0) return 25;
    return withHours.reduce((s, sh) => s + sh.net_real / sh.hours_worked, 0) / withHours.length;
  }, [shifts]);

  const monthlyLiving = profile?.monthly_living_cost || 2000;
  const parsed = parseFloat(amount.replace(',', '.')) || 0;
  const hoursImpact = parsed > 0 ? calcImpactInHours(parsed, avgNetPerHour) : 0;
  const pauseImpact = parsed > 0 ? calcImpactInPauseDays(parsed, monthlyLiving) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-[#f0f0f5] text-2xl font-bold">Impacto de Gastos</h1>

      {/* Input */}
      <Card className="p-6">
        <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-2">Quanto custa?</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0,00"
          className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-4 text-4xl font-bold outline-none focus:border-[#00b4d8] transition-colors placeholder-[#1e1e2a] tabular-nums"
        />
      </Card>

      {/* Results */}
      {parsed > 0 && (
        <>
          <Card className="p-6" glow="#ffc107">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Equivale a horas de direção</p>
            <p className="text-4xl font-black text-[#ffc107]">{hoursImpact.toFixed(1).replace('.', ',')}h</p>
          </Card>

          <Card className="p-6" glow="#f44336">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Dias de pausa perdidos</p>
            <p className="text-4xl font-black text-[#f44336]">{pauseImpact.toFixed(2).replace('.', ',')}</p>
          </Card>
        </>
      )}

      {parsed === 0 && (
        <Card className="p-8 text-center">
          <Calculator size={28} className="text-[#1e1e2a] mx-auto mb-2" />
          <p className="text-[#8888a0] text-sm">Insira um valor.</p>
        </Card>
      )}
    </div>
  );
}
