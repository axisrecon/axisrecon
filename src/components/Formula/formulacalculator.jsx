import React, { useState, useEffect } from 'react';
import { useUnit } from '../../contexts/UnitContext';

const FormulaCalculator = ({ formula, onAddToFavorites, isPreferred = false }) => {
  const { 
    unitSystem, 
    formatResult, 
    getUnitLabel, 
    trackFormulaUsage  // NEW: Added usage tracking function
  } = useUnit();
  
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // Reset inputs when formula changes
  useEffect(() => {
    setInputs({});
    setErrors({});
    setResult(null);
  }, [formula.id]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    
    formula.inputs.forEach(input => {
      const value = inputs[input.key];
      
      if (input.required && (!value || value === '')) {
        newErrors[input.key] = `${input.label} is required`;
        return;
      }

      if (value !== '' && value !== undefined) {
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
          newErrors[input.key] = 'Must be a valid number';
        } else {
          if (input.min !== undefined && numValue < input.min) {
            newErrors[input.key] = `Must be at least ${input.min}`;
          }
          if (input.max !== undefined && numValue > input.max) {
            newErrors[input.key] = `Must be at most ${input.max}`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate result
  const handleCalculate = () => {
    if (!validateInputs()) return;

    try {
      const calculationInputs = {};
      formula.inputs.forEach(input => {
        calculationInputs[input.key] = parseFloat(inputs[input.key]);
      });

      const calculationResult = formula.calculate(calculationInputs, unitSystem);
      setResult(calculationResult);
      setErrors(prev => ({ ...prev, calculation: null }));
      
      // NEW: Track formula usage
      trackFormulaUsage(formula.id, calculationInputs, calculationResult);
      
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        calculation: `Calculation error: ${error.message}` 
      }));
      setResult(null);
    }
  };

  // Handle star toggle
  const handleStarClick = () => {
    if (onAddToFavorites) {
      onAddToFavorites(formula);
    }
  };

  // Render different input types
  const renderInput = (input) => {
    if (input.type === 'select') {
      return (
        <div key={input.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {input.label}
            {input.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={inputs[input.key] || ''}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue ${
              errors[input.key] ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select...</option>
            {input.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors[input.key] && (
            <p className="text-red-500 text-xs mt-1">{errors[input.key]}</p>
          )}
        </div>
      );
    }

    // Number input (default)
    return (
      <div key={input.key} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {input.label}
          {input.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputs[input.key] || ''}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            placeholder={input.placeholder || ''}
            step={input.step || 'any'}
            min={input.min}
            max={input.max}
            className={`w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue ${
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
            onClick={handleStarClick}
            className={`p-1 transition-colors duration-200 ${
              isPreferred
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-axisBlue'
            }`}
            title={isPreferred ? 'Remove from preferred' : 'Add to preferred'}
          >
            <svg 
              className="h-5 w-5" 
              fill={isPreferred ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
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
          
          {/* Factor and Rate Conversion Results */}
          {formula.id === 'factor_rate_conversion' && (
            <div className="space-y-3">
              {result.inputType === 'factor' && result.rate !== null ? (
                <div className="bg-white rounded p-3 border-l-4 border-purple-500">
                  <div className="text-sm text-gray-600">Equivalent Rate</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {formatResult(result.rate)} {result.rateUnit}
                  </div>
                </div>
              ) : result.inputType === 'rate' && result.factor !== null ? (
                <div className="bg-white rounded p-3 border-l-4 border-purple-500">
                  <div className="text-sm text-gray-600">Equivalent Factor</div>
                  <div className="text-lg font-semibold text-purple-600">
                    {formatResult(result.factor, 3)}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Standard velocity result */}
          {result.velocity !== undefined && (
            <div className="bg-white rounded p-3 border-l-4 border-axisBlue">
              <div className="text-sm text-gray-600">Velocity</div>
              <div className="text-lg font-semibold text-axisBlue">
                {formatResult(result.velocity)} {result.velocityUnit}
              </div>
            </div>
          )}
          
          {/* Speed result */}
          {result.speed !== undefined && (
            <div className="bg-white rounded p-3 border-l-4 border-green-500">
              <div className="text-sm text-gray-600">Speed</div>
              <div className="text-lg font-semibold text-green-600">
                {formatResult(result.speed)} {result.speedUnit}
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
          {result.dragFactor !== undefined && formula.id !== 'factor_rate_conversion' && (
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