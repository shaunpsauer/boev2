'use client';

import type { ExcavationType } from '../../types';

interface ExcavationTypeSelectorProps {
  value: ExcavationType;
  onChange: (value: ExcavationType) => void;
}

const excavationTypes: { value: ExcavationType; label: string; icon: string }[] = [
  { value: 'trench', label: 'Trench', icon: '═' },
  { value: 'bell_hole', label: 'Bell Hole', icon: '○' },
  { value: 'pothole', label: 'Pothole', icon: '◉' },
];

export function ExcavationTypeSelector({ value, onChange }: ExcavationTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-[#64748B]">Excavation Type</label>
      <div className="flex gap-2">
        {excavationTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`
              flex-1 flex flex-col items-center gap-1.5 py-3 px-2
              rounded-lg border transition-all
              ${value === type.value
                ? 'bg-[#EFF6FF] border-[#3B82F6] text-[#3B82F6]'
                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#94A3B8]'
              }
            `}
          >
            <span className="text-lg">{type.icon}</span>
            <span className="text-xs font-medium">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExcavationTypeSelector;
