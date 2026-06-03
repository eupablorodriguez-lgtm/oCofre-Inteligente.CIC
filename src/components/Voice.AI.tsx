import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, X, Loader } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function VoiceAI({ isOpen, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'pt-BR';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognitionRef.current.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setTranscript(transcriptSegment);
              setInput(transcriptSegment);
            } else {
              interim += transcriptSegment;
            }
          }
          if (interim) setTranscript(interim);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    // Respostas sobre economia
    if (lower.includes('quanto') && lower.includes('economizar')) {
      return 'Com sua renda de R$ 250/dia, recomendo economizar 30% diariamente, o que dá R$ 75/dia. Assim você consegue juntar R$ 1.500 para o IPVA em 20 dias!';
    }
    if (lower.includes('meta') || lower.includes('objetivo')) {
      return 'Você tem 3 metas ativas: IPVA (70% completo), Viagem SP (40% completo) e Manutenção (55% completo). Qual você quer priorizar?';
    }
    if (lower.includes('ipva')) {
      return 'Para o IPVA: faltam R$ 450 dos R$ 1.500. Se economizar R$ 75/dia, consegue em 6 dias! Quer que eu reserve esse valor?';
    }
    if (lower.includes('viagem')) {
      return 'Para a viagem a SP você tem R$ 800 guardados. Faltam R$ 1.200. Se acelerar para R$ 150/dia, consegue em 8 dias!';
    }

    // Respostas sobre transações
    if (lower.includes('sacar') || lower.includes('withdraw')) {
      return 'Para sacar, preciso saber: qual meta você quer sacar? E qual o valor? Saques por PIX são instantâneos!';
    }
    if (lower.includes('depositar') || lower.includes('pix')) {
      return 'Para depositar, gere uma chave PIX temporária ou use meu CPF. Qual é o valor que quer depositar?';
    }

    // Respostas sobre dicas
    if (lower.includes('dica') || lower.includes('conselho')) {
      return 'Minha dica: comece com a meta do IPVA que está próxima de 100%. Assim você conquista uma vitória rápida e se motiva!';
    }

    // Respostas gerais
    if (lower.includes('oi') || lower.includes('olá')) {
      return 'Oi! Sou seu assistente financeiro. Posso ajudar com dúvidas sobre suas metas, saques, depósitos e estratégias de economia. Como posso te ajudar?';
    }

    return 'Entendi! Posso ajudar com informações sobre suas metas, recomendações de economia, depósitos por PIX ou saques. Quer tentar perguntar sobre alguma dessas coisas?';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simular delay de IA
    await new Promise(resolve => setTimeout(resolve, 800));

    const aiResponse = generateAIResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#0F1419] border border-emerald-500/30 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-xl">IA Financeira</h2>
            <p className="text-white/40 text-xs mt-1">Fale sobre suas finanças</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Mic size={32} className="text-emerald-400" />
              </div>
              <p className="text-white font-semibold mb-2">Comece a conversa!</p>
              <p className="text-white/60 text-sm">Pergunte sobre suas metas, faça depósitos ou saques via PIX</p>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/80 text-white'
                    : 'bg-white/5 border border-white/10 text-white/90'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <Loader size={18} className="text-emerald-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Status */}
        {isListening && (
          <div className="px-6 py-3 bg-emerald-500/10 border-t border-white/10 flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-emerald-400 text-sm font-medium flex-1">
              {transcript ? `"${transcript}"` : 'Ouvindo...'}
            </p>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-xl transition-all font-medium flex items-center justify-center ${
                isListening
                  ? 'bg-red-500/80 hover:bg-red-600 text-white'
                  : 'bg-emerald-500/80 hover:bg-emerald-600 text-white'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ou digite aqui..."
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-3 bg-emerald-500/80 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl transition-all"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-white/30 text-xs mt-3">
            Fale naturalmente: "Quanto devo economizar?", "Quero sacar para o PIX", "Me recomenda uma meta"
          </p>
        </div>
      </div>
    </div>
  );
}
