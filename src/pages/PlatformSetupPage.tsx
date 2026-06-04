import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/index';
import type { Platform } from '../lib/types';

interface PlatformSetupProps {
  onComplete?: () => void;
}

const PLATFORM_PRESETS: { id: Platform; label: string; commission: number; icon: string }[] = [
  { id: 'uber', label: 'Uber', commission: 25, icon: '🚕' },
  { id: '99', label: '99', commission: 28, icon: '🚗' },
  { id: 'loggi', label: 'Loggi', commission: 20, icon: '📦' },
  { id: 'indriver', label: 'InDriver', commission: 10, icon: '🎯' },
];

export default function PlatformSetupPage({ onComplete }: PlatformSetupProps) {
  const { user } = useAuth();
  const { setPlatforms } = useApp();
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['uber']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePlatform = (platformId: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContinue = async () => {
    if (!user || selectedPlatforms.length === 0) {
      setError('Selecione pelo menos uma plataforma');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const platformsData = selectedPlatforms.map((id) => ({
        user_id: user.id,
        platform_name: id,
        commission_percentage: PLATFORM_PRESETS.find((p) => p.id === id)?.commission || 20,
        is_active: true,
      }));

      const { data, error: err } = await supabase
        .from('user_platforms')
        .insert(platformsData)
        .select();

      if (err) throw err;

      setPlatforms(data || []);
      onComplete?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar plataformas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#f0f0f5] text-2xl font-bold">Quais apps você usa?</h2>
        <p className="text-[#8888a0] text-sm mt-2">Selecione as plataformas para melhor rastrear seus ganhos</p>
      </div>

      {/* Grid de seleção simples */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLATFORM_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => togglePlatform(preset.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedPlatforms.includes(preset.id)
                ? 'border-[#00b4d8] bg-[#00b4d8]/10'
                : 'border-[#1e1e2a] bg-[#0a0a0f] hover:border-[#2a2a3a]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl mb-2">{preset.icon}</p>
                <p className="text-[#f0f0f5] font-bold">{preset.label}</p>
                <p className="text-[#8888a0] text-xs mt-1">{preset.commission}% comissão</p>
              </div>
              {selectedPlatforms.includes(preset.id) && (
                <div className="w-5 h-5 rounded-full bg-[#00b4d8] flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-[#0a0a0f]" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {error && <p className="text-[#f44336] text-sm">{error}</p>}

      {/* Info */}
      <Card className="p-4 bg-[#00b4d8]/5 border border-[#00b4d8]/20">
        <p className="text-[#8888a0] text-xs">
          Você pode adicionar ou remover apps depois na seção <span className="text-[#f0f0f5]">Apps</span>.
        </p>
      </Card>

      <button
        onClick={handleContinue}
        disabled={loading || selectedPlatforms.length === 0}
        className="w-full bg-[#00b4d8] hover:bg-[#00c9f0] disabled:opacity-50 text-[#0a0a0f] font-bold py-3 rounded-lg transition-all"
      >
        {loading ? 'Salvando...' : 'Continuar'}
      </button>
    </div>
  );
}
