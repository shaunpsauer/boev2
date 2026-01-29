'use client';

import { Input } from '@/components/ui';

interface ProjectInfoInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProjectInfoInput({ value, onChange, error }: ProjectInfoInputProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
      <Input
        label="Project Name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter project name"
        error={error}
      />
    </div>
  );
}

export default ProjectInfoInput;
