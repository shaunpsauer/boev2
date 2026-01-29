'use client';

import { Badge } from '@/components/ui';

interface ResultsHeaderProps {
  hasResults: boolean;
  timestamp?: Date;
}

export function ResultsHeader({ hasResults, timestamp }: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-[#1E293B]">Calculation Results</h2>
      {hasResults && (
        <Badge variant="success">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Calculated
        </Badge>
      )}
    </div>
  );
}

export default ResultsHeader;
