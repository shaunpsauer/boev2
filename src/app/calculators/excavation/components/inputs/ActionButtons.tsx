'use client';

import { Button } from '@/components/ui';

interface ActionButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  isCalculating?: boolean;
  hasResults?: boolean;
}

export function ActionButtons({ 
  onCalculate, 
  onReset, 
  onSave,
  onLoad,
  isCalculating = false,
  hasResults = false,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="primary"
        size="lg"
        onClick={onCalculate}
        loading={isCalculating}
        className="w-full"
      >
        Calculate
      </Button>
      
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={onReset}
          className="flex-1"
        >
          Reset
        </Button>
        {onSave && (
          <Button
            variant="outline"
            size="md"
            onClick={onSave}
            disabled={!hasResults}
            className="flex-1"
          >
            Save
          </Button>
        )}
        {onLoad && (
          <Button
            variant="outline"
            size="md"
            onClick={onLoad}
            className="flex-1"
          >
            Load
          </Button>
        )}
      </div>
    </div>
  );
}

export default ActionButtons;
