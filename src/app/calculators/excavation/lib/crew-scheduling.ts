// ============================================
// Crew Scheduling Calculations
// ============================================

import type { 
  ExcavationInputs, 
  ProductionResult, 
  DurationResult, 
  CrewSummary, 
  EquipmentSummary,
  AuditEntry 
} from '../types';

/**
 * Calculate duration and crew/equipment summaries
 * @param inputs Excavation inputs
 * @param production Production result
 * @returns Duration result, crew summary, equipment summary, and audit entries
 */
export function calculateDurationAndSummaries(
  inputs: ExcavationInputs,
  production: ProductionResult
): {
  duration: DurationResult;
  crewSummary: CrewSummary;
  equipmentSummary: EquipmentSummary;
  auditEntries: AuditEntry[];
} {
  const auditEntries: AuditEntry[] = [];
  const now = new Date();

  const { hoursPerDay, shiftsPerDay } = inputs.schedule;
  const effectiveHoursPerDay = hoursPerDay * shiftsPerDay;

  // Calculate machine duration
  // Machine duration = Machine hours ÷ (operators × hours/day)
  const operatorCapacity = inputs.crew.operators * effectiveHoursPerDay;
  const machineDuration = operatorCapacity > 0 
    ? production.machineHours / operatorCapacity 
    : 0;

  auditEntries.push({
    id: `dur-machine-${Date.now()}`,
    category: 'duration',
    title: 'Machine Duration',
    description: 'Workdays for machine excavation',
    formula: `${production.machineHours.toFixed(2)} hrs ÷ (${inputs.crew.operators} operators × ${effectiveHoursPerDay} hrs/day)`,
    inputValues: {
      machineHours: `${production.machineHours.toFixed(2)} hrs`,
      operators: inputs.crew.operators,
      hoursPerDay: effectiveHoursPerDay,
    },
    result: `${machineDuration.toFixed(2)} workdays`,
    timestamp: now,
  });

  // Calculate hand dig duration
  // Hand duration = Hand hours ÷ (laborers × hours/day)
  // Note: hand hours is already the total for all laborers working together
  const handDuration = effectiveHoursPerDay > 0 
    ? production.handHours / effectiveHoursPerDay 
    : 0;

  if (production.handHours > 0) {
    auditEntries.push({
      id: `dur-hand-${Date.now()}`,
      category: 'duration',
      title: 'Hand Dig Duration',
      description: 'Workdays for hand excavation',
      formula: `${production.handHours.toFixed(2)} hrs ÷ ${effectiveHoursPerDay} hrs/day`,
      inputValues: {
        handHours: `${production.handHours.toFixed(2)} hrs`,
        hoursPerDay: effectiveHoursPerDay,
      },
      result: `${handDuration.toFixed(2)} workdays`,
      timestamp: now,
    });
  }

  // Determine critical path and total duration
  const criticalPath: 'machine' | 'hand' = machineDuration >= handDuration ? 'machine' : 'hand';
  const totalDuration = Math.max(machineDuration, handDuration);

  auditEntries.push({
    id: `dur-critical-${Date.now()}`,
    category: 'duration',
    title: 'Critical Path',
    description: `${criticalPath === 'machine' ? 'Machine excavation' : 'Hand excavation'} controls duration`,
    result: `${totalDuration.toFixed(2)} workdays`,
    timestamp: now,
  });

  // Calculate crew summary
  const totalWorkHours = totalDuration * effectiveHoursPerDay;
  
  const operatorHours = production.machineHours + production.vacuumHours;
  const laborerHours = (production.handHours * inputs.crew.laborers) + production.machineHours;
  const foremanHours = inputs.crew.foreman ? totalWorkHours : 0;
  const spotterHours = inputs.crew.spotter ? production.machineHours : 0;
  const competentPersonHours = inputs.crew.competentPerson ? totalWorkHours : 0;
  const totalLaborHours = operatorHours + laborerHours + foremanHours + spotterHours + competentPersonHours;

  auditEntries.push({
    id: `crew-summary-${Date.now()}`,
    category: 'duration',
    title: 'Crew Hours Summary',
    description: 'Total labor hours by role',
    inputValues: {
      operators: inputs.crew.operators,
      laborers: inputs.crew.laborers,
      foreman: inputs.crew.foreman ? 'Yes' : 'No',
      spotter: inputs.crew.spotter ? 'Yes' : 'No',
      competentPerson: inputs.crew.competentPerson ? 'Yes' : 'No',
    },
    result: `Total: ${totalLaborHours.toFixed(2)} labor-hours`,
    timestamp: now,
  });

  // Calculate equipment summary
  const excavatorHours = production.machineHours;
  const vacuumTruckHours = production.vacuumHours;
  const sawcutEquipmentHours = production.sawcutHours;
  const totalEquipmentHours = excavatorHours + vacuumTruckHours + sawcutEquipmentHours;

  auditEntries.push({
    id: `equip-summary-${Date.now()}`,
    category: 'duration',
    title: 'Equipment Hours Summary',
    description: 'Total equipment hours by type',
    result: `Total: ${totalEquipmentHours.toFixed(2)} equipment-hours`,
    timestamp: now,
  });

  return {
    duration: {
      machineDuration,
      handDuration,
      totalDuration,
      criticalPath,
    },
    crewSummary: {
      operatorHours,
      laborerHours,
      foremanHours,
      spotterHours,
      competentPersonHours,
      totalLaborHours,
    },
    equipmentSummary: {
      excavatorHours,
      vacuumTruckHours,
      sawcutEquipmentHours,
      totalEquipmentHours,
    },
    auditEntries,
  };
}

/**
 * Convert workdays to calendar days
 * @param workdays Number of workdays
 * @param workingDaysPerWeek Working days per week
 * @returns Calendar days
 */
export function workdaysToCalendarDays(
  workdays: number,
  workingDaysPerWeek: number
): number {
  if (workingDaysPerWeek >= 7) return workdays;
  
  const fullWeeks = Math.floor(workdays / workingDaysPerWeek);
  const remainingWorkdays = workdays % workingDaysPerWeek;
  
  return (fullWeeks * 7) + remainingWorkdays;
}
