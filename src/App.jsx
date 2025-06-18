import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UnitProvider } from './contexts/UnitContext';
import DisclaimerModal from './components/Layout/DisclaimerModal';
import MarketingHomepage from './pages/MarketingHomepage';
import Dashboard from './pages/Dashboard';
import QuickCalculations from './pages/QuickCalculations';
import ReconstructionReport from './pages/ReconstructionReport';
import EDRAnalysis from './pages/EDRAnalysis';
import PreferredFormulas from './pages/PreferredFormulas';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AxisRecon Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Application Error</h2>
            <p className="text-gray-600 mb-4">
              AxisRecon encountered an unexpected error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component - SIMPLIFIED ROUTING
function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Marketing Homepage (no UnitProvider needed) */}
        <Route path="/" element={<MarketingHomepage />} />
        
        {/* App Routes - ALL ROUTES DEFINED HERE */}
        <Route path="/app" element={
          <UnitProvider>
            <DisclaimerModal />
            <Dashboard />
          </UnitProvider>
        } />
        
        <Route path="/app/quick" element={
          <UnitProvider>
            <QuickCalculations />
          </UnitProvider>
        } />
        
        <Route path="/app/reports" element={
          <UnitProvider>
            <ReconstructionReport />
          </UnitProvider>
        } />
        
        <Route path="/app/edr" element={
          <UnitProvider>
            <EDRAnalysis />
          </UnitProvider>
        } />
        
        <Route path="/app/preferred" element={
          <UnitProvider>
            <PreferredFormulas />
          </UnitProvider>
        } />
        
        {/* App 404 - for any /app/* routes that don't match */}
        <Route path="/app/*" element={
          <UnitProvider>
            <NotFoundPage />
          </UnitProvider>
        } />
        
        {/* Marketing 404 - for any other routes */}
        <Route path="*" element={<MarketingNotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

// Marketing 404 Page (clean, directs to marketing)
const MarketingNotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 915.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Return to AxisRecon
          </button>
        </div>
      </div>
    </div>
  );
};

// App 404 Page (professional, directs to app dashboard)
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Tool Not Found</h2>
        
        <p className="text-gray-600 mb-6">
          The tool you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/app'}
            className="w-full bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Return to Tools Dashboard
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-axisBlue">AxisRecon</span> - Reconstruct with Confidence
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;