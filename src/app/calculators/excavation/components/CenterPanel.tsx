'use client';

import type { CalculationResult } from '../types';
import { ResultsHeader, StatsGrid, DetailsTabs } from './results';

interface CenterPanelProps {
  results: CalculationResult | null;
}

export function CenterPanel({ results }: CenterPanelProps) {
  return (
    <main className="flex-1 h-full bg-[#F8FAFC] flex flex-col overflow-hidden p-6">
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <ResultsHeader hasResults={!!results} timestamp={results?.timestamp} />

        {/* Stats Grid */}
        <StatsGrid results={results} />

        {/* Details Tabs */}
        <div className="flex-1 min-h-0">
          <DetailsTabs results={results} />
        </div>
      </div>
    </main>
  );
}

export default CenterPanel;
