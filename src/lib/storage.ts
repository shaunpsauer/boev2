// ============================================
// Client-Side Storage Utilities
// ============================================

import { safeParseJSON, generateId } from './utils';

const STORAGE_KEY = 'excavation-calculations';
const MAX_SAVED_CALCULATIONS = 20;

export interface StoredCalculation {
  id: string;
  name: string;
  timestamp: string;
  inputs: unknown;
  results: unknown;
}

/**
 * Get all saved calculations from localStorage
 */
export function getSavedCalculations(): StoredCalculation[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  return safeParseJSON<StoredCalculation[]>(stored, []);
}

/**
 * Save a calculation to localStorage
 */
export function saveCalculation(
  name: string,
  inputs: unknown,
  results: unknown
): StoredCalculation {
  const calculation: StoredCalculation = {
    id: generateId('calc'),
    name,
    timestamp: new Date().toISOString(),
    inputs,
    results,
  };

  const saved = getSavedCalculations();
  saved.unshift(calculation);
  
  // Keep only the most recent calculations
  const trimmed = saved.slice(0, MAX_SAVED_CALCULATIONS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  
  return calculation;
}

/**
 * Load a specific calculation by ID
 */
export function loadCalculation(id: string): StoredCalculation | null {
  const saved = getSavedCalculations();
  return saved.find(calc => calc.id === id) || null;
}

/**
 * Delete a calculation by ID
 */
export function deleteCalculation(id: string): boolean {
  const saved = getSavedCalculations();
  const filtered = saved.filter(calc => calc.id !== id);
  
  if (filtered.length === saved.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Clear all saved calculations
 */
export function clearAllCalculations(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export calculation as JSON file
 */
export function exportCalculation(
  name: string,
  data: unknown
): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}_excavation.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import calculation from JSON file
 */
export function importCalculation(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Auto-save draft to sessionStorage
 */
export function saveDraft(inputs: unknown): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('excavation-draft', JSON.stringify(inputs));
}

/**
 * Load draft from sessionStorage
 */
export function loadDraft(): unknown | null {
  if (typeof window === 'undefined') return null;
  
  const draft = sessionStorage.getItem('excavation-draft');
  if (!draft) return null;
  
  return safeParseJSON(draft, null);
}

/**
 * Clear draft from sessionStorage
 */
export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('excavation-draft');
}
