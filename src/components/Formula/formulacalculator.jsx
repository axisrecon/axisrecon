import React, { useState, useEffect } from 'react';
import { useUnit } from '../../contexts/UnitContext';
import { getUnitLabel } from '../../formulas';

const FormulaCalculator = ({ formula, onAddToFavorites }) => {
  const { unitSystem, formatResult } = useUnit();
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [dynamicInputs, setDynamicInputs] = useState([]);

  // Initialize inputs when formula changes
  useEffect(() => {
    const initialInputs = {};
    formula.inputs.forEach(input => {
      if (input.type === 'select' && input.default !== undefined) {
        initialInputs[input.key] = input.default;
      } else if (input.type === 'dynamic_array') {
        // Don't initialize dynamic arrays here
      } else {
        initialInputs[input.key] = '';
      }
    });
    setInputs(initialInputs);
    setResult(null);
    setErrors({});
    setDynamicInputs([]);
  }, [formula]);

  // Handle dynamic input count changes
  useEffect(() => {
    const dynamicInput = formula.inputs.find(input => input.type === 'dynamic_array');
    if (dynamicInput && dynamicInput.dependsOn) {
      const countKey = dynamicInput.dependsOn;
      const count = parseInt(inputs[countKey]);
      
      if (count && count > 0) {
        const newDynamicInputs = Array(count).fill('').map((_, index) => ({
          key: `${dynamicInput.key}_${index}`,
          label: index < 10 && dynamicInput.key === 'speeds' 
            ? `S${index + 1}` 
            : `${dynamicInput.label} ${index + 1}`,
          value: dynamicInputs[index]?.value || ''
        }));
        setDynamicInputs(newDynamicInputs);
        
        // Update inputs with the array - initialize with zeros to prevent undefined
        const valuesArray = newDynamicInputs.map(input => {
          const val = parseFloat(input.value);
          return isNaN(val) ? 0 : val;
        });
        setInputs(prev => ({ ...prev, [dynamicInput.key]: valuesArray }));
      }
    }
  }, [inputs.speedCount, inputs.forceCount]); // Add forceCount dependency

  const handleInputChange = (inputKey, value) => {
    setInputs(prev => ({ ...prev, [inputKey]: value }));
    
    // Clear error when user starts typing
    if (errors[inputKey]) {
      setErrors(prev => ({ ...prev, [inputKey]: null }));
    }
  };

  const handleDynamicInputChange = (index, value) => {
    const newDynamicInputs = [...dynamicInputs];
    newDynamicInputs[index] = { ...newDynamicInputs[index], value };
    setDynamicInputs(newDynamicInputs);
    
    // Update the array in inputs
    const valuesArray = newDynamicInputs.map(input => parseFloat(input.value) || 0);
    const dynamicInput = formula.inputs.find(input => input.type === 'dynamic_array');
    if (dynamicInput) {
      setInputs(prev => ({ ...prev, [dynamicInput.key]: valuesArray }));
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    
    formula.inputs.forEach(input => {
      if (input.type === 'dynamic_array') {
        // Validate dynamic inputs
        dynamicInputs.forEach((dynInput, index) => {
          const value = parseFloat(dynInput.value);
          const errorKey = dynInput.key;
          if (!dynInput.value || dynInput.value === '' || isNaN(value)) {
            newErrors[errorKey] = 'Required';
          } else if (input.validation.min && value < input.validation.min) {
            newErrors[errorKey] = `Must be ≥ ${input.validation.min}`;
          } else if (input.validation.max && value > input.validation.max) {
            newErrors[errorKey] = `Must be ≤ ${input.validation.max}`;
          }
        });
      } else if (input.type !== 'select') {
        const value = inputs[input.key];
        
        if (input.validation.required && (!value || value === '')) {
          newErrors[input.key] = 'Required';
        } else if (value !== '' && !isNaN(value) && value !== null) {
          const numValue = parseFloat(value);
          if (input.validation.min && numValue < input.validation.min) {
            newErrors[input.key] = `Must be ≥ ${input.validation.min}`;
          }
          if (input.validation.max && numValue > input.validation.max) {
            newErrors[input.key] = `Must be ≤ ${input.validation.max}`;
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    try {
      // Convert string inputs to numbers
      const numericInputs = {};
      Object.keys(inputs).forEach(key => {
        if (Array.isArray(inputs[key])) {
          // Handle arrays (like forces or speeds)
          numericInputs[key] = inputs[key].map(val => parseFloat(val)).filter(val => !isNaN(val));
        } else if (inputs[key] !== '' && inputs[key] !== null) {
          numericInputs[key] = parseFloat(inputs[key]);
        }
      });
      
      // Debug logging
      console.log('Numeric inputs:', numericInputs);
      
      const calculationResult = formula.calculate(numericInputs, unitSystem);
      setResult(calculationResult);
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ calculation: 'Calculation error occurred: ' + error.message });
    }
  };

  const renderInput = (input) => {
    if (input.type === 'select') {
      return (
        <div key={input.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {input.label}
          </label>
          <select
            value={inputs[input.key] || ''}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
          >
            {input.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (input.type === 'dynamic_array') {
      return (
        <div key={input.key} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {input.label}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dynamicInputs.map((dynInput, index) => (
              <div key={dynInput.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {dynInput.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={dynInput.value}
                    onChange={(e) => handleDynamicInputChange(index, e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue ${
                      errors[dynInput.key] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">
                    {getUnitLabel(input.unit, unitSystem)}
                  </span>
                </div>
                {errors[dynInput.key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[dynInput.key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Regular input
    return (
      <div key={input.key}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {input.label}
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputs[input.key] || ''}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            placeholder={input.placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue ${
              errors[input.key] ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <span className="absolute right-3 top-2 text-sm text-gray-500">
            {getUnitLabel(input.unit, unitSystem)}
          </span>
        </div>
        {errors[input.key] && (
          <p className="text-red-500 text-xs mt-1">{errors[input.key]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Formula Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{formula.name}</h3>
          <p className="text-sm text-gray-600">{formula.description}</p>
          <div className="font-mono text-axisBlue mt-2">{formula.formula}</div>
        </div>
        {onAddToFavorites && (
          <button
            onClick={() => onAddToFavorites(formula)}
            className="text-gray-400 hover:text-axisBlue p-1"
            title="Add to favorites"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        {formula.inputs.map(renderInput)}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="w-full bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Results</h4>
          
          {/* Velocity result (shows both velocity and speed) */}
          {result.velocity !== undefined && result.speed !== undefined && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-3 border-l-4 border-axisBlue">
                <div className="text-sm text-gray-600">Velocity</div>
                <div className="text-lg font-semibold text-axisBlue">
                  {formatResult(result.velocity)} {result.velocityUnit}
                </div>
              </div>
              <div className="bg-white rounded p-3 border-l-4 border-green-500">
                <div className="text-sm text-gray-600">Speed</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatResult(result.speed)} {result.speedUnit}
                </div>
              </div>
            </div>
          )}
          
          {/* Time result */}
          {result.time !== undefined && (
            <div className="bg-white rounded p-3 border-l-4 border-axisBlue">
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-lg font-semibold text-axisBlue">
                {formatResult(result.time)} {result.timeUnit}
              </div>
            </div>
          )}
          
          {/* Distance result */}
          {result.distance !== undefined && !result.dragFactor && (
            <div className="bg-white rounded p-3 border-l-4 border-axisBlue">
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-lg font-semibold text-axisBlue">
                {formatResult(result.distance)} {result.distanceUnit}
              </div>
            </div>
          )}
          
          {/* Drag Factor result */}
          {result.dragFactor !== undefined && (
            <div className="bg-white rounded p-3 border-l-4 border-purple-500">
              <div className="text-sm text-gray-600">Drag Factor</div>
              <div className="text-lg font-semibold text-purple-600">
                {formatResult(result.dragFactor, 3)}
              </div>
              {result.averageForce !== undefined && (
                <div className="text-xs text-gray-500 mt-1">
                  Average Force: {formatResult(result.averageForce)} {result.forceUnit}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Calculation Error */}
      {errors.calculation && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.calculation}</p>
        </div>
      )}
    </div>
  );
};

export default FormulaCalculator;