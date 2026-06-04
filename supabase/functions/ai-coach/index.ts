import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserStats {
  liquidRealMonth: number;
  pauseDays: number;
  scaleFundBalance: number;
  lastShiftStatus: string;
  daysWithoutGreen: number;
  hoursWorkedMonth: number;
  costPerHour: number;
}

interface RequestPayload {
  message: string;
  userStats: UserStats;
}

function generateResponse(message: string, stats: UserStats): string {
  const msg = message.toLowerCase();
  const responses: Record<string, (stats: UserStats) => string> = {
    saudacao: (stats) => {
      if (stats.lastShiftStatus === 'verde') {
        return `Ó meu irmão! Vendo essa situação verde aqui... Tu tá comendo bola hein! Líquido real de ${formatMoney(stats.liquidRealMonth)} em 30 dias? Parabéns demais! Teu fundo tá ficando robusto.`;
      } else if (stats.lastShiftStatus === 'vermelho') {
        return `E aí, parceiro! Vejo que o último turno foi vermelho... Normal demais. A gente não ganha todo dia, mas tu tá aí firme. Relaxa, amanhã é novo turno. Teu fundo ainda tá com ${formatMoney(stats.scaleFundBalance)}.`;
      }
      return `Ó eu aqui, Capitão Cabine! Tudo ok? Vejo que tu tá com ${stats.pauseDays.toFixed(1)} dias de pausa no fundo. Quer uma estratégia pra melhorar?`;
    },

    liquidreal: (stats) => {
      const monthlyAvg = stats.liquidRealMonth / 30;
      if (stats.liquidRealMonth > 5000) {
        return `Rapaz! ${formatMoney(stats.liquidRealMonth)} de líquido real em 30 dias? Você não tá trabalhando, você tá CONSTRUINDO patrimônio! Média de ${formatMoney(monthlyAvg)}/dia. Continue assim!`;
      } else if (stats.liquidRealMonth > 2000) {
        return `${formatMoney(stats.liquidRealMonth)} tá bom, mas tu consegue mais. Seu custo por hora tá em ${formatMoney(stats.costPerHour)}. Tenta aceitar corridas com melhor margem.`;
      }
      return `${formatMoney(stats.liquidRealMonth)} em 30 dias... Tá apertado, viu? Vamos analisar: você rodou ${stats.hoursWorkedMonth}h com custo de ${formatMoney(stats.costPerHour)}/h. Talvez precisamos reduzir custos fixos.`;
    },

    pausa: (stats) => {
      if (stats.pauseDays >= 30) {
        return `${stats.pauseDays.toFixed(1)} dias de pausa?! Irmão, você não tá só ganhando dinheiro, você COMPROU LIBERDADE! Isso é luxo. Tira um finde pra descansar.`;
      } else if (stats.pauseDays >= 7) {
        return `${stats.pauseDays.toFixed(1)} dias de pausa é bom demais! Uma semana fora do volante com tudo pago. Tu merecia isso.`;
      }
      return `${stats.pauseDays.toFixed(1)} dias de pausa... Tá curto ainda, meu. Seu fundo tem ${formatMoney(stats.scaleFundBalance)}. Vamos focar em aumentar isso aí.`;
    },

    fundo: (stats) => {
      if (stats.scaleFundBalance > 3000) {
        return `Fundo de Escala com ${formatMoney(stats.scaleFundBalance)}! Rapaz, tu tá blindado! Isso aqui é segurança operacional. Se passar um período ruim, você tá coberto.`;
      }
      return `Seu fundo tá com ${formatMoney(stats.scaleFundBalance)}. Tá crescendo! Continue aportando 15% do seu líquido real positivo e em alguns meses isso vai virar uma reserva legal.`;
    },

    vermelho: (stats) => {
      if (stats.daysWithoutGreen > 5) {
        return `${stats.daysWithoutGreen} dias sem verde... Isso pesa, viu? Mas relaxa. Toda profissão tem dias ruins. O importante é que seu fundo tá ali: ${formatMoney(stats.scaleFundBalance)}. Amanhã tudo muda.`;
      }
      return `Um dia vermelho não é derrota. Seu custo de operação tá em ${formatMoney(stats.costPerHour)}/h. Talvez hoje foi só um dia off mesmo.`;
    },

    cansaco: (stats) => {
      return `Cansado, é? Olha só: você já fez ${stats.hoursWorkedMonth}h de trabalho esse mês. Isso é MUITO! Seu fundo tá ali pagando sua pausa. Que tal tirar um dia?`;
    },

    custo: (stats) => {
      return `Seu custo por hora está em ${formatMoney(stats.costPerHour)}. Olha bem: se você tira ${formatMoney(stats.costPerHour * 8)} em 8h de trabalho, só tá cobrindo custo fixo. Você não tá lucrando! Tá na hora de revisar.`;
    },

    dica: (stats) => {
      const dicas = [
        `Tira screenshot dos comprovantes de combustível. Ajuda a entender o custo real.`,
        `Aceita corrida longa? Calcula: distância × custo por km. Se não fechar acima do custo/hora, recusa!`,
        `Seu fundo tem ${formatMoney(stats.scaleFundBalance)}. Isso é poder de parar quando quiser. Use isso a seu favor.`,
        `Cansaço reduz eficiência. Um dia de pausa agora vale mais que 2 dias ruim depois.`,
        `Revisa seu aluguel ou manutenção? Isso tá comendo ${(((stats.costPerHour * 240) / (stats.liquidRealMonth + stats.costPerHour * 240)) * 100).toFixed(0)}% do seu faturamento.`,
      ];
      return dicas[Math.floor(Math.random() * dicas.length)];
    },

    motivacao: (stats) => {
      const motivacoes = [
        `Você não tá numa corrida, você tá num negócio. E negócio que cresce é porque o dono tá fazendo certo. Você tá certo.`,
        `Dia ruim? Bora! Dia bom? Continua! Dia chato? Normal! O importante é que tu tá construindo algo.`,
        `Você conhece seu custo, seu fundo, sua margem. 90% dos motoristas não sabem nem quanto ganham de verdade. Você tá anos à frente.`,
        `Seu fundo é sua liberdade. Cada real aí é uma hora que você NÃO precisa trabalhar. Isso é poder.`,
      ];
      return motivacoes[Math.floor(Math.random() * motivacoes.length)];
    },
  };

  // Detectar categoria de pergunta
  let category = "saudacao";
  if (msg.includes("oi") || msg.includes("opa") || msg.includes("e aí") || msg.includes("tudo bem")) {
    category = "saudacao";
  } else if (msg.includes("líquido") || msg.includes("ganho") || msg.includes("quanto ganhei")) {
    category = "liquidreal";
  } else if (msg.includes("pausa") || msg.includes("descanso") || msg.includes("folga")) {
    category = "pausa";
  } else if (msg.includes("fundo") || msg.includes("reserva") || msg.includes("escala")) {
    category = "fundo";
  } else if (msg.includes("vermelho") || msg.includes("ruim") || msg.includes("lixo")) {
    category = "vermelho";
  } else if (msg.includes("cansad") || msg.includes("pneu") || msg.includes("estou morto")) {
    category = "cansaco";
  } else if (msg.includes("custo") || msg.includes("hora") || msg.includes("caro")) {
    category = "custo";
  } else if (msg.includes("dica") || msg.includes("conselho") || msg.includes("ajuda")) {
    category = "dica";
  } else if (msg.includes("motivação") || msg.includes("força") || msg.includes("acredita")) {
    category = "motivacao";
  }

  return responses[category]?.(stats) || responses.saudacao(stats);
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await req.json();
    const response = generateResponse(payload.message, payload.userStats);

    return new Response(
      JSON.stringify({
        success: true,
        message: response,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao processar mensagem",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
