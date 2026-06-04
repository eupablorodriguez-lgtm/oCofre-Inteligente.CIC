export type Platform = 'uber' | '99' | 'loggi' | 'indriver' | 'outro';
export type OperationalStatus = 'verde' | 'amarelo' | 'vermelho';
export type Plan = 'free' | 'pro';

export interface Profile {
  id: string;
  name: string;
  platform: Platform;
  monthly_living_cost: number;
  plan: Plan;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleParams {
  id: string;
  user_id: string;
  vehicle_name: string;
  monthly_rent: number;
  monthly_insurance: number;
  monthly_financing: number;
  monthly_maintenance: number;
  cost_per_km: number;
  monthly_food: number;
  other_monthly: number;
  daily_hours_target: number;
  monthly_km_target: number;
  scale_fund_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: string;
  user_id: string;
  shift_date: string;
  gross_revenue: number;
  fuel_cost: number;
  km_driven: number;
  hours_worked: number;
  extra_costs: number;
  extra_cost_description: string;
  net_real: number;
  operating_cost: number;
  scale_fund_contribution: number;
  operational_status: OperationalStatus;
  behavioral_insight: string;
  cost_per_hour: number;
  cost_per_km: number;
  created_at: string;
}

export interface ScaleFund {
  id: string;
  user_id: string;
  balance: number;
  total_contributed: number;
  total_withdrawn: number;
  last_updated: string;
}

export interface UserPlatform {
  id: string;
  user_id: string;
  platform_name: Platform;
  commission_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShiftInput {
  gross_revenue: number;
  fuel_cost: number;
  km_driven: number;
  hours_worked: number;
  extra_costs: number;
  extra_cost_description: string;
  shift_date: string;
}

export interface ShiftCalculation {
  daily_fixed_cost: number;
  operating_cost: number;
  net_real: number;
  scale_fund_contribution: number;
  operational_status: OperationalStatus;
  behavioral_insight: string;
  cost_per_hour: number;
  cost_per_km_real: number;
  margin_percent: number;
}
