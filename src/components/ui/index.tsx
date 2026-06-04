import type { ReactNode } from 'react';
import { getStatusColor } from '../../lib/calculations';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: string;
}

export function Card({ children, className = '', glow }: CardProps) {
  return (
    <div
      className={`bg-[#111118] border border-[#1e1e2a] rounded-xl ${className}`}
      style={glow ? { boxShadow: `0 0 20px ${glow}15` } : undefined}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({ label, value, sub, color = '#f0f0f5', size = 'md' }: MetricCardProps) {
  const valueSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  return (
    <Card className="p-4">
      <p className="text-[#8888a0] text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className={`font-bold tabular-nums leading-none ${valueSize}`} style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-[#8888a0] text-xs mt-1">{sub}</p>}
    </Card>
  );
}

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, color = '#00b4d8', height = 6, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-[#8888a0] mb-1">
          <span></span>
          <span>{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="w-full bg-[#1e1e2a] rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface CircularGaugeProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  subLabel?: string;
}

export function CircularGauge({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#00b4d8',
  label,
  subLabel,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1e1e2a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {(label || subLabel) && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          {label && <p className="font-bold text-[#f0f0f5] leading-none" style={{ fontSize: size * 0.14 }}>{label}</p>}
          {subLabel && <p className="text-[#8888a0] mt-0.5" style={{ fontSize: size * 0.1 }}>{subLabel}</p>}
        </div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const label = status === 'verde' ? 'VERDE' : status === 'vermelho' ? 'VERMELHO' : 'AMARELO';
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-widest ${padding}`}
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

interface ThermometerIndicatorProps {
  status: string;
}

export function ThermometerIndicator({ status }: ThermometerIndicatorProps) {
  const statuses = [
    { id: 'vermelho', label: 'VERMELHO', color: '#f44336', desc: 'Operação deficitária' },
    { id: 'amarelo', label: 'AMARELO', color: '#ffc107', desc: 'Margem reduzida' },
    { id: 'verde', label: 'VERDE', color: '#00e676', desc: 'Operação sustentável' },
  ];
  return (
    <div className="flex flex-col gap-2">
      {statuses.map(({ id, label, color, desc }) => (
        <div
          key={id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
            status === id ? 'border-opacity-60' : 'border-[#1e1e2a] opacity-30'
          }`}
          style={status === id ? { borderColor: color, backgroundColor: `${color}12` } : undefined}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color, boxShadow: status === id ? `0 0 8px ${color}` : 'none' }}
          />
          <div>
            <p className="text-xs font-bold tracking-widest" style={{ color: status === id ? color : '#8888a0' }}>
              {label}
            </p>
            <p className="text-xs text-[#8888a0]">{desc}</p>
          </div>
          {status === id && (
            <div className="ml-auto text-xs font-bold" style={{ color }}>ATIVO</div>
          )}
        </div>
      ))}
    </div>
  );
}

interface InsightBannerProps {
  text: string;
  status?: string;
}

export function InsightBanner({ text, status = 'amarelo' }: InsightBannerProps) {
  const color = getStatusColor(status);
  return (
    <div
      className="px-4 py-3 rounded-lg border text-sm font-medium"
      style={{ backgroundColor: `${color}10`, borderColor: `${color}30`, color: '#f0f0f5' }}
    >
      <span className="text-[#8888a0] text-xs uppercase tracking-widest block mb-1">Leitura operacional</span>
      {text}
    </div>
  );
}
