import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePageLayout } from '../components/Layout/PageLayout';

const HomePage = () => {
  const navigate = useNavigate();

  // Navigation tools with descriptions
  const tools = [
    {
      id: 'quick',
      title: 'Quick Calculations',
      description: 'Access individual crash reconstruction formulas for quick calculations',
      path: '/quick',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'reports',
      title: 'Reconstruction Report',
      description: 'Comprehensive crash analysis with detailed reporting and PDF export',
      path: '/full',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64m-6.326 2.64A7.962 7.962 0 0112 15c2.34 0 4.29 1.009 5.674 2.64M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'edr',
      title: 'EDR Analysis',
      description: 'Event Data Recorder speed and distance analysis for crash reconstruction',
      path: '/edr',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'preferred',
      title: 'Preferred Formulas',
      description: 'Quick access to your saved favorite formulas and common calculations',
      path: '/preferred',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  const handleToolNavigation = (path) => {
    navigate(path);
  };

  return (
    <HomePageLayout>
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-axisBlue to-blue-800 px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 font-inter">
            AxisRecon
          </h1>
          <p className="text-xl text-blue-100 font-medium">
            Reconstruct with Confidence
          </p>
          <div className="mt-6 pt-6 border-t border-blue-300/30">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Crash Analysis Tools
            </h2>
            <p className="text-blue-100">
              Professional crash reconstruction and analysis software
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolNavigation(tool.path)}
                className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-axisBlue rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-axisBlue focus:ring-opacity-50"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm border border-gray-200 group-hover:border-axisBlue group-hover:bg-axisBlue group-hover:text-white transition-all duration-200 mb-4">
                  <div className="text-axisBlue group-hover:text-white transition-colors duration-200">
                    {tool.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-axisBlue transition-colors duration-200 mb-2 font-inter">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="flex justify-end mt-4">
                  <svg 
                    className="h-5 w-5 text-gray-400 group-hover:text-axisBlue transition-colors duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Built for crash reconstruction professionals
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Professional Grade
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure & Reliable
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Precision Focused
              </span>
            </div>
          </div>
        </div>
      </div>
    </HomePageLayout>
  );
};

export default HomePage;