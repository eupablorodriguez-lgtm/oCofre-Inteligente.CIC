import { Card } from '../components/ui/index';
import { MessageCircle } from 'lucide-react';

export default function AssistantDemoPage() {
  const demoConversations = [
    {
      title: 'Motorista com dia bom',
      lastShiftStatus: 'verde',
      messages: [
        { role: 'user', text: 'Opa! Dia verde hoje!' },
        { role: 'assistant', text: 'Rapaz! Dia verde! Isso é mérito seu, parceiro. Seu fundo tá crescendo! Continue nesse ritmo que em 30 dias você tira férias tranquilo.' },
        { role: 'user', text: 'Quantos dias de pausa eu tenho?' },
        { role: 'assistant', text: '5.2 dias de pausa no seu fundo. Não é muito ainda, mas tá crescendo! Cada turno verde que você tem, 15% desse lucro entra pro fundo de escala.' },
      ],
    },
    {
      title: 'Motorista cansado',
      lastShiftStatus: 'amarelo',
      messages: [
        { role: 'user', text: 'Tô cansado demais cara' },
        { role: 'assistant', text: 'Cansado, é? Olha só: você já fez 156h de trabalho esse mês. Isso é MUITO! Seu fundo tá ali pagando sua pausa. Que tal tirar um dia fora do volante?' },
        { role: 'user', text: 'Preciso de grana though' },
        { role: 'assistant', text: 'Entendo. Mas pensa comigo: um dia parado agora vale mais que 2 dias ruim depois. Fadiga reduz eficiência. Tira uma terça-feira, volta com tudo segunda.' },
      ],
    },
    {
      title: 'Motorista em dia ruim',
      lastShiftStatus: 'vermelho',
      messages: [
        { role: 'user', text: 'Dia vermelho... Tá osso demais' },
        { role: 'assistant', text: '3 dias sem verde... Isso pesa, viu? Mas relaxa. Toda profissão tem dias ruins. O importante é que seu fundo tá ali: R$ 1.240. Amanhã tudo muda.' },
        { role: 'user', text: 'Tô pensando em parar isso tudo' },
        { role: 'assistant', text: 'Irmão, não faz isso por cansaço. Você conhece seu custo (R$ 45/h), sua margem, seu fundo. 90% dos motoristas não sabem nem quanto ganham de verdade. Você tá ANOS à frente. Descansa um dia e volta.' },
      ],
    },
    {
      title: 'Motorista questionando estratégia',
      lastShiftStatus: 'verde',
      messages: [
        { role: 'user', text: 'Quanto eu tô ganhando mesmo?' },
        { role: 'assistant', text: 'R$ 4.230 de líquido real em 30 dias. Média de R$ 141/dia. Seu custo por hora tá em R$ 52. Se você tira R$ 52 em 1h de trabalho, você só tá cobrindo custo fixo. Precisa aceitar corridas melhores!' },
        { role: 'user', text: 'Me da uma dica então' },
        { role: 'assistant', text: 'Tira screenshot dos comprovantes de combustível. Ajuda a entender o custo real. Depois: aceita corrida longa? Calcula distância × custo por km. Se não fechar acima do R$ 52/h, recusa pura e simples.' },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-[#f0f0f5] text-3xl font-bold">Exemplos de Conversa</h1>
        <p className="text-[#8888a0] text-sm mt-2">Veja como o Capitão interage com diferentes situações de motoristas</p>
      </div>

      {demoConversations.map((conv, idx) => (
        <Card key={idx} className="p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${
                conv.lastShiftStatus === 'verde'
                  ? 'bg-[#00e676]'
                  : conv.lastShiftStatus === 'vermelho'
                  ? 'bg-[#f44336]'
                  : 'bg-[#ffc107]'
              }`}
            />
            <h2 className="text-[#f0f0f5] font-bold">{conv.title}</h2>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {conv.messages.map((msg, msgIdx) => (
              <div
                key={msgIdx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#00b4d8] text-[#0a0a0f]'
                      : 'bg-[#16161f] text-[#f0f0f5] border border-[#1e1e2a]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Dados de preenchimento de exemplo */}
      <Card className="p-6 bg-[#00b4d8]/5 border border-[#00b4d8]/20">
        <h2 className="text-[#00b4d8] font-bold mb-3 flex items-center gap-2">
          <MessageCircle size={18} /> Dados de Exemplo para Teste
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-[#111118] rounded-lg p-3 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-1">Faturamento Bruto</p>
            <input
              type="text"
              value="R$ 6.500"
              readOnly
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-xs"
            />
          </div>
          <div className="bg-[#111118] rounded-lg p-3 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-1">Combustível</p>
            <input
              type="text"
              value="R$ 850"
              readOnly
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-xs"
            />
          </div>
          <div className="bg-[#111118] rounded-lg p-3 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-1">Horas Trabalhadas</p>
            <input
              type="text"
              value="42h"
              readOnly
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-xs"
            />
          </div>
          <div className="bg-[#111118] rounded-lg p-3 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-1">KM Rodados</p>
            <input
              type="text"
              value="1.240 km"
              readOnly
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-xs"
            />
          </div>
          <div className="bg-[#111118] rounded-lg p-3 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-1">Aluguel/Mês</p>
            <input
              type="text"
              value="R$ 1.200"
              readOnly
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#f0f0f5] rounded px-2 py-1 text-xs"
            />
          </div>
          <div className="bg-[#111118] rounded-lg p-3 border border-[#1e1e2a]">
            <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-1">Status</p>
            <input
              type="text"
              value="VERDE"
              readOnly
              className="w-full bg-[#0a0a0f] border border-[#1e1e2a] text-[#00e676] rounded px-2 py-1 text-xs font-bold"
            />
          </div>
        </div>
        <p className="text-[#44445a] text-xs mt-3">Use estes valores para testar a IA e ver como ela responde em diferentes contextos.</p>
      </Card>
    </div>
  );
}
