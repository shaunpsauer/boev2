// ============================================
// Main Calculation Orchestrator
// ============================================

import type { ExcavationInputs, CalculationResult, VolumeResult, AuditEntry } from '../types';
import { calculateGeometry, calculateBankVolume, calculateLooseVolume } from './geometry';
import { calculateHandDigSplit } from './hand-dig-logic';
import { calculateProduction } from './production';
import { calculateDurationAndSummaries } from './crew-scheduling';
import { generateInputAuditEntries, sortAuditEntries } from './audit-trail';
import { getSwellFactor } from '../config/soil-classification';

/**
 * Generate a unique calculation ID
 */
function generateCalculationId(): string {
  return `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Perform complete excavation calculation
 * @param inputs The excavation inputs
 * @returns Complete calculation result with audit trail
 */
export function performCalculation(inputs: ExcavationInputs): CalculationResult {
  const calculationId = generateCalculationId();
  const timestamp = new Date();
  const allAuditEntries: AuditEntry[] = [];

  // Step 1: Generate input audit entries
  const inputAuditEntries = generateInputAuditEntries(inputs);
  allAuditEntries.push(...inputAuditEntries);

  // Step 2: Calculate geometry
  const { result: geometry, auditEntries: geometryAuditEntries } = calculateGeometry(inputs);
  allAuditEntries.push(...geometryAuditEntries);

  // Step 3: Calculate volumes
  const bankVolume = calculateBankVolume(geometry);
  const swellFactor = getSwellFactor(inputs.soil.soilType);
  const looseVolume = calculateLooseVolume(bankVolume, swellFactor);

  // Add volume audit entries
  allAuditEntries.push({
    id: `vol-bank-${Date.now()}`,
    category: 'volume',
    title: 'Bank Volume',
    description: 'Total in-place excavation volume',
    formula: `${geometry.crossSectionArea.toFixed(2)} sq ft × ${geometry.length} ft ÷ 27`,
    inputValues: {
      crossSectionArea: `${geometry.crossSectionArea.toFixed(2)} sq ft`,
      length: `${geometry.length} ft`,
    },
    result: `${bankVolume.toFixed(2)} CY`,
    timestamp,
  });

  allAuditEntries.push({
    id: `vol-swell-${Date.now()}`,
    category: 'volume',
    title: 'Swell Factor',
    description: `Swell factor for ${inputs.soil.soilType.replace('_', ' ')} soil`,
    result: `${(swellFactor * 100).toFixed(0)}%`,
    timestamp,
  });

  allAuditEntries.push({
    id: `vol-loose-${Date.now()}`,
    category: 'volume',
    title: 'Loose Volume',
    description: 'Volume after excavation (swelled)',
    formula: `${bankVolume.toFixed(2)} CY × (1 + ${swellFactor})`,
    inputValues: {
      bankVolume: `${bankVolume.toFixed(2)} CY`,
      swellFactor: `${(swellFactor * 100).toFixed(0)}%`,
    },
    result: `${looseVolume.toFixed(2)} CY`,
    timestamp,
  });

  // Step 4: Calculate hand dig split
  const { result: handDigResult, auditEntries: handDigAuditEntries } = calculateHandDigSplit(
    inputs,
    geometry,
    bankVolume
  );
  allAuditEntries.push(...handDigAuditEntries);

  // Create volume result
  const volume: VolumeResult = {
    bankVolume,
    looseVolume,
    swellFactor,
    machineDigVolume: handDigResult.machineDigVolume,
    handDigVolume: handDigResult.handDigVolume,
  };

  // Step 5: Calculate production
  const { result: production, auditEntries: productionAuditEntries } = calculateProduction(
    inputs,
    handDigResult,
    looseVolume
  );
  allAuditEntries.push(...productionAuditEntries);

  // Step 6: Calculate duration and summaries
  const { 
    duration, 
    crewSummary, 
    equipmentSummary, 
    auditEntries: durationAuditEntries 
  } = calculateDurationAndSummaries(inputs, production);
  allAuditEntries.push(...durationAuditEntries);

  // Sort audit entries by category and time
  const sortedAuditEntries = sortAuditEntries(allAuditEntries);

  return {
    id: calculationId,
    timestamp,
    inputs,
    geometry,
    volume,
    production,
    duration,
    crewSummary,
    equipmentSummary,
    auditTrail: sortedAuditEntries,
  };
}

/**
 * Validate inputs before calculation
 * @param inputs The excavation inputs
 * @returns Object with isValid flag and any error messages
 */
export function validateInputs(inputs: ExcavationInputs): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate pipe
  if (inputs.pipe.nps <= 0) {
    errors['pipe.nps'] = 'NPS must be positive';
  }
  if (inputs.pipe.od <= 0) {
    errors['pipe.od'] = 'OD must be positive';
  }

  // Validate geometry
  if (inputs.geometry.length <= 0) {
    errors['geometry.length'] = 'Length must be positive';
  }
  if (inputs.geometry.depth <= 0) {
    errors['geometry.depth'] = 'Depth must be positive';
  }
  if (inputs.geometry.bottomWidth <= 0) {
    errors['geometry.bottomWidth'] = 'Bottom width must be positive';
  }
  if (inputs.geometry.coverToTop < 0) {
    errors['geometry.coverToTop'] = 'Cover to top cannot be negative';
  }

  // Validate crew
  if (inputs.crew.operators < 1) {
    errors['crew.operators'] = 'At least one operator is required';
  }
  if (inputs.crew.laborers < 1) {
    errors['crew.laborers'] = 'At least one laborer is required';
  }

  // Validate schedule
  if (inputs.schedule.hoursPerDay <= 0 || inputs.schedule.hoursPerDay > 24) {
    errors['schedule.hoursPerDay'] = 'Hours per day must be between 1 and 24';
  }
  if (inputs.schedule.shiftsPerDay < 1 || inputs.schedule.shiftsPerDay > 3) {
    errors['schedule.shiftsPerDay'] = 'Shifts per day must be between 1 and 3';
  }
  if (inputs.schedule.workingDaysPerWeek < 1 || inputs.schedule.workingDaysPerWeek > 7) {
    errors['schedule.workingDaysPerWeek'] = 'Working days per week must be between 1 and 7';
  }

  // Validate hand dig
  if (inputs.handDig.toleranceZoneWidth < 0) {
    errors['handDig.toleranceZoneWidth'] = 'Tolerance zone width cannot be negative';
  }
  if (inputs.handDig.bufferLengthEachSide < 0) {
    errors['handDig.bufferLengthEachSide'] = 'Buffer length cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format number for display
 * @param value The number to format
 * @param decimals Number of decimal places
 * @returns Formatted string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format duration for display
 * @param days Number of days
 * @returns Formatted string like "3.5 days" or "1 day"
 */
export function formatDuration(days: number): string {
  const formatted = formatNumber(days, 1);
  return `${formatted} ${days === 1 ? 'day' : 'days'}`;
}
