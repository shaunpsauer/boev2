// ============================================
// Audit Trail Utilities
// ============================================

import type { AuditEntry, ExcavationInputs } from '../types';

/**
 * Generate a unique ID for audit entries
 */
export function generateAuditId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create an input audit entry
 */
export function createInputAuditEntry(
  title: string,
  description: string,
  inputValues: Record<string, string | number>,
  result?: string | number
): AuditEntry {
  return {
    id: generateAuditId('input'),
    category: 'input',
    title,
    description,
    inputValues,
    result,
    timestamp: new Date(),
  };
}

/**
 * Create a calculation audit entry
 */
export function createCalculationAuditEntry(
  category: AuditEntry['category'],
  title: string,
  description: string,
  formula: string,
  inputValues: Record<string, string | number>,
  result: string | number
): AuditEntry {
  return {
    id: generateAuditId(category),
    category,
    title,
    description,
    formula,
    inputValues,
    result,
    timestamp: new Date(),
  };
}

/**
 * Generate initial input audit entries from inputs
 */
export function generateInputAuditEntries(inputs: ExcavationInputs): AuditEntry[] {
  const entries: AuditEntry[] = [];
  const now = new Date();

  // Project info
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Project Name',
    description: 'Project identification',
    result: inputs.projectName,
    timestamp: now,
  });

  // Excavation type
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Excavation Type',
    description: 'Type of excavation',
    result: inputs.excavationType.replace('_', ' '),
    timestamp: now,
  });

  // Pipe configuration
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Pipe Configuration',
    description: 'Pipe size and dimensions',
    inputValues: {
      nps: `${inputs.pipe.nps}"`,
      od: `${inputs.pipe.od}" ${inputs.pipe.odManualOverride ? '(manual)' : '(auto)'}`,
    },
    timestamp: now,
  });

  // Geometry inputs
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Geometry Inputs',
    description: 'Excavation dimensions',
    inputValues: {
      length: `${inputs.geometry.length} ft`,
      coverToTop: `${inputs.geometry.coverToTop} ft`,
      depth: `${inputs.geometry.depth} ft ${inputs.geometry.depthManualOverride ? '(manual)' : '(auto)'}`,
      bottomWidth: `${inputs.geometry.bottomWidth} ft ${inputs.geometry.bottomWidthManualOverride ? '(manual)' : '(auto)'}`,
    },
    timestamp: now,
  });

  // Soil and slope
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Soil & Slope',
    description: 'Soil classification and sloping',
    inputValues: {
      soilType: inputs.soil.soilType.replace('_', ' '),
      slopeRatio: `${inputs.soil.slopeRatio}:1 ${inputs.soil.slopeRatioManualOverride ? '(manual)' : '(auto)'}`,
    },
    timestamp: now,
  });

  // Crew configuration
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Crew Configuration',
    description: 'Assigned crew members',
    inputValues: {
      operators: inputs.crew.operators,
      laborers: inputs.crew.laborers,
      foreman: inputs.crew.foreman ? 'Yes' : 'No',
      spotter: inputs.crew.spotter ? 'Yes' : 'No',
      competentPerson: inputs.crew.competentPerson ? 'Yes' : 'No',
    },
    timestamp: now,
  });

  // Schedule
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Work Schedule',
    description: 'Daily work schedule',
    inputValues: {
      hoursPerDay: `${inputs.schedule.hoursPerDay} hrs`,
      shiftsPerDay: inputs.schedule.shiftsPerDay,
      workingDaysPerWeek: `${inputs.schedule.workingDaysPerWeek} days/week`,
    },
    timestamp: now,
  });

  // Equipment
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Equipment Selection',
    description: 'Excavation equipment',
    inputValues: {
      excavatorClass: inputs.equipment.excavatorClass,
      bucketWidth: `${inputs.equipment.bucketWidth}"`,
      vacuumTruck: inputs.equipment.useVacuumTruck ? 'Yes' : 'No',
      sawcut: inputs.equipment.useSawcut ? `Yes (${inputs.equipment.sawcutLength} LF)` : 'No',
    },
    timestamp: now,
  });

  // Utility proximity
  entries.push({
    id: generateAuditId('input'),
    category: 'input',
    title: 'Utility Proximity',
    description: 'Hand dig configuration',
    inputValues: {
      scenario: inputs.handDig.proximityScenario.replace('_', ' '),
      method: inputs.handDig.method.replace('_', ' '),
      toleranceZone: `${inputs.handDig.toleranceZoneWidth} ft`,
      buffer: `${inputs.handDig.bufferLengthEachSide} ft each side`,
    },
    timestamp: now,
  });

  return entries;
}

/**
 * Sort audit entries by category order
 */
export function sortAuditEntries(entries: AuditEntry[]): AuditEntry[] {
  const categoryOrder: Record<AuditEntry['category'], number> = {
    input: 0,
    geometry: 1,
    volume: 2,
    production: 3,
    duration: 4,
  };

  return [...entries].sort((a, b) => {
    const orderDiff = categoryOrder[a.category] - categoryOrder[b.category];
    if (orderDiff !== 0) return orderDiff;
    return a.timestamp.getTime() - b.timestamp.getTime();
  });
}

/**
 * Filter audit entries by category
 */
export function filterAuditEntriesByCategory(
  entries: AuditEntry[],
  category: AuditEntry['category']
): AuditEntry[] {
  return entries.filter(entry => entry.category === category);
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: AuditEntry['category']): string {
  const names: Record<AuditEntry['category'], string> = {
    input: 'Inputs',
    geometry: 'Geometry Calculations',
    volume: 'Volume Calculations',
    production: 'Production Calculations',
    duration: 'Duration & Summary',
  };
  return names[category];
}
