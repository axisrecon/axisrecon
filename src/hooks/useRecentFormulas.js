// File: src/hooks/useRecentFormulas.js
// Hook for managing recently used formulas in AxisRecon

import { useState, useEffect, useCallback } from 'react';
import { getFormulaById } from '../formulas';

const STORAGE_KEY = 'axisrecon_recent_formulas';
const MAX_RECENT_FORMULAS = 5;

export const useRecentFormulas = () => {
  const [recentFormulas, setRecentFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recent formulas from session storage on mount
  useEffect(() => {
    const loadRecentFormulas = () => {
      try {
        const savedRecentFormulas = sessionStorage.getItem(STORAGE_KEY);
        if (savedRecentFormulas) {
          const recentFormulaIds = JSON.parse(savedRecentFormulas);
          // Convert IDs back to formula objects, filtering out any that no longer exist
          const formulaObjects = recentFormulaIds
            .map(id => getFormulaById(id))
            .filter(Boolean);
          setRecentFormulas(formulaObjects);
        }
      } catch (error) {
        console.warn('Error loading recent formulas from session storage:', error);
        // Clear corrupted data
        sessionStorage.removeItem(STORAGE_KEY);
        setRecentFormulas([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentFormulas();
  }, []);

  // Save recent formulas to session storage
  const saveRecentFormulas = useCallback((formulas) => {
    try {
      const formulaIds = formulas.map(f => f.id);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formulaIds));
    } catch (error) {
      console.warn('Error saving recent formulas to session storage:', error);
    }
  }, []);

  // Add a formula to recent formulas
  const addRecentFormula = useCallback((formula) => {
    if (!formula || !formula.id) {
      console.warn('Invalid formula provided to addRecentFormula');
      return;
    }

    setRecentFormulas(prevRecent => {
      // Remove the formula if it already exists (to move it to the top)
      const filtered = prevRecent.filter(f => f.id !== formula.id);
      
      // Add to beginning and limit to MAX_RECENT_FORMULAS
      const updated = [formula, ...filtered].slice(0, MAX_RECENT_FORMULAS);
      
      // Save to session storage
      saveRecentFormulas(updated);
      
      return updated;
    });
  }, [saveRecentFormulas]);

  // Remove a specific formula from recent formulas
  const removeRecentFormula = useCallback((formulaId) => {
    setRecentFormulas(prevRecent => {
      const updated = prevRecent.filter(f => f.id !== formulaId);
      saveRecentFormulas(updated);
      return updated;
    });
  }, [saveRecentFormulas]);

  // Clear all recent formulas
  const clearRecentFormulas = useCallback(() => {
    setRecentFormulas([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get the category name for a formula
  const getFormulaCategoryName = useCallback((formulaId) => {
    // Import here to avoid circular dependencies
    import('../formulas').then(({ formulaDatabase }) => {
      for (const [categoryId, categoryData] of Object.entries(formulaDatabase)) {
        if (categoryData.formulas[formulaId]) {
          return categoryData.name;
        }
      }
      return 'Unknown';
    });
  }, []);

  // Check if a formula is in recent formulas
  const isFormulaRecent = useCallback((formulaId) => {
    return recentFormulas.some(f => f.id === formulaId);
  }, [recentFormulas]);

  // Get formula position in recent list (1-based index, 0 if not found)
  const getFormulaRecentPosition = useCallback((formulaId) => {
    const index = recentFormulas.findIndex(f => f.id === formulaId);
    return index === -1 ? 0 : index + 1;
  }, [recentFormulas]);

  return {
    // State
    recentFormulas,
    isLoading,
    
    // Actions
    addRecentFormula,
    removeRecentFormula,
    clearRecentFormulas,
    
    // Utilities
    isFormulaRecent,
    getFormulaRecentPosition,
    getFormulaCategoryName,
    
    // Metadata
    hasRecentFormulas: recentFormulas.length > 0,
    recentFormulasCount: recentFormulas.length,
    maxRecentFormulas: MAX_RECENT_FORMULAS
  };
};

export default useRecentFormulas;