'use client';

import type { CalculationResult } from '../../types';

interface LineItemDetailProps {
  results: CalculationResult | null;
}

export function LineItemDetail({ results }: LineItemDetailProps) {
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

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-semibold text-[#1E293B]">Line Item Details</h3>

      {/* Geometry details */}
      <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
        <h4 className="text-xs font-semibold text-[#64748B] mb-3">Geometry Parameters</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Bottom Width:</span>
            <span className="text-[#1E293B] font-medium">
              {formatNumber(results.geometry.bottomWidth)} ft
              {!results.inputs.geometry.bottomWidthManualOverride && 
                <span className="text-xs text-[#22C55E] ml-1">(auto)</span>
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Top Width:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.geometry.topWidth)} ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Depth:</span>
            <span className="text-[#1E293B] font-medium">
              {formatNumber(results.geometry.depth)} ft
              {!results.inputs.geometry.depthManualOverride && 
                <span className="text-xs text-[#22C55E] ml-1">(auto)</span>
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Length:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.geometry.length)} ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Bedding Depth:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.geometry.beddingDepth * 12)} in</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Cross-Section:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.geometry.crossSectionArea)} sq ft</span>
          </div>
        </div>
      </div>

      {/* Soil & slope details */}
      <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
        <h4 className="text-xs font-semibold text-[#64748B] mb-3">Soil & Slope</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Soil Type:</span>
            <span className="text-[#1E293B] font-medium capitalize">
              {results.inputs.soil.soilType.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Slope Ratio:</span>
            <span className="text-[#1E293B] font-medium">
              {results.inputs.soil.slopeRatio}:1
              {!results.inputs.soil.slopeRatioManualOverride && 
                <span className="text-xs text-[#22C55E] ml-1">(auto)</span>
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Excavation Type:</span>
            <span className="text-[#1E293B] font-medium">
              {results.geometry.isSloped ? 'Sloped' : 'Vertical'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Swell Factor:</span>
            <span className="text-[#1E293B] font-medium">
              {(results.volume.swellFactor * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Production rates */}
      <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
        <h4 className="text-xs font-semibold text-[#64748B] mb-3">Production Rates Applied</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Machine Rate:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.production.machineRate)} CY/hr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Hand Rate:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.production.handRate)} CY/hr/laborer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Machine Hours:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.production.machineHours)} hrs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Hand Hours:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.production.handHours)} hrs</span>
          </div>
        </div>
      </div>

      {/* Duration calculation */}
      <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
        <h4 className="text-xs font-semibold text-[#64748B] mb-3">Duration Calculation</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Machine Duration:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.duration.machineDuration)} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Hand Duration:</span>
            <span className="text-[#1E293B] font-medium">{formatNumber(results.duration.handDuration)} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Critical Path:</span>
            <span className={`font-medium ${
              results.duration.criticalPath === 'machine' ? 'text-[#3B82F6]' : 'text-[#F59E0B]'
            }`}>
              {results.duration.criticalPath === 'machine' ? 'Machine' : 'Hand'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Total Duration:</span>
            <span className="text-[#1E293B] font-semibold">{formatNumber(results.duration.totalDuration)} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LineItemDetail;
