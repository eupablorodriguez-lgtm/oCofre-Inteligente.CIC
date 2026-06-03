import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Wallet, TrendingUp, Target, Zap, Plus, LogOut, Bell, Settings, ChevronRight, Lightbulb, DollarSign, Mic, Send } from 'lucide-react';
import VoiceAI from '../components/VoiceAI';
import PIXPanel from '../components/PIXPanel';

export default function DashboardPage() {
  const { profile, user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showVoiceAI, setShowVoiceAI] = useState(false);
  const [showPIX, setShowPIX] = useState(false);
  const [newGoalData, setNewGoalData] = useState({
    nome: '',
    categoria: 'ipva',
    valor_meta: '',
    data_prazo: '',
  });

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const fetchGoals = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setGoals(data || []);
  };

  const fetchRecommendations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(3);
    setRecommendations(data || []);
  };

  useEffect(() => {
    fetchGoals();
    fetchRecommendations();
  }, [user]);

  const handleCreateGoal = async () => {
    if (!user || !newGoalData.nome || !newGoalData.valor_meta) return;

    const { error } = await supabase.from('savings_goals').insert({
      user_id: user.id,
      nome: newGoalData.nome,
      categoria: newGoalData.categoria,
      valor_meta: parseFloat(newGoalData.valor_meta),
      valor_atual: 0,
      data_prazo: newGoalData.data_prazo || null,
      status: 'active',
    });

    if (!error) {
      setNewGoalData({ nome: '', categoria: 'ipva', valor_meta: '', data_prazo: '' });
      setShowNewGoal(false);
      fetchGoals();
    }
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
  };

  const firstName = profile?.nome?.split(' ')[0] ?? 'Motorista';
  const totalMetas = goals.reduce((acc, g) => acc + (g.valor_meta - g.valor_atual), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#0F1419] text-white relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Modals */}
      <VoiceAI isOpen={showVoiceAI} onClose={() => setShowVoiceAI(false)} />
      <PIXPanel isOpen={showPIX} onClose={() => setShowPIX(false)} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={() => setShowPIX(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          title="Depositar/Sacar"
        >
          <DollarSign size={22} />
        </button>
        <button
          onClick={() => setShowVoiceAI(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          title="IA por voz"
        >
          <Mic size={22} />
        </button>
      </div>

      {/* Topbar */}
      <header className="border-b border-white/10 sticky top-0 bg-gradient-to-b from-[#0F1419]/90 to-[#0F1419]/50 backdrop-blur-xl z-20 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} color="#fff" strokeWidth={2} />
            </div>
            <span className="text-white font-bold text-base hidden sm:block">
              Driver<span className="text-emerald-400">Bank</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all">
              <Bell size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all">
              <Settings size={16} />
            </button>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-red-500/40 text-sm font-medium transition-all"
            >
              {loggingOut
                ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                : <LogOut size={14} />}
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Bem-vindo de volta,</p>
            <h1 className="text-3xl font-bold text-white">{firstName}</h1>
            <p className="text-white/40 text-xs mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-4 py-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Economizando</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                <DollarSign size={18} className="text-emerald-400" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Renda diaria</span>
            </div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Seu ganho</p>
            <p className="text-white font-bold text-2xl">{fmt(profile?.renda_diaria ?? 0)}</p>
            <p className="text-white/40 text-xs mt-2">Media diaria confirmada</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                <Target size={18} className="text-emerald-400" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{goals.length} metas</span>
            </div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Faltam guardar</p>
            <p className="text-white font-bold text-2xl">{fmt(totalMetas)}</p>
            <p className="text-white/40 text-xs mt-2">Proxima meta: {goals[0]?.nome || 'Nenhuma'}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">Sugestao</span>
            </div>
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Economizar por dia</p>
            <p className="text-white font-bold text-2xl">{fmt((profile?.renda_diaria ?? 0) * 0.3)}</p>
            <p className="text-white/40 text-xs mt-2">30% dos seus ganhos</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Goals Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Suas Metas</h2>
              <button
                onClick={() => setShowNewGoal(!showNewGoal)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                <Plus size={16} />
                Nova meta
              </button>
            </div>

            {showNewGoal && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome da meta (ex: IPVA 2025)"
                    value={newGoalData.nome}
                    onChange={e => setNewGoalData({ ...newGoalData, nome: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newGoalData.categoria}
                      onChange={e => setNewGoalData({ ...newGoalData, categoria: e.target.value })}
                      className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50"
                    >
                      <option value="ipva">IPVA</option>
                      <option value="seguro">Seguro</option>
                      <option value="manutencao">Manutencao</option>
                      <option value="viagem">Viagem</option>
                      <option value="outro">Outro</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Valor (R$)"
                      value={newGoalData.valor_meta}
                      onChange={e => setNewGoalData({ ...newGoalData, valor_meta: e.target.value })}
                      className="bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>
                  <input
                    type="date"
                    value={newGoalData.data_prazo}
                    onChange={e => setNewGoalData({ ...newGoalData, data_prazo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNewGoal(false)}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg py-2 hover:bg-white/10 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateGoal}
                      className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg py-2 font-medium hover:from-emerald-500 hover:to-emerald-700 transition-all"
                    >
                      Criar meta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {goals.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-sm text-center">
                <Target size={40} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/60 mb-4">Voce ainda nao tem metas de poupanca</p>
                <button
                  onClick={() => setShowNewGoal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-500 hover:to-emerald-700 transition-all"
                >
                  <Plus size={16} />
                  Criar sua primeira meta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map(goal => {
                  const progresso = (goal.valor_atual / goal.valor_meta) * 100;
                  const diasFaltantes = goal.data_prazo
                    ? Math.ceil((new Date(goal.data_prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;
                  const economiaNecessaria = diasFaltantes
                    ? ((goal.valor_meta - goal.valor_atual) / diasFaltantes).toFixed(2)
                    : null;

                  return (
                    <div key={goal.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white font-semibold">{goal.nome}</h3>
                          <p className="text-white/40 text-xs mt-1">Categoria: {goal.categoria}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                          {progresso.toFixed(0)}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">Progresso</span>
                          <span className="text-white">{fmt(goal.valor_atual)} / {fmt(goal.valor_meta)}</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                            style={{ width: `${Math.min(progresso, 100)}%` }}
                          />
                        </div>

                        {diasFaltantes !== null && (
                          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                            <div>
                              <p className="text-white/60 text-xs">Dias restantes</p>
                              <p className="text-white font-bold text-lg">{Math.max(0, diasFaltantes)}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs">Economizar por dia</p>
                              <p className="text-white font-bold text-lg">{fmt(parseFloat(economiaNecessaria!))}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommendations & Quick Actions */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb size={18} className="text-yellow-400" />
                <h2 className="text-lg font-bold text-white">IA Recomenda</h2>
              </div>

              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Zap size={32} className="mx-auto text-white/20 mb-3" />
                  <p className="text-white/60 text-sm">Crie metas para receber recomendacoes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map(rec => (
                    <div
                      key={rec.id}
                      className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 hover:border-emerald-500/50 transition-all text-sm"
                    >
                      <p className="text-white font-medium mb-2">{rec.recommendation_text}</p>
                      {rec.days_to_goal && (
                        <p className="text-emerald-400 text-xs">
                          <span className="font-semibold">{rec.days_to_goal} dias</span> • {fmt(rec.target_daily_savings)}/dia
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Acoes Rapidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowVoiceAI(true)}
                  className="w-full bg-gradient-to-r from-purple-500/80 to-purple-600/80 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg py-3 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Mic size={16} />
                  Falar com IA
                </button>
                <button
                  onClick={() => setShowPIX(true)}
                  className="w-full bg-gradient-to-r from-emerald-400/80 to-emerald-600/80 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-lg py-3 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <DollarSign size={16} />
                  PIX Depositar
                </button>
                <button
                  onClick={() => setShowPIX(true)}
                  className="w-full bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-3 font-medium transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} />
                  PIX Sacar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
