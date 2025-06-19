import React, { useState } from 'react';
import PageLayout, { ContentCard } from '../components/Layout/PageLayout';
import { useUnit } from '../contexts/UnitContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EDRAnalysis = () => {
  const { unitSystem, formatResult } = useUnit();
  const [activeTab, setActiveTab] = useState('data-input');
  
  // Form data
  const [vehicleInfo, setVehicleInfo] = useState({
    makeModel: '',
    crashDate: ''
  });
  
  // Raw CSV data
  const [timeData, setTimeData] = useState('');
  const [speedData, setSpeedData] = useState('');
  
  // Parsed data
  const [parsedEDRData, setParsedEDRData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');

  // Get unit labels based on current unit system
  const getUnitLabel = (type) => {
    const unitLabels = {
      imperial: {
        speed: 'mph',
        distance: 'ft',
        time: 's'
      },
      metric: {
        speed: 'km/h',
        distance: 'm', 
        time: 's'
      }
    };
    return unitLabels[unitSystem][type] || '';
  };

  const tabs = [
    { id: 'data-input', name: 'Data Input', icon: '📝' },
    { id: 'speed-analysis', name: 'Speed Analysis', icon: '📈' },
    { id: 'distance-calculation', name: 'Distance Calculation', icon: '📏' },
    { id: 'report-export', name: 'Report Export', icon: '📄' }
  ];

  // Parse CSV data
  const parseCSVData = () => {
    setError('');
    
    if (!timeData.trim() || !speedData.trim()) {
      setError('Both time and speed data are required');
      return;
    }

    try {
      // Parse time data
      const timeValues = timeData.trim().split(/[\n,\t\r]+/).map(val => {
        const parsed = parseFloat(val.trim());
        if (isNaN(parsed)) {
          throw new Error(`Invalid time value: "${val.trim()}"`);
        }
        return parsed;
      }).filter(val => !isNaN(val));

      // Parse speed data
      const speedValues = speedData.trim().split(/[\n,\t\r]+/).map(val => {
        const parsed = parseFloat(val.trim());
        if (isNaN(parsed)) {
          throw new Error(`Invalid speed value: "${val.trim()}"`);
        }
        return parsed;
      }).filter(val => !isNaN(val));

      // Validate data lengths match
      if (timeValues.length !== speedValues.length) {
        setError(`Data length mismatch: ${timeValues.length} time values vs ${speedValues.length} speed values`);
        return;
      }

      if (timeValues.length < 2) {
        setError('At least 2 data points are required for analysis');
        return;
      }

      // Create data pairs and sort by time
      const dataPoints = timeValues.map((time, index) => ({
        time: time,
        speed: speedValues[index]
      })).sort((a, b) => a.time - b.time);

      // Validate time values (should be negative or zero)
      const invalidTimes = dataPoints.filter(point => point.time > 0);
      if (invalidTimes.length > 0) {
        setError(`Time values must be ≤ 0 (Event Trigger = 0). Found invalid times: ${invalidTimes.map(p => p.time).join(', ')}`);
        return;
      }

      // Validate speed values (should be non-negative)
      const invalidSpeeds = dataPoints.filter(point => point.speed < 0);
      if (invalidSpeeds.length > 0) {
        setError(`Speed values cannot be negative. Found invalid speeds: ${invalidSpeeds.map(p => p.speed).join(', ')}`);
        return;
      }

      setParsedEDRData(dataPoints);
      calculateAnalysis(dataPoints);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate comprehensive analysis
  const calculateAnalysis = (dataPoints) => {
    const speedChangeThreshold = 10; // 10 mph or 10 km/h
    const gravity = 32.2; // ft/s² (standard for crash reconstruction)
    
    const results = [];
    let totalDistance = 0;
    const dragFactors = [];
    
    // Check if Event Trigger (0.0) is included in the data
    const hasEventTrigger = dataPoints.some(point => point.time === 0);
    const lastDataPoint = dataPoints[dataPoints.length - 1]; // Closest to Event Trigger
    const timeToEventTrigger = hasEventTrigger ? 0 : Math.abs(lastDataPoint.time);
    let extrapolatedDistance = 0;
    
    // Calculate extrapolated distance if no Event Trigger point
    if (!hasEventTrigger && timeToEventTrigger > 0) {
      let speedInDistanceUnits;
      if (unitSystem === 'imperial') {
        speedInDistanceUnits = lastDataPoint.speed * 1.466; // mph to ft/s
      } else {
        speedInDistanceUnits = lastDataPoint.speed / 3.6; // km/h to m/s
      }
      extrapolatedDistance = speedInDistanceUnits * timeToEventTrigger;
    }
    
    for (let i = 0; i < dataPoints.length; i++) {
      const current = dataPoints[i];
      const previous = i > 0 ? dataPoints[i - 1] : null;
      
      let speedChange = null;
      let decelAccelRate = null;
      let dragFactor = null;
      let segmentDistance = 0;
      let isSignificantChange = false;
      
      if (previous) {
        const timeInterval = Math.abs(current.time - previous.time);
        speedChange = current.speed - previous.speed;
        isSignificantChange = Math.abs(speedChange) > speedChangeThreshold;
        
        // Calculate deceleration/acceleration rate
        // Convert speed change to ft/s or m/s for proper acceleration units
        let speedChangeInDistanceUnits;
        if (unitSystem === 'imperial') {
          speedChangeInDistanceUnits = speedChange * 1.466; // mph to ft/s
        } else {
          speedChangeInDistanceUnits = speedChange / 3.6; // km/h to m/s
        }
        
        decelAccelRate = speedChangeInDistanceUnits / timeInterval; // ft/s² or m/s²
        
        // Calculate drag factor: f = (v1-v2)/(g×t)
        // Note: Using speed in original units for drag factor calculation
        const speedDifference = previous.speed - current.speed; // Deceleration is positive
        dragFactor = speedDifference / (gravity * timeInterval);
        
        if (!isNaN(dragFactor) && isFinite(dragFactor)) {
          dragFactors.push(dragFactor);
        }
        
        // Calculate segment distance using average speed
        const avgSpeed = (previous.speed + current.speed) / 2;
        let avgSpeedInDistanceUnits;
        if (unitSystem === 'imperial') {
          avgSpeedInDistanceUnits = avgSpeed * 1.466; // mph to ft/s
        } else {
          avgSpeedInDistanceUnits = avgSpeed / 3.6; // km/h to m/s
        }
        
        segmentDistance = avgSpeedInDistanceUnits * timeInterval;
        totalDistance += segmentDistance;
      }
      
      results.push({
        time: current.time,
        speed: current.speed,
        speedChange: speedChange,
        decelAccelRate: decelAccelRate,
        dragFactor: dragFactor,
        segmentDistance: segmentDistance,
        cumulativeDistance: totalDistance,
        isSignificantChange: isSignificantChange
      });
    }
    
    // Add extrapolated distance to total if no Event Trigger
    const finalTotalDistance = totalDistance + extrapolatedDistance;
    
    // Calculate summary statistics
    const speedChanges = results.filter(r => r.speedChange !== null).map(r => r.speedChange);
    const decelAccelRates = results.filter(r => r.decelAccelRate !== null).map(r => r.decelAccelRate);
    const validDragFactors = dragFactors.filter(f => !isNaN(f) && isFinite(f));
    
    const avgSpeedChange = speedChanges.length > 0 ? 
      speedChanges.reduce((sum, change) => sum + change, 0) / speedChanges.length : 0;
    
    const avgDecelAccelRate = decelAccelRates.length > 0 ? 
      decelAccelRates.reduce((sum, rate) => sum + rate, 0) / decelAccelRates.length : 0;
    
    const avgDragFactor = validDragFactors.length > 0 ? 
      validDragFactors.reduce((sum, factor) => sum + factor, 0) / validDragFactors.length : 0;
    
    const maxSpeed = Math.max(...dataPoints.map(p => p.speed));
    const minSpeed = Math.min(...dataPoints.map(p => p.speed));
    const significantEvents = results.filter(r => r.isSignificantChange).length;
    
    setAnalysisResults({
      dataPoints: results,
      totalDistance: finalTotalDistance,
      measuredDistance: totalDistance,
      extrapolatedDistance: extrapolatedDistance,
      hasEventTrigger: hasEventTrigger,
      timeToEventTrigger: timeToEventTrigger,
      lastDataPointTime: lastDataPoint.time,
      avgSpeedChange: avgSpeedChange,
      avgDecelAccelRate: avgDecelAccelRate,
      avgDragFactor: avgDragFactor,
      maxSpeed: maxSpeed,
      minSpeed: minSpeed,
      significantEvents: significantEvents,
      timeSpan: Math.abs(dataPoints[dataPoints.length - 1].time - dataPoints[0].time)
    });
  };

  // Generate PDF Report
  const generatePDFReport = async () => {
    console.log('PDF generation started');
    console.log('analysisResults state:', analysisResults);
    console.log('vehicleInfo state:', vehicleInfo);
    
    // Check if we have analysis results
    if (!analysisResults || !analysisResults.dataPoints) {
      console.error('No analysis results available');
      setError('No analysis data available to export. Please parse EDR data first.');
      return;
    }

    try {
      setError(''); // Clear any previous errors
      console.log('Starting PDF import...');
      
      // Dynamic import of jsPDF
      const { default: jsPDF } = await import('jspdf');
      console.log('jsPDF imported successfully');
      
      const doc = new jsPDF();
      let currentY = 20;

      // Helper function to add text with line wrapping
      const addText = (text, x = 20, fontSize = 10, fontStyle = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        
        const lines = doc.splitTextToSize(text, 170);
        lines.forEach((line) => {
          if (currentY > 280) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(line, x, currentY);
          currentY += fontSize * 0.5 + 2;
        });
        currentY += 4;
      };

      console.log('Building PDF content...');

      // Header
      addText('EDR Analysis Report', 20, 18, 'bold');
      addText('Generated by AxisRecon', 20, 9, 'normal');
      currentY += 10;

      // Report Information
      addText('REPORT INFORMATION', 20, 12, 'bold');
      addText(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`);
      addText(`Unit System: ${unitSystem === 'imperial' ? 'Imperial (mph, ft)' : 'Metric (km/h, m)'}`);
      if (vehicleInfo && vehicleInfo.crashDate) {
        addText(`Analysis Date: ${vehicleInfo.crashDate}`);
      }
      currentY += 8;

      // Vehicle Information
      if (vehicleInfo && (vehicleInfo.makeModel || vehicleInfo.crashDate)) {
        addText('VEHICLE INFORMATION', 20, 12, 'bold');
        if (vehicleInfo.makeModel) {
          addText(`Vehicle: ${vehicleInfo.makeModel}`);
        }
        if (vehicleInfo.crashDate) {
          addText(`Incident Date: ${vehicleInfo.crashDate}`);
        }
        currentY += 8;
      }

      // Analysis Summary
      addText('ANALYSIS SUMMARY', 20, 12, 'bold');
      addText(`Data Points: ${analysisResults.dataPoints.length}`);
      addText(`Time Period: ${formatResult(analysisResults.timeSpan, 1)} seconds`);
      addText(`Approximate Total Distance: ${formatResult(analysisResults.totalDistance, 1)} ${getUnitLabel('distance')}`);
      
      if (analysisResults.hasEventTrigger === false) {
        addText(`Measured Distance: ${formatResult(analysisResults.measuredDistance, 1)} ${getUnitLabel('distance')}`);
        addText(`Extrapolated Distance: ${formatResult(analysisResults.extrapolatedDistance, 1)} ${getUnitLabel('distance')}`);
        addText(`Note: Event Trigger (0.0s) extrapolated from final data point`);
      }
      currentY += 8;

      // Key Results
      addText('KEY RESULTS', 20, 12, 'bold');
      addText(`Maximum Speed: ${formatResult(analysisResults.maxSpeed, 1)} ${getUnitLabel('speed')}`);
      addText(`Minimum Speed: ${formatResult(analysisResults.minSpeed, 1)} ${getUnitLabel('speed')}`);
      addText(`Average Speed Change: ${formatResult(analysisResults.avgSpeedChange, 1)} ${getUnitLabel('speed')}`);
      addText(`Average Decel/Accel Rate: ${formatResult(analysisResults.avgDecelAccelRate, 1)} ${getUnitLabel('distance')}/s²`);
      addText(`Average Drag Factor: ${formatResult(analysisResults.avgDragFactor, 3)}`);
      addText(`Significant Events (>10 ${getUnitLabel('speed')}): ${analysisResults.significantEvents}`);
      currentY += 8;

      // Speed Analysis Data
      addText('SPEED ANALYSIS DATA', 20, 12, 'bold');
      addText(`Time (s)    Speed (${getUnitLabel('speed')})    Change (${getUnitLabel('speed')})    Decel/Accel (${getUnitLabel('distance')}/s²)    Drag Factor`, 20, 9, 'bold');
      
      if (analysisResults.dataPoints && Array.isArray(analysisResults.dataPoints)) {
        analysisResults.dataPoints.forEach((point) => {
          const timeStr = point.time.toString().padEnd(8);
          const speedStr = formatResult(point.speed, 1).padEnd(12);
          const changeStr = (point.speedChange !== null ? formatResult(point.speedChange, 1) : '—').padEnd(12);
          const decelStr = (point.decelAccelRate !== null ? formatResult(point.decelAccelRate, 1) : '—').padEnd(16);
          const dragStr = point.dragFactor !== null ? formatResult(point.dragFactor, 3) : '—';
          
          addText(`${timeStr} ${speedStr} ${changeStr} ${decelStr} ${dragStr}`, 20, 8);
        });
      }
      
      currentY += 8;

      // Distance Breakdown
      addText('DISTANCE BREAKDOWN', 20, 12, 'bold');
      addText(`Time (s)    Speed (${getUnitLabel('speed')})    Segment (${getUnitLabel('distance')})    Cumulative (${getUnitLabel('distance')})`, 20, 9, 'bold');
      
      if (analysisResults.dataPoints && Array.isArray(analysisResults.dataPoints)) {
        analysisResults.dataPoints.forEach((point) => {
          const timeStr = point.time.toString().padEnd(8);
          const speedStr = formatResult(point.speed, 1).padEnd(12);
          const segmentStr = (point.segmentDistance > 0 ? formatResult(point.segmentDistance, 1) : '—').padEnd(12);
          const cumulativeStr = formatResult(point.cumulativeDistance, 1);
          
          addText(`${timeStr} ${speedStr} ${segmentStr} ${cumulativeStr}`, 20, 8);
        });
      }

      currentY += 8;

      // Methodology
      addText('CALCULATION METHODOLOGY', 20, 12, 'bold');
      addText('Distance Calculation: Each segment uses average speed method');
      addText('Formula: Distance = ((Speed₁ + Speed₂) / 2) × Time_Interval');
      addText(`Speed Conversion: ${unitSystem === 'imperial' ? 'mph × 1.466 = ft/s' : 'km/h ÷ 3.6 = m/s'}`);
      addText('Drag Factor: f = (v1-v2)/(g×t) where g = 32.2 ft/s²');
      
      if (analysisResults.hasEventTrigger === false) {
        addText('Extrapolation: Final speed × time gap to Event Trigger (0.0s)');
        addText('Assumption: Constant speed from last data point to Event Trigger');
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('AxisRecon.com', 105, 285, { align: 'center' });

      console.log('Saving PDF...');

      // Save the PDF
      const fileName = `EDR_Analysis_${vehicleInfo && vehicleInfo.makeModel ? vehicleInfo.makeModel.replace(/\s+/g, '_') : 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      console.log('PDF generated successfully:', fileName);

    } catch (error) {
      console.error('PDF generation failed:', error);
      setError(`Failed to generate PDF report: ${error.message || 'Unknown error'}`);
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`Time: ${label}s`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${
                entry.name === 'Speed' ? ` ${getUnitLabel('speed')}` :
                entry.name === 'Distance' ? ` ${getUnitLabel('distance')}` : ''
              }`}
            </p>
          ))}
          {data.isSignificantChange && (
            <p className="text-orange-600 font-semibold">⚠️ Significant Change</p>
          )}
        </div>
      );
    }
    return null;
  };

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
            Analyze Event Data Recorder information to determine pre-event trigger speeds, 
            calculate distances, and generate professional reports for crash reconstruction.
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Make/Model/Year
                      </label>
                      <input
                        type="text"
                        value={vehicleInfo.makeModel}
                        onChange={(e) => setVehicleInfo(prev => ({ ...prev, makeModel: e.target.value }))}
                        placeholder="Honda Accord 2022"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Crash Date
                      </label>
                      <input
                        type="date"
                        value={vehicleInfo.crashDate}
                        onChange={(e) => setVehicleInfo(prev => ({ ...prev, crashDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw EDR Data</h3>
                  <p className="text-gray-600 mb-4">
                    Paste your EDR data from CDR tools. Use proper EDR terminology - "Event Trigger" represents the crash moment (time = 0).
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Stamps (seconds)
                      </label>
                      <textarea
                        value={timeData}
                        onChange={(e) => setTimeData(e.target.value)}
                        placeholder={`Paste time values here (one per line):\n-5.0\n-4.0\n-3.0\n-2.0\n-1.0\n0.0`}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Times should be ≤ 0 (Event Trigger = 0)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speed Values ({getUnitLabel('speed')})
                      </label>
                      <textarea
                        value={speedData}
                        onChange={(e) => setSpeedData(e.target.value)}
                        placeholder={`Paste speed values here (one per line):\n45.2\n44.8\n44.1\n43.5\n42.9\n0.0`}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-axisBlue focus:border-axisBlue font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Speed values must be ≥ 0
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={parseCSVData}
                      className="bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Parse EDR Data
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {parsedEDRData.length > 0 && !error && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">
                          Successfully parsed {parsedEDRData.length} data points. Navigate to Speed Analysis to view results.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Speed Analysis Tab */}
            {activeTab === 'speed-analysis' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Speed Analysis</h3>
                  {!analysisResults ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Data Available</h4>
                      <p className="text-gray-500 mb-4">Please parse EDR data in the Data Input tab first.</p>
                      <button
                        onClick={() => setActiveTab('data-input')}
                        className="bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Go to Data Input
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Extrapolation Notice - Only show if no Event Trigger */}
                      {analysisResults && !analysisResults.hasEventTrigger && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-blue-800 mb-2">📊 Event Trigger Extrapolation Applied</h4>
                          <div className="text-blue-700 space-y-1">
                            <p>• <strong>No Event Trigger (0.0s) detected</strong> in EDR data</p>
                            <p>• Last data point was at <strong>{analysisResults.lastDataPointTime}s</strong></p>
                            <p>• Extrapolated additional <strong>{formatResult(analysisResults.extrapolatedDistance, 1)} {getUnitLabel('distance')}</strong> to reach Event Trigger</p>
                            <p>• Used final speed of <strong>{formatResult(analysisResults.dataPoints[analysisResults.dataPoints.length - 1].speed, 1)} {getUnitLabel('speed')}</strong> over remaining <strong>{formatResult(analysisResults.timeToEventTrigger, 1)}s</strong></p>
                            <p>• <strong>Total Distance = Measured Distance + Extrapolated Distance</strong></p>
                          </div>
                        </div>
                      )}

                      {/* Summary Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-axisBlue">{formatResult(analysisResults.avgSpeedChange, 1)}</div>
                          <div className="text-sm text-gray-600">Avg Speed Change ({getUnitLabel('speed')})</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-600">{formatResult(analysisResults.avgDecelAccelRate, 1)}</div>
                          <div className="text-sm text-gray-600">Avg Decel/Accel ({getUnitLabel('distance')}/s²)</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-purple-600">{formatResult(analysisResults.avgDragFactor, 3)}</div>
                          <div className="text-sm text-gray-600">Avg Drag Factor</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-600">{analysisResults.significantEvents}</div>
                          <div className="text-sm text-gray-600">Significant Events (&gt;10 {getUnitLabel('speed')})</div>
                        </div>
                      </div>

                      {/* Speed Chart */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Speed vs Time</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analysisResults.dataPoints}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="time" 
                                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                              />
                              <YAxis 
                                label={{ value: `Speed (${getUnitLabel('speed')})`, angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="speed" 
                                stroke="#1E3A8A" 
                                strokeWidth={2}
                                dot={{ fill: '#1E3A8A', strokeWidth: 2, r: 4 }}
                                name="Speed"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Detailed Analysis Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (s)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed ({getUnitLabel('speed')})</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed Change ({getUnitLabel('speed')})</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decel/Accel Rate ({getUnitLabel('distance')}/s²)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drag Factor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {analysisResults.dataPoints.map((point, index) => (
                              <tr key={index} className={`${point.isSignificantChange ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {point.time}
                                  {point.time === 0 && <span className="ml-2 text-xs text-blue-600">(Event Trigger)</span>}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatResult(point.speed, 1)}
                                </td>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                                  point.isSignificantChange 
                                    ? 'font-bold text-red-600' 
                                    : point.speedChange && point.speedChange < 0 
                                      ? 'text-red-600' 
                                      : point.speedChange && point.speedChange > 0 
                                        ? 'text-green-600' 
                                        : 'text-gray-900'
                                }`}>
                                  {point.speedChange !== null ? 
                                    (point.speedChange > 0 ? '+' : '') + formatResult(point.speedChange, 1) : 
                                    '—'
                                  }
                                  {point.isSignificantChange && <span className="ml-1">⚠️</span>}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {point.decelAccelRate !== null ? formatResult(point.decelAccelRate, 1) : '—'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {point.dragFactor !== null ? formatResult(point.dragFactor, 3) : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Distance Calculation Tab */}
            {activeTab === 'distance-calculation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Calculation</h3>
                  {!analysisResults ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Data Available</h4>
                      <p className="text-gray-500 mb-4">Please parse EDR data in the Data Input tab first.</p>
                      <button
                        onClick={() => setActiveTab('data-input')}
                        className="bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Go to Data Input
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Distance Breakdown with Extrapolation Info */}
                      {analysisResults && !analysisResults.hasEventTrigger && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{formatResult(analysisResults.measuredDistance, 1)}</div>
                            <div className="text-sm text-gray-600">Measured Distance ({getUnitLabel('distance')})</div>
                            <div className="text-xs text-gray-500 mt-1">From EDR data points</div>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">{formatResult(analysisResults.extrapolatedDistance, 1)}</div>
                            <div className="text-sm text-gray-600">Extrapolated Distance ({getUnitLabel('distance')})</div>
                            <div className="text-xs text-gray-500 mt-1">To Event Trigger (0.0s)</div>
                          </div>
                        </div>
                      )}

                      {/* Distance Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-blue-50 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-axisBlue">{formatResult(analysisResults.totalDistance, 1)}</div>
                          <div className="text-sm text-gray-600 mt-1">Approximate Total EDR Distance ({getUnitLabel('distance')})</div>
                          <div className="text-xs text-gray-500 mt-2">Distance covered during EDR recording period</div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-green-600">{formatResult(analysisResults.timeSpan, 1)}</div>
                          <div className="text-sm text-gray-600 mt-1">Time Span (seconds)</div>
                          <div className="text-xs text-gray-500 mt-2">Duration of EDR recording</div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-purple-600">{formatResult((analysisResults.totalDistance / analysisResults.timeSpan) * (unitSystem === 'imperial' ? 0.681818 : 3.6), 1)}</div>
                          <div className="text-sm text-gray-600 mt-1">Average Speed ({getUnitLabel('speed')})</div>
                          <div className="text-xs text-gray-500 mt-2">Overall average during event</div>
                        </div>
                      </div>

                      {/* Distance Chart */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Cumulative Distance vs Time</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analysisResults.dataPoints}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="time" 
                                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                              />
                              <YAxis 
                                label={{ value: `Distance (${getUnitLabel('distance')})`, angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="cumulativeDistance" 
                                stroke="#059669" 
                                strokeWidth={2}
                                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                                name="Cumulative Distance"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Distance Breakdown Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (s)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed ({getUnitLabel('speed')})</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment Distance ({getUnitLabel('distance')})</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumulative Distance ({getUnitLabel('distance')})</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Interval (s)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {analysisResults.dataPoints.map((point, index) => {
                              const previous = index > 0 ? analysisResults.dataPoints[index - 1] : null;
                              const timeInterval = previous ? Math.abs(point.time - previous.time) : 0;
                              
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {point.time}
                                    {point.time === 0 && <span className="ml-2 text-xs text-blue-600">(Event Trigger)</span>}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatResult(point.speed, 1)}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {point.segmentDistance > 0 ? formatResult(point.segmentDistance, 1) : '—'}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatResult(point.cumulativeDistance, 1)}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {timeInterval > 0 ? formatResult(timeInterval, 1) : '—'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Calculation Methodology */}
                      <div className="bg-gray-50 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Calculation Methodology</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p><strong>Distance Calculation:</strong> Each segment distance is calculated using the average speed method:</p>
                          <p className="font-mono text-xs bg-white p-2 rounded border">
                            Distance = ((Speed₁ + Speed₂) / 2) × Time_Interval
                          </p>
                          
                          {analysisResults && !analysisResults.hasEventTrigger ? (
                            <>
                              <p><strong>Extrapolation Method (No Event Trigger Detected):</strong></p>
                              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                                <p className="font-mono text-xs mb-2">
                                  Extrapolated_Distance = Final_Speed × Time_to_Event_Trigger
                                </p>
                                <p className="text-xs">
                                  • Final Speed: {formatResult(analysisResults.dataPoints[analysisResults.dataPoints.length - 1].speed, 1)} {getUnitLabel('speed')} 
                                  (converted to {getUnitLabel('distance')}/s)
                                </p>
                                <p className="text-xs">
                                  • Time Gap: {formatResult(analysisResults.timeToEventTrigger, 1)} seconds from last data point to Event Trigger
                                </p>
                                <p className="text-xs">
                                  • Assumes constant speed from last data point to Event Trigger
                                </p>
                              </div>
                              <p><strong>Approximate Total Distance:</strong> Measured Distance + Extrapolated Distance</p>
                            </>
                          ) : (
                            <p><strong>Approximate Total Distance:</strong> Sum of all segment distances from earliest time to Event Trigger (0.0s)</p>
                          )}
                          
                          <p><strong>Speed Conversion:</strong> {
                            unitSystem === 'imperial' 
                              ? 'mph × 1.466 = ft/s for distance calculations'
                              : 'km/h ÷ 3.6 = m/s for distance calculations'
                          }</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Report Export Tab */}
            {activeTab === 'report-export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Export</h3>
                  {!analysisResults ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Data Available</h4>
                      <p className="text-gray-500 mb-4">Please parse EDR data and complete analysis first.</p>
                      <button
                        onClick={() => setActiveTab('data-input')}
                        className="bg-axisBlue hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Go to Data Input
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Report Summary */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Report Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Vehicle Information</h5>
                            <p className="text-sm text-gray-600">Make/Model: {vehicleInfo.makeModel || 'Not specified'}</p>
                            <p className="text-sm text-gray-600">Crash Date: {vehicleInfo.crashDate || 'Not specified'}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Analysis Period</h5>
                            <p className="text-sm text-gray-600">Data Points: {analysisResults.dataPoints.length}</p>
                            <p className="text-sm text-gray-600">Time Span: {formatResult(analysisResults.timeSpan, 1)} seconds</p>
                            <p className="text-sm text-gray-600">Unit System: {unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Key Findings */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Key Findings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Approximate Total Distance Traveled:</span>
                              <span className="text-sm text-gray-900">{formatResult(analysisResults.totalDistance, 1)} {getUnitLabel('distance')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Maximum Speed:</span>
                              <span className="text-sm text-gray-900">{formatResult(analysisResults.maxSpeed, 1)} {getUnitLabel('speed')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Minimum Speed:</span>
                              <span className="text-sm text-gray-900">{formatResult(analysisResults.minSpeed, 1)} {getUnitLabel('speed')}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Average Drag Factor:</span>
                              <span className="text-sm text-gray-900">{formatResult(analysisResults.avgDragFactor, 3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Significant Events:</span>
                              <span className="text-sm text-gray-900">{analysisResults.significantEvents}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-700">Avg Decel/Accel Rate:</span>
                              <span className="text-sm text-gray-900">{formatResult(analysisResults.avgDecelAccelRate, 1)} {getUnitLabel('distance')}/s²</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Export Options */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Export Options</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button 
                            onClick={generatePDFReport}
                            disabled={!analysisResults}
                            className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                              !analysisResults 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF Report
                          </button>
                          
                          <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a4 4 0 014-4h6l4 4v12a4 4 0 01-4 4z" />
                            </svg>
                            Export Excel Data
                          </button>
                          
                          <button className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Preview Report
                          </button>
                        </div>
                      </div>

                      {/* Report Content Preview */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Report Content Preview</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue mr-2" defaultChecked />
                            <span>Vehicle information and crash details</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue mr-2" defaultChecked />
                            <span>Speed vs time analysis chart</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue mr-2" defaultChecked />
                            <span>Distance calculation breakdown</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue mr-2" defaultChecked />
                            <span>Drag factor analysis</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue mr-2" defaultChecked />
                            <span>Significant events summary</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-axisBlue focus:ring-axisBlue mr-2" />
                            <span>Methodology and calculation notes</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
                <strong>Professional EDR Analysis Tool:</strong> This tool provides comprehensive Event Data Recorder analysis 
                including speed changes, drag factor calculations, and distance measurements. Export functionality 
                will generate detailed reports suitable for crash reconstruction documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EDRAnalysis;