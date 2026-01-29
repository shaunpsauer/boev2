'use client';

import { Select, Input } from '@/components/ui';
import type { SoilInput, SoilType } from '../../types';
import { AVAILABLE_SOIL_TYPES, getSlopeRatio } from '../../config/soil-classification';

interface SoilAndSlopeProps {
  value: SoilInput;
  onChange: (value: SoilInput) => void;
  errors?: Record<string, string>;
}

export function SoilAndSlope({ value, onChange, errors }: SoilAndSlopeProps) {
  const soilOptions = AVAILABLE_SOIL_TYPES.map((soil) => ({
    value: soil.value,
    label: soil.label,
  }));

  const handleSoilTypeChange = (soilType: SoilType) => {
    const autoSlope = getSlopeRatio(soilType);
    onChange({
      ...value,
      soilType,
      slopeRatio: value.slopeRatioManualOverride ? value.slopeRatio : autoSlope,
    });
  };

  const handleSlopeChange = (slopeRatio: number) => {
    onChange({
      ...value,
      slopeRatio,
      slopeRatioManualOverride: true,
    });
  };

  const handleAutoToggle = () => {
    const autoSlope = getSlopeRatio(value.soilType);
    onChange({
      ...value,
      slopeRatioManualOverride: !value.slopeRatioManualOverride,
      slopeRatio: !value.slopeRatioManualOverride ? value.slopeRatio : autoSlope,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-[#1E293B]">Soil & Slope</span>
      
      <Select
        label="Soil Type"
        value={value.soilType}
        onChange={(e) => handleSoilTypeChange(e.target.value as SoilType)}
        options={soilOptions}
        error={errors?.['soil.soilType']}
      />

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#64748B]">Slope Ratio (H:V)</label>
            <button
              type="button"
              onClick={handleAutoToggle}
              className={`
                px-1.5 py-0.5 text-[10px] font-medium rounded
                ${value.slopeRatioManualOverride
                  ? 'bg-[#FEF3C7] text-[#92400E]'
                  : 'bg-[#DCFCE7] text-[#166534]'
                }
              `}
            >
              {value.slopeRatioManualOverride ? 'Manual' : 'Auto'}
            </button>
          </div>
          <Input
            type="number"
            step="0.25"
            value={value.slopeRatio}
            onChange={(e) => handleSlopeChange(Number(e.target.value))}
            disabled={!value.slopeRatioManualOverride}
            suffix=":1V"
            error={errors?.['soil.slopeRatio']}
          />
        </div>
        <div className="pb-2">
          <span className="text-xs text-[#64748B]">
            {value.slopeRatio === 0 ? 'Vertical walls' : `${value.slopeRatio}:1 slope`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SoilAndSlope;
