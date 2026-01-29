'use client';

import { useState } from 'react';
import { AuditEntry } from './AuditEntry';
import type { AuditEntry as AuditEntryType } from '../../types';
import { getCategoryDisplayName } from '../../lib/audit-trail';

interface AuditTrailProps {
  entries: AuditEntryType[];
}

export function AuditTrail({ entries }: AuditTrailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<AuditEntryType['category'] | 'all'>('all');

  const filteredEntries = filterCategory === 'all' 
    ? entries 
    : entries.filter(e => e.category === filterCategory);

  const categories: (AuditEntryType['category'] | 'all')[] = [
    'all', 'input', 'geometry', 'volume', 'production', 'duration'
  ];

  const categoryLabels: Record<string, string> = {
    all: 'All',
    input: 'Inputs',
    geometry: 'Geometry',
    volume: 'Volume',
    production: 'Production',
    duration: 'Duration',
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <span className="text-sm font-semibold text-[#1E293B]">Audit Trail</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <span className="text-3xl mb-3 block">📊</span>
            <p className="text-sm text-[#64748B]">Run a calculation to see the audit trail</p>
            <p className="text-xs text-[#94A3B8] mt-1">
              Every step will be documented here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold text-[#1E293B]">Audit Trail</span>
        </div>
        <span className="text-xs text-[#64748B]">{entries.length} entries</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-2 border-b border-[#E2E8F0] overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`
              px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors
              ${filterCategory === cat
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }
            `}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Entries list */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-3">
          {filteredEntries.map((entry) => (
            <AuditEntry
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuditTrail;
