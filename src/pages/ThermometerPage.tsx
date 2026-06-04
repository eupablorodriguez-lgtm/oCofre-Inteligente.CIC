import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, StatusBadge, ProgressBar } from '../components/ui/index';
import { getStatusColor } from '../lib/calculations';

export default function ThermometerPage() {
  const { shifts } = useApp();

  const data = useMemo(() => {
    if (shifts.length === 0) return null;
    const last30 = shifts.slice(0, 30);
    const latestStatus = shifts[0]?.operational_status || 'amarelo';
    const latestInsight = shifts[0]?.behavioral_insight || '';

    const greenCount = last30.filter(s => s.operational_status === 'verde').length;
    const yellowCount = last30.filter(s => s.operational_status === 'amarelo').length;
    const redCount = last30.filter(s => s.operational_status === 'vermelho').length;

    const last5 = shifts.slice(0, 5);
    const fatigue = last5.length >= 5 && last5.every(s => s.operational_status !== 'verde');

    return { latestStatus, latestInsight, greenCount, yellowCount, redCount, fatigue, totalShifts: last30.length };
  }, [shifts]);

  if (!data) {
    return (
      <Card className="p-6 text-center">
        <p className="text-[#8888a0] text-sm">Registre turnos para ver o termômetro.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-[#f0f0f5] text-2xl font-bold">Termômetro Operacional</h1>

      {/* Big status */}
      <Card className="p-8" glow={getStatusColor(data.latestStatus)}>
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Status Agora</p>
        <StatusBadge status={data.latestStatus} />
        {data.latestInsight && (
          <p className="text-[#f0f0f5] text-sm mt-4">{data.latestInsight}</p>
        )}
        {data.fatigue && (
          <p className="text-[#f44336] text-xs mt-2">Fadiga operacional detectada (5 turnos sem verde).</p>
        )}
      </Card>

      {/* Distribution */}
      <Card className="p-4">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">30 Dias</p>
        <div className="space-y-2">
          {[
            { label: 'Verdes', count: data.greenCount, color: '#00e676' },
            { label: 'Amarelos', count: data.yellowCount, color: '#ffc107' },
            { label: 'Vermelhos', count: data.redCount, color: '#f44336' },
          ].map(({ label, count, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#8888a0]">{label}</span>
                <span className="font-bold" style={{ color }}>{count}</span>
              </div>
              <ProgressBar
                value={data.totalShifts > 0 ? (count / data.totalShifts) * 100 : 0}
                color={color}
                height={4}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
