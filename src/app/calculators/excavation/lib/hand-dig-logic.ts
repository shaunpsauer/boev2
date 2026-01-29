// ============================================
// Hand Dig vs Machine Dig Logic
// ============================================

import type { ExcavationInputs, GeometryResult, AuditEntry } from '../types';

/**
 * Hand dig volume calculation result
 */
export interface HandDigResult {
  handDigVolume: number; // Cubic yards
  machineDigVolume: number; // Cubic yards
  handDigPercentage: number;
  machineDigPercentage: number;
}

/**
 * Calculate tolerance zone volume for crossing scenario
 * @param toleranceWidth Width of tolerance zone (feet)
 * @param bufferLength Buffer length on each side (feet)
 * @param geometry Geometry result
 * @returns Volume in cubic yards
 */
function calculateToleranceZoneVolume(
  toleranceWidth: number,
  bufferLength: number,
  geometry: GeometryResult
): number {
  // Total length of tolerance zone = tolerance width + 2 × buffer
  const toleranceLength = toleranceWidth + (2 * bufferLength);
  
  // Volume = cross-section area × tolerance length
  const volumeCuFt = geometry.crossSectionArea * toleranceLength;
  return volumeCuFt / 27; // Convert to cubic yards
}

/**
 * Calculate parallel utility hand dig volume
 * @param toleranceWidth Width of tolerance zone along the trench (feet)
 * @param trenchLength Total trench length (feet)
 * @param geometry Geometry result
 * @returns Volume in cubic yards
 */
function calculateParallelZoneVolume(
  toleranceWidth: number,
  trenchLength: number,
  geometry: GeometryResult
): number {
  // For parallel utilities, hand dig a strip along the trench
  // This is a simplified calculation - in reality it depends on utility location
  const handDigLength = Math.min(toleranceWidth, trenchLength);
  const volumeCuFt = geometry.crossSectionArea * handDigLength;
  return volumeCuFt / 27; // Convert to cubic yards
}

/**
 * Determine hand dig vs machine dig volume split
 * @param inputs Excavation inputs
 * @param geometry Geometry result
 * @param totalBankVolume Total bank volume in cubic yards
 * @returns Hand dig result with audit entries
 */
