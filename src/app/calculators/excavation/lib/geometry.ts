// ============================================
// Geometry Calculations
// ============================================

import type { ExcavationInputs, GeometryResult, AuditEntry } from '../types';
import { calculateBottomWidth, calculateBeddingDepth, calculateTrenchDepth, getODFromNPS } from '../config/pipe-master';
import { getSlopeRatio, calculateTopWidth, isSloped as checkIsSloped } from '../config/soil-classification';

/**
 * Calculate all geometry parameters for an excavation
 * @param inputs The excavation inputs
 * @returns Geometry result with audit entries
 */
export function calculateGeometry(inputs: ExcavationInputs): {
  result: GeometryResult;
  auditEntries: AuditEntry[];
} {
  const auditEntries: AuditEntry[] = [];
  const now = new Date();

  // Get pipe OD (auto or manual override)
  let od = inputs.pipe.od;
  if (!inputs.pipe.odManualOverride) {
    const autoOD = getODFromNPS(inputs.pipe.nps);
    if (autoOD) {
      od = autoOD;
      auditEntries.push({
        id: `geo-od-${Date.now()}`,
        category: 'geometry',
        title: 'Pipe OD Lookup',
        description: `Auto-calculated OD from NPS ${inputs.pipe.nps}"`,
        formula: `OD = NPS_TO_OD[${inputs.pipe.nps}]`,
        inputValues: { nps: inputs.pipe.nps },
        result: `${od}"`,
        timestamp: now,
      });
    }
  } else {
    auditEntries.push({
      id: `geo-od-manual-${Date.now()}`,
      category: 'input',
      title: 'Pipe OD (Manual)',
      description: 'OD manually entered',
      inputValues: { od: inputs.pipe.od },
      result: `${od}"`,
      timestamp: now,
    });
  }

  // Calculate bedding depth
  const beddingDepth = calculateBeddingDepth(od);
  auditEntries.push({
    id: `geo-bedding-${Date.now()}`,
    category: 'geometry',
    title: 'Bedding Depth',
    description: 'Calculated bedding depth using max(OD/3, 4")',
    formula: `max(${od}" ÷ 3, 4") = ${(beddingDepth * 12).toFixed(2)}"`,
    inputValues: { od },
    result: `${beddingDepth.toFixed(3)} ft`,
    timestamp: now,
  });

  // Calculate bottom width (auto or manual override)
  let bottomWidth = inputs.geometry.bottomWidth;
  if (!inputs.geometry.bottomWidthManualOverride) {
    bottomWidth = calculateBottomWidth(od);
    auditEntries.push({
      id: `geo-bottom-${Date.now()}`,
      category: 'geometry',
      title: 'Bottom Width',
      description: 'Auto-calculated from OD and clearance rules',
      formula: `(OD + 2 × clearance) ÷ 12`,
      inputValues: { od },
      result: `${bottomWidth.toFixed(2)} ft`,
      timestamp: now,
    });
  } else {
    auditEntries.push({
      id: `geo-bottom-manual-${Date.now()}`,
      category: 'input',
      title: 'Bottom Width (Manual)',
      description: 'Bottom width manually entered',
      inputValues: { bottomWidth: inputs.geometry.bottomWidth },
      result: `${bottomWidth.toFixed(2)} ft`,
      timestamp: now,
    });
  }

  // Calculate depth (auto or manual override)
  let depth = inputs.geometry.depth;
  if (!inputs.geometry.depthManualOverride) {
    depth = calculateTrenchDepth(inputs.geometry.coverToTop, od);
    auditEntries.push({
      id: `geo-depth-${Date.now()}`,
      category: 'geometry',
      title: 'Trench Depth',
      description: 'Auto-calculated from cover + pipe OD + bedding + clearance',
      formula: `cover + OD + bedding + working clearance`,
      inputValues: { 
        coverToTop: inputs.geometry.coverToTop,
        od,
        beddingDepth: beddingDepth.toFixed(3),
      },
      result: `${depth.toFixed(2)} ft`,
      timestamp: now,
    });
  } else {
    auditEntries.push({
      id: `geo-depth-manual-${Date.now()}`,
      category: 'input',
      title: 'Trench Depth (Manual)',
      description: 'Depth manually entered',
      inputValues: { depth: inputs.geometry.depth },
      result: `${depth.toFixed(2)} ft`,
      timestamp: now,
    });
  }

  // Get slope ratio (auto or manual override)
  let slopeRatio = inputs.soil.slopeRatio;
  if (!inputs.soil.slopeRatioManualOverride) {
    slopeRatio = getSlopeRatio(inputs.soil.soilType);
    auditEntries.push({
      id: `geo-slope-${Date.now()}`,
      category: 'geometry',
      title: 'Slope Ratio',
      description: `Auto-selected from soil type ${inputs.soil.soilType}`,
      inputValues: { soilType: inputs.soil.soilType },
      result: `${slopeRatio}H:1V`,
      timestamp: now,
    });
  } else {
    auditEntries.push({
      id: `geo-slope-manual-${Date.now()}`,
      category: 'input',
      title: 'Slope Ratio (Manual)',
      description: 'Slope ratio manually entered',
      inputValues: { slopeRatio: inputs.soil.slopeRatio },
      result: `${slopeRatio}H:1V`,
      timestamp: now,
    });
  }

  // Calculate top width
  const isSloped = checkIsSloped(slopeRatio);
  const topWidth = isSloped 
    ? calculateTopWidth(bottomWidth, depth, slopeRatio)
    : bottomWidth;

  if (isSloped) {
    auditEntries.push({
      id: `geo-top-${Date.now()}`,
      category: 'geometry',
      title: 'Top Width',
      description: 'Calculated from bottom width, depth, and slope ratio',
      formula: `${bottomWidth.toFixed(2)} + (${depth.toFixed(2)} × ${slopeRatio} × 2)`,
      inputValues: { bottomWidth, depth, slopeRatio },
      result: `${topWidth.toFixed(2)} ft`,
      timestamp: now,
    });
  }

  // Calculate cross-section area (trapezoidal for sloped, rectangular for vertical)
  const crossSectionArea = isSloped
    ? ((bottomWidth + topWidth) / 2) * depth
    : bottomWidth * depth;

  auditEntries.push({
    id: `geo-area-${Date.now()}`,
    category: 'geometry',
    title: 'Cross-Section Area',
    description: isSloped ? 'Trapezoidal cross-section' : 'Rectangular cross-section',
    formula: isSloped 
      ? `((${bottomWidth.toFixed(2)} + ${topWidth.toFixed(2)}) ÷ 2) × ${depth.toFixed(2)}`
      : `${bottomWidth.toFixed(2)} × ${depth.toFixed(2)}`,
    result: `${crossSectionArea.toFixed(2)} sq ft`,
    timestamp: now,
  });

  const result: GeometryResult = {
    bottomWidth,
    topWidth,
    depth,
    length: inputs.geometry.length,
    beddingDepth,
    crossSectionArea,
    isSloped,
  };

  return { result, auditEntries };
}

/**
 * Calculate bank volume from geometry
 * Volume = Cross-section area × length (in cubic feet)
 * Convert to cubic yards (divide by 27)
 */
export function calculateBankVolume(geometry: GeometryResult): number {
  const volumeCuFt = geometry.crossSectionArea * geometry.length;
  return volumeCuFt / 27; // Convert to cubic yards
}

/**
 * Calculate loose volume from bank volume and swell factor
 */
export function calculateLooseVolume(bankVolume: number, swellFactor: number): number {
  return bankVolume * (1 + swellFactor);
}
