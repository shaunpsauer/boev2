// ============================================
// Soil Classification Configuration
// ============================================

import type { SoilType } from '../types';

/**
 * Soil Type Configuration
 * Based on OSHA soil classification system
 */
export interface SoilTypeConfig {
  id: SoilType;
  name: string;
  description: string;
  slopeRatio: number; // Horizontal:Vertical (e.g., 1.0 means 1H:1V)
  swellFactor: number; // Percentage increase when excavated (e.g., 0.25 = 25%)
  unitsWeight: number; // Approximate unit weight (pcf)
  cohesion: 'high' | 'medium' | 'low' | 'none';
}

export const SOIL_TYPES: Record<SoilType, SoilTypeConfig> = {
  stable_rock: {
    id: 'stable_rock',
    name: 'Stable Rock',
    description: 'Natural solid mineral material that can be excavated with vertical sides',
    slopeRatio: 0, // Vertical walls allowed
    swellFactor: 0.5, // 50% swell
    unitsWeight: 165,
    cohesion: 'high',
  },
  type_a: {
    id: 'type_a',
    name: 'Type A',
    description: 'Cohesive soil with unconfined compressive strength of 1.5 tsf or greater',
    slopeRatio: 0.75, // 0.75H:1V (3/4:1)
    swellFactor: 0.25, // 25% swell
    unitsWeight: 130,
    cohesion: 'high',
  },
  type_b: {
    id: 'type_b',
    name: 'Type B',
    description: 'Cohesive soil with unconfined compressive strength between 0.5 and 1.5 tsf',
    slopeRatio: 1.0, // 1H:1V (1:1)
    swellFactor: 0.25, // 25% swell
    unitsWeight: 120,
    cohesion: 'medium',
  },
  type_c: {
    id: 'type_c',
    name: 'Type C',
    description: 'Cohesive soil with unconfined compressive strength of 0.5 tsf or less, or granular soils',
    slopeRatio: 1.5, // 1.5H:1V (1-1/2:1)
    swellFactor: 0.3, // 30% swell
    unitsWeight: 110,
    cohesion: 'low',
  },
};

/**
 * Get soil configuration by type
 */
export function getSoilConfig(soilType: SoilType): SoilTypeConfig {
  return SOIL_TYPES[soilType];
}

/**
 * Get slope ratio for a soil type
 * @param soilType The soil type
 * @returns Slope ratio (horizontal:vertical)
 */
export function getSlopeRatio(soilType: SoilType): number {
  return SOIL_TYPES[soilType].slopeRatio;
}

/**
 * Get swell factor for a soil type
 * @param soilType The soil type
 * @returns Swell factor as decimal (e.g., 0.25 for 25%)
 */
export function getSwellFactor(soilType: SoilType): number {
  return SOIL_TYPES[soilType].swellFactor;
}

/**
 * Calculate top width from bottom width, depth, and slope ratio
 * @param bottomWidth Bottom width in feet
 * @param depth Trench depth in feet
 * @param slopeRatio Horizontal:Vertical ratio
 * @returns Top width in feet
 */
export function calculateTopWidth(
  bottomWidth: number,
  depth: number,
  slopeRatio: number
): number {
  // For each foot of depth, the trench expands by slopeRatio feet on each side
  const expansion = depth * slopeRatio * 2; // Both sides
  return bottomWidth + expansion;
}

/**
 * Check if excavation is sloped (requires wider top than bottom)
 * @param slopeRatio The slope ratio
 * @returns true if sloped excavation is required
 */
export function isSloped(slopeRatio: number): boolean {
  return slopeRatio > 0;
}

/**
 * Available soil types for dropdown selection
 */
export const AVAILABLE_SOIL_TYPES = Object.values(SOIL_TYPES).map(config => ({
  value: config.id,
  label: config.name,
  description: config.description,
}));