export function calculateHandDigSplit(
  inputs: ExcavationInputs,
  geometry: GeometryResult,
  totalBankVolume: number
): {
  result: HandDigResult;
  auditEntries: AuditEntry[];
} {
  const auditEntries: AuditEntry[] = [];
  const now = new Date();

  let handDigVolume = 0;
  let machineDigVolume = totalBankVolume;

  // Check for manual override
  if (inputs.handDig.manualOverride) {
    if (inputs.handDig.overrideType === 'fixed_cy' && inputs.handDig.overrideValue !== undefined) {
      handDigVolume = Math.min(inputs.handDig.overrideValue, totalBankVolume);
      machineDigVolume = totalBankVolume - handDigVolume;
      
      auditEntries.push({
        id: `hand-dig-override-${Date.now()}`,
        category: 'volume',
        title: 'Hand Dig Override',
        description: 'Fixed cubic yards override applied',
        inputValues: { overrideValue: inputs.handDig.overrideValue },
        result: `${handDigVolume.toFixed(2)} CY`,
        timestamp: now,
      });
    } else if (inputs.handDig.overrideType === 'percentage' && inputs.handDig.overrideValue !== undefined) {
      const percentage = inputs.handDig.overrideValue / 100;
      handDigVolume = totalBankVolume * percentage;
      machineDigVolume = totalBankVolume - handDigVolume;
      
      auditEntries.push({
        id: `hand-dig-override-pct-${Date.now()}`,
        category: 'volume',
        title: 'Hand Dig Override',
        description: 'Percentage override applied',
        inputValues: { overridePercentage: inputs.handDig.overrideValue },
        result: `${handDigVolume.toFixed(2)} CY (${inputs.handDig.overrideValue}%)`,
        timestamp: now,
      });
    }
  } else {
    // Calculate based on proximity scenario
    switch (inputs.handDig.proximityScenario) {
      case 'no_conflict':
        // All machine dig
        handDigVolume = 0;
        machineDigVolume = totalBankVolume;
        
        auditEntries.push({
          id: `hand-dig-no-conflict-${Date.now()}`,
          category: 'volume',
          title: 'No Utility Conflict',
          description: '100% machine excavation',
          result: `Machine: ${machineDigVolume.toFixed(2)} CY`,
          timestamp: now,
        });
        break;

      case 'crossing':
        // Hand dig the tolerance zone around the crossing
        handDigVolume = calculateToleranceZoneVolume(
          inputs.handDig.toleranceZoneWidth,
          inputs.handDig.bufferLengthEachSide,
          geometry
        );
        handDigVolume = Math.min(handDigVolume, totalBankVolume);
        machineDigVolume = totalBankVolume - handDigVolume;
        
        auditEntries.push({
          id: `hand-dig-crossing-${Date.now()}`,
          category: 'volume',
          title: 'Utility Crossing',
          description: 'Tolerance zone hand dig required',
          formula: `Zone length = ${inputs.handDig.toleranceZoneWidth} + (2 × ${inputs.handDig.bufferLengthEachSide}) = ${inputs.handDig.toleranceZoneWidth + 2 * inputs.handDig.bufferLengthEachSide} ft`,
          inputValues: {
            toleranceWidth: inputs.handDig.toleranceZoneWidth,
            bufferLength: inputs.handDig.bufferLengthEachSide,
          },
          result: `Hand dig: ${handDigVolume.toFixed(2)} CY`,
          timestamp: now,
        });
        break;

      case 'parallel':
        // Hand dig along the parallel utility
        handDigVolume = calculateParallelZoneVolume(
          inputs.handDig.toleranceZoneWidth,
          geometry.length,
          geometry
        );
        handDigVolume = Math.min(handDigVolume, totalBankVolume);
        machineDigVolume = totalBankVolume - handDigVolume;
        
        auditEntries.push({
          id: `hand-dig-parallel-${Date.now()}`,
          category: 'volume',
          title: 'Parallel Utility',
          description: 'Parallel tolerance zone hand dig required',
          inputValues: {
            toleranceWidth: inputs.handDig.toleranceZoneWidth,
            trenchLength: geometry.length,
          },
          result: `Hand dig: ${handDigVolume.toFixed(2)} CY`,
          timestamp: now,
        });
        break;

      case 'exposure':
        // Exposure/pothole - typically all hand dig
        handDigVolume = totalBankVolume;
        machineDigVolume = 0;
        
        auditEntries.push({
          id: `hand-dig-exposure-${Date.now()}`,
          category: 'volume',
          title: 'Utility Exposure',
          description: '100% hand dig for utility exposure',
          result: `Hand dig: ${handDigVolume.toFixed(2)} CY`,
          timestamp: now,
        });
        break;
    }
  }

  // Add method audit entry
  auditEntries.push({
    id: `hand-dig-method-${Date.now()}`,
    category: 'volume',
    title: 'Hand Dig Method',
    description: `Using ${inputs.handDig.method === 'vacuum' ? 'vacuum excavation' : 'hand tools'}`,
    result: inputs.handDig.method,
    timestamp: now,
  });

  const handDigPercentage = totalBankVolume > 0 
    ? (handDigVolume / totalBankVolume) * 100 
    : 0;
  const machineDigPercentage = totalBankVolume > 0 
    ? (machineDigVolume / totalBankVolume) * 100 
    : 0;

  // Summary audit entry
  auditEntries.push({
    id: `hand-dig-summary-${Date.now()}`,
    category: 'volume',
    title: 'Volume Split Summary',
    description: 'Machine vs hand dig volume breakdown',
    inputValues: {
      totalVolume: `${totalBankVolume.toFixed(2)} CY`,
    },
    result: `Machine: ${machineDigPercentage.toFixed(1)}% | Hand: ${handDigPercentage.toFixed(1)}%`,
    timestamp: now,
  });

  return {
    result: {
      handDigVolume,
      machineDigVolume,
      handDigPercentage,
      machineDigPercentage,
    },
    auditEntries,
  };
}
