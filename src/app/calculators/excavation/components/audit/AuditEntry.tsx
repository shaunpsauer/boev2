'use client';

import type { AuditEntry as AuditEntryType } from '../../types';

interface AuditEntryProps {
  entry: AuditEntryType;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const categoryColors: Record<AuditEntryType['category'], { bg: string; text: string; icon: string }> = {
  input: { bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]', icon: '📝' },
  geometry: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', icon: '📐' },
  volume: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', icon: '📦' },
  production: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', icon: '⏱️' },
  duration: { bg: 'bg-[#E0E7FF]', text: 'text-[#3730A3]', icon: '📅' },
};

export function AuditEntry({ entry, isExpanded = false, onToggle }: AuditEntryProps) {
  const { bg, text, icon } = categoryColors[entry.category];

  return (
    <div 
      className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-[#E2E8F0] cursor-pointer hover:border-[#94A3B8] transition-colors"
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium text-[#1E293B]">{entry.title}</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${bg} ${text}`}>
          {entry.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-[#64748B]">{entry.description}</p>

      {/* Result (always shown) */}
      {entry.result !== undefined && (
        <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
          <span className="text-xs text-[#94A3B8]">Result:</span>
          <span className="text-xs font-medium text-[#1E293B]">{entry.result}</span>
        </div>
      )}

      {/* Expanded details */}
      {isExpanded && (
        <div className="flex flex-col gap-2 pt-2 mt-1 border-t border-[#E2E8F0]">
          {/* Formula */}
          {entry.formula && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium text-[#94A3B8] uppercase">Formula</span>
              <code className="text-xs text-[#1E293B] bg-[#F8FAFC] px-2 py-1 rounded font-mono">
                {entry.formula}
              </code>
            </div>
          )}

          {/* Input values */}
          {entry.inputValues && Object.keys(entry.inputValues).length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium text-[#94A3B8] uppercase">Inputs Used</span>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {Object.entries(entry.inputValues).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-1">
                    <span className="text-[#64748B]">{key}:</span>
                    <span className="text-[#1E293B] font-medium truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expand indicator */}
      <div className="flex justify-center">
        <svg 
          className={`w-4 h-4 text-[#94A3B8] transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default AuditEntry;
