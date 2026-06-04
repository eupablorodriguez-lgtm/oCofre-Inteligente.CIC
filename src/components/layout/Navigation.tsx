import { LayoutDashboard, Gauge, PauseCircle, Wallet, Thermometer, Calculator, Settings, LogOut, Menu, X, MessageCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export type Page = 'dashboard' | 'turno' | 'pausa' | 'fundo' | 'termometro' | 'calculadora' | 'assistente' | 'plataformas' | 'configuracoes';

interface NavProps {
  current: Page;
  onNavigate: (p: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Painel', Icon: LayoutDashboard },
  { id: 'turno', label: 'Turno', Icon: Gauge },
  { id: 'pausa', label: 'Pausa', Icon: PauseCircle },
  { id: 'fundo', label: 'Fundo', Icon: Wallet },
  { id: 'termometro', label: 'Termômetro', Icon: Thermometer },
  { id: 'calculadora', label: 'Impacto', Icon: Calculator },
  { id: 'assistente', label: 'Capitão', Icon: MessageCircle },
  { id: 'plataformas', label: 'Apps', Icon: Zap },
  { id: 'configuracoes', label: 'Config', Icon: Settings },
];

export function Sidebar({ current, onNavigate }: NavProps) {
  const { signOut } = useAuth();
  const { profile } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#16161f] border border-[#1e1e2a] text-[#8888a0]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0d0d14] border-r border-[#1e1e2a] z-40
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#1e1e2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00b4d8]/20 border border-[#00b4d8]/40 flex items-center justify-center">
              <Gauge size={16} className="text-[#00b4d8]" />
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-wider">CABINE</p>
              <p className="text-[#8888a0] text-xs tracking-widest">SUA FROTA É VOCÊ</p>
            </div>
          </div>
        </div>

        {/* Driver info */}
        {profile && (
          <div className="px-6 py-4 border-b border-[#1e1e2a]">
            <p className="text-[#f0f0f5] text-sm font-medium truncate">{profile.name}</p>
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mt-0.5">{profile.platform}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                current === id
                  ? 'bg-[#00b4d8]/15 text-[#00b4d8] border border-[#00b4d8]/30'
                  : 'text-[#8888a0] hover:text-[#f0f0f5] hover:bg-[#16161f]'
              }`}
            >
              <Icon size={16} />
              <span className="font-medium">{label}</span>
              {current === id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
              )}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-[#1e1e2a]">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8888a0] hover:text-[#f44336] hover:bg-[#f44336]/10 transition-all duration-150"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function BottomNav({ current, onNavigate }: NavProps) {
  const BOTTOM_ITEMS = NAV_ITEMS.slice(0, 7);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d14] border-t border-[#1e1e2a] flex lg:hidden z-20">
      {BOTTOM_ITEMS.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-xs transition-colors ${
            current === id ? 'text-[#00b4d8]' : 'text-[#8888a0]'
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px]">{label}</span>
          {current === id && <div className="w-1 h-1 rounded-full bg-[#00b4d8] absolute bottom-1" />}
        </button>
      ))}
    </nav>
  );
}
