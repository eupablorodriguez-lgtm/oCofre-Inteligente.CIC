import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  nome: string;
  telefone: string;
  renda_diaria: number;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type SavingsGoal = {
  id: string;
  user_id: string;
  nome: string;
  descricao: string;
  valor_meta: number;
  valor_atual: number;
  categoria: string;
  data_prazo: string;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  goal_id: string;
  user_id: string;
  valor: number;
  tipo: 'deposit' | 'withdrawal';
  descricao: string;
  data: string;
  created_at: string;
};

export type AIRecommendation = {
  id: string;
  user_id: string;
  goal_id: string | null;
  recommendation_text: string;
  days_to_goal: number | null;
  target_daily_savings: number | null;
  confidence_level: number;
  is_read: boolean;
  created_at: string;
};
