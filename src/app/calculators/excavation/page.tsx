'use client';

import { useState, useCallback } from 'react';
import { Navigation, LeftSidebar, CenterPanel, RightSidebar } from './components';
import { DEFAULT_INPUTS, type ExcavationInputs, type CalculationResult } from './types';
import { performCalculation, validateInputs } from './lib/calculator';

export default function ExcavationCalculatorPage() {
  const [inputs, setInputs] = useState<ExcavationInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = useCallback(() => {
    // Validate inputs
    const validation = validateInputs(inputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsCalculating(true);

    // Simulate a brief delay for UX (calculations are instant)
    setTimeout(() => {
      const result = performCalculation(inputs);
      setResults(result);
      setIsCalculating(false);
    }, 100);
  }, [inputs]);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setResults(null);
    setErrors({});
  }, []);

  const handleSave = useCallback(() => {
    if (!results) return;
    
    // Get existing saved calculations
    const savedStr = localStorage.getItem('excavation-calculations');
    const saved = savedStr ? JSON.parse(savedStr) : [];
    
    // Add new calculation
    const newSave = {
      id: results.id,
      name: inputs.projectName,
      timestamp: new Date().toISOString(),
      inputs,
      results,
    };
    
    saved.unshift(newSave);
    
    // Keep only last 20 calculations
    const trimmed = saved.slice(0, 20);
    
    localStorage.setItem('excavation-calculations', JSON.stringify(trimmed));
    alert(`Calculation "${inputs.projectName}" saved!`);
  }, [inputs, results]);

  const handleLoad = useCallback(() => {
    const savedStr = localStorage.getItem('excavation-calculations');
    if (!savedStr) {
      alert('No saved calculations found.');
      return;
    }

    const saved = JSON.parse(savedStr);
    if (saved.length === 0) {
      alert('No saved calculations found.');
      return;
    }

    // For now, just load the most recent one
    // In a full implementation, you'd show a modal to select
    const mostRecent = saved[0];
    setInputs(mostRecent.inputs);
    setResults(mostRecent.results);
    alert(`Loaded calculation "${mostRecent.name}"`);
  }, []);

  const handleExport = useCallback(() => {
    if (!results) {
      alert('No results to export. Run a calculation first.');
      return;
    }

    const exportData = {
      projectName: inputs.projectName,
      exportDate: new Date().toISOString(),
      inputs,
      results: {
        bankVolume: results.volume.bankVolume,
        looseVolume: results.volume.looseVolume,
        machineDigVolume: results.volume.machineDigVolume,
        handDigVolume: results.volume.handDigVolume,
        totalLaborHours: results.production.totalLaborHours,
        totalEquipmentHours: results.production.totalEquipmentHours,
        totalDuration: results.duration.totalDuration,
        criticalPath: results.duration.criticalPath,
      },
      auditTrail: results.auditTrail,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inputs.projectName.replace(/\s+/g, '_')}_excavation_calc.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [inputs, results]);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <Navigation
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
      />

      {/* Main Content - Three Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Inputs */}
        <LeftSidebar
          inputs={inputs}
          onChange={setInputs}
          onCalculate={handleCalculate}
          onReset={handleReset}
          onSave={handleSave}
          onLoad={handleLoad}
          errors={errors}
          isCalculating={isCalculating}
          hasResults={!!results}
        />

        {/* Center Panel - Results */}
        <CenterPanel results={results} />

        {/* Right Sidebar - Audit Trail */}
        <RightSidebar auditEntries={results?.auditTrail ?? []} />
      </div>
    </div>
  );
}
