import React, { useState } from 'react';
import PageLayout, { ContentCard, EmptyState } from '../components/Layout/PageLayout';
import { useUnit } from '../contexts/UnitContext';

const PreferredFormulas = () => {
  const { unitSystem, formatResult } = useUnit();
  const [preferredFormulas, setPreferredFormulas] = useState([]);

  // Sample available formulas for demonstration
  const availableFormulas = [
    {
      id: 'basic_speed',
      name: 'Basic Speed',
      category: 'Speed and Velocity',
      formula: 'v = d / t',
      description: 'Calculate speed from distance and time',
      lastUsed: '2025-06-10'
    },
    {
      id: 'stopping_distance',
      name: 'Stopping Distance',
      category: 'Distance',
      formula: 'd = v² / (2μg)',
      description: 'Calculate stopping distance using friction coefficient',
      lastUsed: '2025-06-09'
    },
    {
      id: 'kinetic_energy',
      name: 'Kinetic Energy',
      category: 'Energy',
      formula: 'KE = ½mv²',
      description: 'Calculate kinetic energy of moving object',
      lastUsed: '2025-06-08'
    },
    {
      id: 'coefficient_friction',
      name: 'Coefficient of Friction',
      category: 'Factors',
      formula: 'μ = tan(θ)',
      description: 'Calculate friction coefficient from angle',
      lastUsed: '2025-06-07'
    }
  ];

  const addToPreferred = (formula) => {
    setPreferredFormulas(prev => [...prev, formula]);
  };

  const removeFromPreferred = (formulaId) => {
    setPreferredFormulas(prev => prev.filter(f => f.id !== formulaId));
  };

  const calculateSample = (formulaId) => {
    // Sample calculation results for demonstration
    const sampleResults = {
      basic_speed: { result: 45.67, unit: unitSystem === 'imperial' ? 'ft/s' : 'm/s' },
      stopping_distance: { result: 156.8, unit: unitSystem === 'imperial' ? 'ft' : 'm' },
      kinetic_energy: { result: 12456, unit: 'J' },
      coefficient_friction: { result: 0.75, unit: '' }
    };
    return sampleResults[formulaId] || { result: 0, unit: '' };
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <ContentCard
          title="Preferred Formulas"
          subtitle="Quick access to your saved favorite formulas and common calculations"
          headerActions={
            <div className="text-sm text-gray-600">
              {preferredFormulas.length} saved formula{preferredFormulas.length !== 1 ? 's' : ''}
            </div>
          }
        >
          <p className="text-gray-600">
            Save your most frequently used formulas for quick access. Build your personal collection 
            of go-to calculations for efficient crash reconstruction analysis.
          </p>
        </ContentCard>

        {/* Preferred Formulas Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Preferred Formulas */}
          <ContentCard title="Your Preferred Formulas">
            {preferredFormulas.length === 0 ? (
              <EmptyState
                title="No Preferred Formulas Yet"
                description="Add formulas from the available list to create your personal collection of frequently used calculations."
                icon={
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                }
              />
            ) : (
              <div className="space-y-4">
                {preferredFormulas.map((formula) => {
                  const sample = calculateSample(formula.id);
                  return (
                    <div key={formula.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-axisBlue">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{formula.name}</h4>
                          <p className="text-sm text-gray-600">{formula.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-axisBlue hover:text-blue-800 p-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => removeFromPreferred(formula.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="font-mono text-axisBlue mb-2">{formula.formula}</div>
                      <p className="text-xs text-gray-600 mb-3">{formula.description}</p>
                      
                      {/* Quick Result Display */}
                      <div className="bg-white rounded px-3 py-2 text-sm">
                        <span className="text-gray-600">Sample result: </span>
                        <span className="font-semibold text-axisBlue">
                          {formatResult(sample.result)} {sample.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ContentCard>

          {/* Available Formulas */}
          <ContentCard title="Available Formulas" subtitle="Add formulas to your preferred collection">
            <div className="space-y-3">
              {availableFormulas
                .filter(formula => !preferredFormulas.find(pf => pf.id === formula.id))
                .map((formula) => (
                  <div key={formula.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-axisBlue transition-colors duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{formula.name}</h4>
                        <p className="text-sm text-gray-600">{formula.category}</p>
                      </div>
                      <button
                        onClick={() => addToPreferred(formula)}
                        className="text-axisBlue hover:text-blue-800 p-1 rounded"
                        title="Add to preferred"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="font-mono text-sm text-axisBlue mb-2">{formula.formula}</div>
                    <p className="text-xs text-gray-600 mb-2">{formula.description}</p>
                    <div className="text-xs text-gray-500">
                      Last used: {formula.lastUsed}
                    </div>
                  </div>
                ))}
            </div>
          </ContentCard>
        </div>

        {/* Quick Actions */}
        <ContentCard title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-axisBlue text-white rounded-lg hover:bg-blue-800 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate All Preferred
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Preferred List
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Browse More Formulas
            </button>
          </div>
        </ContentCard>

        {/* Usage Statistics */}
        <ContentCard title="Usage Statistics" subtitle="Track your formula usage patterns">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-axisBlue">{preferredFormulas.length}</div>
              <div className="text-sm text-gray-600">Preferred Formulas</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-600">Times Used This Week</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">7</div>
              <div className="text-sm text-gray-600">Most Used Category</div>
              <div className="text-xs text-gray-500">Speed & Velocity</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatResult(89.2)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </ContentCard>

        {/* Recently Used Formulas */}
        <ContentCard title="Recently Used Formulas" subtitle="Formulas you've used in recent sessions">
          <div className="space-y-2">
            {availableFormulas.slice(0, 3).map((formula) => (
              <div key={formula.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-axisBlue rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-900">{formula.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({formula.category})</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{formula.lastUsed}</span>
                  <button
                    onClick={() => addToPreferred(formula)}
                    className="text-axisBlue hover:text-blue-800 p-1"
                    title="Add to preferred"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>

        {/* Development Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Development Note:</strong> Preferred formulas functionality is currently a placeholder. 
                Integration with the formula database, persistence, and calculation features will be implemented in future phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PreferredFormulas;