// File: src/components/Formula/QuickAccessWidget.jsx
// Reusable Quick Access widget for recently used formulas

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRecentFormulas from '../../hooks/useRecentFormulas';
import { formulaDatabase } from '../../formulas';

const QuickAccessWidget = ({ 
  onFormulaSelect, 
  showClearButton = true, 
  maxDisplay = 5,
  layout = 'grid' // 'grid' or 'list'
}) => {
  const navigate = useNavigate();
  const { recentFormulas, clearRecentFormulas, hasRecentFormulas } = useRecentFormulas();
  
  // Get category name for a formula
  const getCategoryName = (formulaId) => {
    for (const [categoryId, categoryData] of Object.entries(formulaDatabase)) {
      if (categoryData.formulas[formulaId]) {
        return categoryData.name;
      }
    }
    return 'Unknown';
  };

  // Handle formula selection
  const handleFormulaClick = (formula) => {
    if (onFormulaSelect) {
      // Custom handler provided (e.g., for selecting within same page)
      onFormulaSelect(formula);
    } else {
      // Default: navigate to Quick Calculations with the formula
      navigate(`/quick-calculations?formula=${formula.id}`);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Clear all recent formulas? This action cannot be undone.')) {
      clearRecentFormulas();
    }
  };

  if (!hasRecentFormulas) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-sm">No recent formulas</p>
        <p className="text-gray-400 text-xs mt-1">Use a formula to see it appear here</p>
      </div>
    );
  }

  const displayFormulas = recentFormulas.slice(0, maxDisplay);

  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {/* Header with clear button */}
        {showClearButton && (
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-900">Recently Used</h4>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        )}

        {/* List layout */}
        <div className="space-y-2">
          {displayFormulas.map((formula, index) => (
            <div
              key={`${formula.id}-${index}`}
              onClick={() => handleFormulaClick(formula)}
              className="bg-white border border-gray-200 hover:border-axisBlue rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Position indicator */}
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-axisBlue text-white text-xs font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  
                  {/* Formula info */}
                  <div className="min-w-0 flex-1">
                    <h5 className="font-medium text-gray-900 group-hover:text-axisBlue transition-colors duration-200 text-sm truncate">
                      {formula.name}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-mono truncate">{formula.formula}</span>
                      <span>•</span>
                      <span className="truncate">{getCategoryName(formula.id)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Arrow icon */}
                <svg className="h-4 w-4 text-gray-400 group-hover:text-axisBlue transition-colors duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="space-y-4">
      {/* Header with clear button */}
      {showClearButton && (
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-900">Recently Used</h4>
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {displayFormulas.map((formula, index) => (
          <div
            key={`${formula.id}-${index}`}
            onClick={() => handleFormulaClick(formula)}
            className="bg-white border border-gray-200 hover:border-axisBlue rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            {/* Position indicator */}
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-axisBlue text-white text-xs font-medium rounded-full">
                {index + 1}
              </span>
              <svg className="h-4 w-4 text-gray-400 group-hover:text-axisBlue transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Formula info */}
            <h4 className="font-medium text-gray-900 group-hover:text-axisBlue transition-colors duration-200 mb-1 text-sm line-clamp-2">
              {formula.name}
            </h4>
            <div className="font-mono text-xs text-gray-600 mb-2 line-clamp-1">
              {formula.formula}
            </div>
            
            {/* Category badge */}
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 truncate">
                {getCategoryName(formula.id)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessWidget;