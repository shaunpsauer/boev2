// ============================================
// Form Validation Schema
// ============================================

import { z } from 'zod';

// Pipe input schema
export const pipeInputSchema = z.object({
  nps: z.number().positive('NPS must be positive'),
  od: z.number().positive('OD must be positive'),
  odManualOverride: z.boolean(),
});

// Geometry input schema
export const geometryInputSchema = z.object({
  length: z.number().positive('Length must be positive'),
  depth: z.number().positive('Depth must be positive'),
  depthManualOverride: z.boolean(),
  bottomWidth: z.number().positive('Bottom width must be positive'),
  bottomWidthManualOverride: z.boolean(),
  coverToTop: z.number().min(0, 'Cover cannot be negative'),
});

// Soil input schema
export const soilInputSchema = z.object({
  soilType: z.enum(['stable_rock', 'type_a', 'type_b', 'type_c']),
  slopeRatio: z.number().min(0, 'Slope ratio cannot be negative'),
  slopeRatioManualOverride: z.boolean(),
});

// Hand dig input schema
export const handDigInputSchema = z.object({
  proximityScenario: z.enum(['no_conflict', 'parallel', 'crossing', 'exposure']),
  toleranceZoneWidth: z.number().min(0, 'Tolerance zone width cannot be negative'),
  bufferLengthEachSide: z.number().min(0, 'Buffer length cannot be negative'),
  verticalExtent: z.enum(['full_depth', 'pipe_zone']),
  method: z.enum(['hand_tools', 'vacuum']),
  manualOverride: z.boolean(),
  overrideType: z.enum(['fixed_cy', 'percentage']).optional(),
  overrideValue: z.number().optional(),
});

// Crew input schema
export const crewInputSchema = z.object({
  operators: z.number().int().min(1, 'At least one operator is required'),
  laborers: z.number().int().min(1, 'At least one laborer is required'),
  foreman: z.boolean(),
  spotter: z.boolean(),
  competentPerson: z.boolean(),
});

// Schedule input schema
export const scheduleInputSchema = z.object({
  hoursPerDay: z.number().min(1, 'Must be at least 1 hour').max(24, 'Cannot exceed 24 hours'),
  shiftsPerDay: z.number().int().min(1, 'Must be at least 1 shift').max(3, 'Cannot exceed 3 shifts'),
  workingDaysPerWeek: z.number().int().min(1, 'Must be at least 1 day').max(7, 'Cannot exceed 7 days'),
});

// Equipment input schema
export const equipmentInputSchema = z.object({
  excavatorClass: z.enum(['micro', 'mini', 'small', 'medium', 'large']),
  bucketWidth: z.number().positive('Bucket width must be positive'),
  useVacuumTruck: z.boolean(),
  useSawcut: z.boolean(),
  sawcutLength: z.number().min(0, 'Sawcut length cannot be negative'),
});

// Complete excavation inputs schema
export const excavationInputsSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  excavationType: z.enum(['trench', 'bell_hole', 'pothole']),
  pipe: pipeInputSchema,
  geometry: geometryInputSchema,
  soil: soilInputSchema,
  handDig: handDigInputSchema,
  crew: crewInputSchema,
  schedule: scheduleInputSchema,
  equipment: equipmentInputSchema,
});

export type ExcavationInputsSchema = z.infer<typeof excavationInputsSchema>;

/**
 * Validate inputs and return errors
 */
export function validateExcavationInputs(inputs: unknown): {
  isValid: boolean;
  errors: Record<string, string>;
  data?: ExcavationInputsSchema;
} {
  const result = excavationInputsSchema.safeParse(inputs);
  
  if (result.success) {
    return { isValid: true, errors: {}, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  
  return { isValid: false, errors };
}
