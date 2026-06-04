import { useState } from 'react';
import { Plus, Trash2, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/index';
import type { Platform, UserPlatform } from '../lib/types';

const PLATFORM_PRESETS: { id: Platform; label: string; description: string; defaultCommission: number }[] = [
  { id: 'uber', label: 'Uber', description: 'Comissão padrão: 25%', defaultCommission: 25 },
  { id: '99', label: '99', description: 'Comissão padrão: 28%', defaultCommission: 28 },
  { id: 'loggi', label: 'Loggi', description: 'Comissão padrão: 20%', defaultCommission: 20 },
  { id: 'indriver', label: 'InDriver', description: 'Comissão padrão: 10%', defaultCommission: 10 },
  { id: 'outro', label: 'Outro', description: 'Personalizável', defaultCommission: 20 },
];

export default function PlatformsPage() {
  const { user } = useAuth();
  const { platforms, setPlatforms } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('uber');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (platform: Platform) => {
    if (!user) return;
    setError('');
    setLoading(true);

    try {
      const preset = PLATFORM_PRESETS.find(p => p.id === platform);
      if (!preset) throw new Error('Plataforma inválida');

      // Verificar se já existe
      if (platforms.some(p => p.platform_name === platform)) {
        setError('Você já adicionou esta plataforma');
        setLoading(false);
        return;
      }

      const { data, error: err } = await supabase
        .from('user_platforms')
        .insert({
          user_id: user.id,
          platform_name: platform,
          commission_percentage: preset.defaultCommission,
          is_active: true,
        })
        .select()
        .single();

      if (err) throw err;

      setPlatforms([...platforms, data]);
      setSelectedPlatform('uber');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao adicionar plataforma');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (platform: UserPlatform) => {
    try {
      const { data, error: err } = await supabase
        .from('user_platforms')
        .update({ is_active: !platform.is_active })
        .eq('id', platform.id)
        .select()
        .single();

      if (err) throw err;

      setPlatforms(platforms.map(p => (p.id === platform.id ? data : p)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar');
    }
  };

  const handleDelete = async (platformId: string) => {
    if (!confirm('Remover esta plataforma?')) return;

    try {
      await supabase.from('user_platforms').delete().eq('id', platformId);
      setPlatforms(platforms.filter(p => p.id !== platformId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao remover');
    }
  };

  const handleUpdateCommission = async (platform: UserPlatform, newCommission: string) => {
    try {
      const commissionNum = parseFloat(newCommission) || platform.commission_percentage;
      if (commissionNum < 0 || commissionNum > 100) {
        setError('Comissão deve estar entre 0% e 100%');
        return;
      }

      const { data, error: err } = await supabase
        .from('user_platforms')
        .update({ commission_percentage: commissionNum })
        .eq('id', platform.id)
        .select()
        .single();

      if (err) throw err;

      setPlatforms(platforms.map(p => (p.id === platform.id ? data : p)));
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar');
    }
  };

  const alreadyAdded = platforms.map(p => p.platform_name);
  const availablePlatforms = PLATFORM_PRESETS.filter(p => !alreadyAdded.includes(p.id));

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-[#f0f0f5] text-3xl font-bold">Suas Plataformas</h1>
        <p className="text-[#8888a0] text-sm mt-2">Adicione os apps que você usa para melhor rastrear seus ganhos</p>
      </div>

      {/* Grid de seleção — super simples */}
      {availablePlatforms.length > 0 && (
        <Card className="p-6">
          <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-4">Escolha uma plataforma:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availablePlatforms.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleAdd(preset.id)}
                disabled={loading}
                className="p-4 border border-[#1e1e2a] rounded-lg hover:border-[#00b4d8] hover:bg-[#00b4d8]/5 transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#f0f0f5] font-bold">{preset.label}</p>
                    <p className="text-[#8888a0] text-xs mt-1">{preset.description}</p>
                  </div>
                  <Plus size={18} className="text-[#00b4d8]" />
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#f44336] text-sm mt-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </Card>
      )}

      {/* Plataformas adicionadas */}
      {platforms.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-[#8888a0] text-sm">Nenhuma plataforma adicionada ainda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-[#8888a0] text-xs uppercase tracking-widest">Apps adicionados:</p>
          {platforms.map((platform) => (
            <Card key={platform.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Toggle */}
                <button
                  onClick={() => handleToggle(platform)}
                  className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded border-2 transition-all ${
                    platform.is_active
                      ? 'bg-[#00e676] border-[#00e676]'
                      : 'border-[#1e1e2a] hover:border-[#2a2a3a]'
                  }`}
                >
                  {platform.is_active && <Check size={14} className="text-[#0a0a0f]" />}
                </button>

                {/* Info */}
                <div className="flex-1">
                  <p className={`font-bold text-sm ${platform.is_active ? 'text-[#f0f0f5]' : 'text-[#44445a] line-through'}`}>
                    {PLATFORM_PRESETS.find(p => p.id === platform.platform_name)?.label || platform.platform_name}
                  </p>
                </div>

                {/* Comissão editável */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={platform.commission_percentage}
                    onChange={(e) => handleUpdateCommission(platform, e.target.value)}
                    disabled={!platform.is_active}
                    className="w-16 bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-sm outline-none focus:border-[#00b4d8] transition-colors disabled:opacity-50 text-center"
                  />
                  <span className="text-[#8888a0] text-sm">%</span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(platform.id)}
                  className="p-2 text-[#44445a] hover:text-[#f44336] transition-colors rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info card */}
      <Card className="p-4 bg-[#00b4d8]/5 border border-[#00b4d8]/20">
        <p className="text-[#f0f0f5] text-xs uppercase tracking-widest mb-2">Como funciona:</p>
        <ul className="text-[#8888a0] text-xs space-y-1.5">
          <li>• <span className="text-[#f0f0f5]">Marque como "ativo"</span> as plataformas que você está usando agora</li>
          <li>• <span className="text-[#f0f0f5]">Ajuste a comissão</span> se ela for diferente do padrão (clique no número)</li>
          <li>• Ao registrar turno, escolha qual app foi</li>
          <li>• Veja análises separadas por plataforma</li>
        </ul>
      </Card>
    </div>
  );
}

