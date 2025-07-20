// FILE: src/formulas/categories/momentum.js
// AxisRecon Momentum Formulas Category
// Professional Crash Reconstruction Software Suite

export const momentumCategory = {
  id: 'momentum',
  name: 'Momentum Analysis',
  description: 'Conservation of momentum and impulse-momentum calculations for crash reconstruction',
  color: 'purple',
  icon: 'momentum',
  formulas: {
    // Vehicle momentum using weight and velocity in ft/s
    vehicleMomentumWV: {
      id: 'vehicleMomentumWV',
      name: 'Vehicle Momentum (P = WV)',
      category: 'Momentum Analysis',
      description: 'Calculate momentum using vehicle weight and velocity in ft/s',
      formula: 'P = WV',
      
      inputs: [
        {
          key: "W",
          label: "Weight (W)",
          unit: "weight",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "3500"
        },
        {
          key: "V",
          label: "Velocity (V)",
          unit: "fps",
          type: "number", 
          validation: { min: 0.1, required: true },
          placeholder: "44"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { W, V } = inputs;
        const P = W * V;
        
        return {
          momentum: P,
          momentumUnit: unitSystem === 'imperial' ? 'lb⋅ft/s' : 'kg⋅m/s',
          weight: W,
          velocity: V,
          weightUnit: unitSystem === 'imperial' ? 'lb' : 'kg',
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { W, V } = inputs;
        const weightUnit = unitSystem === 'imperial' ? 'lb' : 'kg';
        const velocityUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
        const momentumUnit = unitSystem === 'imperial' ? 'lb⋅ft/s' : 'kg⋅m/s';
        
        return [
          "Given:",
          `Weight (W) = ${W} ${weightUnit}`,
          `Velocity (V) = ${V} ${velocityUnit}`,
          "",
          "Formula: P = WV",
          `Substitution: P = ${W} × ${V}`,
          `Result: P = ${result.momentum.toFixed(2)} ${momentumUnit}`
        ];
      },

      resultUnit: "momentum",
      tags: ["momentum", "weight", "velocity"],
      relatedFormulas: ["vehicleMomentumWS"]
    },

    // Vehicle momentum using weight and speed in mph
    vehicleMomentumWS: {
      id: 'vehicleMomentumWS',
      name: 'Vehicle Momentum (P = WS)',
      category: 'Momentum Analysis', 
      description: 'Calculate momentum using vehicle weight and speed in mph',
      formula: 'P = WS',
      
      inputs: [
        {
          key: "W",
          label: "Weight (W)",
          unit: "weight",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "3500"
        },
        {
          key: "S",
          label: "Speed (S)",
          unit: "mph",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "30"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { W, S } = inputs;
        const P = W * S;
        
        return {
          momentum: P,
          momentumUnit: unitSystem === 'imperial' ? 'lb⋅mph' : 'kg⋅km/h',
          weight: W,
          speed: S,
          weightUnit: unitSystem === 'imperial' ? 'lb' : 'kg',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { W, S } = inputs;
        const weightUnit = unitSystem === 'imperial' ? 'lb' : 'kg';
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const momentumUnit = unitSystem === 'imperial' ? 'lb⋅mph' : 'kg⋅km/h';
        
        return [
          "Given:",
          `Weight (W) = ${W} ${weightUnit}`,
          `Speed (S) = ${S} ${speedUnit}`,
          "",
          "Formula: P = WS",
          `Substitution: P = ${W} × ${S}`,
          `Result: P = ${result.momentum.toFixed(2)} ${momentumUnit}`
        ];
      },

      resultUnit: "momentum",
      tags: ["momentum", "weight", "speed"],
      relatedFormulas: ["vehicleMomentumWV"]
    }
  }
};