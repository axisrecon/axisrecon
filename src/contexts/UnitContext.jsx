import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UnitContext = createContext();

// Session storage keys
const STORAGE_KEYS = {
  UNIT_SYSTEM: 'axisrecon_unit_system',
  DECIMAL_PRECISION: 'axisrecon_decimal_precision',
  DISCLAIMER_ACCEPTED: 'axisrecon_disclaimer_accepted'
};

// Unit conversion definitions
const UNIT_LABELS = {
  imperial: {
    distance: 'ft',
    speed: 'ft/s',
    acceleration: 'ft/s²',
    mass: 'lbs',
    force: 'lbf',
    time: 's',
    angle: 'degrees'
  },
  metric: {
    distance: 'm',
    speed: 'm/s',
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
    
    // Setters
    setUnitSystem,
    setDecimalPrecision,
    setDisclaimerAccepted,
    
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