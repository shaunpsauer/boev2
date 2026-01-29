'use client';

import type { CalculationResult } from '../../types';

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  variant?: 'default' | 'primary' | 'success';
}

function StatCard({ label, value, sublabel, variant = 'default' }: StatCardProps) {
  const bgColors = {
    default: 'bg-white',
    primary: 'bg-[#EFF6FF]',
    success: 'bg-[#F0FDF4]',
  };

  const valueColors = {
    default: 'text-[#1E293B]',
    primary: 'text-[#1E40AF]',
    success: 'text-[#166534]',
  };

  return (
    <div className={`flex flex-col gap-1 p-4 rounded-lg border border-[#E2E8F0] ${bgColors[variant]}`}>
      <span className="text-xs font-medium text-[#64748B]">{label}</span>
      <span className={`text-2xl font-semibold ${valueColors[variant]}`}>{value}</span>
      {sublabel && (
        <span className="text-xs text-[#94A3B8]">{sublabel}</span>
      )}
    </div>
  );
}

interface StatsGridProps {
  results: CalculationResult | null;
}

export function StatsGrid({ results }: StatsGridProps) {
  if (!results) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Bank Volume" value="--" sublabel="CY" />
        <StatCard label="Labor Hours" value="--" sublabel="Total hours" />
        <StatCard label="Duration" value="--" sublabel="Workdays" />
        <StatCard label="Loose Volume" value="--" sublabel="CY (swelled)" />
        <StatCard label="Equipment Hours" value="--" sublabel="Total hours" />
        <StatCard label="Critical Path" value="--" sublabel="Controlling" />
      </div>
    );
  }

  const formatNumber = (num: number, decimals: number = 1) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Row 1 */}
      <StatCard
        label="Bank Volume"
        value={`${formatNumber(results.volume.bankVolume)} CY`}
        sublabel={`${formatNumber(results.volume.machineDigVolume)} machine + ${formatNumber(results.volume.handDigVolume)} hand`}
      />
      <StatCard
        label="Labor Hours"
        value={`${formatNumber(results.production.totalLaborHours)} hrs`}
        sublabel="Total crew hours"
        variant="primary"
      />
      <StatCard
        label="Duration"
        value={`${formatNumber(results.duration.totalDuration)} days`}
        sublabel="Workdays"
        variant="success"
      />

      {/* Row 2 */}
      <StatCard
        label="Loose Volume"
        value={`${formatNumber(results.volume.looseVolume)} CY`}
        sublabel={`Swell: ${(results.volume.swellFactor * 100).toFixed(0)}%`}
      />
      <StatCard
        label="Equipment Hours"
        value={`${formatNumber(results.production.totalEquipmentHours)} hrs`}
        sublabel="Excavator + support"
      />
      <StatCard
        label="Critical Path"
        value={results.duration.criticalPath === 'machine' ? 'Machine' : 'Hand'}
        sublabel={results.duration.criticalPath === 'machine' 
          ? `${formatNumber(results.duration.machineDuration)} days` 
          : `${formatNumber(results.duration.handDuration)} days`
        }
        variant={results.duration.criticalPath === 'machine' ? 'primary' : 'default'}
      />
    </div>
  );
}

export default StatsGrid;
