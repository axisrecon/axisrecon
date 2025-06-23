import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout, { ContentCard, EmptyState } from '../components/Layout/PageLayout';
import { useUnit } from '../contexts/UnitContext';
import { getFormulaById, formulaDatabase } from '../formulas';

const PreferredFormulas = () => {
  const navigate = useNavigate();
  const { 
    unitSystem, 
    formatResult, 
    preferredFormulas, 
    removePreferredFormula,
    togglePreferredFormula,
    getRecentFormulas,
    getThisWeekCalculations,
    getMostUsedFormulas,
    isFormulaPreferred
  } = useUnit();

  // Custom function to find formula by ID property (not object key)
  const findFormulaById = (formulaId) => {
    for (const category of Object.values(formulaDatabase)) {
      for (const formulaObj of Object.values(category.formulas)) {
        if (formulaObj.id === formulaId) {
          return formulaObj;
        }
      }
    }
    return null;
  };

  // Get actual preferred formula objects from the database
  const getPreferredFormulaData = () => {
    console.log('=== DEBUGGING PREFERRED FORMULAS ===');
    console.log('preferredFormulas from session storage:', preferredFormulas);
    
    const results = preferredFormulas.map(formulaId => {
      console.log(`Looking for formula ID: "${formulaId}"`);
      
      // Use our custom search function
      const formula = findFormulaById(formulaId);
      
      console.log(`Result for "${formulaId}":`, formula ? 'FOUND' : 'NOT FOUND');
      return formula;
    }).filter(formula => formula !== null);
    
    console.log('Final filtered results:', results.length, 'formulas found');
    console.log('=== END DEBUGGING ===');
    
    return results;
  };

  const preferredFormulaData = getPreferredFormulaData();

  // FIXED: Navigate to QuickCalculations with specific formula pre-selected
  const handleCalculateFormula = (formula) => {
    // Find the category that contains this formula
    let categoryId = null;
    for (const [catId, categoryData] of Object.entries(formulaDatabase)) {
      if (Object.values(categoryData.formulas).some(f => f.id === formula.id)) {
        categoryId = catId;
        break;
      }
    }
    
    // Navigate to QuickCalculations with formula pre-selected via URL parameters
    if (categoryId) {
      navigate(`/app/quick?category=${categoryId}&formula=${formula.id}`);
    } else {
      // Fallback: just navigate to QuickCalculations
      navigate('/app/quick');
    }
  };

  // Calculate sample results for display
  const calculateSampleResult = (formula) => {
    // Generate sample inputs based on formula requirements
    const sampleInputs = {};
    
    formula.inputs.forEach(input => {
      if (input.type === 'number') {
        // Use sample values for demonstration
        switch (input.key) {
          case 'distance':
            sampleInputs[input.key] = unitSystem === 'imperial' ? 120 : 36.6;
            break;
          case 'time':
            sampleInputs[input.key] = 2.5;
            break;
          case 'speed':
          case 'velocity':
            sampleInputs[input.key] = unitSystem === 'imperial' ? 45 : 72.4;
            break;
          case 'acceleration':
            sampleInputs[input.key] = unitSystem === 'imperial' ? 15 : 4.6;
            break;
          case 'deceleration':
            sampleInputs[input.key] = unitSystem === 'imperial' ? 20 : 6.1;
            break;
          case 'coefficient':
            sampleInputs[input.key] = 0.7;
            break;
          case 'mass':
          case 'weight':
            sampleInputs[input.key] = unitSystem === 'imperial' ? 3500 : 1587;
            break;
          case 'force':
            sampleInputs[input.key] = unitSystem === 'imperial' ? 5000 : 22241;
            break;
          default:
            sampleInputs[input.key] = 10;
        }
      } else if (input.type === 'select') {
        sampleInputs[input.key] = input.options[0].value;
      }
    });

    // Calculate result using formula function
    try {
      const result = formula.calculate(sampleInputs);
      return formatResult(result, formula.unit);
    } catch (error) {
      return 'Sample calculation';
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <ContentCard
          title="Preferred Formulas"
          subtitle={
            preferredFormulas.length > 0 
              ? `${preferredFormulas.length} preferred formula${preferredFormulas.length !== 1 ? 's' : ''}`
              : 'Build your personal collection'
          }
        >
          <p className="text-gray-600">
            Save your most frequently used formulas for quick access. Build your personal collection 
            of go-to calculations for efficient crash reconstruction analysis.
          </p>
        </ContentCard>

        {/* Your Preferred Formulas - Main Section */}
        <ContentCard title="Your Preferred Formulas">
          {preferredFormulaData.length === 0 ? (
            <EmptyState
              title="No Preferred Formulas Yet"
              description="Star formulas in QuickCalculations to add them to your preferred collection for quick access."
              icon={
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferredFormulaData.map((formula) => {
                const sampleResult = calculateSampleResult(formula);
                
                return (
                  <div key={formula.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-axisBlue transition-all duration-200 hover:shadow-md">
                    {/* Formula Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{formula.name}</h4>
                        <p className="text-xs text-gray-600">{formula.category}</p>
                      </div>
                      <button
                        onClick={() => togglePreferredFormula(formula.id)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                        title="Remove from preferred"
                      >
                        <svg 
                          className="h-4 w-4" 
                          fill="currentColor" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>

                    {/* Formula Display */}
                    <div className="mb-3">
                      <div className="font-mono text-xs text-axisBlue mb-1">{formula.formula}</div>
                      <div className="text-xs text-gray-500">{formula.description}</div>
                    </div>

                    {/* Sample Result */}
                    <div className="mb-4 p-2 bg-gray-50 rounded text-center">
                      <div className="text-xs text-gray-600 mb-1">Sample Result</div>
                      <div className="font-semibold text-axisBlue text-sm">{sampleResult}</div>
                    </div>

                    {/* Calculate Button */}
                    <button
                      onClick={() => handleCalculateFormula(formula)}
                      className="w-full bg-axisBlue hover:bg-blue-800 text-white text-sm font-medium py-2 px-3 rounded transition-colors duration-200"
                    >
                      Calculate
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ContentCard>

        {/* Usage Statistics */}
        <ContentCard title="Usage Statistics" subtitle="Track your formula usage patterns">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-axisBlue">{preferredFormulas.length}</div>
              <div className="text-sm text-gray-600">Preferred Formulas</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getThisWeekCalculations()}</div>
              <div className="text-sm text-gray-600">Calculations This Week</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {getMostUsedFormulas(1)[0]?.count || 0}
              </div>
              <div className="text-sm text-gray-600">Most Used Formula</div>
              <div className="text-xs text-gray-500">
                {getMostUsedFormulas(1)[0] ? 
                  getFormulaById(getMostUsedFormulas(1)[0].formulaId)?.name || 'Unknown' : 
                  'None yet'
                }
              </div>
            </div>
          </div>
        </ContentCard>

        {/* Recently Used Formulas */}
        {getRecentFormulas().length > 0 && (
          <ContentCard title="Recently Used Formulas" subtitle="Formulas you've calculated recently">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getRecentFormulas().slice(0, 6).map((formulaId) => {
                const formula = getFormulaById(formulaId);
                if (!formula) return null;
                
                return (
                  <div key={formulaId} className="bg-gray-50 rounded-lg p-3 border hover:border-axisBlue transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{formula.name}</h4>
                      <button
                        onClick={() => togglePreferredFormula(formulaId)}
                        className={`p-1 transition-colors duration-200 ${
                          isFormulaPreferred(formulaId)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-axisBlue'
                        }`}
                        title={isFormulaPreferred(formulaId) ? 'Remove from preferred' : 'Add to preferred'}
                      >
                        <svg 
                          className="h-3 w-3" 
                          fill={isFormulaPreferred(formulaId) ? 'currentColor' : 'none'} 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <div className="font-mono text-xs text-axisBlue mb-1">{formula.formula}</div>
                    <div className="text-xs text-gray-600">{formula.category}</div>
                  </div>
                );
              })}
            </div>
          </ContentCard>
        )}

        {/* Quick Actions */}
        <ContentCard title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/app/quick')}
              className="flex items-center justify-center px-4 py-3 bg-axisBlue text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Browse More Formulas
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </ContentCard>
      </div>
    </PageLayout>
  );
};

export default PreferredFormulas;