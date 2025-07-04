import React, { useState } from 'react';
import PageLayout, { ContentCard } from '../components/Layout/PageLayout';
import FormulaCalculator from '../components/Formula/formulacalculator';
import { useUnit } from '../contexts/UnitContext';
import { formulaDatabase, getAllCategories, getFormulasByCategory } from '../formulas';

const QuickCalculations = () => {
  // Get unit system and preferred formulas from context
  const { 
    unitSystem, 
    isFormulaPreferred, 
    togglePreferredFormula 
  } = useUnit();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);

  // Get all available categories
  const categories = getAllCategories();

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedFormula(null); // Clear selected formula when changing category
  };

  const handleFormulaSelect = (formulaId) => {
    if (!formulaId) {
      setSelectedFormula(null);
      return;
    }
    
    const formulas = getFormulasByCategory(selectedCategory);
    const formula = formulas.find(f => f.id === formulaId);
    setSelectedFormula(formula);
  };

  // Updated star toggle handler
  const handleStarToggle = (formula) => {
    togglePreferredFormula(formula.id);
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

  const renderFormulaSelector = () => {
    const formulas = getFormulasByCategory(selectedCategory);
    
    return (
      <div className="space-y-6">
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

        {/* Formula Dropdown Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Formula
          </label>
          <select
            value={selectedFormula?.id || ''}
            onChange={(e) => handleFormulaSelect(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue bg-white text-gray-900"
          >
            <option value="">Choose a formula...</option>
            {formulas.map((formula) => (
              <option key={formula.id} value={formula.id}>
                {formula.name} - {formula.formula}
              </option>
            ))}
          </select>
          
          {/* Formula Description */}
          {selectedFormula && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedFormula.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedFormula.description}</p>
              <div className="font-mono text-sm text-axisBlue bg-white px-3 py-2 rounded border">
                {selectedFormula.formula}
              </div>
              {selectedFormula.tags && selectedFormula.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {selectedFormula.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Formula Quick Reference (Desktop Only) - NOW WITH FUNCTIONAL STARS */}
        <div className="hidden lg:block">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Formulas</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {formulas.map((formula) => (
              <div
                key={formula.id}
                className={`bg-white border rounded-lg p-3 transition-all duration-200 hover:shadow-sm relative ${
                  selectedFormula?.id === formula.id 
                    ? 'border-axisBlue bg-blue-50' 
                    : 'border-gray-200 hover:border-axisBlue'
                }`}
              >
                {/* Star Icon - NOW FUNCTIONAL */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent formula selection when clicking star
                    handleStarToggle(formula);
                  }}
                  className={`absolute top-2 right-2 p-1 transition-colors duration-200 ${
                    isFormulaPreferred(formula.id)
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-axisBlue'
                  }`}
                  title={isFormulaPreferred(formula.id) ? 'Remove from preferred' : 'Add to preferred'}
                >
                  <svg 
                    className="h-4 w-4" 
                    fill={isFormulaPreferred(formula.id) ? 'currentColor' : 'none'} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                
                {/* Formula Content - Clickable to select */}
                <div 
                  onClick={() => handleFormulaSelect(formula.id)}
                  className="cursor-pointer pr-8"
                >
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{formula.name}</h4>
                  <div className="font-mono text-xs text-axisBlue">{formula.formula}</div>
                </div>
              </div>
            ))}
          </div>
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
              ? "Choose a formula from the dropdown below to perform calculations with step-by-step results."
              : "Choose from the categories below to access individual crash reconstruction formulas. Each category contains multiple formulas with step-by-step calculations and results."
            }
          </p>
        </ContentCard>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Side - Categories/Formulas */}
          <div className="xl:col-span-2">
            {selectedCategory ? renderFormulaSelector() : renderCategoryGrid()}
          </div>

          {/* Right Side - Calculator */}
          <div className="xl:col-span-1">
            {selectedFormula ? (
              <FormulaCalculator 
                formula={selectedFormula}
                onAddToFavorites={handleStarToggle}
                isPreferred={isFormulaPreferred(selectedFormula.id)}
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