'use client';

import { Select, Input } from '@/components/ui';
import type { PipeInput } from '../../types';
import { AVAILABLE_NPS_SIZES, getODFromNPS } from '../../config/pipe-master';

interface PipeConfigurationProps {
  value: PipeInput;
  onChange: (value: PipeInput) => void;
  errors?: Record<string, string>;
}

export function PipeConfiguration({ value, onChange, errors }: PipeConfigurationProps) {
  const npsOptions = AVAILABLE_NPS_SIZES.map((nps) => ({
    value: nps,
    label: `${nps}"`,
  }));

  const handleNPSChange = (nps: number) => {
    const autoOD = getODFromNPS(nps);
    onChange({
      ...value,
      nps,
      od: value.odManualOverride ? value.od : (autoOD || value.od),
    });
  };

  const handleODChange = (od: number) => {
    onChange({
      ...value,
      od,
      odManualOverride: true,
    });
  };

  const handleAutoToggle = () => {
    const autoOD = getODFromNPS(value.nps);
    onChange({
      ...value,
      odManualOverride: !value.odManualOverride,
      od: !value.odManualOverride ? value.od : (autoOD || value.od),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1E293B]">Pipe Configuration</span>
        <button
          type="button"
          onClick={handleAutoToggle}
          className={`
            px-2 py-1 text-xs font-medium rounded
            ${value.odManualOverride
              ? 'bg-[#FEF3C7] text-[#92400E]'
              : 'bg-[#DCFCE7] text-[#166534]'
            }
          `}
        >
          {value.odManualOverride ? 'Manual' : 'Auto'}
        </button>
      </div>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <Select
            label="NPS (Nominal)"
            value={value.nps}
            onChange={(e) => handleNPSChange(Number(e.target.value))}
            options={npsOptions}
            error={errors?.['pipe.nps']}
          />
        </div>
        <div className="flex-1">
          <Input
            label="OD (Outside Dia.)"
            type="number"
            step="0.001"
            value={value.od}
            onChange={(e) => handleODChange(Number(e.target.value))}
            suffix='"'
            disabled={!value.odManualOverride}
            error={errors?.['pipe.od']}
          />
        </div>
      </div>
    </div>
  );
}

export default PipeConfiguration;
