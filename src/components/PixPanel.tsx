import { useState } from 'react';
import { X, Copy, Check, QrCode, DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PIXPanel({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [copied, setCopied] = useState(false);

  const pixKey = 'chave-pix-temporaria-12345678';
  const qrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const goals = [
    { id: 1, name: 'IPVA 2025', balance: 1050, total: 1500 },
    { id: 2, name: 'Viagem SP', balance: 800, total: 2000 },
    { id: 3, name: 'Manutenção', balance: 1100, total: 2000 },
  ];

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDepositConfirm = () => {
    if (amount && selectedGoal) {
      setStep(3);
      setTimeout(() => {
        alert(`✅ Depósito de ${fmt(parseFloat(amount))} confirmado para ${selectedGoal}!`);
        setMode('deposit');
        setStep(1);
        setAmount('');
        setSelectedGoal('');
        onClose();
      }, 2000);
    }
  };

  const handleWithdrawConfirm = () => {
    if (amount) {
      setStep(2);
      setTimeout(() => {
        alert(`✅ Saque de ${fmt(parseFloat(amount))} iniciado! Você receberá em até 2 horas.`);
        setMode('withdraw');
        setStep(1);
        setAmount('');
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#0F1419] via-[#1a1f2e] to-[#0F1419] border border-emerald-500/30 rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gradient-to-b from-[#0F1419] to-transparent z-10">
          <h2 className="text-white font-bold text-xl">Transações PIX</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Mode Selection */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                setMode('deposit');
                setStep(1);
              }}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode === 'deposit'
                  ? 'bg-emerald-500/80 text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <ArrowDownLeft size={18} />
              Depositar
            </button>
            <button
              onClick={() => {
                setMode('withdraw');
                setStep(1);
              }}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                mode === 'withdraw'
                  ? 'bg-emerald-500/80 text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <ArrowUpRight size={18} />
              Sacar
            </button>
          </div>

          {/* DEPOSIT Flow */}
          {mode === 'deposit' && (
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase mb-2">
                      Qual meta você quer depositar?
                    </label>
                    <div className="space-y-2">
                      {goals.map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => setSelectedGoal(goal.name)}
                          className={`w-full p-4 rounded-lg text-left transition-all border ${
                            selectedGoal === goal.name
                              ? 'bg-emerald-500/20 border-emerald-500/50'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{goal.name}</p>
                              <p className="text-white/40 text-xs mt-1">
                                {fmt(goal.balance)} / {fmt(goal.total)}
                              </p>
                            </div>
                            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 mt-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 uppercase mb-2">
                      Valor a depositar (R$)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-emerald-400/50"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!amount || !selectedGoal}
                    className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition-all"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 text-center">
                  <p className="text-white/60 mb-4">Escaneie o QR Code ou copie a chave PIX</p>

                  <div className="bg-white p-4 rounded-lg mb-4">
                    <img src={qrCode} alt="QR Code" className="w-full aspect-square" />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                    <code className="text-white/60 text-xs truncate">{pixKey}</code>
                    <button
                      onClick={copyToClipboard}
                      className="ml-2 p-2 hover:bg-white/10 rounded transition-all"
                    >
                      {copied ? (
                        <Check size={18} className="text-emerald-400" />
                      ) : (
                        <Copy size={18} className="text-white/60" />
                      )}
                    </button>
                  </div>

                  <p className="text-white font-bold text-lg mt-4">
                    Depositando: {fmt(parseFloat(amount || '0'))}
                  </p>
                  <p className="text-white/60 text-sm">na meta: {selectedGoal}</p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg py-2 hover:bg-white/10 transition-all"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleDepositConfirm}
                      className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg py-2 font-medium hover:from-emerald-500 hover:to-emerald-700 transition-all"
                    >
                      Confirmar depósito
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-white font-bold mb-2">Depósito recebido!</p>
                  <p className="text-white/60 text-sm">
                    {fmt(parseFloat(amount))} adicionado a {selectedGoal}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* WITHDRAW Flow */}
          {mode === 'withdraw' && (
            <div className="space-y-4">
              {step === 1 && (
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase mb-2">
                    Valor a sacar (R$)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-emerald-400/50 mb-4"
                  />

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4">
                    <p className="text-white/60 text-xs mb-2">Saque será processado em até 2 horas</p>
                    <p className="text-white font-semibold">
                      Você receberá: {fmt(parseFloat(amount || '0') * 0.98)}
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Taxa: {fmt(parseFloat(amount || '0') * 0.02)}
                    </p>
                  </div>

                  <button
                    onClick={handleWithdrawConfirm}
                    disabled={!amount}
                    className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg py-3 transition-all"
                  >
                    Solicitar saque
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-white font-bold mb-2">Saque solicitado!</p>
                  <p className="text-white/60 text-sm">
                    {fmt(parseFloat(amount || '0') * 0.98)} será transferido em até 2 horas
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
