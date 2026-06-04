import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CircularGauge, ProgressBar } from '../components/ui/index';
import { calcPauseDays, formatCurrency } from '../lib/calculations';

export default function PauseCapacityPage() {
  const { profile, scaleFund, shifts } = useApp();

  const data = useMemo(() => {
    const balance = scaleFund?.balance || 0;
    const monthlyLiving = profile?.monthly_living_cost || 2000;
    const pauseDays = calcPauseDays(balance, monthlyLiving);
    const dailyLiving = monthlyLiving / 30;
    return { balance, pauseDays, monthlyLiving, dailyLiving };
  }, [scaleFund, profile]);

  const milestones = [1, 3, 7, 15, 30, 60, 90];

  return (
    <div className="space-y-4">
      <h1 className="text-[#f0f0f5] text-2xl font-bold">Capacidade de Pausa</h1>

      {/* Main — huge number */}
      <Card className="p-8" glow="#00e676">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Dias que você pode parar</p>
        <div className="flex items-center justify-between">
          <p className="text-7xl font-black text-[#00e676]">{data.pauseDays.toFixed(1).replace('.', ',')}</p>
          <CircularGauge value={Math.min(100, (data.pauseDays / 30) * 100)} size={110} color="#00e676" />
        </div>
      </Card>

      {/* Milestones */}
      <Card className="p-4">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Marcos</p>
        <div className="space-y-1.5">
          {milestones.map((days) => {
            const reached = data.pauseDays >= days;
            return (
              <div key={days} className={`flex items-center justify-between p-2 rounded-lg ${
                reached ? 'bg-[#00e676]/10' : 'opacity-30'
              }`}>
                <span className={`text-sm font-medium ${reached ? 'text-[#00e676]' : 'text-[#44445a]'}`}>
                  {days} {days === 1 ? 'dia' : 'dias'}
                </span>
                <span className={`text-sm font-bold ${reached ? 'text-[#00e676]' : 'text-[#44445a]'}`}>
                  {reached ? '✓' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#8888a0]">Saldo do Fundo</span>
            <span className="text-[#00b4d8] font-bold">{formatCurrency(data.balance)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8888a0]">Custo/dia de vida</span>
            <span className="text-[#f0f0f5] font-bold">{formatCurrency(data.dailyLiving)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
