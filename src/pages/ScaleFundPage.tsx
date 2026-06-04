import { useState } from 'react';
import { ArrowDownCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, ProgressBar } from '../components/ui/index';
import { formatCurrency } from '../lib/calculations';

export default function ScaleFundPage() {
  const { user } = useAuth();
  const { scaleFund, setScaleFund, profile } = useApp();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount.replace(',', '.'));
    if (!amount || amount <= 0) { setError('Informe um valor válido.'); return; }
    if (!scaleFund || amount > scaleFund.balance) { setError('Saldo insuficiente.'); return; }
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const newBalance = scaleFund.balance - amount;
      const { error: e } = await supabase.from('scale_fund').update({
        balance: newBalance,
        total_withdrawn: scaleFund.total_withdrawn + amount,
        last_updated: new Date().toISOString(),
      }).eq('user_id', user.id);
      if (e) throw e;
      setScaleFund({ ...scaleFund, balance: newBalance, total_withdrawn: scaleFund.total_withdrawn + amount });
      setWithdrawAmount('');
      setShowWithdraw(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar saque.');
    } finally {
      setLoading(false);
    }
  };

  if (!scaleFund) return <div className="text-[#8888a0]">Carregando...</div>;

  const lifeAlloc = profile?.monthly_living_cost || 2000;

  return (
    <div className="space-y-4">
      <h1 className="text-[#f0f0f5] text-2xl font-bold">Fundo de Escala</h1>

      {/* Big balance */}
      <Card className="p-8" glow="#00b4d8">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Saldo</p>
        <p className="text-6xl font-black text-[#00b4d8] tabular-nums mb-4">{formatCurrency(scaleFund.balance)}</p>
        <button
          onClick={() => setShowWithdraw(!showWithdraw)}
          className="flex items-center gap-1.5 text-xs text-[#8888a0] hover:text-[#f0f0f5] border border-[#1e1e2a] hover:border-[#2a2a3a] px-3 py-2 rounded-lg transition-all"
        >
          <ArrowDownCircle size={13} /> Sacar
        </button>
      </Card>

      {/* Withdraw form */}
      {showWithdraw && (
        <Card className="p-4">
          <div className="space-y-2">
            <input
              type="number"
              step="0.01"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder="0,00"
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a]"
            />
            {error && <p className="text-[#f44336] text-xs flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setShowWithdraw(false)} className="flex-1 border border-[#1e1e2a] text-[#8888a0] py-2 rounded-lg text-sm transition-all">
                Cancelar
              </button>
              <button onClick={handleWithdraw} disabled={loading} className="flex-1 bg-[#ffc107] disabled:opacity-50 text-[#0a0a0f] font-bold py-2 rounded-lg text-sm transition-all">
                {loading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-[#8888a0] text-xs mb-1">Total Aportado</p>
          <p className="text-[#00e676] font-bold text-xl">{formatCurrency(scaleFund.total_contributed)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[#8888a0] text-xs mb-1">Total Retirado</p>
          <p className="text-[#ffc107] font-bold text-xl">{formatCurrency(scaleFund.total_withdrawn)}</p>
        </Card>
      </div>

      {/* Flow breakdown */}
      <Card className="p-4">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-3">Divisão de Fluxo</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#8888a0]">Vida Pessoal/mês</span>
              <span className="text-[#f44336] font-bold">{formatCurrency(lifeAlloc)}</span>
            </div>
            <ProgressBar value={100} color="#f44336" height={4} />
          </div>
        </div>
      </Card>
    </div>
  );
}
