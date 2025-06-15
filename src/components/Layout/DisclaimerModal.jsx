import React from 'react';
import { useUnit } from '../../contexts/UnitContext';

const DisclaimerModal = () => {
  const { disclaimerAccepted, setDisclaimerAccepted } = useUnit();

  // Don't render if already accepted
  if (disclaimerAccepted) {
    return null;
  }

  const handleAccept = () => {
    setDisclaimerAccepted(true);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="bg-axisBlue text-white p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold font-inter text-center">
              AxisRecon
            </h2>
            <p className="text-center text-blue-100 mt-1 font-roboto">
              Reconstruct with Confidence
            </p>
          </div>

          {/* Body */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 font-inter">
              Important Notice
            </h3>
            
            <div className="bg-yellow-50 border-l-4 border-axisYellow p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-axisYellow" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    Mathematical Verification Tool
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                These calculation tools are provided for verification and validation purposes only. They are intended to support, not replace, professional engineering judgment and manual analysis in crash reconstruction applications.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Professional Use Guidelines:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Verify calculations against your manual work</li>
                  <li>• Use as a secondary confirmation tool</li>
                  <li>• Maintain professional engineering judgment</li>
                  <li>• Follow applicable standards and regulations</li>
                </ul>
              </div>

              <p className="text-gray-700 text-base leading-relaxed mb-6">
                By using AxisRecon, you acknowledge that this software is intended for 
                professional crash reconstruction specialists and should be used in conjunction 
                with proper engineering analysis and expertise.
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This disclaimer will only appear once per session. 
                  Your preferences and settings will be maintained throughout your current session.
                </p>
              </div>
            </div>
          </div>

          {/* Footer with Accept Button */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
            <div className="flex justify-center">
              <button
                onClick={handleAccept}
                className="bg-axisBlue hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-axisBlue focus:ring-opacity-50"
              >
                I Understand and Accept
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              Clicking "Accept" allows you to proceed to the AxisRecon tools
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerModal;