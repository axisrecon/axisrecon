// Airborne Formula Category
// Place this file in: src/formulas/categories/airborne.js

export const airborneCategory = {
  id: "airborne",
  name: "Airborne",
  description: "Airborne vehicle formulas",
  icon: "flight",
  formulas: {
    airborneSpeedWithAngle: {
      id: "airborne_speed_with_angle",
      name: "Airborne Speed (with Takeoff Angle)",
      formula: "S = (2.73d) / (cos θ √(±h + d tan θ))",
      description: "Calculate speed (mph) of airborne object when horizontal distance, vertical distance, and takeoff angle are known",
      category: "airborne",
      
      inputs: [
        {
          key: "d",
          label: "Horizontal Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "150"
        },
        {
          key: "h",
          label: "Vertical Distance (±h)",
          unit: "distance",
          type: "number",
          validation: { required: true },
          placeholder: "25",
          note: "(+) when object lands lower than takeoff, (-) when object lands higher than takeoff"
        },
        {
          key: "theta",
          label: "Takeoff Angle (θ)",
          unit: "angle",
          type: "number",
          validation: { min: -45, max: 45, required: true },
          placeholder: "15",
          note: "(-) for downhill grade, (+) for uphill grade"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { d, h, theta } = inputs;
        
        // Convert angle to radians for calculations
        const thetaRad = (theta * Math.PI) / 180;
        
        // S = (2.73d) / (cos θ √(±h + d tan θ))
        const cosTheta = Math.cos(thetaRad);
        const tanTheta = Math.tan(thetaRad);
        const underSqrt = h + (d * tanTheta);
        
        // Check for negative under square root
        if (underSqrt < 0) {
          throw new Error(`Invalid configuration: (±h + d tan θ) = ${underSqrt.toFixed(3)} cannot be negative`);
        }
        
        const speed = (2.73 * d) / (cosTheta * Math.sqrt(underSqrt));
        
        // Convert to metric if needed (formula gives mph)
        let convertedSpeed = speed;
        let speedUnit = 'mph';
        
        if (unitSystem === 'metric') {
          convertedSpeed = speed * 1.609344; // mph to km/h
          speedUnit = 'km/h';
        }
        
        return {
          speed: convertedSpeed,
          speedMph: speed, // Always keep mph for reference
          speedUnit: speedUnit,
          horizontalDistance: d,
          verticalDistance: h,
          takeoffAngle: theta,
          cosTheta: cosTheta,
          tanTheta: tanTheta,
          underSqrtValue: underSqrt
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { d, h, theta } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Horizontal Distance (d) = ${d} ${distanceUnit}`,
          `Vertical Distance (±h) = ${h} ${distanceUnit}`,
          `Takeoff Angle (θ) = ${theta}°`,
          "",
          "Formula: S = (2.73d) / (cos θ √(±h + d tan θ))",
          `Step 1: Calculate trigonometric values`,
          `cos(${theta}°) = ${result.cosTheta.toFixed(4)}`,
          `tan(${theta}°) = ${result.tanTheta.toFixed(4)}`,
          "",
          `Step 2: Calculate (±h + d tan θ)`,
          `(±h + d tan θ) = ${h} + (${d} × ${result.tanTheta.toFixed(4)})`,
          `(±h + d tan θ) = ${result.underSqrtValue.toFixed(3)}`,
          "",
          `Step 3: Apply formula`,
          `S = (2.73 × ${d}) / (${result.cosTheta.toFixed(4)} × √${result.underSqrtValue.toFixed(3)})`,
          `S = ${(2.73 * d).toFixed(2)} / (${result.cosTheta.toFixed(4)} × ${Math.sqrt(result.underSqrtValue).toFixed(3)})`,
          `S = ${(2.73 * d).toFixed(2)} / ${(result.cosTheta * Math.sqrt(result.underSqrtValue)).toFixed(3)}`,
          `Result: S = ${result.speedMph.toFixed(2)} mph${unitSystem === 'metric' ? ` (${result.speed.toFixed(2)} km/h)` : ''}`
        ];
      },

      resultUnit: "speed",
      tags: ["airborne", "takeoff-angle", "projectile", "crash-reconstruction"],
      relatedFormulas: ["airborne_speed_flat_surface"],
      
      notes: [
        "Equation is very sensitive to measurement errors for takeoff angles less than 10° and heights less than 10 feet",
        "Use ±dm when the takeoff is from a downhill grade (-dm) or uphill grade (+dm)",
        "Vertical height is (+h) when object lands lower than takeoff position, (-h) when object lands higher"
      ]
    },

    airborneSpeedFlatSurface: {
      id: "airborne_speed_flat_surface",
      name: "Airborne Speed (Flat Surface)",
      formula: "S = (2.73d) / √h",
      description: "Calculate speed (mph) of vehicle that goes airborne from a level surface when horizontal and vertical distances are known",
      category: "airborne",
      
      inputs: [
        {
          key: "d",
          label: "Horizontal Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "120"
        },
        {
          key: "h",
          label: "Vertical Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "15"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { d, h } = inputs;
        
        // S = (2.73d) / √h
        const speed = (2.73 * d) / Math.sqrt(h);
        
        // Convert to metric if needed (formula gives mph)
        let convertedSpeed = speed;
        let speedUnit = 'mph';
        
        if (unitSystem === 'metric') {
          convertedSpeed = speed * 1.609344; // mph to km/h
          speedUnit = 'km/h';
        }
        
        return {
          speed: convertedSpeed,
          speedMph: speed, // Always keep mph for reference
          speedUnit: speedUnit,
          horizontalDistance: d,
          verticalDistance: h,
          sqrtH: Math.sqrt(h)
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { d, h } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Horizontal Distance (d) = ${d} ${distanceUnit}`,
          `Vertical Distance (h) = ${h} ${distanceUnit}`,
          "",
          "Formula: S = (2.73d) / √h",
          `Step 1: Calculate √h`,
          `√h = √${h} = ${result.sqrtH.toFixed(3)}`,
          "",
          `Step 2: Apply formula`,
          `S = (2.73 × ${d}) / ${result.sqrtH.toFixed(3)}`,
          `S = ${(2.73 * d).toFixed(2)} / ${result.sqrtH.toFixed(3)}`,
          `Result: S = ${result.speedMph.toFixed(2)} mph${unitSystem === 'metric' ? ` (${result.speed.toFixed(2)} km/h)` : ''}`
        ];
      },

      resultUnit: "speed",
      tags: ["airborne", "flat-surface", "level-surface", "crash-reconstruction"],
      relatedFormulas: ["airborne_speed_with_angle"],
      
      notes: [
        "These equations are very sensitive to heights less than 10 feet",
        "Make sure you check the sensitivity of this equation to possible errors in your measurements",
        "Use this formula when the takeoff is from a level surface only"
      ]
    }
  }
};

export default airborneCategory;