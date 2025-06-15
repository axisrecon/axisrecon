import React, { useState } from 'react';
import PageLayout, { ContentCard } from '../components/Layout/PageLayout';
import { useUnit } from '../contexts/UnitContext';

const ReconstructionReport = () => {
  const { unitSystem } = useUnit();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Case Information', description: 'Enter basic case details' },
    { id: 2, name: 'Formula Selection', description: 'Choose formulas for analysis' },
    { id: 3, name: 'Data Input', description: 'Input values for calculations' },
    { id: 4, name: 'Report Generation', description: 'Generate PDF report' }
  ];

  // Sample case information fields
  const caseFields = [
    { id: 'case_number', label: 'Case Number', type: 'text', placeholder: '2025-001' },
    { id: 'incident_date', label: 'Incident Date', type: 'date' },
    { id: 'location', label: 'Location', type: 'text', placeholder: 'Main St & Oak Ave' },
    { id: 'investigator', label: 'Investigator', type: 'text', placeholder: 'Your Name' },
    { id: 'report_date', label: 'Report Date', type: 'date' },
    { id: 'weather', label: 'Weather Conditions', type: 'text', placeholder: 'Clear, dry' }
  ];

  // Sample selected formulas
  const selectedFormulas = [
    { category: 'Speed and Velocity', name: 'Basic Speed', formula: 'v = d / t' },
    { category: 'Distance', name: 'Stopping Distance', formula: 'd = v² / (2μg)' },
    { category: 'Factors', name: 'Coefficient of Friction', formula: 'μ = tan(θ)' }
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <ContentCard
          title="Reconstruction Report"
          subtitle="Create comprehensive crash analysis reports with step-by-step calculations"
          headerActions={
            <div className="text-sm text-gray-600">
              Units: <span className="font-medium text-axisBlue">{unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</span>
            </div>
          }
        >
          <p className="text-gray-600">
            Build professional crash reconstruction reports by entering case information, 
            selecting relevant formulas, and generating detailed PDF documentation with 
            step-by-step calculations.
          </p>
        </ContentCard>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.id === currentStep 
                    ? 'border-axisBlue bg-axisBlue text-white' 
                    : step.id < currentStep 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {step.id < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{step.name}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-px bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={currentStep === 4}
              className="px-4 py-2 text-sm font-medium text-white bg-axisBlue border border-transparent rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <ContentCard title="Case Information" subtitle="Enter the basic details for this crash reconstruction">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                  />
                </div>
              ))}
            </div>
          </ContentCard>
        )}

        {currentStep === 2 && (
          <ContentCard title="Formula Selection" subtitle="Choose the formulas you want to include in this report">
            <div className="space-y-4">
              <p className="text-gray-600">
                Select formulas from different categories to build your comprehensive analysis:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Speed and Velocity', 'Distance', 'Time', 'Factors', 'Grade & Superelevation'].map((category) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <label key={i} className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue" />
                          <span className="ml-2 text-sm text-gray-700">Formula {i}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ContentCard>
        )}

        {currentStep === 3 && (
          <ContentCard title="Data Input" subtitle="Enter values for your selected formulas">
            <div className="space-y-6">
              {selectedFormulas.map((formula, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-axisBlue">
                  <h4 className="font-semibold text-gray-900 mb-1">{formula.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{formula.category}</p>
                  <div className="font-mono text-axisBlue mb-3">{formula.formula}</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Input 1</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Input 2</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                      <div className="px-3 py-2 bg-axisBlue text-white rounded-md">
                        — {unitSystem === 'imperial' ? 'ft/s' : 'm/s'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        )}

        {currentStep === 4 && (
          <ContentCard title="Report Generation" subtitle="Generate your professional crash reconstruction report">
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <svg className="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Report Ready</h3>
                <p className="text-green-700">
                  Your crash reconstruction report is ready to generate with step-by-step calculations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate PDF Report
                </button>
                <button className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Preview Report
                </button>
              </div>
            </div>
          </ContentCard>
        )}

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
                <strong>Development Note:</strong> Report generation workflow is currently a placeholder. 
                PDF generation, formula integration, and data persistence will be implemented in future phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReconstructionReport;