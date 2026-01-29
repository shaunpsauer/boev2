'use client';

import { Input } from '@/components/ui';
import type { CrewInput, ScheduleInput } from '../../types';

interface CrewConfigurationProps {
  crew: CrewInput;
  schedule: ScheduleInput;
  onCrewChange: (value: CrewInput) => void;
  onScheduleChange: (value: ScheduleInput) => void;
  errors?: Record<string, string>;
}

export function CrewConfiguration({ 
  crew, 
  schedule, 
  onCrewChange, 
  onScheduleChange,
  errors 
}: CrewConfigurationProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-[#1E293B]">Crew & Schedule</span>
      
      {/* Crew counts */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            label="Operators"
            type="number"
            min="1"
            value={crew.operators}
            onChange={(e) => onCrewChange({ ...crew, operators: Number(e.target.value) })}
            error={errors?.['crew.operators']}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Laborers"
            type="number"
            min="1"
            value={crew.laborers}
            onChange={(e) => onCrewChange({ ...crew, laborers: Number(e.target.value) })}
            error={errors?.['crew.laborers']}
          />
        </div>
      </div>

      {/* Optional crew roles */}
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={crew.foreman}
            onChange={(e) => onCrewChange({ ...crew, foreman: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
          />
          <span className="text-xs text-[#64748B]">Foreman</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={crew.spotter}
            onChange={(e) => onCrewChange({ ...crew, spotter: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
          />
          <span className="text-xs text-[#64748B]">Spotter</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={crew.competentPerson}
            onChange={(e) => onCrewChange({ ...crew, competentPerson: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
          />
          <span className="text-xs text-[#64748B]">Competent Person</span>
        </label>
      </div>

      {/* Schedule inputs */}
      <div className="flex gap-3 mt-2">
        <div className="flex-1">
          <Input
            label="Hrs/Day"
            type="number"
            min="1"
            max="24"
            value={schedule.hoursPerDay}
            onChange={(e) => onScheduleChange({ ...schedule, hoursPerDay: Number(e.target.value) })}
            error={errors?.['schedule.hoursPerDay']}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Shifts"
            type="number"
            min="1"
            max="3"
            value={schedule.shiftsPerDay}
            onChange={(e) => onScheduleChange({ ...schedule, shiftsPerDay: Number(e.target.value) })}
            error={errors?.['schedule.shiftsPerDay']}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Days/Week"
            type="number"
            min="1"
            max="7"
            value={schedule.workingDaysPerWeek}
            onChange={(e) => onScheduleChange({ ...schedule, workingDaysPerWeek: Number(e.target.value) })}
            error={errors?.['schedule.workingDaysPerWeek']}
          />
        </div>
      </div>
    </div>
  );
}

export default CrewConfiguration;
