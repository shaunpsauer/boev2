'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { VolumeBreakdown } from './VolumeBreakdown';
import { EquipmentBreakdown } from './EquipmentBreakdown';
import { LineItemDetail } from './LineItemDetail';
import type { CalculationResult } from '../../types';

interface DetailsTabsProps {
  results: CalculationResult | null;
}

export function DetailsTabs({ results }: DetailsTabsProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
      <Tabs defaultValue="volume" className="flex flex-col h-full">
        <div className="px-4 pt-1 border-b border-[#E2E8F0]">
          <TabsList className="bg-transparent p-0 gap-0">
            <TabsTrigger 
              value="volume"
              className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] bg-transparent"
            >
              Volume
            </TabsTrigger>
            <TabsTrigger 
              value="crew"
              className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] bg-transparent"
            >
              Crew
            </TabsTrigger>
            <TabsTrigger 
              value="equipment"
              className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] bg-transparent"
            >
              Equipment
            </TabsTrigger>
            <TabsTrigger 
              value="details"
              className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#3B82F6] bg-transparent"
            >
              Line Items
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <TabsContent value="volume">
            <VolumeBreakdown results={results} />
          </TabsContent>
          <TabsContent value="crew">
            <EquipmentBreakdown results={results} />
          </TabsContent>
          <TabsContent value="equipment">
            <EquipmentBreakdown results={results} />
          </TabsContent>
          <TabsContent value="details">
            <LineItemDetail results={results} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default DetailsTabs;
