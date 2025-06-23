// Time & Distance Formula Category
export const timeDistanceCategory = {
  id: "timeDistance",
  name: "Time, Distance, & Velocity",
  description: "Basic time, distance, and velocity formulas",
  icon: "clock",
  formulas: {
    time: {
      id: "time",
      name: "Time",
      formula: "t = d / v",
      description: "Calculate time from distance and velocity",
      category: "timeDistance",
      
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
          key: "v",
          label: "Velocity",
          unit: "velocity",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "45"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { d, v } = inputs;
        // t = d / v
        const time = d / v;
        
        return {
          time: time,
          timeUnit: "s"
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { d, v } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        const velocityUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
        
        return [
          "Given:",
          `Distance = ${d} ${distanceUnit}`,
          `Velocity = ${v} ${velocityUnit}`,
          "",
          "Formula: t = d / v",
          `Substitution: t = ${d} / ${v}`,
          `Result: t = ${result.time.toFixed(2)} ${result.timeUnit}`
        ];
      },

      resultUnit: "time",
      tags: ["basic", "time"],
      relatedFormulas: ["distance", "velocity"]
    },

    distance: {
      id: "distance",
      name: "Distance",
      formula: "d = v × t",
      description: "Calculate distance from velocity and time",
      category: "timeDistance",
      
      inputs: [
        {
          key: "v",
          label: "Velocity",
          unit: "velocity",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "45"
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
        const { v, t } = inputs;
        // d = v × t
        const distance = v * t;
        
        return {
          distance: distance,
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { v, t } = inputs;
        const velocityUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
        
        return [
          "Given:",
          `Velocity = ${v} ${velocityUnit}`,
          `Time = ${t} s`,
          "",
          "Formula: d = v × t",
          `Substitution: d = ${v} × ${t}`,
          `Result: d = ${result.distance.toFixed(2)} ${result.distanceUnit}`
        ];
      },

      resultUnit: "distance",
      tags: ["basic", "distance"],
      relatedFormulas: ["time", "velocity"]
    },

    velocity: {
      id: "velocity_basic",
      name: "Velocity",
      formula: "v = d / t",
      description: "Calculate velocity from distance and time",
      category: "timeDistance",
      
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
        // v = d / t
        const velocity = d / t;
        
        // Convert to speed using 1.466 factor
        let speed;
        if (unitSystem === 'imperial') {
          speed = velocity / 1.466; // ft/s to mph
        } else {
          speed = velocity * 3.6; // m/s to km/h
        }
        
        return {
          velocity: velocity,
          speed: speed,
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h'
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
          "Formula: v = d / t",
          `Substitution: v = ${d} / ${t}`,
          `Result: v = ${result.velocity.toFixed(2)} ${result.velocityUnit} (${result.speed.toFixed(2)} ${result.speedUnit})`
        ];
      },

      resultUnit: "velocity",
      tags: ["basic", "velocity"],
      relatedFormulas: ["time", "distance"]
    },

    timeFromSpeedChange: {
      id: "time_from_speed_change",
      name: "Time from Speed Change",
      formula: "t = (S₁ - S₂) / (21.96 × f)",
      description: "Calculate time from speed change and drag factor",
      category: "timeDistance",
      
      inputs: [
        {
          key: "S1",
          label: "Speed 1 (S₁)",
          unit: "speed",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "55"
        },
        {
          key: "S2",
          label: "Speed 2 (S₂)",
          unit: "speed",
          type: "number",
          validation: { min: 0, required: true },
          placeholder: "35"
        },
        {
          key: "f",
          label: "Drag Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { S1, S2, f } = inputs;
        // t = (S1 - S2) / (21.96 × f)
        const time = (S1 - S2) / (21.96 * f);
        
        return {
          time: time,
          timeUnit: "s",
          speedDifference: S1 - S2,
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { S1, S2, f } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        
        return [
          "Given:",
          `Speed 1 (S₁) = ${S1} ${speedUnit}`,
          `Speed 2 (S₂) = ${S2} ${speedUnit}`,
          `Drag Factor = ${f}`,
          "",
          "Formula: t = (S₁ - S₂) / (21.96 × f)",
          `Substitution: t = (${S1} - ${S2}) / (21.96 × ${f})`,
          `Calculation: t = ${result.speedDifference} / ${21.96 * f}`,
          `Result: t = ${result.time.toFixed(2)} ${result.timeUnit}`
        ];
      },

      resultUnit: "time",
      tags: ["time", "speed change", "deceleration"],
      relatedFormulas: ["time", "distance", "velocity"]
    },

    timeToStop: {
      id: "time_to_stop",
      name: "Time To/From a Stop",
      formula: "t = 0.249√(D/f)",
      description: "Calculate time to/from a stop from distance and drag factor",
      category: "timeDistance",
      
      inputs: [
        {
          key: "D",
          label: "Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "150"
        },
        {
          key: "f",
          label: "Drag Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { D, f } = inputs;
        
        // Convert distance to appropriate units for calculation
        let distanceForCalc = D;
        let constant = 0.249; // Imperial constant (feet)
        
        if (unitSystem === 'metric') {
          // Use metric constant for meters
          constant = 0.452;
        }
        
        // t = constant × √(D/f)
        const time = constant * Math.sqrt(distanceForCalc / f);
        
        return {
          time: time,
          timeUnit: "s",
          distance: D,
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          dragFactor: f,
          constant: constant
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { D, f } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        const constant = unitSystem === 'imperial' ? '0.249' : '0.452';
        
        return [
          "Given:",
          `Distance = ${D} ${distanceUnit}`,
          `Drag Factor = ${f}`,
          "",
          `Formula: t = ${constant}√(D/f)`,
          `Substitution: t = ${constant}√(${D}/${f})`,
          `Calculation: t = ${constant}√(${(D/f).toFixed(3)})`,
          `Calculation: t = ${constant} × ${Math.sqrt(D/f).toFixed(3)}`,
          `Result: t = ${result.time.toFixed(2)} ${result.timeUnit}`
        ];
      },

      resultUnit: "time",
      tags: ["time", "stopping", "deceleration", "braking"],
      relatedFormulas: ["distanceToStop", "timeFromSpeedChange"]
    },

    distanceToStop: {
      id: "distance_to_stop",
      name: "Distance To/From a Stop",
      formula: "D = S²/(30×f)",
      description: "Calculate distance to/from a stop from initial speed and drag factor",
      category: "timeDistance",
      
      inputs: [
        {
          key: "S",
          label: "Speed",
          unit: "speed",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "55"
        },
        {
          key: "f",
          label: "Drag Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { S, f } = inputs;
        
        // D = S²/(30×f)
        // This formula uses speed in mph and gives distance in feet
        // For metric, we need to convert
        let speedForCalc = S;
        let constant = 30;
        
        if (unitSystem === 'metric') {
          // Convert km/h to m/s equivalent calculation
          // Using constant 254 for metric (km/h to meters)
          constant = 254;
        }
        
        const distance = (speedForCalc * speedForCalc) / (constant * f);
        
        return {
          distance: distance,
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          speed: S,
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          dragFactor: f,
          constant: constant
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { S, f } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        const constant = unitSystem === 'imperial' ? '30' : '254';
        
        return [
          "Given:",
          `Speed = ${S} ${speedUnit}`,
          `Drag Factor = ${f}`,
          "",
          `Formula: D = S²/(${constant}×f)`,
          `Substitution: D = ${S}²/(${constant}×${f})`,
          `Calculation: D = ${S * S}/(${constant * f})`,
          `Result: D = ${result.distance.toFixed(2)} ${result.distanceUnit}`
        ];
      },

      resultUnit: "distance",
      tags: ["distance", "stopping", "braking", "deceleration"],
      relatedFormulas: ["timeToStop", "timeFromSpeedChange"]
    }
  }
};

export default timeDistanceCategory;