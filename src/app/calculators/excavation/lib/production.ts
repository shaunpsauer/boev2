// ============================================
// Production Calculations
// ============================================

import type { ExcavationInputs, ProductionResult, AuditEntry } from '../types';
import type { HandDigResult } from './hand-dig-logic';
import {
  getMachineProductionRate,
  getHandProductionRate,
  getVacuumProductionRate,
  calculateSawcutHours,
  SAWCUT_RATE,
} from '../config/production-rates';

/**
 * Calculate production hours for excavation
 * @param inputs Excavation inputs
 * @param handDigResult Hand dig volume split result
 * @param looseVolume Total loose volume (for haul calculations, not used yet)
 * @returns Production result with audit entries
 */
export function calculateProduction(
  inputs: ExcavationInputs,
  handDigResult: HandDigResult,
  looseVolume: number
): {
  result: ProductionResult;
  auditEntries: AuditEntry[];
} {
  const auditEntries: AuditEntry[] = [];
  const now = new Date();

  // Get production rates
  const machineRate = getMachineProductionRate(
    inputs.equipment.excavatorClass,
    inputs.soil.soilType
  );
  
  auditEntries.push({
    id: `prod-machine-rate-${Date.now()}`,
    category: 'production',
    title: 'Machine Production Rate',
    description: `${inputs.equipment.excavatorClass} excavator in ${inputs.soil.soilType} soil`,
    inputValues: {
      excavatorClass: inputs.equipment.excavatorClass,
      soilType: inputs.soil.soilType,
    },
    result: `${machineRate} CY/hr`,
    timestamp: now,
  });

  // Calculate machine hours
  const machineHours = machineRate > 0 
    ? handDigResult.machineDigVolume / machineRate 
    : 0;
  
  auditEntries.push({
    id: `prod-machine-hours-${Date.now()}`,
    category: 'production',
    title: 'Machine Hours',
    description: 'Hours for machine excavation',
    formula: `${handDigResult.machineDigVolume.toFixed(2)} CY ÷ ${machineRate} CY/hr`,
    inputValues: {
      machineVolume: `${handDigResult.machineDigVolume.toFixed(2)} CY`,
      machineRate: `${machineRate} CY/hr`,
    },
    result: `${machineHours.toFixed(2)} hrs`,
    timestamp: now,
  });

  // Calculate hand dig hours based on method
  let handHours = 0;
  let vacuumHours = 0;

  if (handDigResult.handDigVolume > 0) {
    if (inputs.handDig.method === 'vacuum' && inputs.equipment.useVacuumTruck) {
      // Vacuum excavation
      const vacuumRate = getVacuumProductionRate(inputs.soil.soilType);
      vacuumHours = vacuumRate > 0 
        ? handDigResult.handDigVolume / vacuumRate 
        : 0;
      
      auditEntries.push({
        id: `prod-vacuum-hours-${Date.now()}`,
        category: 'production',
        title: 'Vacuum Excavation Hours',
        description: 'Hours for vacuum excavation',
        formula: `${handDigResult.handDigVolume.toFixed(2)} CY ÷ ${vacuumRate} CY/hr`,
        inputValues: {
          handVolume: `${handDigResult.handDigVolume.toFixed(2)} CY`,
          vacuumRate: `${vacuumRate} CY/hr`,
        },
        result: `${vacuumHours.toFixed(2)} hrs`,
        timestamp: now,
      });
    } else {
      // Hand tools
      const handRate = getHandProductionRate(inputs.soil.soilType);
      const totalHandRate = handRate * inputs.crew.laborers;
      handHours = totalHandRate > 0 
        ? handDigResult.handDigVolume / totalHandRate 
        : 0;
      
      auditEntries.push({
        id: `prod-hand-rate-${Date.now()}`,
        category: 'production',
        title: 'Hand Excavation Rate',
        description: `${inputs.crew.laborers} laborers in ${inputs.soil.soilType} soil`,
        formula: `${handRate} CY/hr/laborer × ${inputs.crew.laborers} laborers`,
        inputValues: {
          ratePerLaborer: `${handRate} CY/hr`,
          laborers: inputs.crew.laborers,
        },
        result: `${totalHandRate.toFixed(2)} CY/hr`,
        timestamp: now,
      });

      auditEntries.push({
        id: `prod-hand-hours-${Date.now()}`,
        category: 'production',
        title: 'Hand Excavation Hours',
        description: 'Hours for hand excavation',
        formula: `${handDigResult.handDigVolume.toFixed(2)} CY ÷ ${totalHandRate.toFixed(2)} CY/hr`,
        inputValues: {
          handVolume: `${handDigResult.handDigVolume.toFixed(2)} CY`,
          totalHandRate: `${totalHandRate.toFixed(2)} CY/hr`,
        },
        result: `${handHours.toFixed(2)} hrs`,
        timestamp: now,
      });
    }
  }

  // Calculate sawcut hours if applicable
  let sawcutHours = 0;
  if (inputs.equipment.useSawcut && inputs.equipment.sawcutLength > 0) {
    sawcutHours = calculateSawcutHours(inputs.equipment.sawcutLength);
    
    auditEntries.push({
      id: `prod-sawcut-hours-${Date.now()}`,
      category: 'production',
      title: 'Sawcut Hours',
      description: 'Hours for sawcutting pavement',
      formula: `${inputs.equipment.sawcutLength} LF ÷ ${SAWCUT_RATE} LF/hr`,
      inputValues: {
        sawcutLength: `${inputs.equipment.sawcutLength} LF`,
        sawcutRate: `${SAWCUT_RATE} LF/hr`,
      },
      result: `${sawcutHours.toFixed(2)} hrs`,
      timestamp: now,
    });
  }

  // Calculate totals
  const totalEquipmentHours = machineHours + vacuumHours + sawcutHours;
  
  // Total labor hours = hand excavation hours × laborers + equipment operation support
  const laborerHoursOnHand = handHours * inputs.crew.laborers;
  const laborerHoursOnMachine = machineHours; // Laborers support machine operation
  const totalLaborHours = laborerHoursOnHand + laborerHoursOnMachine;

  auditEntries.push({
    id: `prod-summary-${Date.now()}`,
    category: 'production',
    title: 'Production Summary',
    description: 'Total hours breakdown',
    result: `Equipment: ${totalEquipmentHours.toFixed(2)} hrs | Labor: ${totalLaborHours.toFixed(2)} hrs`,
    timestamp: now,
  });

  const handRate = getHandProductionRate(inputs.soil.soilType);

  return {
    result: {
      machineRate,
      handRate,
      machineHours,
      handHours,
      sawcutHours,
      vacuumHours,
      totalEquipmentHours,
      totalLaborHours,
    },
    auditEntries,
  };
}
