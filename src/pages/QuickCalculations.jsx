import React, { useState } from 'react';
import PageLayout, { ContentCard } from '../components/Layout/PageLayout';
import FormulaCalculator from '../components/Formula/FormulaCalculator';
import { useUnit } from '../contexts/UnitContext';
import { formulaDatabase, getAllCategories, getFormulasByCategory } from '../formulas';

const QuickCalculations = () => {
  const { unitSystem } = useUnit();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);

  // Get all available categories
  const categories = getAllCategories();

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedFormula(null); // Clear selected formula when changing category
  };

  const handleFormulaSelect = (formula) => {
    setSelectedFormula(formula);
  };

  const handleAddToFavorites = (formula) => {
    // TODO: Implement favorites functionality
    console.log('Adding to favorites:', formula.name);
    // This will be connected to PreferredFormulas later
  };

  const renderCategoryGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="bg-white rounded-lg border border-gray-200 hover:border-axisBlue p-6 cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            {/* Category Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 group-hover:bg-axisBlue rounded-lg mb-4 transition-colors duration-200">
              <div className="text-gray-600 group-hover:text-white transition-colors duration-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Category Info */}
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-axisBlue transition-colors duration-200 mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {category.description}
            </p>

            {/* Formula Count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {category.formulaCount} formulas
              </span>
              <svg 
                className="h-4 w-4 text-gray-400 group-hover:text-axisBlue transition-colors duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFormulaList = () => {
    const formulas = getFormulasByCategory(selectedCategory);
    
    return (
      <div className="space-y-4">
        {/* Back to Categories */}
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center text-axisBlue hover:text-blue-800 transition-colors duration-200"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </button>

        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {formulaDatabase[selectedCategory]?.name}
          </h2>
          <p className="text-gray-600">
            {formulaDatabase[selectedCategory]?.description}
          </p>
        </div>

        {/* Formula List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {formulas.map((formula) => (
            <div
              key={formula.id}
              onClick={() => handleFormulaSelect(formula)}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFormula?.id === formula.id 
                  ? 'border-axisBlue bg-blue-50' 
                  : 'border-gray-200 hover:border-axisBlue'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{formula.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{formula.description}</p>
              <div className="font-mono text-sm text-axisBlue">{formula.formula}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <ContentCard
          title="Quick Calculations"
          subtitle={
            selectedCategory 
              ? "Select a formula to begin calculations"
              : "Select a formula category to begin calculations"
          }
          headerActions={
            <div className="text-sm text-gray-600">
              Current Units: <span className="font-medium text-axisBlue">{unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</span>
            </div>
          }
        >
          <p className="text-gray-600">
            {selectedCategory
              ? "Choose a formula from the list below to perform calculations with step-by-step results."
              : "Choose from the categories below to access individual crash reconstruction formulas. Each category contains multiple formulas with step-by-step calculations and results."
            }
          </p>
        </ContentCard>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Side - Categories/Formulas */}
          <div className="xl:col-span-2">
            {selectedCategory ? renderFormulaList() : renderCategoryGrid()}
          </div>

          {/* Right Side - Calculator */}
          <div className="xl:col-span-1">
            {selectedFormula ? (
              <FormulaCalculator 
                formula={selectedFormula}
                onAddToFavorites={handleAddToFavorites}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Formula</h3>
                <p className="text-gray-500">
                  Choose a category and formula to begin calculations
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access - Recently Used Formulas */}
        {!selectedCategory && (
          <ContentCard title="Quick Access" subtitle="Recently used formulas for faster access">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* These will be populated from session storage later */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500 text-sm">No recent formulas</p>
              </div>
            </div>
          </ContentCard>
        )}
      </div>
    </PageLayout>
  );
};

export default QuickCalculations;