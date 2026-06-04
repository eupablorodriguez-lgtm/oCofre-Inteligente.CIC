import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/index';
import { formatCurrency } from '../lib/calculations';

export default function CommissionCalculatorPage() {
  const [faturamento, setFaturamento] = useState(650);
  const [commission, setCommission] = useState(25);

  const comissaoValor = (faturamento * commission) / 100;
  const liquido = faturamento - comissaoValor;

  const handleReset = () => {
    setFaturamento(650);
    setCommission(25);
  };

  const platforms = [
    { name: 'Uber', commission: 25 },
    { name: '99', commission: 28 },
    { name: 'Loggi', commission: 20 },
    { name: 'InDriver', commission: 10 },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-[#f0f0f5] text-3xl font-bold">Calculadora de Comissão</h1>
        <p className="text-[#8888a0] text-sm mt-2">Entenda quanto cada plataforma desconta do seu faturamento</p>
      </div>

      {/* Calculator interactive */}
      <Card className="p-6" glow="#00b4d8">
        <div className="space-y-6">
          {/* Faturamento */}
          <div>
            <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-2">Faturamento Bruto</label>
            <div className="flex items-center gap-2">
              <span className="text-[#8888a0]">R$</span>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={faturamento}
                onChange={(e) => setFaturamento(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-[#0a0a0f] rounded-lg appearance-none cursor-pointer accent-[#00b4d8]"
              />
              <input
                type="number"
                value={faturamento}
                onChange={(e) => setFaturamento(parseFloat(e.target.value) || 0)}
                className="w-20 bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-sm text-center outline-none focus:border-[#00b4d8]"
              />
            </div>
            <p className="text-[#f0f0f5] font-bold text-lg mt-2">{formatCurrency(faturamento)}</p>
          </div>

          {/* Comissão */}
          <div>
            <label className="block text-xs text-[#8888a0] uppercase tracking-widest mb-2">Comissão da Plataforma</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={commission}
                onChange={(e) => setCommission(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-[#0a0a0f] rounded-lg appearance-none cursor-pointer accent-[#ffc107]"
              />
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                className="w-20 bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-sm text-center outline-none focus:border-[#ffc107]"
              />
              <span className="text-[#8888a0]">%</span>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[#1e1e2a] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8888a0]">Comissão desconta:</span>
              <span className="text-[#ffc107] font-bold">{formatCurrency(comissaoValor)}</span>
            </div>
            <div className="border-t border-[#1e1e2a] pt-3 flex items-center justify-between">
              <span className="text-[#f0f0f5] font-bold">Você recebe:</span>
              <span className="text-[#00e676] font-bold text-lg">{formatCurrency(liquido)}</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 border border-[#1e1e2a] text-[#8888a0] hover:border-[#2a2a3a] py-2 rounded-lg transition-all text-sm"
          >
            <RotateCcw size={14} /> Resetar
          </button>
        </div>
      </Card>

      {/* Comparação de plataformas */}
      <div className="space-y-3">
        <p className="text-[#8888a0] text-xs uppercase tracking-widest">Simulação com R$ {faturamento.toFixed(0)}:</p>
        {platforms.map((platform) => {
          const comissao = (faturamento * platform.commission) / 100;
          const recebe = faturamento - comissao;
          return (
            <Card key={platform.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[#f0f0f5] font-bold text-sm">{platform.name}</p>
                  <p className="text-[#8888a0] text-xs mt-1">{platform.commission}% de comissão</p>
                </div>
                <div className="text-right">
                  <p className="text-[#ffc107] text-xs">Desconta {formatCurrency(comissao)}</p>
                  <p className="text-[#00e676] font-bold text-sm">Recebe {formatCurrency(recebe)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Dicas */}
      <Card className="p-4 bg-[#00b4d8]/5 border border-[#00b4d8]/20">
        <p className="text-[#f0f0f5] text-xs uppercase tracking-widest mb-2">Dica:</p>
        <p className="text-[#8888a0] text-sm">
          A comissão é <span className="text-[#f0f0f5]">automática</span> — você escolhe a plataforma ao registrar o turno e o Cabine calcula tudo.
        </p>
        <p className="text-[#8888a0] text-sm mt-2">
          Se a comissão mudar, você pode atualizar na página de <span className="text-[#f0f0f5]">Apps</span>.
        </p>
      </Card>
    </div>
  );
}
