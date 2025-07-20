// UPDATED FILE: src/formulas/index.js
// Main Formula Database Index with Momentum Category
import { speedVelocityCategory } from './categories/speedVelocity.js';
import { timeDistanceCategory } from './categories/timeDistance.js';
import { factorsCategory } from './categories/factors.js';
import { edrAnalysisCategory } from './categories/edrAnalysis.js';
import { pedestrianMotorcycleCategory } from './categories/pedestrianMotorcycle.js';
import { airborneCategory } from './categories/airborne.js';
import { momentumCategory } from './categories/momentum.js'; // ADD THIS LINE

// Main formula database export
export const formulaDatabase = {
  speedVelocity: speedVelocityCategory,
  timeDistance: timeDistanceCategory,
  factors: factorsCategory,
  edrAnalysis: edrAnalysisCategory,
  pedestrianMotorcycle: pedestrianMotorcycleCategory,
  airborne: airborneCategory,
  momentum: momentumCategory // ADD THIS LINE
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

// Helper function to get category information
export const getCategoryInfo = (categoryId) => {
  return formulaDatabase[categoryId] || null;
};

// Get all categories for navigation/display
export const getAllCategories = () => {
  return Object.keys(formulaDatabase).map(key => ({
    id: key,
    name: formulaDatabase[key].name,
    description: formulaDatabase[key].description,
    color: formulaDatabase[key].color,
    formulaCount: Object.keys(formulaDatabase[key].formulas).length
  }));
};