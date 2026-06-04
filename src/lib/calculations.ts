import type { VehicleParams, ShiftInput, ShiftCalculation, OperationalStatus } from './types';

export function calcDailyFixedCost(params: VehicleParams): number {
  return (
    params.monthly_rent +
    params.monthly_insurance +
    params.monthly_financing +
    params.monthly_maintenance +
    params.monthly_food +
    params.other_monthly
  ) / 30;
}

export function calcShift(input: ShiftInput, params: VehicleParams, recentShifts: { net_real: number; cost_per_hour: number }[] = []): ShiftCalculation {
  const dailyFixed = calcDailyFixedCost(params);
  const kmCost = input.km_driven > 0 ? input.km_driven * params.cost_per_km : 0;
  const variableCost = input.fuel_cost + input.extra_costs;
  const operatingCost = dailyFixed + variableCost + (input.km_driven > 0 ? kmCost - input.fuel_cost : 0);
  // Use fuel as main variable if km not provided separately
  const totalOperatingCost = dailyFixed + input.fuel_cost + input.extra_costs;

  const netReal = input.gross_revenue - totalOperatingCost;
  const scaleFundContribution = netReal > 0 ? netReal * params.scale_fund_rate : 0;

  const costPerHour = input.hours_worked > 0 ? totalOperatingCost / input.hours_worked : 0;
  const costPerKmReal = input.km_driven > 0 ? totalOperatingCost / input.km_driven : 0;
  const marginPercent = input.gross_revenue > 0 ? (netReal / input.gross_revenue) * 100 : 0;

  // Determine operational status
  let status: OperationalStatus = 'verde';
  const avgCostPerHour = recentShifts.length > 0
    ? recentShifts.reduce((s, r) => s + r.cost_per_hour, 0) / recentShifts.length
    : costPerHour;

  if (netReal < 0) {
    status = 'vermelho';
  } else if (marginPercent < 15 || (costPerHour > avgCostPerHour * 1.2 && recentShifts.length >= 3)) {
    status = 'amarelo';
  } else {
    status = 'verde';
  }

  const insight = generateInsight(netReal, marginPercent, costPerHour, avgCostPerHour, recentShifts.length, scaleFundContribution);

  return {
    daily_fixed_cost: dailyFixed,
    operating_cost: totalOperatingCost,
    net_real: netReal,
    scale_fund_contribution: scaleFundContribution,
    operational_status: status,
    behavioral_insight: insight,
    cost_per_hour: costPerHour,
    cost_per_km_real: costPerKmReal,
    margin_percent: marginPercent,
  };
}

function generateInsight(
  netReal: number,
  margin: number,
  costPerHour: number,
  avgCostPerHour: number,
  historyCount: number,
  fundContribution: number
): string {
  if (netReal < 0) {
    return 'Turno no vermelho: custos superaram o faturamento.';
  }
  if (margin > 30) {
    if (fundContribution > 0) {
      const pauseDays = fundContribution / (avgCostPerHour > 0 ? avgCostPerHour * 8 : 200);
      if (pauseDays > 0.5) {
        return `Seu fundo ganhou mais ${pauseDays.toFixed(1)} dia de pausa.`;
      }
    }
    return `Hoje sobrou ${margin.toFixed(0)}% acima da média operacional.`;
  }
  if (margin > 15) {
    return 'Turno sustentável: operação pagou custos e criou sobra.';
  }
  if (historyCount === 0) {
    return 'Cabine calibrada. Amanhã já existe comparação.';
  }
  if (costPerHour > avgCostPerHour * 1.15) {
    return 'Custo por hora acima da média. Vale revisar combustível.';
  }
  return 'Margem baixa. Mais corridas não garantem mais líquido real.';
}

export function calcPauseDays(scaleFundBalance: number, monthlyLivingCost: number): number {
  if (monthlyLivingCost <= 0) return 0;
  const dailyCost = monthlyLivingCost / 30;
  return scaleFundBalance / dailyCost;
}

export function calcImpactInHours(expenseAmount: number, avgNetRealPerHour: number): number {
  if (avgNetRealPerHour <= 0) return 0;
  return expenseAmount / avgNetRealPerHour;
}

export function calcImpactInPauseDays(expenseAmount: number, monthlyLivingCost: number): number {
  if (monthlyLivingCost <= 0) return 0;
  const dailyLiving = monthlyLivingCost / 30;
  return expenseAmount / dailyLiving;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace('.', ',');
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function getStatusColor(status: string): string {
  if (status === 'verde') return '#00e676';
  if (status === 'vermelho') return '#f44336';
  return '#ffc107';
}

export function getStatusLabel(status: string): string {
  if (status === 'verde') return 'VERDE';
  if (status === 'vermelho') return 'VERMELHO';
  return 'AMARELO';
}
