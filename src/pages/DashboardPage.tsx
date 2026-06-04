import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CircularGauge, StatusBadge, InsightBanner } from '../components/ui/index';
import { formatCurrency, calcPauseDays, formatDate } from '../lib/calculations';

export default function DashboardPage() {
  const { profile, vehicleParams, shifts, scaleFund } = useApp();

  const stats = useMemo(() => {
    if (!vehicleParams) return null;
    const last30 = shifts.slice(0, 30);
    const totalNet = last30.reduce((s, sh) => s + sh.net_real, 0);
    const pauseDays = scaleFund ? calcPauseDays(scaleFund.balance, profile?.monthly_living_cost || 2000) : 0;
    return { totalNet, pauseDays, balance: scaleFund?.balance || 0 };
  }, [shifts, vehicleParams, scaleFund, profile]);

  const todayShift = shifts[0] && shifts[0].shift_date === new Date().toISOString().split('T')[0] ? shifts[0] : null;

  if (!stats) return <div className="flex items-center justify-center h-64"><p className="text-[#8888a0]">Carregando...</p></div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[#f0f0f5] text-3xl font-bold">CABINE</h1>
        {todayShift && <StatusBadge status={todayShift.operational_status} />}
      </div>

      {/* Today's insight */}
      {todayShift && (
        <InsightBanner text={todayShift.behavioral_insight} status={todayShift.operational_status} />
      )}

      {/* 3 Core metrics — BIG and bold */}
      <div className="grid grid-cols-1 gap-3">
        {/* Liquid Real */}
        <Card className="p-6" glow={stats.totalNet >= 0 ? '#00e676' : '#f44336'}>
          <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Líquido Real (30d)</p>
          <p className={`text-6xl font-black tabular-nums ${stats.totalNet >= 0 ? 'text-[#00e676]' : 'text-[#f44336]'}`}>
            {formatCurrency(stats.totalNet)}
          </p>
        </Card>

        {/* Pause Capacity */}
        <Card className="p-6" glow="#00b4d8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Dias de Pausa</p>
              <p className="text-5xl font-black text-[#00b4d8]">{stats.pauseDays.toFixed(1).replace('.', ',')}</p>
            </div>
            <CircularGauge value={Math.min(100, (stats.pauseDays / 30) * 100)} size={100} color="#00b4d8" />
          </div>
        </Card>

        {/* Scale Fund */}
        <Card className="p-6" glow="#ffc107">
          <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Fundo de Escala</p>
          <p className="text-5xl font-black text-[#ffc107] tabular-nums">{formatCurrency(stats.balance)}</p>
        </Card>
      </div>

      {/* Minimal recent shifts */}
      {shifts.length > 0 && (
        <Card className="p-4 mt-6">
          <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Últimos Turnos</p>
          {shifts.slice(0, 3).map((shift) => (
            <div key={shift.id} className="flex items-center justify-between py-2.5 border-b border-[#1e1e2a] last:border-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: shift.operational_status === 'verde' ? '#00e676' : shift.operational_status === 'vermelho' ? '#f44336' : '#ffc107' }}
                />
                <span className="text-[#f0f0f5] text-sm">{formatDate(shift.shift_date)}</span>
              </div>
              <span className={`font-bold text-sm ${shift.net_real >= 0 ? 'text-[#00e676]' : 'text-[#f44336]'}`}>
                {formatCurrency(shift.net_real)}
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
