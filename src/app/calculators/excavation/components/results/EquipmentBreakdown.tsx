'use client';

import type { CalculationResult } from '../../types';

interface EquipmentBreakdownProps {
  results: CalculationResult | null;
}

export function EquipmentBreakdown({ results }: EquipmentBreakdownProps) {
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
      <h3 className="text-sm font-semibold text-[#1E293B]">Equipment & Crew Hours</h3>

      {/* Equipment hours table */}
      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-[#64748B]">Equipment</th>
              <th className="px-4 py-2 text-right font-medium text-[#64748B]">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            <tr>
              <td className="px-4 py-3 text-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚜</span>
                  <span>Excavator ({results.inputs.equipment.excavatorClass})</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {formatNumber(results.equipmentSummary.excavatorHours)} hrs
              </td>
            </tr>
            {results.equipmentSummary.vacuumTruckHours > 0 && (
              <tr>
                <td className="px-4 py-3 text-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚛</span>
                    <span>Vacuum Truck</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[#1E293B]">
                  {formatNumber(results.equipmentSummary.vacuumTruckHours)} hrs
                </td>
              </tr>
            )}
            {results.equipmentSummary.sawcutEquipmentHours > 0 && (
              <tr>
                <td className="px-4 py-3 text-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔪</span>
                    <span>Sawcut Equipment</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[#1E293B]">
                  {formatNumber(results.equipmentSummary.sawcutEquipmentHours)} hrs
                </td>
              </tr>
            )}
            <tr className="bg-[#F8FAFC]">
              <td className="px-4 py-3 font-medium text-[#1E293B]">Total Equipment Hours</td>
              <td className="px-4 py-3 text-right font-medium text-[#1E293B]">
                {formatNumber(results.equipmentSummary.totalEquipmentHours)} hrs
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Crew hours table */}
      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-[#64748B]">Role</th>
              <th className="px-4 py-2 text-right font-medium text-[#64748B]">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            <tr>
              <td className="px-4 py-3 text-[#1E293B]">
                Operators ({results.inputs.crew.operators})
              </td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {formatNumber(results.crewSummary.operatorHours)} hrs
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-[#1E293B]">
                Laborers ({results.inputs.crew.laborers})
              </td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {formatNumber(results.crewSummary.laborerHours)} hrs
              </td>
            </tr>
            {results.crewSummary.foremanHours > 0 && (
              <tr>
                <td className="px-4 py-3 text-[#1E293B]">Foreman</td>
                <td className="px-4 py-3 text-right text-[#1E293B]">
                  {formatNumber(results.crewSummary.foremanHours)} hrs
                </td>
              </tr>
            )}
            {results.crewSummary.spotterHours > 0 && (
              <tr>
                <td className="px-4 py-3 text-[#1E293B]">Spotter</td>
                <td className="px-4 py-3 text-right text-[#1E293B]">
                  {formatNumber(results.crewSummary.spotterHours)} hrs
                </td>
              </tr>
            )}
            {results.crewSummary.competentPersonHours > 0 && (
              <tr>
                <td className="px-4 py-3 text-[#1E293B]">Competent Person</td>
                <td className="px-4 py-3 text-right text-[#1E293B]">
                  {formatNumber(results.crewSummary.competentPersonHours)} hrs
                </td>
              </tr>
            )}
            <tr className="bg-[#F8FAFC]">
              <td className="px-4 py-3 font-medium text-[#1E293B]">Total Labor Hours</td>
              <td className="px-4 py-3 text-right font-medium text-[#1E293B]">
                {formatNumber(results.crewSummary.totalLaborHours)} hrs
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentBreakdown;
