// ============================================
// Equipment Specifications Configuration
// ============================================

import type { ExcavatorClass } from '../types';

/**
 * Excavator Specification
 */
export interface ExcavatorSpec {
  class: ExcavatorClass;
  name: string;
  description: string;
  operatingWeight: { min: number; max: number }; // Pounds
  bucketWidthRange: { min: number; max: number }; // Inches
  bucketCapacityRange: { min: number; max: number }; // Cubic yards
  maxDigDepth: number; // Feet
  reachAtGround: number; // Feet
  typicalApplications: string[];
}

export const EXCAVATOR_SPECS: Record<ExcavatorClass, ExcavatorSpec> = {
  micro: {
    class: 'micro',
    name: 'Micro Excavator',
    description: 'Compact excavator for tight spaces and light work',
    operatingWeight: { min: 2000, max: 4000 },
    bucketWidthRange: { min: 12, max: 18 },
    bucketCapacityRange: { min: 0.02, max: 0.06 },
    maxDigDepth: 6,
    reachAtGround: 10,
    typicalApplications: [
      'Interior demolition',
      'Backyard excavation',
      'Narrow trenches',
      'Landscaping',
    ],
  },
  mini: {
    class: 'mini',
    name: 'Mini Excavator',
    description: 'Versatile compact excavator for residential and light commercial',
    operatingWeight: { min: 4000, max: 12000 },
    bucketWidthRange: { min: 18, max: 30 },
    bucketCapacityRange: { min: 0.06, max: 0.2 },
    maxDigDepth: 10,
    reachAtGround: 15,
    typicalApplications: [
      'Utility trenches',
      'Foundation work',
      'Pipe installation',
      'Small site preparation',
    ],
  },
  small: {
    class: 'small',
    name: 'Small Excavator',
    description: 'Mid-size excavator for commercial and utility work',
    operatingWeight: { min: 12000, max: 25000 },
    bucketWidthRange: { min: 24, max: 42 },
    bucketCapacityRange: { min: 0.2, max: 0.5 },
    maxDigDepth: 15,
    reachAtGround: 22,
    typicalApplications: [
      'Large utility installation',
      'Road construction',
      'Storm drainage',
      'Commercial site work',
    ],
  },
  medium: {
    class: 'medium',
    name: 'Medium Excavator',
    description: 'Standard excavator for heavy commercial and infrastructure',
    operatingWeight: { min: 25000, max: 50000 },
    bucketWidthRange: { min: 36, max: 60 },
    bucketCapacityRange: { min: 0.5, max: 1.25 },
    maxDigDepth: 22,
    reachAtGround: 32,
    typicalApplications: [
      'Major pipeline work',
      'Highway construction',
      'Large-scale grading',
      'Deep excavation',
    ],
  },
  large: {
    class: 'large',
    name: 'Large Excavator',
    description: 'Heavy excavator for major infrastructure and mining',
    operatingWeight: { min: 50000, max: 100000 },
    bucketWidthRange: { min: 48, max: 84 },
    bucketCapacityRange: { min: 1.0, max: 3.0 },
    maxDigDepth: 30,
    reachAtGround: 42,
    typicalApplications: [
      'Major infrastructure',
      'Mining operations',
      'Large pipeline',
      'Mass excavation',
    ],
  },
};

/**
 * Bucket Specifications
 */
export interface BucketSpec {
  width: number; // Inches
  capacity: number; // Cubic yards
  applicableClasses: ExcavatorClass[];
}

/**
 * Standard bucket widths available
 */
export const STANDARD_BUCKET_WIDTHS: BucketSpec[] = [
  { width: 12, capacity: 0.03, applicableClasses: ['micro'] },
  { width: 18, capacity: 0.06, applicableClasses: ['micro', 'mini'] },
  { width: 24, capacity: 0.12, applicableClasses: ['mini', 'small'] },
  { width: 30, capacity: 0.18, applicableClasses: ['mini', 'small'] },
  { width: 36, capacity: 0.3, applicableClasses: ['small', 'medium'] },
  { width: 42, capacity: 0.4, applicableClasses: ['small', 'medium'] },
  { width: 48, capacity: 0.6, applicableClasses: ['medium', 'large'] },
  { width: 60, capacity: 0.9, applicableClasses: ['medium', 'large'] },
  { width: 72, capacity: 1.5, applicableClasses: ['large'] },
  { width: 84, capacity: 2.0, applicableClasses: ['large'] },
];

/**
 * Get excavator specification
 * @param excavatorClass The excavator class
 * @returns Excavator specification
 */
export function getExcavatorSpec(excavatorClass: ExcavatorClass): ExcavatorSpec {
  return EXCAVATOR_SPECS[excavatorClass];
}

/**
 * Get available bucket widths for an excavator class
 * @param excavatorClass The excavator class
 * @returns Array of bucket specifications
 */
export function getAvailableBuckets(excavatorClass: ExcavatorClass): BucketSpec[] {
  return STANDARD_BUCKET_WIDTHS.filter(bucket => 
    bucket.applicableClasses.includes(excavatorClass)
  );
}

/**
 * Get bucket capacity by width
 * @param width Bucket width in inches
 * @returns Bucket capacity in cubic yards
 */
export function getBucketCapacity(width: number): number {
  const bucket = STANDARD_BUCKET_WIDTHS.find(b => b.width === width);
  return bucket ? bucket.capacity : 0.12; // Default to mini bucket capacity
}

/**
 * Recommend excavator class based on trench width
 * @param trenchWidth Trench width in feet
 * @returns Recommended excavator class
 */
export function recommendExcavatorClass(trenchWidth: number): ExcavatorClass {
  const trenchWidthInches = trenchWidth * 12;
  
  if (trenchWidthInches <= 18) return 'micro';
  if (trenchWidthInches <= 30) return 'mini';
  if (trenchWidthInches <= 42) return 'small';
  if (trenchWidthInches <= 60) return 'medium';
  return 'large';
}

/**
 * Available excavator classes for dropdown selection
 */
export const AVAILABLE_EXCAVATOR_CLASSES = Object.values(EXCAVATOR_SPECS).map(spec => ({
  value: spec.class,
  label: spec.name,
  description: spec.description,
}));

/**
 * Available bucket widths for dropdown selection
 */
export const AVAILABLE_BUCKET_WIDTHS = STANDARD_BUCKET_WIDTHS.map(bucket => ({
  value: bucket.width,
  label: `${bucket.width}" (${bucket.capacity} CY)`,
}));
