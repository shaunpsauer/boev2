'use client';

import type { CalculationResult } from '../../types';

interface VolumeBreakdownProps {
  results: CalculationResult | null;
}

export function VolumeBreakdown({ results }: VolumeBreakdownProps) {
  if (!results) {
    return (
      <div className="flex items-center justify-center h-48 text-[#94A3B8]">
        No calculation results
      </div>
    );
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const machinePercent = results.volume.bankVolume > 0 
    ? (results.volume.machineDigVolume / results.volume.bankVolume) * 100 
    : 0;
  const handPercent = results.volume.bankVolume > 0 
    ? (results.volume.handDigVolume / results.volume.bankVolume) * 100 
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-semibold text-[#1E293B]">Volume Breakdown</h3>

      {/* Volume composition bar */}
      <div className="flex flex-col gap-2">
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div 
            className="bg-[#3B82F6] flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${machinePercent}%` }}
          >
            {machinePercent > 15 && `${formatNumber(machinePercent, 0)}%`}
          </div>
          <div 
            className="bg-[#F59E0B] flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${handPercent}%` }}
          >
            {handPercent > 15 && `${formatNumber(handPercent, 0)}%`}
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#3B82F6]"></div>
            <span className="text-[#64748B]">Machine: {formatNumber(results.volume.machineDigVolume)} CY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F59E0B]"></div>
            <span className="text-[#64748B]">Hand: {formatNumber(results.volume.handDigVolume)} CY</span>
          </div>
        </div>
      </div>

      {/* Volume details table */}
      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-[#64748B]">Volume Type</th>
              <th className="px-4 py-2 text-right font-medium text-[#64748B]">Amount (CY)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            <tr>
              <td className="px-4 py-3 text-[#1E293B]">Cross-Section Area</td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {formatNumber(results.geometry.crossSectionArea)} sq ft
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-[#1E293B]">Trench Excavation (Bank)</td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {formatNumber(results.volume.bankVolume)} CY
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 pl-8 text-[#64748B]">→ Machine Dig</td>
              <td className="px-4 py-3 text-right text-[#64748B]">
                {formatNumber(results.volume.machineDigVolume)} CY
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 pl-8 text-[#64748B]">→ Hand Dig (Tolerance Zone)</td>
              <td className="px-4 py-3 text-right text-[#64748B]">
                {formatNumber(results.volume.handDigVolume)} CY
              </td>
            </tr>
            <tr className="bg-[#F8FAFC]">
              <td className="px-4 py-3 font-medium text-[#1E293B]">Total Loose Volume</td>
              <td className="px-4 py-3 text-right font-medium text-[#1E293B]">
                {formatNumber(results.volume.looseVolume)} CY
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VolumeBreakdown;
