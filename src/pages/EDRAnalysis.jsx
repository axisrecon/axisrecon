import React, { useState } from 'react';
import PageLayout, { ContentCard } from '../components/Layout/PageLayout';
import { useUnit } from '../contexts/UnitContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EDRAnalysis = () => {
  const { unitSystem, formatResult, getUnitLabel } = useUnit();
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

      // Validate data
      if (timeValues.length === 0 || speedValues.length === 0) {
        throw new Error('No valid data points found');
      }

      if (timeValues.length !== speedValues.length) {
        throw new Error(`Time and speed data must have the same number of values (Time: ${timeValues.length}, Speed: ${speedValues.length})`);
      }

      // Create combined data points
      const dataPoints = timeValues.map((time, index) => ({
        time: time,
        speed: speedValues[index]
      }));

      // Sort by time in descending order (EDR data is typically recorded backwards from Event Trigger)
      dataPoints.sort((a, b) => b.time - a.time);

      setParsedEDRData(dataPoints);
      setError('');
      console.log('Parsed EDR data:', dataPoints);
      
    } catch (err) {
      setError(err.message);
      setParsedEDRData([]);
    }
  };

  // Analyze EDR data for distance calculation
  const analyzeEDRData = () => {
    if (parsedEDRData.length === 0) {
      setError('No parsed data available. Please parse CSV data first.');
      return;
    }

    try {
      console.log('Starting EDR analysis...');
      
      // Create analysis copy of data (time ascending for calculations)
      const dataPoints = [...parsedEDRData].sort((a, b) => a.time - b.time);
      console.log('Data points for analysis:', dataPoints);
      
      // Check for Event Trigger (time = 0.0)
      const hasEventTrigger = dataPoints.some(point => Math.abs(point.time) < 0.01);
      console.log('Has Event Trigger:', hasEventTrigger);
      
      // Constants
      const gravity = unitSystem === 'imperial' ? 32.2 : 9.81; // ft/s² or m/s²
      const speedChangeThreshold = 10; // Threshold for significant speed changes
      
      // Analysis results array
      const results = [];
      let totalDistance = 0;
      let extrapolatedDistance = 0;
      let timeToEventTrigger = 0;
      const dragFactors = [];
      
      // Process each data point
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
      
      // Extrapolation calculation if no Event Trigger
      if (!hasEventTrigger) {
        const finalDataPoint = dataPoints[dataPoints.length - 1];
        timeToEventTrigger = Math.abs(finalDataPoint.time); // Time from final point to 0.0s
        
        // Convert final speed to distance units
        let finalSpeedInDistanceUnits;
        if (unitSystem === 'imperial') {
          finalSpeedInDistanceUnits = finalDataPoint.speed * 1.466; // mph to ft/s
        } else {
          finalSpeedInDistanceUnits = finalDataPoint.speed / 3.6; // km/h to m/s
        }
        
        extrapolatedDistance = finalSpeedInDistanceUnits * timeToEventTrigger;
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
      const timeSpan = Math.max(...dataPoints.map(p => p.time)) - Math.min(...dataPoints.map(p => p.time));
      
      const analysisResults = {
        dataPoints: results,
        totalDistance: finalTotalDistance,
        measuredDistance: totalDistance,
        extrapolatedDistance: extrapolatedDistance,
        timeToEventTrigger: timeToEventTrigger,
        hasEventTrigger: hasEventTrigger,
        maxSpeed: maxSpeed,
        minSpeed: minSpeed,
        avgSpeedChange: avgSpeedChange,
        avgDecelAccelRate: avgDecelAccelRate,
        avgDragFactor: avgDragFactor,
        significantEvents: significantEvents,
        timeSpan: timeSpan
      };
      
      console.log('Analysis results:', analysisResults);
      setAnalysisResults(analysisResults);
      setError('');
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Analysis failed: ${err.message}`);
      setAnalysisResults(null);
    }
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow">
          <p className="font-medium">{`Time: ${label} s`}</p>
          <p className="text-blue-600">{`Speed: ${payload[0].value.toFixed(1)} ${getUnitLabel('speed')}`}</p>
        </div>
      );
    }
    return null;
  };

  // Generate PDF report
  const generatePDFReport = async () => {
    if (!analysisResults) {
      setError('No analysis results available. Please analyze EDR data first.');
      return;
    }

    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      
      // Create new PDF document
      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Document setup
      let currentY = 20;
      
      const addText = (text, fontSize = 10, yOffset = 4, fontStyle = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        doc.setTextColor(0, 0, 0);
        doc.text(text, 20, currentY);
        currentY += yOffset;
      };

      // Header
      addText('AxisRecon - EDR Analysis Report', 16, 8, 'bold');
      addText(`Generated: ${new Date().toLocaleDateString()}`);
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
      const fileName = `EDR_Analysis_${vehicleInfo && vehicleInfo.makeModel ? 
        vehicleInfo.makeModel.replace(/[^a-zA-Z0-9]/g, '_') : 
        'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      doc.save(fileName);
      
      console.log('PDF saved successfully');
      
    } catch (err) {
      console.error('PDF generation error:', err);
      setError(`PDF generation failed: ${err.message}`);
    }
  };

  return (
    <PageLayout>
      <ContentCard 
        title="EDR Analysis"
        description="Professional Event Data Recorder analysis with distance calculation and PDF export"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Data Input Tab */}
          {activeTab === 'data-input' && (
            <div className="space-y-6">
              {/* Vehicle Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Make/Model
                    </label>
                    <input
                      type="text"
                      value={vehicleInfo.makeModel}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, makeModel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 2019 Honda Accord"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Date
                    </label>
                    <input
                      type="date"
                      value={vehicleInfo.crashDate}
                      onChange={(e) => setVehicleInfo({...vehicleInfo, crashDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* EDR Data Input */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">EDR Data Input</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter time and speed data from the EDR. Data should be comma or newline separated.
                  Time values should be in seconds, speed values in {getUnitLabel('speed')}.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Data (seconds)
                    </label>
                    <textarea
                      value={timeData}
                      onChange={(e) => setTimeData(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="e.g. -4.5, -4.0, -3.5, -3.0, -2.5, -2.0, -1.5, -1.0, -0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speed Data ({getUnitLabel('speed')})
                    </label>
                    <textarea
                      value={speedData}
                      onChange={(e) => setSpeedData(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="e.g. 45, 43, 41, 38, 35, 31, 26, 20, 12"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={parseCSVData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Parse Data
                  </button>
                  
                  {parsedEDRData.length > 0 && (
                    <button
                      onClick={analyzeEDRData}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Analyze EDR Data
                    </button>
                  )}
                </div>

                {/* Parsed Data Preview */}
                {parsedEDRData.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Parsed Data ({parsedEDRData.length} points)</h4>
                    <div className="bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1">Time (s)</th>
                            <th className="text-left py-1">Speed ({getUnitLabel('speed')})</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono">
                          {parsedEDRData.slice(0, 10).map((point, idx) => (
                            <tr key={idx}>
                              <td className="py-1">{point.time}</td>
                              <td className="py-1">{point.speed}</td>
                            </tr>
                          ))}
                          {parsedEDRData.length > 10 && (
                            <tr>
                              <td colSpan="2" className="py-1 text-gray-500 italic">
                                ... and {parsedEDRData.length - 10} more points
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Speed Analysis Tab */}
          {activeTab === 'speed-analysis' && (
            <div className="space-y-6">
              {!analysisResults ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No analysis results available</p>
                  <p className="text-sm text-gray-400">Parse and analyze EDR data in the Data Input tab</p>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{formatResult(analysisResults.maxSpeed, 1)}</div>
                      <div className="text-sm text-gray-600">Max Speed ({getUnitLabel('speed')})</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{formatResult(analysisResults.minSpeed, 1)}</div>
                      <div className="text-sm text-gray-600">Min Speed ({getUnitLabel('speed')})</div>
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
                            dot={{ fill: '#1E3A8A', strokeWidth: 2, r: 3 }}
                            name={`Speed (${getUnitLabel('speed')})`}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Data Table */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Detailed Analysis Data</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left py-2 px-3">Time (s)</th>
                            <th className="text-left py-2 px-3">Speed ({getUnitLabel('speed')})</th>
                            <th className="text-left py-2 px-3">Change ({getUnitLabel('speed')})</th>
                            <th className="text-left py-2 px-3">Decel/Accel ({getUnitLabel('distance')}/s²)</th>
                            <th className="text-left py-2 px-3">Drag Factor</th>
                            <th className="text-left py-2 px-3">Significant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisResults.dataPoints.map((point, idx) => (
                            <tr key={idx} className={`border-b ${point.isSignificantChange ? 'bg-orange-50' : ''}`}>
                              <td className="py-2 px-3 font-mono">{point.time}</td>
                              <td className="py-2 px-3 font-mono">{formatResult(point.speed, 1)}</td>
                              <td className="py-2 px-3 font-mono">
                                {point.speedChange !== null ? formatResult(point.speedChange, 1) : '—'}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {point.decelAccelRate !== null ? formatResult(point.decelAccelRate, 1) : '—'}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {point.dragFactor !== null ? formatResult(point.dragFactor, 3) : '—'}
                              </td>
                              <td className="py-2 px-3">
                                {point.isSignificantChange ? '⚠️' : ''}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Distance Calculation Tab */}
          {activeTab === 'distance-calculation' && (
            <div className="space-y-6">
              {!analysisResults ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No analysis results available</p>
                  <p className="text-sm text-gray-400">Parse and analyze EDR data in the Data Input tab</p>
                </div>
              ) : (
                <>
                  {/* Distance Summary */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Analysis Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatResult(analysisResults.totalDistance, 1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Approximate Total Distance ({getUnitLabel('distance')})
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Unit System: {unitSystem === 'imperial' ? 'Imperial' : 'Metric'}
                        </div>
                      </div>

                      {analysisResults.hasEventTrigger === false && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              {formatResult(analysisResults.measuredDistance, 1)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Measured Distance ({getUnitLabel('distance')})
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              From data points
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600 mb-2">
                              {formatResult(analysisResults.extrapolatedDistance, 1)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Extrapolated Distance ({getUnitLabel('distance')})
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              To Event Trigger (0.0s)
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Calculation Method */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Calculation Methodology</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Distance Calculation Method</h5>
                        <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                          <p className="font-mono text-sm mb-2">
                            Distance = ((Speed₁ + Speed₂) / 2) × Time_Interval
                          </p>
                          <p className="text-sm text-gray-600">
                            Each segment uses the average speed method for accuracy in deceleration scenarios.
                          </p>
                        </div>
                      </div>

                      {analysisResults.hasEventTrigger === false && (
                        <div>
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
                        </div>
                      )}
                      
                      <div>
                        <p><strong>Speed Conversion:</strong> {
                          unitSystem === 'imperial' 
                            ? 'mph × 1.466 = ft/s for distance calculations'
                            : 'km/h ÷ 3.6 = m/s for distance calculations'
                        }</p>
                      </div>
                    </div>
                  </div>

                  {/* Distance Breakdown Table */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Distance Breakdown</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left py-2 px-3">Time (s)</th>
                            <th className="text-left py-2 px-3">Speed ({getUnitLabel('speed')})</th>
                            <th className="text-left py-2 px-3">Segment ({getUnitLabel('distance')})</th>
                            <th className="text-left py-2 px-3">Cumulative ({getUnitLabel('distance')})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisResults.dataPoints.map((point, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-2 px-3 font-mono">{point.time}</td>
                              <td className="py-2 px-3 font-mono">{formatResult(point.speed, 1)}</td>
                              <td className="py-2 px-3 font-mono">
                                {point.segmentDistance > 0 ? formatResult(point.segmentDistance, 1) : '—'}
                              </td>
                              <td className="py-2 px-3 font-mono">{formatResult(point.cumulativeDistance, 1)}</td>
                            </tr>
                          ))}
                          {analysisResults.hasEventTrigger === false && analysisResults.extrapolatedDistance > 0 && (
                            <tr className="border-b bg-blue-50">
                              <td className="py-2 px-3 font-mono">0.0</td>
                              <td className="py-2 px-3 font-mono italic">Extrapolated</td>
                              <td className="py-2 px-3 font-mono">{formatResult(analysisResults.extrapolatedDistance, 1)}</td>
                              <td className="py-2 px-3 font-mono font-bold">{formatResult(analysisResults.totalDistance, 1)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Report Export Tab */}
          {activeTab === 'report-export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Export</h3>
                {!analysisResults ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No analysis results available</p>
                    <p className="text-sm text-gray-400">Parse and analyze EDR data to generate a report</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Report Preview */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Report Preview</h4>
                      <div className="bg-gray-50 p-4 rounded border text-sm space-y-2">
                        <p className="font-bold">AxisRecon - EDR Analysis Report</p>
                        <p>Generated: {new Date().toLocaleDateString()}</p>
                        <p>Unit System: {unitSystem === 'imperial' ? 'Imperial (mph, ft)' : 'Metric (km/h, m)'}</p>
                        
                        {vehicleInfo.makeModel && <p>Vehicle: {vehicleInfo.makeModel}</p>}
                        {vehicleInfo.crashDate && <p>Incident Date: {vehicleInfo.crashDate}</p>}
                        
                        <div className="pt-2 border-t border-gray-300">
                          <p className="font-semibold">Key Results:</p>
                          <p>• Approximate Total Distance: {formatResult(analysisResults.totalDistance, 1)} {getUnitLabel('distance')}</p>
                          <p>• Maximum Speed: {formatResult(analysisResults.maxSpeed, 1)} {getUnitLabel('speed')}</p>
                          <p>• Average Drag Factor: {formatResult(analysisResults.avgDragFactor, 3)}</p>
                          <p>• Data Points: {analysisResults.dataPoints.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Export Options</h4>
                      <div className="space-y-4">
                        <button
                          onClick={generatePDFReport}
                          className="flex items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <span className="mr-2">📄</span>
                          Export Professional PDF Report
                        </button>
                        <p className="text-sm text-gray-600">
                          Generates a comprehensive PDF report including all analysis data, calculations, and methodology 
                          suitable for legal and insurance use.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ContentCard>
    </PageLayout>
  );
};

export default EDRAnalysis;