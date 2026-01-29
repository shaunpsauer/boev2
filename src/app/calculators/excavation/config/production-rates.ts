// ============================================
// Production Rates Configuration
// ============================================

import type { SoilType, ExcavatorClass } from '../types';

/**
 * Machine Excavation Production Rates
 * Indexed by excavator class and soil type
 * Values in cubic yards per hour (CY/hr)
 */
export interface MachineProductionRate {
  excavatorClass: ExcavatorClass;
  soilType: SoilType;
  rate: number; // CY/hr
}

/**
 * Machine production rates table
 * Based on typical production rates for various excavator sizes and soil conditions
 */
export const MACHINE_PRODUCTION_RATES: Record<ExcavatorClass, Record<SoilType, number>> = {
  micro: {
    stable_rock: 3,
    type_a: 8,
    type_b: 10,
    type_c: 12,
  },
  mini: {
    stable_rock: 6,
    type_a: 15,
    type_b: 20,
    type_c: 25,
  },
  small: {
    stable_rock: 10,
    type_a: 25,
    type_b: 35,
    type_c: 45,
  },
  medium: {
    stable_rock: 15,
    type_a: 40,
    type_b: 55,
    type_c: 70,
  },
  large: {
    stable_rock: 25,
    type_a: 60,
    type_b: 80,
    type_c: 100,
  },
};

/**
 * Hand Excavation Production Rates
 * Indexed by soil type
 * Values in cubic yards per hour per laborer (CY/hr/laborer)
 */
export const HAND_PRODUCTION_RATES: Record<SoilType, number> = {
  stable_rock: 0.1, // Very slow - essentially requires breaking
  type_a: 0.3,
  type_b: 0.4,
  type_c: 0.5,
};

/**
 * Vacuum Excavation Production Rates
 * Indexed by soil type
 * Values in cubic yards per hour (CY/hr)
 */
export const VACUUM_PRODUCTION_RATES: Record<SoilType, number> = {
  stable_rock: 2,
  type_a: 5,
  type_b: 7,
  type_c: 10,
};

/**
 * Sawcut Production Rate
 * Linear feet per hour
 */
export const SAWCUT_RATE = 100; // LF/hr

/**
 * Get machine production rate
 * @param excavatorClass The excavator class
 * @param soilType The soil type
 * @returns Production rate in CY/hr
 */
export function getMachineProductionRate(
  excavatorClass: ExcavatorClass,
  soilType: SoilType
): number {
  return MACHINE_PRODUCTION_RATES[excavatorClass][soilType];
}

/**
 * Get hand excavation production rate
 * @param soilType The soil type
 * @returns Production rate in CY/hr per laborer
 */
export function getHandProductionRate(soilType: SoilType): number {
  return HAND_PRODUCTION_RATES[soilType];
}

/**
 * Get vacuum excavation production rate
 * @param soilType The soil type
 * @returns Production rate in CY/hr
 */
export function getVacuumProductionRate(soilType: SoilType): number {
  return VACUUM_PRODUCTION_RATES[soilType];
}

/**
 * Calculate machine hours
 * @param volume Volume in cubic yards
 * @param excavatorClass The excavator class
 * @param soilType The soil type
 * @returns Hours required
 */
export function calculateMachineHours(
  volume: number,
  excavatorClass: ExcavatorClass,
  soilType: SoilType
): number {
  const rate = getMachineProductionRate(excavatorClass, soilType);
  return rate > 0 ? volume / rate : 0;
}

/**
 * Calculate hand excavation hours
 * @param volume Volume in cubic yards
 * @param soilType The soil type
 * @param laborers Number of laborers
 * @returns Hours required
 */
export function calculateHandHours(
  volume: number,
  soilType: SoilType,
  laborers: number
): number {
  const ratePerLaborer = getHandProductionRate(soilType);
  const totalRate = ratePerLaborer * laborers;
  return totalRate > 0 ? volume / totalRate : 0;
}

/**
 * Calculate vacuum excavation hours
 * @param volume Volume in cubic yards
 * @param soilType The soil type
 * @returns Hours required
 */
export function calculateVacuumHours(
  volume: number,
  soilType: SoilType
): number {
  const rate = getVacuumProductionRate(soilType);
  return rate > 0 ? volume / rate : 0;
}

/**
 * Calculate sawcut hours
 * @param linearFeet Length to sawcut in linear feet
 * @returns Hours required
 */
export function calculateSawcutHours(linearFeet: number): number {
  return SAWCUT_RATE > 0 ? linearFeet / SAWCUT_RATE : 0;
}
