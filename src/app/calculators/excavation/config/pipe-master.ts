// ============================================
// Pipe Master Data Configuration
// ============================================

/**
 * NPS to OD Lookup Table
 * Maps Nominal Pipe Size (NPS) to Outside Diameter (OD) in inches
 * Based on standard steel pipe dimensions
 */
export const NPS_TO_OD: Record<number, number> = {
  0.5: 0.84,
  0.75: 1.05,
  1: 1.315,
  1.25: 1.66,
  1.5: 1.9,
  2: 2.375,
  2.5: 2.875,
  3: 3.5,
  3.5: 4.0,
  4: 4.5,
  5: 5.563,
  6: 6.625,
  8: 8.625,
  10: 10.75,
  12: 12.75,
  14: 14.0,
  16: 16.0,
  18: 18.0,
  20: 20.0,
  22: 22.0,
  24: 24.0,
  26: 26.0,
  28: 28.0,
  30: 30.0,
  32: 32.0,
  34: 34.0,
  36: 36.0,
  42: 42.0,
  48: 48.0,
};

/**
 * Available NPS sizes for dropdown selection
 */
export const AVAILABLE_NPS_SIZES = Object.keys(NPS_TO_OD).map(Number).sort((a, b) => a - b);

/**
 * Side Clearance Rules by OD Range
 * Defines minimum clearance on each side of the pipe based on OD
 * Returns clearance in inches
 */
export interface SideClearanceRule {
  minOD: number; // Minimum OD (inclusive)
  maxOD: number; // Maximum OD (exclusive)
  clearance: number; // Clearance per side in inches
}

export const SIDE_CLEARANCE_RULES: SideClearanceRule[] = [
  { minOD: 0, maxOD: 6, clearance: 6 },       // Up to 6" OD: 6" each side
  { minOD: 6, maxOD: 12, clearance: 9 },      // 6" to 12" OD: 9" each side
  { minOD: 12, maxOD: 24, clearance: 12 },    // 12" to 24" OD: 12" each side
  { minOD: 24, maxOD: 36, clearance: 18 },    // 24" to 36" OD: 18" each side
  { minOD: 36, maxOD: Infinity, clearance: 24 }, // 36"+ OD: 24" each side
];

/**
 * Get OD from NPS
 */
export function getODFromNPS(nps: number): number | undefined {
  return NPS_TO_OD[nps];
}

/**
 * Get side clearance based on OD
 * @param od Outside diameter in inches
 * @returns Clearance per side in inches
 */
export function getSideClearance(od: number): number {
  const rule = SIDE_CLEARANCE_RULES.find(r => od >= r.minOD && od < r.maxOD);
  return rule ? rule.clearance : 12; // Default to 12" if no rule found
}

/**
 * Calculate trench bottom width from OD
 * @param od Outside diameter in inches
 * @returns Bottom width in feet
 */
export function calculateBottomWidth(od: number): number {
  const clearance = getSideClearance(od);
  const bottomWidthInches = od + (2 * clearance);
  return bottomWidthInches / 12; // Convert to feet
}

/**
 * Calculate bedding depth
 * Rule: max(OD ÷ 3, 4 inches)
 * @param od Outside diameter in inches
 * @returns Bedding depth in feet
 */
export function calculateBeddingDepth(od: number): number {
  const beddingInches = Math.max(od / 3, 4);
  return beddingInches / 12; // Convert to feet
}

/**
 * Calculate trench depth from pipe parameters
 * @param coverToTop Cover from surface to top of pipe (feet)
 * @param od Outside diameter (inches)
 * @param workingClearance Additional working clearance below pipe (inches, default 4)
 * @returns Total trench depth in feet
 */
export function calculateTrenchDepth(
  coverToTop: number,
  od: number,
  workingClearance: number = 4
): number {
  const odFeet = od / 12;
  const beddingDepth = calculateBeddingDepth(od);
  const workingClearanceFeet = workingClearance / 12;
  
  return coverToTop + odFeet + beddingDepth + workingClearanceFeet;
}
