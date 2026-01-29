// ============================================
// Excavation Calculator Type Definitions
// ============================================

// --- Enums and Constants ---

export type ExcavationType = 'trench' | 'bell_hole' | 'pothole';

export type SoilType = 'stable_rock' | 'type_a' | 'type_b' | 'type_c';

export type ProximityScenario = 'no_conflict' | 'parallel' | 'crossing' | 'exposure';

export type HandDigMethod = 'hand_tools' | 'vacuum';

export type ExcavatorClass = 'micro' | 'mini' | 'small' | 'medium' | 'large';

// --- Input Types ---

export interface PipeInput {
  nps: number; // Nominal Pipe Size (inches)
  od: number; // Outside Diameter (inches) - auto-calculated or manual override
  odManualOverride: boolean;
}

export interface GeometryInput {
  length: number; // Linear feet
  depth: number; // Feet - auto-calculated or manual override
  depthManualOverride: boolean;
  bottomWidth: number; // Feet - auto-calculated or manual override
  bottomWidthManualOverride: boolean;
  coverToTop: number; // Cover to top of pipe (feet)
}

export interface SoilInput {
  soilType: SoilType;
  slopeRatio: number; // Horizontal:Vertical (e.g., 1.0 means 1:1)
  slopeRatioManualOverride: boolean;
}

export interface HandDigInput {
  proximityScenario: ProximityScenario;
  toleranceZoneWidth: number; // Feet
  bufferLengthEachSide: number; // Feet
  verticalExtent: 'full_depth' | 'pipe_zone';
  method: HandDigMethod;
  manualOverride: boolean;
  overrideType?: 'fixed_cy' | 'percentage';
  overrideValue?: number;
}

export interface CrewInput {
  operators: number;
  laborers: number;
  foreman: boolean;
  spotter: boolean;
  competentPerson: boolean;
}

export interface ScheduleInput {
  hoursPerDay: number;
  shiftsPerDay: number;
  workingDaysPerWeek: number;
}

export interface EquipmentInput {
  excavatorClass: ExcavatorClass;
  bucketWidth: number; // Inches
  useVacuumTruck: boolean;
  useSawcut: boolean;
  sawcutLength: number; // Linear feet
}

// --- Complete Form Input ---

export interface ExcavationInputs {
  projectName: string;
  excavationType: ExcavationType;
  pipe: PipeInput;
  geometry: GeometryInput;
  soil: SoilInput;
  handDig: HandDigInput;
  crew: CrewInput;
  schedule: ScheduleInput;
  equipment: EquipmentInput;
}

// --- Calculation Result Types ---

export interface GeometryResult {
  bottomWidth: number; // Feet
  topWidth: number; // Feet
  depth: number; // Feet
  length: number; // Feet
  beddingDepth: number; // Feet
  crossSectionArea: number; // Square feet
  isSloped: boolean;
}

export interface VolumeResult {
  bankVolume: number; // Cubic yards
  looseVolume: number; // Cubic yards
  swellFactor: number;
  machineDigVolume: number; // Cubic yards
  handDigVolume: number; // Cubic yards
}

export interface ProductionResult {
  machineRate: number; // CY/hr
  handRate: number; // CY/hr per laborer
  machineHours: number;
  handHours: number;
  sawcutHours: number;
  vacuumHours: number;
  totalEquipmentHours: number;
  totalLaborHours: number;
}

export interface DurationResult {
  machineDuration: number; // Workdays
  handDuration: number; // Workdays
  totalDuration: number; // Workdays
  criticalPath: 'machine' | 'hand';
}

export interface CrewSummary {
  operatorHours: number;
  laborerHours: number;
  foremanHours: number;
  spotterHours: number;
  competentPersonHours: number;
  totalLaborHours: number;
}

export interface EquipmentSummary {
  excavatorHours: number;
  vacuumTruckHours: number;
  sawcutEquipmentHours: number;
  totalEquipmentHours: number;
}

// --- Audit Trail Types ---

export interface AuditEntry {
  id: string;
  category: 'geometry' | 'volume' | 'production' | 'duration' | 'input';
  title: string;
  description: string;
  formula?: string;
  inputValues?: Record<string, string | number>;
  result?: string | number;
  timestamp: Date;
}

// --- Complete Calculation Result ---

export interface CalculationResult {
  id: string;
  timestamp: Date;
  inputs: ExcavationInputs;
  geometry: GeometryResult;
  volume: VolumeResult;
  production: ProductionResult;
  duration: DurationResult;
  crewSummary: CrewSummary;
  equipmentSummary: EquipmentSummary;
  auditTrail: AuditEntry[];
}

// --- Storage Types ---

export interface StoredCalculation {
  id: string;
  name: string;
  timestamp: Date;
  inputs: ExcavationInputs;
  results: CalculationResult;
}

// --- UI State Types ---

export interface CalculatorState {
  inputs: ExcavationInputs;
  results: CalculationResult | null;
  isCalculating: boolean;
  hasCalculated: boolean;
  errors: Record<string, string>;
}

// --- Default Values ---

export const DEFAULT_INPUTS: ExcavationInputs = {
  projectName: 'New Excavation Project',
  excavationType: 'trench',
  pipe: {
    nps: 4,
    od: 4.5,
    odManualOverride: false,
  },
  geometry: {
    length: 100,
    depth: 4,
    depthManualOverride: false,
    bottomWidth: 2,
    bottomWidthManualOverride: false,
    coverToTop: 3,
  },
  soil: {
    soilType: 'type_b',
    slopeRatio: 1.0,
    slopeRatioManualOverride: false,
  },
  handDig: {
    proximityScenario: 'no_conflict',
    toleranceZoneWidth: 2,
    bufferLengthEachSide: 2,
    verticalExtent: 'full_depth',
    method: 'hand_tools',
    manualOverride: false,
  },
  crew: {
    operators: 1,
    laborers: 2,
    foreman: false,
    spotter: false,
    competentPerson: true,
  },
  schedule: {
    hoursPerDay: 8,
    shiftsPerDay: 1,
    workingDaysPerWeek: 5,
  },
  equipment: {
    excavatorClass: 'mini',
    bucketWidth: 24,
    useVacuumTruck: false,
    useSawcut: false,
    sawcutLength: 0,
  },
};
