'use client';

import { Input } from '@/components/ui';
import type { GeometryInput, PipeInput } from '../../types';
import { calculateBottomWidth, calculateTrenchDepth } from '../../config/pipe-master';

interface GeometryInputsProps {
  value: GeometryInput;
  pipe: PipeInput;
  onChange: (value: GeometryInput) => void;
  errors?: Record<string, string>;
}

export function GeometryInputs({ value, pipe, onChange, errors }: GeometryInputsProps) {
  const handleLengthChange = (length: number) => {
    onChange({ ...value, length });
  };

  const handleCoverChange = (coverToTop: number) => {
    const autoDepth = calculateTrenchDepth(coverToTop, pipe.od);
    onChange({
      ...value,
      coverToTop,
      depth: value.depthManualOverride ? value.depth : autoDepth,
    });
  };

  const handleDepthChange = (depth: number) => {
    onChange({
      ...value,
      depth,
      depthManualOverride: true,
    });
  };

  const handleWidthChange = (bottomWidth: number) => {
    onChange({
      ...value,
      bottomWidth,
      bottomWidthManualOverride: true,
    });
  };

  const handleDepthAutoToggle = () => {
    const autoDepth = calculateTrenchDepth(value.coverToTop, pipe.od);
    onChange({
      ...value,
      depthManualOverride: !value.depthManualOverride,
      depth: !value.depthManualOverride ? value.depth : autoDepth,
    });
  };

  const handleWidthAutoToggle = () => {
    const autoWidth = calculateBottomWidth(pipe.od);
    onChange({
      ...value,
      bottomWidthManualOverride: !value.bottomWidthManualOverride,
      bottomWidth: !value.bottomWidthManualOverride ? value.bottomWidth : autoWidth,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-[#1E293B]">Geometry</span>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Length (ft)"
            type="number"
            step="0.1"
            value={value.length}
            onChange={(e) => handleLengthChange(Number(e.target.value))}
            error={errors?.['geometry.length']}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Cover to Top (ft)"
            type="number"
            step="0.1"
            value={value.coverToTop}
            onChange={(e) => handleCoverChange(Number(e.target.value))}
            error={errors?.['geometry.coverToTop']}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#64748B]">Depth (ft)</label>
            <button
              type="button"
              onClick={handleDepthAutoToggle}
              className={`
                px-1.5 py-0.5 text-[10px] font-medium rounded
                ${value.depthManualOverride
                  ? 'bg-[#FEF3C7] text-[#92400E]'
                  : 'bg-[#DCFCE7] text-[#166534]'
                }
              `}
            >
              {value.depthManualOverride ? 'Manual' : 'Auto'}
            </button>
          </div>
          <Input
            type="number"
            step="0.1"
            value={value.depth.toFixed(2)}
            onChange={(e) => handleDepthChange(Number(e.target.value))}
            disabled={!value.depthManualOverride}
            error={errors?.['geometry.depth']}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#64748B]">Width (ft)</label>
            <button
              type="button"
              onClick={handleWidthAutoToggle}
              className={`
                px-1.5 py-0.5 text-[10px] font-medium rounded
                ${value.bottomWidthManualOverride
                  ? 'bg-[#FEF3C7] text-[#92400E]'
                  : 'bg-[#DCFCE7] text-[#166534]'
                }
              `}
            >
              {value.bottomWidthManualOverride ? 'Manual' : 'Auto'}
            </button>
          </div>
          <Input
            type="number"
            step="0.1"
            value={value.bottomWidth.toFixed(2)}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            disabled={!value.bottomWidthManualOverride}
            error={errors?.['geometry.bottomWidth']}
          />
        </div>
      </div>
    </div>
  );
}

export default GeometryInputs;
