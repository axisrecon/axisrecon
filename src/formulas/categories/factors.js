// Factors Formula Category
export const factorsCategory = {
  id: "factors",
  name: "Factors",
  description: "Drag factor and coefficient calculations for crash reconstruction",
  icon: "factors",
  formulas: {
    dragFactorSled: {
      id: "drag_factor_sled",
      name: "Drag Factor from Drag Sled",
      formula: "f = F / W",
      description: "Calculate drag factor from drag sled force readings and weight",
      category: "factors",
      
      inputs: [
        {
          key: "forceCount",
          label: "Number of Force Readings",
          type: "select",
          options: [
            { value: 1, label: "1 reading" },
            { value: 2, label: "2 readings" },
            { value: 3, label: "3 readings" },
            { value: 4, label: "4 readings" },
            { value: 5, label: "5 readings" },
            { value: 6, label: "6 readings" },
            { value: 7, label: "7 readings" },
            { value: 8, label: "8 readings" },
            { value: 9, label: "9 readings" },
            { value: 10, label: "10 readings" }
          ],
          validation: { required: true },
          default: 3
        },
        {
          key: "forces",
          label: "Pull Force",
          type: "dynamic_array",
          unit: "force",
          validation: { min: 0.1, required: true },
          dependsOn: "forceCount"
        },
        {
          key: "W",
          label: "Weight of Drag Sled",
          unit: "force",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { forces, W } = inputs;
        
        // Calculate average force if multiple readings
        const averageForce = forces.reduce((sum, force) => sum + force, 0) / forces.length;
        
        // f = F / W
        const dragFactor = averageForce / W;
        
        return {
          dragFactor: dragFactor,
          averageForce: averageForce,
          individualForces: forces,
          weight: W,
          forceUnit: unitSystem === 'imperial' ? 'lbs' : 'kg'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { forces, W } = inputs;
        const forceUnit = unitSystem === 'imperial' ? 'lbs' : 'kg';
        
        const steps = [
          "Given:",
          ...forces.map((force, index) => `F${index + 1} = ${force} ${forceUnit}`),
          `Weight = ${W} ${forceUnit}`,
          ""
        ];
        
        if (forces.length > 1) {
          steps.push(
            "Average Force:",
            `F_avg = (${forces.join(' + ')}) / ${forces.length}`,
            `F_avg = ${result.averageForce.toFixed(2)} ${forceUnit}`,
            ""
          );
        }
        
        steps.push(
          "Formula: f = F / W",
          `Substitution: f = ${result.averageForce.toFixed(2)} / ${W}`,
          `Result: f = ${result.dragFactor.toFixed(3)}`
        );
        
        return steps;
      },

      resultUnit: "coefficient",
      tags: ["drag", "sled", "coefficient"],
      relatedFormulas: ["drag_factor_speed_distance", "drag_factor_speed_time", "factor_rate_conversion"]
    },

    dragFactorSpeedDistance: {
      id: "drag_factor_speed_distance",
      name: "Drag Factor from Speed & Distance",
      formula: "f = S² / (30 × d)",
      description: "Calculate drag factor from speed and distance",
      category: "factors",
      
      inputs: [
        {
          key: "S",
          label: "Speed",
          unit: "speed",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "45"
        },
        {
          key: "d",
          label: "Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "120"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { S, d } = inputs;
        
        // f = S² / (30 × d)
        const dragFactor = (S * S) / (30 * d);
        
        return {
          dragFactor: dragFactor,
          speed: S,
          distance: d,
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { S, d } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Speed = ${S} ${speedUnit}`,
          `Distance = ${d} ${distanceUnit}`,
          "",
          "Formula: f = S² / (30 × d)",
          `Substitution: f = ${S}² / (30 × ${d})`,
          `Calculation: f = ${S * S} / ${30 * d}`,
          `Result: f = ${result.dragFactor.toFixed(3)}`
        ];
      },

      resultUnit: "coefficient",
      tags: ["drag", "speed", "distance"],
      relatedFormulas: ["drag_factor_sled", "drag_factor_speed_time", "factor_rate_conversion"]
    },

    dragFactorSpeedTime: {
      id: "drag_factor_speed_time",
      name: "Drag Factor from Speed & Time",
      formula: "f = d / (16.1 × t²)",
      description: "Calculate drag factor from distance and time",
      category: "factors",
      
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
          key: "t",
          label: "Time",
          unit: "time",
          type: "number",
          validation: { min: 0.01, required: true },
          placeholder: "2.5"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { d, t } = inputs;
        
        // f = d / (16.1 × t²)
        const dragFactor = d / (16.1 * (t * t));
        
        return {
          dragFactor: dragFactor,
          distance: d,
          time: t,
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          timeUnit: 's'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { d, t } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Distance = ${d} ${distanceUnit}`,
          `Time = ${t} s`,
          "",
          "Formula: f = d / (16.1 × t²)",
          `Substitution: f = ${d} / (16.1 × ${t}²)`,
          `Calculation: f = ${d} / (16.1 × ${t * t})`,
          `Calculation: f = ${d} / ${16.1 * (t * t)}`,
          `Result: f = ${result.dragFactor.toFixed(3)}`
        ];
      },

      resultUnit: "coefficient",
      tags: ["drag", "time", "distance"],
      relatedFormulas: ["drag_factor_sled", "drag_factor_speed_distance", "factor_rate_conversion"]
    },

    factorRateConversion: {
      id: "factor_rate_conversion",
      name: "Factor and Rate Conversion",
      formula: "f = a/32.2 | a = f×32.2",
      description: "Convert between acceleration factor and acceleration rate using standard gravity (32.2 ft/s²)",
      category: "factors",
      
      inputs: [
        {
          key: "inputType",
          label: "Calculate From",
          type: "select",
          options: [
            { value: "factor", label: "Factor (f) → Rate (a)" },
            { value: "rate", label: "Rate (a) → Factor (f)" }
          ],
          validation: { required: true },
          default: "factor"
        },
        {
          key: "f",
          label: "Acceleration Factor (f)",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.01, max: 2.0, required: false },
          placeholder: "0.75",
          conditionalRequired: "factor"
        },
        {
          key: "a",
          label: "Acceleration Rate (a)",
          unit: "acceleration",
          type: "number",
          validation: { min: 0.1, max: 64.4, required: false },
          placeholder: "24.15",
          conditionalRequired: "rate"
        }
      ],

      calculate: (inputs, unitSystem) => {
        console.log('Factor Rate Conversion - inputs:', inputs); // Debug log
        
        const { inputType, f, a } = inputs;
        const g = 32.2; // Standard gravity constant for crash reconstruction
        
        let calculatedFactor = null;
        let calculatedRate = null;
        
        if (inputType === "factor") {
          const factorValue = parseFloat(f);
          console.log('Calculating from factor:', factorValue); // Debug log
          if (!isNaN(factorValue)) {
            // Calculate rate from factor: a = f × 32.2
            calculatedRate = factorValue * g;
            calculatedFactor = factorValue;
            console.log('Calculated rate:', calculatedRate); // Debug log
          }
        } else if (inputType === "rate") {
          const rateValue = parseFloat(a);
          console.log('Calculating from rate:', rateValue); // Debug log
          if (!isNaN(rateValue)) {
            // Calculate factor from rate: f = a / 32.2
            calculatedFactor = rateValue / g;
            calculatedRate = rateValue;
            console.log('Calculated factor:', calculatedFactor); // Debug log
          }
        }
        
        const result = {
          factor: calculatedFactor,
          rate: calculatedRate,
          gravity: g,
          inputType: inputType,
          rateUnit: unitSystem === 'imperial' ? 'ft/s²' : 'm/s²',
          gravityUnit: unitSystem === 'imperial' ? 'ft/s²' : 'm/s²'
        };
        
        console.log('Final result:', result); // Debug log
        return result;
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { inputType, f, a } = inputs;
        const g = 32.2;
        const rateUnit = unitSystem === 'imperial' ? 'ft/s²' : 'm/s²';
        
        if (inputType === "factor") {
          return [
            "Given:",
            `Acceleration Factor (f) = ${f}`,
            `Standard Gravity (g) = ${g} ${rateUnit}`,
            "",
            "Formula: a = f × 32.2",
            `Substitution: a = ${f} × ${g}`,
            `Result: a = ${result.rate.toFixed(2)} ${rateUnit}`
          ];
        } else {
          return [
            "Given:",
            `Acceleration Rate (a) = ${a} ${rateUnit}`,
            `Standard Gravity (g) = ${g} ${rateUnit}`,
            "",
            "Formula: f = a / 32.2",
            `Substitution: f = ${a} / ${g}`,
            `Result: f = ${result.factor.toFixed(3)}`
          ];
        }
      },

      resultUnit: "coefficient",
      tags: ["factor", "rate", "acceleration", "conversion", "gravity"],
      relatedFormulas: ["drag_factor_sled", "drag_factor_speed_distance", "drag_factor_speed_time"],
      
      notes: [
        "Standard gravity: 32.2 ft/s² (imperial) or 9.81 m/s² (metric)",
        "Factor is dimensionless (unitless coefficient)",
        "Rate is acceleration in ft/s² or m/s²"
      ]
    }
  }
};

export default factorsCategory;