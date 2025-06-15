import React, { useState } from 'react';
import PageLayout, { ContentCard } from '../components/Layout/PageLayout';
import { useUnit } from '../contexts/UnitContext';

const EDRAnalysis = () => {
  const { unitSystem, formatResult } = useUnit();
  const [activeTab, setActiveTab] = useState('data-input');

  // Sample EDR data
  const sampleData = {
    vehicle: 'Honda Accord 2022',
    eventTrigger: 'Event Trigger',
    preEventTrigger: '5.0 seconds',
    deltaV: '25.3 mph',
    maxDeltaV: '27.1 mph',
    timeToDeltaV: '0.12 seconds',
    seatbeltStatus: 'Buckled',
    preEventTriggerSpeed: ['45.2', '44.8', '44.1', '43.5', '42.9'],
    eventData: [
      { time: '-5.0', speed: '45.2', throttle: '15%', brake: 'Off' },
      { time: '-4.0', speed: '44.8', throttle: '12%', brake: 'Off' },
      { time: '-3.0', speed: '44.1', throttle: '8%', brake: 'Off' },
      { time: '-2.0', speed: '43.5', throttle: '5%', brake: 'On' },
      { time: '-1.0', speed: '42.9', throttle: '0%', brake: 'On' },
      { time: '0.0', speed: '0.0', throttle: '0%', brake: 'On' }
    ]
  };

  const tabs = [
    { id: 'data-input', name: 'Data Input', icon: '📝' },
    { id: 'speed-analysis', name: 'Speed Analysis', icon: '📈' },
    { id: 'distance-calculation', name: 'Distance Calculation', icon: '📏' },
    { id: 'report-export', name: 'Report Export', icon: '📄' }
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <ContentCard
          title="EDR Analysis"
          subtitle="Event Data Recorder speed and distance analysis for crash reconstruction"
          headerActions={
            <div className="text-sm text-gray-600">
              Units: <span className="font-medium text-axisBlue">{unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</span>
            </div>
          }
        >
          <p className="text-gray-600">
            Analyze Event Data Recorder information to determine pre-crash speeds, 
            calculate stopping distances, and generate professional reports for crash reconstruction.
          </p>
        </ContentCard>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-axisBlue text-axisBlue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon.replace(/[📝📈📏📄]/g, '')}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Data Input Tab */}
            {activeTab === 'data-input' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">EDR Data Input</h3>
                  <p className="text-gray-600 mb-6">
                    Paste or enter EDR data from your CDR tool. Use proper EDR terminology - "Event Trigger" not "impact".
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Vehicle Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make/Model/Year</label>
                        <input
                          type="text"
                          placeholder="Honda Accord 2022"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Trigger</label>
                        <input
                          type="text"
                          placeholder="Event Trigger"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delta V</label>
                        <input
                          type="text"
                          placeholder="25.3 mph"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* EDR Data Paste Area */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Raw EDR Data</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paste CDR Data</label>
                      <textarea
                        rows={8}
                        placeholder="Paste your EDR data from CDR tool here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                      ></textarea>
                    </div>
                    <button className="w-full bg-axisBlue hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors duration-200">
                      Parse EDR Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Speed Analysis Tab */}
            {activeTab === 'speed-analysis' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Speed Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Analysis of pre-event trigger speeds and deceleration patterns.
                  </p>
                </div>

                {/* Speed Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Speed vs Time Chart</h4>
                    <p className="text-gray-500">Interactive chart will display EDR speed data over time</p>
                  </div>
                </div>

                {/* Speed Data Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Pre-Event Trigger Speed Data</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (s)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Throttle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brake</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sampleData.eventData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.speed} {unitSystem === 'imperial' ? 'mph' : 'km/h'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.throttle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                row.brake === 'On' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {row.brake}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Distance Calculation Tab */}
            {activeTab === 'distance-calculation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Calculation</h3>
                  <p className="text-gray-600 mb-6">
                    Calculate stopping distances and travel distances based on EDR speed data.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calculation Inputs */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Calculation Parameters</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Speed</label>
                        <input
                          type="number"
                          placeholder="45.2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                        />
                        <span className="text-xs text-gray-500">{unitSystem === 'imperial' ? 'mph' : 'km/h'}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Final Speed</label>
                        <input
                          type="number"
                          placeholder="0.0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                        />
                        <span className="text-xs text-gray-500">{unitSystem === 'imperial' ? 'mph' : 'km/h'}</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deceleration Time</label>
                        <input
                          type="number"
                          placeholder="2.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                        />
                        <span className="text-xs text-gray-500">seconds</span>
                      </div>
                    </div>
                    <button className="w-full bg-axisBlue hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors duration-200">
                      Calculate Distance
                    </button>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Calculated Results</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Stopping Distance:</span>
                        <span className="text-sm font-semibold text-axisBlue">
                          {formatResult(156.8)} {unitSystem === 'imperial' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Average Deceleration:</span>
                        <span className="text-sm font-semibold text-axisBlue">
                          {formatResult(18.1)} {unitSystem === 'imperial' ? 'ft/s²' : 'm/s²'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-700">Peak Deceleration:</span>
                        <span className="text-sm font-semibold text-axisBlue">
                          {formatResult(22.4)} {unitSystem === 'imperial' ? 'ft/s²' : 'm/s²'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Report Export Tab */}
            {activeTab === 'report-export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Export</h3>
                  <p className="text-gray-600 mb-6">
                    Generate professional EDR analysis reports with charts and calculations.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Report Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Report Options</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Include speed vs time chart</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Include distance calculations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue" defaultChecked />
                        <span className="ml-2 text-sm text-gray-700">Include raw EDR data table</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue" />
                        <span className="ml-2 text-sm text-gray-700">Include methodology notes</span>
                      </label>
                    </div>
                  </div>

                  {/* Export Actions */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Export Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export PDF Report
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h6l4 4v12a4 4 0 01-4 4z" />
                        </svg>
                        Export Excel Data
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Preview Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

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
                <strong>Development Note:</strong> EDR analysis functionality is currently a placeholder. 
                Chart generation, data parsing, and calculation engines will be implemented in future phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EDRAnalysis;