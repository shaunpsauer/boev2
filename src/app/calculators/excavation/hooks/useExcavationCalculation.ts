'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ExcavationInputs, CalculationResult } from '../types';
import { DEFAULT_INPUTS } from '../types';
import { performCalculation, validateInputs } from '../lib/calculator';
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage';

interface UseExcavationCalculationReturn {
  inputs: ExcavationInputs;
  results: CalculationResult | null;
  errors: Record<string, string>;
  isCalculating: boolean;
  hasResults: boolean;
  setInputs: (inputs: ExcavationInputs) => void;
  updateInput: <K extends keyof ExcavationInputs>(
    key: K,
    value: ExcavationInputs[K]
  ) => void;
  calculate: () => void;
  reset: () => void;
  loadFromDraft: () => boolean;
}

export function useExcavationCalculation(): UseExcavationCalculationReturn {
  const [inputs, setInputsState] = useState<ExcavationInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const hasResults = useMemo(() => results !== null, [results]);

  const setInputs = useCallback((newInputs: ExcavationInputs) => {
    setInputsState(newInputs);
    // Auto-save draft when inputs change
    saveDraft(newInputs);
  }, []);

  const updateInput = useCallback(<K extends keyof ExcavationInputs>(
    key: K,
    value: ExcavationInputs[K]
  ) => {
    setInputsState(prev => {
      const updated = { ...prev, [key]: value };
      saveDraft(updated);
      return updated;
    });
  }, []);

  const calculate = useCallback(() => {
    // Validate inputs
    const validation = validateInputs(inputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsCalculating(true);

    // Perform calculation (with brief delay for UX)
    setTimeout(() => {
      try {
        const result = performCalculation(inputs);
        setResults(result);
      } catch (error) {
        console.error('Calculation error:', error);
        setErrors({ _form: 'An error occurred during calculation' });
      } finally {
        setIsCalculating(false);
      }
    }, 100);
  }, [inputs]);

  const reset = useCallback(() => {
    setInputsState(DEFAULT_INPUTS);
    setResults(null);
    setErrors({});
    clearDraft();
  }, []);

  const loadFromDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      setInputsState(draft as ExcavationInputs);
      return true;
    }
    return false;
  }, []);

  return {
    inputs,
    results,
    errors,
    isCalculating,
    hasResults,
    setInputs,
    updateInput,
    calculate,
    reset,
    loadFromDraft,
  };
}

export default useExcavationCalculation;
