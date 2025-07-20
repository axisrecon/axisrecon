// Speed and Critical Speed Formula Category - Enhanced for Crash Reconstruction
export const speedVelocityCategory = {
  id: "speedVelocity",
  name: "Speed and Critical Speed",
  description: "Speed and critical speed formulas",
  icon: "lightning",
  formulas: {
    basicSpeedSkid: {
      id: "basic_speed_skid",
      name: "Basic Speed from Skid",
      formula: "S = √(30 × d × f × n)",
      description: "Calculate speed from skid distance, drag factor, and braking efficiency",
      category: "speedVelocity",
      
      inputs: [
        {
          key: "d",
          label: "Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "120"
        },
        {
          key: "f", 
          label: "Drag Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.75"
        },
        {
          key: "n",
          label: "Braking Efficiency",
          unit: "percentage", 
          type: "number",
          validation: { min: 1, max: 100, required: true },
          placeholder: "85"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { d, f, n } = inputs;
        // S = √(30 × d × f × (n/100))
        // This formula directly calculates speed in MPH (not velocity in ft/s)
        const speed = Math.sqrt(30 * d * f * (n / 100));
        
        // Convert to velocity using 1.466 factor for calculations that need ft/s
        let velocity;
        if (unitSystem === 'imperial') {
          velocity = speed * 1.466; // mph to ft/s
        } else {
          velocity = speed / 3.6; // km/h to m/s
        }
        
        return {
          speed: speed,           // mph or km/h (primary result)
          velocity: velocity,     // ft/s or m/s (for reference)
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { d, f, n } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Distance = ${d} ${distanceUnit}`,
          `Drag Factor = ${f}`,
          `Braking Efficiency = ${n}%`,
          "",
          "Formula: S = √(30 × d × f × n)",
          `Substitution: S = √(30 × ${d} × ${f} × ${n/100})`,
          `Calculation: S = √(${30 * d * f * (n/100)})`,
          `Result: S = ${result.speed.toFixed(2)} ${result.speedUnit}`
        ];
      },

      resultUnit: "speed",
      tags: ["skid", "basic", "fundamental"],
      relatedFormulas: ["combined_speed", "radius_equation", "critical_speed_yaw"]
    },

    combinedSpeed: {
      id: "combined_speed", 
      name: "Combined Speed",
      formula: "Sc = √(S₁² + S₂² + S₃² + ...)",
      description: "Calculate combined speed from multiple individual speeds",
      category: "speedVelocity",
      
      inputs: [
        {
          key: "speedCount",
          label: "Number of Speeds",
          type: "select",
          options: [
            { value: 2, label: "2 speeds" },
            { value: 3, label: "3 speeds" },
            { value: 4, label: "4 speeds" },
            { value: 5, label: "5 speeds" },
            { value: 6, label: "6 speeds" },
            { value: 7, label: "7 speeds" },
            { value: 8, label: "8 speeds" },
            { value: 9, label: "9 speeds" },
            { value: 10, label: "10 speeds" }
          ],
          validation: { required: true },
          default: 2
        },
        {
          key: "speeds",
          label: "Individual Speeds",
          type: "dynamic_array",
          unit: "speed",
          validation: { min: 0.1, required: true },
          dependsOn: "speedCount"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { speeds } = inputs;
        
        // Sc = √(S₁² + S₂² + S₃² + ...)
        // Input speeds are in MPH, calculation gives result in MPH
        const sumOfSquares = speeds.reduce((sum, speed) => sum + (speed * speed), 0);
        const combinedSpeed = Math.sqrt(sumOfSquares);
        
        // Convert to velocity for reference
        let velocity;
        if (unitSystem === 'imperial') {
          velocity = combinedSpeed * 1.466; // mph to ft/s
        } else {
          velocity = combinedSpeed / 3.6; // km/h to m/s
        }
        
        return {
          speed: combinedSpeed,       // mph or km/h (primary result)
          velocity: velocity,         // ft/s or m/s (for reference)
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          individualSpeeds: speeds
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { speeds } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        
        const steps = [
          "Given:",
          ...speeds.map((speed, index) => `S${index + 1} = ${speed} ${speedUnit}`),
          "",
          "Formula: Sc = √(S₁² + S₂² + S₃² + ...)",
          `Substitution: Sc = √(${speeds.map((s, i) => `${s}²`).join(' + ')})`,
          `Calculation: Sc = √(${speeds.map(s => s * s).join(' + ')})`,
          `Calculation: Sc = √(${speeds.reduce((sum, s) => sum + (s * s), 0)})`,
          `Result: Sc = ${result.speed.toFixed(2)} ${result.speedUnit}`
        ];
        
        return steps;
      },

      resultUnit: "speed",
      tags: ["combined", "multiple", "vector"],
      relatedFormulas: ["basic_speed_skid", "critical_speed_yaw"]
    },

    radiusEquation: {
      id: "radius_equation",
      name: "Radius Equation",
      formula: "r = C² / (8mo) + mo / 2",
      description: "Calculate radius in feet from chord and middle ordinate measurements",
      category: "speedVelocity",
      
      inputs: [
        {
          key: "C",
          label: "Chord (C)",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "50"
        },
        {
          key: "mo",
          label: "Middle Ordinate (mo)",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "8"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { C, mo } = inputs;
        
        // r = C² / (8mo) + mo / 2
        const radius = (C * C) / (8 * mo) + mo / 2;
        
        return {
          radius: radius,
          radiusUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          chord: C,
          middleOrdinate: mo,
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { C, mo } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Chord (C) = ${C} ${distanceUnit}`,
          `Middle Ordinate (mo) = ${mo} ${distanceUnit}`,
          "",
          "Formula: r = C² / (8mo) + mo / 2",
          `Substitution: r = ${C}² / (8 × ${mo}) + ${mo} / 2`,
          `Calculation: r = ${C * C} / ${8 * mo} + ${mo / 2}`,
          `Calculation: r = ${(C * C) / (8 * mo)} + ${mo / 2}`,
          `Result: r = ${result.radius.toFixed(2)} ${result.radiusUnit}`
        ];
      },

      resultUnit: "distance",
      tags: ["radius", "chord", "geometry", "yaw"],
      relatedFormulas: ["critical_speed_yaw"]
    },

    criticalSpeedYaw: {
      id: "critical_speed_yaw",
      name: "Critical Speed Yaw",
      formula: "S = 3.86√(rf)",
      description: "Calculate critical speed for yaw using radius and adjusted deceleration factor",
      category: "speedVelocity",
      
      inputs: [
        {
          key: "r",
          label: "Radius (r)",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "150"
        },
        {
          key: "f",
          label: "Adjusted Deceleration Factor (f)",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { r, f } = inputs;
        
        // S = 3.86√(rf)
        // This formula directly calculates speed in MPH
        const speed = 3.86 * Math.sqrt(r * f);
        
        // Convert to velocity for reference
        let velocity;
        if (unitSystem === 'imperial') {
          velocity = speed * 1.466; // mph to ft/s
        } else {
          velocity = speed / 3.6; // km/h to m/s
        }
        
        return {
          speed: speed,               // mph or km/h (primary result)
          velocity: velocity,         // ft/s or m/s (for reference)
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          radius: r,
          decelerationFactor: f
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { r, f } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Radius (r) = ${r} ${distanceUnit}`,
          `Adjusted Deceleration Factor (f) = ${f}`,
          "",
          "Formula: S = 3.86√(rf)",
          `Substitution: S = 3.86 × √(${r} × ${f})`,
          `Calculation: S = 3.86 × √(${r * f})`,
          `Calculation: S = 3.86 × ${Math.sqrt(r * f).toFixed(3)}`,
          `Result: S = ${result.speed.toFixed(2)} ${result.speedUnit}`
        ];
      },

      resultUnit: "speed",
      tags: ["critical", "yaw", "radius", "deceleration"],
      relatedFormulas: ["radius_equation", "basic_speed_skid"]
    }
  }
};

export default speedVelocityCategory;