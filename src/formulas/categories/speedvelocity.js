// Speed and Velocity Formula Category
export const speedVelocityCategory = {
  id: "speedVelocity",
  name: "Speed and Velocity",
  description: "Speed calculations and velocity analysis for crash reconstruction",
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
        const speed = Math.sqrt(30 * d * f * (n / 100));
        
        // Convert to speed using 1.466 factor
        let speedMph;
        if (unitSystem === 'imperial') {
          speedMph = speed / 1.466; // ft/s to mph
        } else {
          speedMph = speed * 3.6; // m/s to km/h
        }
        
        return {
          velocity: speed,        // ft/s or m/s (vector)
          speed: speedMph,        // mph or km/h (scalar)
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h'
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
          `Result: S = ${result.velocity.toFixed(2)} ${result.velocityUnit} (${result.speed.toFixed(2)} ${result.speedUnit})`
        ];
      },

      resultUnit: "speed",
      tags: ["skid", "basic", "fundamental"],
      relatedFormulas: ["combined_speed"]
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
        const sumOfSquares = speeds.reduce((sum, speed) => sum + (speed * speed), 0);
        const combinedSpeed = Math.sqrt(sumOfSquares);
        
        // Convert to speed using 1.466 factor
        let speedMph;
        if (unitSystem === 'imperial') {
          speedMph = combinedSpeed / 1.466; // ft/s to mph
        } else {
          speedMph = combinedSpeed * 3.6; // m/s to km/h
        }
        
        return {
          velocity: combinedSpeed,    // ft/s or m/s (vector)
          speed: speedMph,            // mph or km/h (scalar)
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          individualSpeeds: speeds
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { speeds } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
        
        const steps = [
          "Given:",
          ...speeds.map((speed, index) => `S${index + 1} = ${speed} ${speedUnit}`),
          "",
          "Formula: Sc = √(S₁² + S₂² + S₃² + ...)",
          `Substitution: Sc = √(${speeds.map((s, i) => `${s}²`).join(' + ')})`,
          `Calculation: Sc = √(${speeds.map(s => s * s).join(' + ')})`,
          `Calculation: Sc = √(${speeds.reduce((sum, s) => sum + (s * s), 0)})`,
          `Result: Sc = ${result.velocity.toFixed(2)} ${result.velocityUnit} (${result.speed.toFixed(2)} ${result.speedUnit})`
        ];
        
        return steps;
      },

      resultUnit: "speed",
      tags: ["combined", "multiple", "vector"],
      relatedFormulas: ["basic_speed_skid"]
    }
  }
};

export default speedVelocityCategory;