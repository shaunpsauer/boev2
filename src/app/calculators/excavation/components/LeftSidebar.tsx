'use client';

import type { ExcavationInputs } from '../types';
import {
  ProjectInfoInput,
  ExcavationTypeSelector,
  PipeConfiguration,
  GeometryInputs,
  SoilAndSlope,
  CrewConfiguration,
  ActionButtons,
} from './inputs';

interface LeftSidebarProps {
  inputs: ExcavationInputs;
  onChange: (inputs: ExcavationInputs) => void;
  onCalculate: () => void;
  onReset: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  errors?: Record<string, string>;
  isCalculating?: boolean;
  hasResults?: boolean;
}

export function LeftSidebar({
  inputs,
  onChange,
  onCalculate,
  onReset,
  onSave,
  onLoad,
  errors = {},
  isCalculating = false,
  hasResults = false,
}: LeftSidebarProps) {
  return (
    <aside className="w-[360px] h-full bg-white border-r border-[#E2E8F0] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4">
        <h1 className="text-lg font-semibold text-[#1E293B]">Input Parameters</h1>
        <p className="text-sm text-[#64748B]">Configure excavation details</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-4">
          {/* Project Info */}
          <ProjectInfoInput
            value={inputs.projectName}
            onChange={(projectName) => onChange({ ...inputs, projectName })}
            error={errors['projectName']}
          />

          {/* Excavation Type */}
          <ExcavationTypeSelector
            value={inputs.excavationType}
            onChange={(excavationType) => onChange({ ...inputs, excavationType })}
          />

          {/* Pipe Configuration */}
          <PipeConfiguration
            value={inputs.pipe}
            onChange={(pipe) => onChange({ ...inputs, pipe })}
            errors={errors}
          />

          {/* Geometry Inputs */}
          <GeometryInputs
            value={inputs.geometry}
            pipe={inputs.pipe}
            onChange={(geometry) => onChange({ ...inputs, geometry })}
            errors={errors}
          />

          {/* Soil & Slope */}
          <SoilAndSlope
            value={inputs.soil}
            onChange={(soil) => onChange({ ...inputs, soil })}
            errors={errors}
          />

          {/* Crew Configuration */}
          <CrewConfiguration
            crew={inputs.crew}
            schedule={inputs.schedule}
            onCrewChange={(crew) => onChange({ ...inputs, crew })}
            onScheduleChange={(schedule) => onChange({ ...inputs, schedule })}
            errors={errors}
          />

          {/* Action Buttons */}
          <ActionButtons
            onCalculate={onCalculate}
            onReset={onReset}
            onSave={onSave}
            onLoad={onLoad}
            isCalculating={isCalculating}
            hasResults={hasResults}
          />
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
