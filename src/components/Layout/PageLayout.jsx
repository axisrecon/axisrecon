import React from 'react';
import TopNavigation from './TopNavigation';

const PageLayout = ({ children, className = '', maxWidth = 'max-w-7xl' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content Area */}
      <main className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-axisBlue">AxisRecon</span> - Reconstruct with Confidence
            </div>
            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
              Built for crash reconstruction professionals
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Specialized layout for homepage (centered content)
export const HomePageLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-axisBlue via-blue-700 to-blue-900">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content Area - Centered */}
      <main className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-white/90">
              <span className="font-semibold">AxisRecon</span> - Reconstruct with Confidence
            </div>
            <div className="text-sm text-white/70 mt-2 sm:mt-0">
              Built for crash reconstruction professionals
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Specialized layout for full-width content (like charts/reports)
export const WidePageLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content Area - Full Width */}
      <main className={`px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-axisBlue">AxisRecon</span> - Reconstruct with Confidence
            </div>
            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
              Built for crash reconstruction professionals
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Card wrapper component for consistent content styling
export const ContentCard = ({ 
  children, 
  title, 
  subtitle, 
  className = '',
  headerActions = null
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-gray-900 font-inter">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-axisBlue ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-sm text-gray-600 mt-2">{text}</p>
      )}
    </div>
  );
};

// Error message component
export const ErrorMessage = ({ message, onRetry = null }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-3">
            <button
              onClick={onRetry}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Empty state component
export const EmptyState = ({ 
  title, 
  description, 
  action = null,
  icon = null 
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && action}
    </div>
  );
};

export default PageLayout;