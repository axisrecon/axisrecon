// UPDATE FILE: src/formulas/index.js
// Main Formula Database Index
import { speedVelocityCategory } from './categories/speedvelocity.js';
import { timeDistanceCategory } from './categories/timedistance.js';
import { factorsCategory } from './categories/factors.js';
import { edrAnalysisCategory } from './categories/edrAnalysis.js'; // ADD THIS LINE

// Main formula database export
export const formulaDatabase = {
  speedVelocity: speedVelocityCategory,
  timeDistance: timeDistanceCategory,
  factors: factorsCategory,
  edrAnalysis: edrAnalysisCategory // ADD THIS LINE
};

// Helper function to get all formulas flattened
export const getAllFormulas = () => {
  const allFormulas = [];
  
  Object.values(formulaDatabase).forEach(category => {
    Object.values(category.formulas).forEach(formula => {
      allFormulas.push(formula);
    });
  });
  
  return allFormulas;
};

// Helper function to find a formula by ID
export const getFormulaById = (formulaId) => {
  for (const category of Object.values(formulaDatabase)) {
    if (category.formulas[formulaId]) {
      return category.formulas[formulaId];
    }
  }
  return null;
};

// Helper function to get formulas by category ID
export const getFormulasByCategory = (categoryId) => {
  const category = formulaDatabase[categoryId];
  return category ? Object.values(category.formulas) : [];
};

// Helper function to get all categories
export const getAllCategories = () => {
  return Object.values(formulaDatabase).map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    formulaCount: Object.keys(category.formulas).length
  }));
};

// Helper function to search formulas
export const searchFormulas = (query) => {
  if (!query || query.trim() === '') return [];
  
  const searchTerm = query.toLowerCase();
  const allFormulas = getAllFormulas();
  
  return allFormulas.filter(formula => 
    formula.name.toLowerCase().includes(searchTerm) ||
    formula.description.toLowerCase().includes(searchTerm) ||
    formula.formula.toLowerCase().includes(searchTerm) ||
    formula.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Unit helper functions
export const getUnitLabel = (unitType, unitSystem) => {
  const unitLabels = {
    imperial: {
      distance: 'ft',
      speed: 'mph',           // Speed is mph (scalar)
      velocity: 'ft/s',       // Velocity is ft/s (vector)
      acceleration: 'ft/s²',
      force: 'lbs',           // Force/Weight in pounds
      coefficient: '',
      percentage: '%',
      time: 's'
    },
    metric: {
      distance: 'm',
      speed: 'km/h',          // Speed is km/h (scalar)
      velocity: 'm/s',        // Velocity is m/s (vector)
      acceleration: 'm/s²',
      force: 'kg',            // Force/Weight in kilograms
      coefficient: '',
      percentage: '%',
      time: 's'
    }
  };
  
  return unitLabels[unitSystem][unitType] || '';
};

export default formulaDatabase;