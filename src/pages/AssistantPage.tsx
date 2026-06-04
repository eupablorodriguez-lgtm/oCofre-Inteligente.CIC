import { useState, useRef, useEffect } from 'react';
import { Send, Loader, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { emoji: '💚', text: 'Dia verde hoje!', label: 'Celebrar' },
  { emoji: '😓', text: 'Tô cansado demais', label: 'Motivação' },
  { emoji: '❌', text: 'Dia vermelho...', label: 'Apoio' },
  { emoji: '💰', text: 'Quanto eu ganhei?', label: 'Análise' },
  { emoji: '⏸️', text: 'Sobre pausa', label: 'Liberdade' },
  { emoji: '🎯', text: 'Me da uma dica', label: 'Estratégia' },
];

export default function AssistantPage() {
  const { shifts, scaleFund, profile, vehicleParams } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Ó eu aqui! Capitão Cabine na missão. Me conta como tá a situação aí na frota pessoal. Dia verde? Vermelho? Tá cansado? Quer estratégia?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getUserStats = () => {
    const last30 = shifts.slice(0, 30);
    const last7 = shifts.slice(0, 7);

    const liquidRealMonth = last30.reduce((s, sh) => s + sh.net_real, 0);
    const hoursWorked = last30.reduce((s, sh) => s + sh.hours_worked, 0);
    const costPerHour = hoursWorked > 0 ? last30.reduce((s, sh) => s + sh.operating_cost, 0) / hoursWorked : 0;

    const lastShift = shifts[0];

    let daysWithoutGreen = 0;
    for (const shift of shifts) {
      if (shift.operational_status === 'verde') break;
      daysWithoutGreen++;
    }

    const pauseDays = scaleFund ? (scaleFund.balance / (profile?.monthly_living_cost || 2000)) * 30 : 0;

    return {
      liquidRealMonth,
      pauseDays,
      scaleFundBalance: scaleFund?.balance || 0,
      lastShiftStatus: lastShift?.operational_status || 'sem-dados',
      daysWithoutGreen,
      hoursWorkedMonth: hoursWorked,
      costPerHour,
    };
  };

  const handleSend = async (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const userStats = getUserStats();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: msgText,
            userStats,
          }),
        }
      );

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Desculpa, não entendi direito. Tenta de novo aí!',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ops, passei mal aqui. Tenta de novo em alguns segundos, campeão.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stats = getUserStats();

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f]">
      {/* Header com contexto */}
      <div className="px-4 py-4 border-b border-[#1e1e2a] flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[#f0f0f5] text-2xl font-bold">Capitão Cabine</h1>
            <p className="text-[#8888a0] text-xs mt-1">Seu coach financeiro bem-humorado</p>
          </div>
          <Sparkles size={24} className="text-[#ffc107]" />
        </div>

        {/* Stats resumidas no header */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-[#111118] rounded-lg p-2 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs">Líquido (30d)</p>
            <p className="text-[#00e676] font-bold text-sm">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.liquidRealMonth)}
            </p>
          </div>
          <div className="bg-[#111118] rounded-lg p-2 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs">Dias Pausa</p>
            <p className="text-[#00b4d8] font-bold text-sm">{stats.pauseDays.toFixed(1)}</p>
          </div>
          <div className={`rounded-lg p-2 border ${
            stats.lastShiftStatus === 'verde'
              ? 'bg-[#00e676]/10 border-[#00e676]/30'
              : stats.lastShiftStatus === 'vermelho'
              ? 'bg-[#f44336]/10 border-[#f44336]/30'
              : 'bg-[#ffc107]/10 border-[#ffc107]/30'
          }`}>
            <p className="text-[#8888a0] text-xs">Status</p>
            <p className={`font-bold text-sm ${
              stats.lastShiftStatus === 'verde'
                ? 'text-[#00e676]'
                : stats.lastShiftStatus === 'vermelho'
                ? 'text-[#f44336]'
                : 'text-[#ffc107]'
            }`}>
              {stats.lastShiftStatus === 'verde' ? 'VERDE' : stats.lastShiftStatus === 'vermelho' ? 'VERMELHO' : 'AMARELO'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-[#00b4d8] text-[#0a0a0f] font-medium'
                  : 'bg-[#111118] border border-[#1e1e2a] text-[#f0f0f5]'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-[#0a0a0f]/60' : 'text-[#44445a]'}`}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111118] border border-[#1e1e2a] rounded-lg px-4 py-3 flex items-center gap-2">
              <Loader size={16} className="text-[#00b4d8] animate-spin" />
              <p className="text-[#8888a0] text-sm">Capitão pensando...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="px-4 py-3 border-t border-[#1e1e2a] flex-shrink-0">
          <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => handleSend(prompt.text)}
                disabled={loading}
                className="flex items-center gap-1.5 bg-[#111118] border border-[#1e1e2a] hover:border-[#00b4d8] text-[#f0f0f5] text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                <span>{prompt.emoji}</span>
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#1e1e2a] flex-shrink-0 bg-[#0a0a0f]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Me conta como tá indo..."
            disabled={loading}
            className="flex-1 bg-[#111118] border border-[#1e1e2a] text-[#f0f0f5] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00b4d8] transition-colors placeholder-[#44445a] disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-[#00b4d8] hover:bg-[#00c9f0] disabled:opacity-30 text-[#0a0a0f] font-bold p-3 rounded-lg transition-all flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[#44445a] text-xs mt-2 text-center">
          Fale sobre seu dia, estratégia, desafios ou qualquer coisa da operação
        </p>
      </div>
    </div>
  );
}
