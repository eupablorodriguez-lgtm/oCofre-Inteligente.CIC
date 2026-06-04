import { useState } from 'react';
import { Plus, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, StatusBadge, InsightBanner } from '../components/ui/index';
import { calcShift, formatCurrency, formatDate, todayISO } from '../lib/calculations';
import type { ShiftInput } from '../lib/types';

export default function ShiftPanelPage() {
  const { user } = useAuth();
  const { vehicleParams, shifts, setShifts, scaleFund, setScaleFund, platforms } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);

  const [form, setForm] = useState<ShiftInput>({
    gross_revenue: 0,
    fuel_cost: 0,
    km_driven: 0,
    hours_worked: 0,
    extra_costs: 0,
    extra_cost_description: '',
    shift_date: todayISO(),
  });

  const n = (v: string) => parseFloat(v) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vehicleParams) return;
    setError('');
    setLoading(true);

    try {
      const recent = shifts.slice(0, 14).map(s => ({ net_real: s.net_real, cost_per_hour: s.cost_per_hour }));
      const calc = calcShift(form, vehicleParams, recent);

      const shiftData = {
        user_id: user.id,
        shift_date: form.shift_date,
        gross_revenue: form.gross_revenue,
        fuel_cost: form.fuel_cost,
        km_driven: form.km_driven,
        hours_worked: form.hours_worked,
        extra_costs: form.extra_costs,
        extra_cost_description: form.extra_cost_description,
        net_real: calc.net_real,
        operating_cost: calc.operating_cost,
        scale_fund_contribution: calc.scale_fund_contribution,
        operational_status: calc.operational_status,
        behavioral_insight: calc.behavioral_insight,
        cost_per_hour: calc.cost_per_hour,
        cost_per_km: calc.cost_per_km_real,
        platform_id: selectedPlatformId || null,
      };

      const { data, error: se } = await supabase.from('shifts').insert(shiftData).select().single();
      if (se) throw se;

      if (calc.scale_fund_contribution > 0) {
        const currentBalance = scaleFund?.balance || 0;
        const currentContributed = scaleFund?.total_contributed || 0;
        if (scaleFund) {
          await supabase.from('scale_fund').update({
            balance: currentBalance + calc.scale_fund_contribution,
            total_contributed: currentContributed + calc.scale_fund_contribution,
            last_updated: new Date().toISOString(),
          }).eq('user_id', user.id);
          setScaleFund({
            ...scaleFund,
            balance: currentBalance + calc.scale_fund_contribution,
            total_contributed: currentContributed + calc.scale_fund_contribution,
          });
        } else {
          const { data: fund } = await supabase.from('scale_fund').insert({
            user_id: user.id,
            balance: calc.scale_fund_contribution,
            total_contributed: calc.scale_fund_contribution,
          }).select().single();
          if (fund) setScaleFund(fund);
        }
      }

      setShifts([data, ...shifts]);
      setShowForm(false);
      setSelectedPlatformId(null);
      setForm({
        gross_revenue: 0, fuel_cost: 0, km_driven: 0, hours_worked: 0,
        extra_costs: 0, extra_cost_description: '', shift_date: todayISO(),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar turno.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este turno?')) return;
    const shift = shifts.find(s => s.id === id);
    if (!shift) return;
    await supabase.from('shifts').delete().eq('id', id);
    if (shift.scale_fund_contribution > 0 && scaleFund) {
      const newBalance = scaleFund.balance - shift.scale_fund_contribution;
      await supabase.from('scale_fund').update({ balance: Math.max(0, newBalance) }).eq('user_id', user?.id);
      setScaleFund({ ...scaleFund, balance: Math.max(0, newBalance) });
    }
    setShifts(shifts.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#f0f0f5] text-2xl font-bold">Novo Turno</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#00c9f0] text-[#0a0a0f] font-bold px-4 py-2.5 rounded-lg text-sm transition-all"
        >
          <Plus size={16} /> Registrar
        </button>
      </div>

      {/* Form — minimal */}
      {showForm && (
        <Card className="p-5" glow="#00b4d8">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1">Data</label>
                <input
                  type="date"
                  value={form.shift_date}
                  onChange={e => setForm({ ...form, shift_date: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors"
                />
              </div>
              {platforms.length > 0 && (
                <div>
                  <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1">Plataforma</label>
                  <select
                    value={selectedPlatformId || ''}
                    onChange={e => setSelectedPlatformId(e.target.value || null)}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors"
                  >
                    <option value="">Sem app</option>
                    {platforms.filter(p => p.is_active).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.platform_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1">Faturamento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0"
                  value={form.gross_revenue || ''}
                  onChange={e => setForm({ ...form, gross_revenue: n(e.target.value) })}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1">Combustível (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0"
                  value={form.fuel_cost || ''}
                  onChange={e => setForm({ ...form, fuel_cost: n(e.target.value) })}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-1">Horas</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="8"
                  value={form.hours_worked || ''}
                  onChange={e => setForm({ ...form, hours_worked: n(e.target.value) })}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
                />
              </div>
            </div>

            {/* Live preview com comissão */}
            {vehicleParams && form.gross_revenue > 0 && (
              <div className="bg-[#0a0a0f] rounded-lg p-3 border border-[#1e1e2a] space-y-2">
                {(() => {
                  const calc = calcShift(form, vehicleParams, []);
                  const selectedPlatform = selectedPlatformId ? platforms.find(p => p.id === selectedPlatformId) : null;
                  const comissaoValor = selectedPlatform ? (form.gross_revenue * selectedPlatform.commission_percentage) / 100 : 0;
                  const faturamentoLiquido = form.gross_revenue - comissaoValor;

                  return (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8888a0]">Faturamento bruto:</span>
                        <span className="text-[#f0f0f5] font-medium">{formatCurrency(form.gross_revenue)}</span>
                      </div>
                      {selectedPlatform && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8888a0]">Comissão ({selectedPlatform.platform_name} {selectedPlatform.commission_percentage}%):</span>
                          <span className="text-[#ffc107] font-medium">{formatCurrency(comissaoValor)}</span>
                        </div>
                      )}
                      <div className="border-t border-[#1e1e2a] pt-2 flex items-center justify-between">
                        <span className="text-[#8888a0] text-xs">Custo operação:</span>
                        <span className="text-[#ffc107] font-bold text-xs">{formatCurrency(calc.operating_cost)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#f0f0f5] font-bold text-xs">Você recebe:</span>
                        <p className={`font-bold text-sm ${calc.net_real >= 0 ? 'text-[#00e676]' : 'text-[#f44336]'}`}>
                          {formatCurrency(calc.net_real)}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-[#f44336] text-sm">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-[#1e1e2a] text-[#8888a0] py-2 rounded-lg text-sm hover:border-[#2a2a3a] transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-[#00b4d8] disabled:opacity-50 text-[#0a0a0f] font-bold py-2 rounded-lg text-sm transition-all">
                {loading ? 'Salvando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Shifts history — clean list */}
      <Card>
        <div className="px-4 py-3 border-b border-[#1e1e2a]">
          <p className="text-[#8888a0] text-xs uppercase tracking-widest">Histórico</p>
        </div>
        {shifts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-[#8888a0] text-sm">Nenhum turno registrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e2a]">
            {shifts.slice(0, 10).map((shift) => (
              <div key={shift.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: shift.operational_status === 'verde' ? '#00e676' : shift.operational_status === 'vermelho' ? '#f44336' : '#ffc107' }}
                    />
                    <div>
                      <p className="text-[#f0f0f5] text-sm font-medium">{formatDate(shift.shift_date)}</p>
                      <p className="text-[#44445a] text-xs">{formatCurrency(shift.gross_revenue)} · {shift.hours_worked}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${shift.net_real >= 0 ? 'text-[#00e676]' : 'text-[#f44336]'}`}>
                      {formatCurrency(shift.net_real)}
                    </p>
                    <button onClick={() => handleDelete(shift.id)} className="p-1 text-[#44445a] hover:text-[#f44336] transition-colors rounded">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {shift.behavioral_insight && (
                  <p className="text-[#44445a] text-xs mt-1">{shift.behavioral_insight}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
