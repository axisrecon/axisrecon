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
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="bg-axisBlue text-white px-8 py-6 rounded-t-lg">
            <div className="text-center">
              <h1 className="text-2xl font-bold font-inter">AxisRecon</h1>
              <p className="text-blue-100 mt-1 font-roboto text-sm">Professional Crash Reconstruction Software</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-inter">
                Professional Use Notice
              </h2>
              
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                AxisRecon is a professional crash reconstruction analysis tool designed for qualified 
                engineers, technicians, and investigators. These computational tools are provided to 
                support professional analysis and must be used in conjunction with proper engineering 
                judgment and established methodologies.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Intended Use</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                This software provides mathematical verification tools for crash reconstruction calculations. 
                Users are responsible for validating results, applying appropriate safety factors, and 
                ensuring compliance with applicable industry standards and regulatory requirements.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Professional Responsibility</h3>
              <div className="text-gray-700 text-sm space-y-2">
                <p>• Verify all calculations through independent analysis</p>
                <p>• Apply professional engineering judgment to all results</p>
                <p>• Ensure appropriate qualifications for reconstruction work</p>
                <p>• Follow applicable legal and professional standards</p>
              </div>
            </div>

            <div className="border-l-4 border-axisYellow bg-yellow-50 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> This software does not replace professional expertise or 
                eliminate the need for thorough investigation and analysis. Results should be validated 
                against established engineering principles and field evidence.
              </p>
            </div>

            <p className="text-gray-600 text-sm">
              By proceeding, you acknowledge that you are a qualified professional and will use this 
              software appropriately within the scope of your expertise and applicable standards.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 rounded-b-lg">
            <div className="flex justify-center">
              <button
                onClick={handleAccept}
                className="bg-axisBlue hover:bg-blue-800 text-white font-semibold py-3 px-12 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-axisBlue focus:ring-opacity-50 text-base"
              >
                Accept and Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerModal;