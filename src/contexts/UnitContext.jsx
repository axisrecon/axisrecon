import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UnitContext = createContext();

// Session storage keys
const STORAGE_KEYS = {
  UNIT_SYSTEM: 'axisrecon_unit_system',
  DECIMAL_PRECISION: 'axisrecon_decimal_precision',
  DISCLAIMER_ACCEPTED: 'axisrecon_disclaimer_accepted',
  PREFERRED_FORMULAS: 'axisrecon_preferred_formulas',
  CALCULATION_HISTORY: 'axisrecon_calculation_history'  // NEW: Added calculation history key
};

// Unit conversion definitions
const UNIT_LABELS = {
  imperial: {
    distance: 'ft',
    speed: 'mph',        // ← Change from 'ft/s' to 'mph'
    velocity: 'ft/s',    // ← Add velocity as separate unit type
    acceleration: 'ft/s²',
    mass: 'lbs',
    force: 'lbf',
    time: 's',
    angle: 'degrees'
  },
  metric: {
    distance: 'm',
    speed: 'km/h',       // ← Already correct
    velocity: 'm/s',     // ← Add velocity as separate unit type
    acceleration: 'm/s²',
    mass: 'kg',
    force: 'N',
    time: 's',
    angle: 'degrees'
  }
};

// Conversion factors (from imperial to metric)
const CONVERSION_FACTORS = {
  distance: 0.3048, // feet to meters
  speed: 0.3048,    // ft/s to m/s
  acceleration: 0.3048, // ft/s² to m/s²
  mass: 0.453592,   // pounds to kg
  force: 4.44822    // lbf to N
};

// Custom hook to use the context
export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};

// Provider component
export const UnitProvider = ({ children }) => {
  // Initialize state from session storage or defaults
  const [unitSystem, setUnitSystemState] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.UNIT_SYSTEM);
    return saved || 'imperial';
  });

  const [decimalPrecision, setDecimalPrecisionState] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.DECIMAL_PRECISION);
    return saved ? parseInt(saved) : 2;
  });

  const [disclaimerAccepted, setDisclaimerAcceptedState] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    return saved === 'true';
  });

  // NEW: Initialize preferred formulas from session storage
  const [preferredFormulas, setPreferredFormulasState] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.PREFERRED_FORMULAS);
    return saved ? JSON.parse(saved) : [];
  });

  // NEW: Initialize calculation history from session storage
  const [calculationHistory, setCalculationHistoryState] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.CALCULATION_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist unit system changes
  const setUnitSystem = (system) => {
    setUnitSystemState(system);
    sessionStorage.setItem(STORAGE_KEYS.UNIT_SYSTEM, system);
  };

  // Persist decimal precision changes
  const setDecimalPrecision = (precision) => {
    setDecimalPrecisionState(precision);
    sessionStorage.setItem(STORAGE_KEYS.DECIMAL_PRECISION, precision.toString());
  };

  // Persist disclaimer acceptance
  const setDisclaimerAccepted = (accepted) => {
    setDisclaimerAcceptedState(accepted);
    sessionStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, accepted.toString());
  };

  // NEW: Persist preferred formulas changes
  const setPreferredFormulas = (formulas) => {
    setPreferredFormulasState(formulas);
    sessionStorage.setItem(STORAGE_KEYS.PREFERRED_FORMULAS, JSON.stringify(formulas));
  };

  // NEW: Persist calculation history changes
  const setCalculationHistory = (history) => {
    setCalculationHistoryState(history);
    sessionStorage.setItem(STORAGE_KEYS.CALCULATION_HISTORY, JSON.stringify(history));
  };

  // NEW: Helper functions for preferred formulas management
  const addPreferredFormula = (formulaId) => {
    const updated = [...preferredFormulas, formulaId];
    setPreferredFormulas(updated);
  };

  const removePreferredFormula = (formulaId) => {
    const updated = preferredFormulas.filter(id => id !== formulaId);
    setPreferredFormulas(updated);
  };

  const isFormulaPreferred = (formulaId) => {
    return preferredFormulas.includes(formulaId);
  };

  const togglePreferredFormula = (formulaId) => {
    if (isFormulaPreferred(formulaId)) {
      removePreferredFormula(formulaId);
    } else {
      addPreferredFormula(formulaId);
    }
  };

  // NEW: Track formula usage
  const trackFormulaUsage = (formulaId, inputs, result) => {
    const usageEntry = {
      formulaId,
      timestamp: new Date().toISOString(),
      inputs: { ...inputs },
      result: { ...result },
      unitSystem
    };

    // Add to history (keep last 100 entries)
    const updatedHistory = [usageEntry, ...calculationHistory].slice(0, 100);
    setCalculationHistory(updatedHistory);
  };

  // NEW: Get recent formulas (last 10 unique formulas)
  const getRecentFormulas = () => {
    const recentIds = [];
    const seen = new Set();
    
    for (const entry of calculationHistory) {
      if (!seen.has(entry.formulaId) && recentIds.length < 10) {
        recentIds.push(entry.formulaId);
        seen.add(entry.formulaId);
      }
    }
    
    return recentIds;
  };

  // NEW: Get usage frequency for a formula
  const getFormulaUsageCount = (formulaId) => {
    return calculationHistory.filter(entry => entry.formulaId === formulaId).length;
  };

  // NEW: Get most used formulas
  const getMostUsedFormulas = (limit = 5) => {
    const frequency = {};
    
    calculationHistory.forEach(entry => {
      frequency[entry.formulaId] = (frequency[entry.formulaId] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([formulaId, count]) => ({ formulaId, count }));
  };

  // NEW: Get total calculations this week
  const getThisWeekCalculations = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return calculationHistory.filter(entry => 
      new Date(entry.timestamp) > oneWeekAgo
    ).length;
  };

  // Get unit label for a given measurement type
  const getUnitLabel = (measurementType) => {
    return UNIT_LABELS[unitSystem][measurementType] || '';
  };

  // Format a number with the current precision setting
  const formatResult = (value, customPrecision = null) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '—';
    }
    
    const precision = customPrecision !== null ? customPrecision : decimalPrecision;
    return Number(value).toFixed(precision);
  };

  // Convert value between unit systems
  const convertValue = (value, measurementType, fromSystem, toSystem) => {
    if (fromSystem === toSystem || !CONVERSION_FACTORS[measurementType]) {
      return value;
    }

    if (fromSystem === 'imperial' && toSystem === 'metric') {
      return value * CONVERSION_FACTORS[measurementType];
    } else if (fromSystem === 'metric' && toSystem === 'imperial') {
      return value / CONVERSION_FACTORS[measurementType];
    }

    return value;
  };

  // Format a value with units (for display)
  const formatWithUnits = (value, measurementType, customPrecision = null) => {
    const formattedValue = formatResult(value, customPrecision);
    const unit = getUnitLabel(measurementType);
    return `${formattedValue} ${unit}`;
  };

  // Precision options for dropdown
  const precisionOptions = [
    { value: 0, label: '0 decimals', example: '123' },
    { value: 1, label: '1 decimal', example: '123.4' },
    { value: 2, label: '2 decimals', example: '123.45' },
    { value: 3, label: '3 decimals', example: '123.456' },
    { value: 4, label: '4 decimals', example: '123.4567' }
  ];

  // Unit system options for dropdown
  const unitSystemOptions = [
    { value: 'imperial', label: 'Imperial' },
    { value: 'metric', label: 'Metric' }
  ];

  // Context value object
  const contextValue = {
    // State
    unitSystem,
    decimalPrecision,
    disclaimerAccepted,
    preferredFormulas,
    calculationHistory,  // NEW: Added calculation history state
    
    // Setters
    setUnitSystem,
    setDecimalPrecision,
    setDisclaimerAccepted,
    setPreferredFormulas,
    setCalculationHistory,  // NEW: Added calculation history setter
    
    // Preferred formulas helper functions
    addPreferredFormula,
    removePreferredFormula,
    isFormulaPreferred,
    togglePreferredFormula,
    
    // NEW: Usage tracking functions
    trackFormulaUsage,
    getRecentFormulas,
    getFormulaUsageCount,
    getMostUsedFormulas,
    getThisWeekCalculations,
    
    // Utility functions
    getUnitLabel,
    formatResult,
    formatWithUnits,
    convertValue,
    
    // Options for UI components
    precisionOptions,
    unitSystemOptions,
    
    // Unit labels object for direct access
    unitLabels: UNIT_LABELS[unitSystem]
  };

  return (
    <UnitContext.Provider value={contextValue}>
      {children}
    </UnitContext.Provider>
  );
};

export default UnitContext;