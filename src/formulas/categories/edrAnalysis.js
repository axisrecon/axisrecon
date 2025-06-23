// EDR Analysis Formula Category
// Place this file in: src/formulas/categories/edrAnalysis.js

export const edrAnalysisCategory = {
  id: "edrAnalysis",
  name: "EDR Analysis Formuals", 
  description: "Event Data Recorder analysis formulas",
  icon: "edr",
  formulas: {
    totalDeltaV: {
      id: "total_delta_v",
      name: "Total DeltaV",
      formula: "TotalDeltaV = √(DeltaVₓ² + DeltaVᵧ²)",
      description: "Calculate total DeltaV from longitudinal and lateral DeltaV components",
      category: "edrAnalysis",
      
      inputs: [
        {
          key: "deltaVx",
          label: "Longitudinal DeltaV (DeltaVₓ)",
          unit: "speed",
          type: "number",
          validation: { min: 0, required: true },
          placeholder: "28.9"
        },
        {
          key: "deltaVy", 
          label: "Lateral DeltaV (DeltaVᵧ)",
          unit: "speed",
          type: "number",
          validation: { min: 0, required: true },
          placeholder: "3.9"
        }
      ],

      calculate: (inputs, unitSystem) => {
        console.log('EDR Calculate called with:', inputs, unitSystem); // Debug log
        
        const { deltaVx, deltaVy } = inputs;
        
        // Convert to numbers to ensure calculation works
        const vx = parseFloat(deltaVx);
        const vy = parseFloat(deltaVy);
        
        console.log('Parsed values:', vx, vy); // Debug log
        
        // TotalDeltaV = √(DeltaVₓ² + DeltaVᵧ²)
        const totalDeltaV = Math.sqrt((vx * vx) + (vy * vy));
        
        console.log('Calculated totalDeltaV:', totalDeltaV); // Debug log
        
        const result = {
          totalDeltaV: totalDeltaV,
          longitudinalDeltaV: vx,
          lateralDeltaV: vy,
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h'
        };
        
        console.log('Final result:', result); // Debug log
        
        return result;
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { deltaVx, deltaVy } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const vx = parseFloat(deltaVx);
        const vy = parseFloat(deltaVy);
        
        return [
          "Given:",
          `Longitudinal DeltaV (DeltaVₓ) = ${vx} ${speedUnit}`,
          `Lateral DeltaV (DeltaVᵧ) = ${vy} ${speedUnit}`,
          "",
          "Formula: TotalDeltaV = √(DeltaVₓ² + DeltaVᵧ²)",
          `Substitution: TotalDeltaV = √(${vx}² + ${vy}²)`,
          `Calculation: TotalDeltaV = √(${vx * vx} + ${vy * vy})`,
          `Calculation: TotalDeltaV = √(${(vx * vx) + (vy * vy)})`,
          `Result: TotalDeltaV = ${result.totalDeltaV.toFixed(2)} ${result.speedUnit}`
        ];
      },

      resultUnit: "speed",
      tags: ["delta-v", "edr", "event-data-recorder", "total"],
      relatedFormulas: ["pdof_angle"]
    },

    pdofAngle: {
      id: "pdof_angle",
      name: "PDOF Angle",
      formula: "Θ = tan⁻¹(DeltaVᵧ / DeltaVₓ)",
      description: "Calculate Principal Direction of Force angle from longitudinal and lateral DeltaV components",
      category: "edrAnalysis",
      
      inputs: [
        {
          key: "deltaVx",
          label: "Longitudinal DeltaV (DeltaVₓ)",
          unit: "speed",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "28.9"
        },
        {
          key: "deltaVy",
          label: "Lateral DeltaV (DeltaVᵧ)",
          unit: "speed",
          type: "number",
          validation: { min: 0, required: true },
          placeholder: "3.9"
        }
      ],

      calculate: (inputs, unitSystem) => {
        console.log('PDOF Calculate called with:', inputs, unitSystem); // Debug log
        
        const { deltaVx, deltaVy } = inputs;
        
        // Convert to numbers to ensure calculation works
        const vx = parseFloat(deltaVx);
        const vy = parseFloat(deltaVy);
        
        console.log('Parsed values:', vx, vy); // Debug log
        
        // Θ = tan⁻¹(DeltaVᵧ / DeltaVₓ)
        const angleRadians = Math.atan(vy / vx);
        const angleDegrees = angleRadians * (180 / Math.PI);
        
        console.log('Calculated PDOF angle:', angleDegrees); // Debug log
        
        const result = {
          pdofAngle: angleDegrees,
          pdofAngleRadians: angleRadians,
          longitudinalDeltaV: vx,
          lateralDeltaV: vy,
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          angleUnit: 'degrees'
        };
        
        console.log('Final PDOF result:', result); // Debug log
        
        return result;
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { deltaVx, deltaVy } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const vx = parseFloat(deltaVx);
        const vy = parseFloat(deltaVy);
        
        return [
          "Given:",
          `Longitudinal DeltaV (DeltaVₓ) = ${vx} ${speedUnit}`,
          `Lateral DeltaV (DeltaVᵧ) = ${vy} ${speedUnit}`,
          "",
          "Formula: Θ = tan⁻¹(DeltaVᵧ / DeltaVₓ)",
          `Substitution: Θ = tan⁻¹(${vy} / ${vx})`,
          `Calculation: Θ = tan⁻¹(${(vy / vx).toFixed(4)})`,
          `Result: Θ = ${result.pdofAngle.toFixed(1)}° (PDOF Angle)`
        ];
      },

      resultUnit: "angle",
      tags: ["pdof", "angle", "edr", "event-data-recorder", "direction"],
      relatedFormulas: ["total_delta_v"]
    },

    speedInGear: {
      id: "speed_in_gear",
      name: "Speed in Gear",
      formula: "S = [(RPM) × (R)] / [(Final Gear Ratio) × (168)]",
      description: "Calculate vehicle speed from engine RPM, loaded rolling radius, and final gear ratio",
      category: "edrAnalysis",
      
      inputs: [
        {
          key: "rpm",
          label: "Engine RPM (Transmission)",
          unit: "coefficient", // RPM has no unit label
          type: "number",
          validation: { min: 100, required: true },
          placeholder: "2500"
        },
        {
          key: "rollingRadius",
          label: "Loaded Rolling Radius (R)",
          unit: "distance", // Will show as inches for imperial
          type: "number",
          validation: { min: 8, max: 20, required: true },
          placeholder: "12.5"
        },
        {
          key: "gearRatio",
          label: "Gear Ratio",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.5, max: 8, required: true },
          placeholder: "2.84"
        },
        {
          key: "rearAxleRatio",
          label: "Rear Axle Ratio",
          unit: "coefficient",
          type: "number",
          validation: { min: 2, max: 6, required: true },
          placeholder: "3.73"
        }
      ],

      calculate: (inputs, unitSystem) => {
        console.log('Speed in Gear Calculate called with:', inputs, unitSystem); // Debug log
        
        const { rpm, rollingRadius, gearRatio, rearAxleRatio } = inputs;
        
        // Convert to numbers
        const engineRPM = parseFloat(rpm);
        const radius = parseFloat(rollingRadius);
        const gear = parseFloat(gearRatio);
        const axle = parseFloat(rearAxleRatio);
        
        console.log('Parsed values:', { engineRPM, radius, gear, axle }); // Debug log
        
        // Calculate Final Gear Ratio = (Gear Ratio) × (Rear Axle Ratio)
        const finalGearRatio = gear * axle;
        
        // S = [(RPM) × (R)] / [(Final Gear Ratio) × (168)]
        const speedMPH = (engineRPM * radius) / (finalGearRatio * 168);
        
        // Convert to metric if needed
        let speedResult = speedMPH;
        let speedUnit = 'mph';
        
        if (unitSystem === 'metric') {
          speedResult = speedMPH * 1.609344; // mph to km/h
          speedUnit = 'km/h';
        }
        
        console.log('Calculated speed:', speedResult); // Debug log
        
        const result = {
          speed: speedResult,
          speedMPH: speedMPH, // Always keep MPH for reference since formula gives MPH
          speedUnit: speedUnit,
          engineRPM: engineRPM,
          rollingRadius: radius,
          gearRatio: gear,
          rearAxleRatio: axle,
          finalGearRatio: finalGearRatio,
          radiusUnit: 'inches' // Formula uses inches regardless of unit system
        };
        
        console.log('Final speed in gear result:', result); // Debug log
        
        return result;
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { rpm, rollingRadius, gearRatio, rearAxleRatio } = inputs;
        const engineRPM = parseFloat(rpm);
        const radius = parseFloat(rollingRadius);
        const gear = parseFloat(gearRatio);
        const axle = parseFloat(rearAxleRatio);
        
        return [
          "Given:",
          `Engine RPM = ${engineRPM}`,
          `Loaded Rolling Radius (R) = ${radius} inches`,
          `Gear Ratio = ${gear}`,
          `Rear Axle Ratio = ${axle}`,
          "",
          "Step 1: Calculate Final Gear Ratio",
          `Final Gear Ratio = (Gear Ratio) × (Rear Axle Ratio)`,
          `Final Gear Ratio = ${gear} × ${axle} = ${result.finalGearRatio.toFixed(3)}`,
          "",
          "Step 2: Apply Speed in Gear Formula",
          "Formula: S = [(RPM) × (R)] / [(Final Gear Ratio) × (168)]",
          `Substitution: S = [${engineRPM} × ${radius}] / [${result.finalGearRatio.toFixed(3)} × 168]`,
          `Calculation: S = ${engineRPM * radius} / ${(result.finalGearRatio * 168).toFixed(1)}`,
          `Result: S = ${result.speedMPH.toFixed(2)} mph${unitSystem === 'metric' ? ` (${result.speed.toFixed(2)} km/h)` : ''}`
        ];
      },

      resultUnit: "speed",
      tags: ["speed", "gear", "rpm", "edr", "transmission", "rolling-radius"],
      relatedFormulas: ["total_delta_v", "pdof_angle"]
    }
  }
};

export default edrAnalysisCategory;