// Pedestrian and Motorcycle Formula Category
export const pedestrianMotorcycleCategory = {
  id: "pedestrianMotorcycle",
  name: "Pedestrian & Motorcycle",
  description: "Pedestrian and Motorcycle specialized formulas",
  icon: "pedestrian",
  formulas: {
    searleMinimumSpeed: {
      id: "searle_minimum_speed",
      name: "Searle Minimum Speed",
      formula: "Vmin = √(2gfd / (1 + f²))",
      description: "Calculate minimum velocity (ft/s) to throw a pedestrian or motorcycle rider using Searle equation",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "g",
          label: "Gravity Acceleration",
          unit: "acceleration",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "32.2",
          defaultValue: 32.2
        },
        {
          key: "f",
          label: "Coefficient of Friction",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.65"
        },
        {
          key: "d",
          label: "Throw Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "35"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { g, f, d } = inputs;
        
        // Vmin = √(2gfd / (1 + f²))
        // This formula calculates velocity directly in ft/s or m/s
        const velocity = Math.sqrt((2 * g * f * d) / (1 + (f * f)));
        
        // Convert to speed for reference
        let speed;
        if (unitSystem === 'imperial') {
          speed = velocity / 1.466; // ft/s to mph
        } else {
          speed = velocity * 3.6; // m/s to km/h
        }
        
        return {
          velocity: velocity,          // Primary result (ft/s or m/s)
          speed: speed,               // For reference (mph or km/h)
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          gravity: g,
          friction: f,
          distance: d
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { g, f, d } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        const accelUnit = unitSystem === 'imperial' ? 'ft/s²' : 'm/s²';
        
        return [
          "Given:",
          `Gravity (g) = ${g} ${accelUnit}`,
          `Coefficient of Friction (f) = ${f}`,
          `Throw Distance (d) = ${d} ${distanceUnit}`,
          "",
          "Formula: Vmin = √(2gfd / (1 + f²))",
          `Substitution: Vmin = √(2 × ${g} × ${f} × ${d} / (1 + ${f}²))`,
          `Calculation: Vmin = √(${2 * g * f * d} / (1 + ${f * f}))`,
          `Calculation: Vmin = √(${2 * g * f * d} / ${1 + (f * f)})`,
          `Result: Vmin = ${result.velocity.toFixed(2)} ${result.velocityUnit}`
        ];
      },

      resultUnit: "velocity",
      tags: ["searle", "pedestrian", "minimum", "throw"],
      relatedFormulas: ["searle_maximum_speed"]
    },

    searleMaximumSpeed: {
      id: "searle_maximum_speed",
      name: "Searle Maximum Speed",
      formula: "Vmax = √(2gfd)",
      description: "Calculate maximum velocity (ft/s) to throw a pedestrian or motorcycle rider using Searle equation",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "g",
          label: "Gravity Acceleration",
          unit: "acceleration",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "32.2",
          defaultValue: 32.2
        },
        {
          key: "f",
          label: "Coefficient of Friction",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.1, max: 2.0, required: true },
          placeholder: "0.65"
        },
        {
          key: "d",
          label: "Throw Distance",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "35"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { g, f, d } = inputs;
        
        // Vmax = √(2gfd)
        // This formula calculates velocity directly in ft/s or m/s
        const velocity = Math.sqrt(2 * g * f * d);
        
        // Convert to speed for reference
        let speed;
        if (unitSystem === 'imperial') {
          speed = velocity / 1.466; // ft/s to mph
        } else {
          speed = velocity * 3.6; // m/s to km/h
        }
        
        return {
          velocity: velocity,          // Primary result (ft/s or m/s)
          speed: speed,               // For reference (mph or km/h)
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          gravity: g,
          friction: f,
          distance: d
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { g, f, d } = inputs;
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        const accelUnit = unitSystem === 'imperial' ? 'ft/s²' : 'm/s²';
        
        return [
          "Given:",
          `Gravity (g) = ${g} ${accelUnit}`,
          `Coefficient of Friction (f) = ${f}`,
          `Throw Distance (d) = ${d} ${distanceUnit}`,
          "",
          "Formula: Vmax = √(2gfd)",
          `Substitution: Vmax = √(2 × ${g} × ${f} × ${d})`,
          `Calculation: Vmax = √(${2 * g * f * d})`,
          `Result: Vmax = ${result.velocity.toFixed(2)} ${result.velocityUnit}`
        ];
      },

      resultUnit: "velocity",
      tags: ["searle", "pedestrian", "maximum", "throw"],
      relatedFormulas: ["searle_minimum_speed"]
    },

    motorcycleLateralFrictionVelocity: {
      id: "motorcycle_lateral_friction_velocity",
      name: "Motorcycle Lateral Friction (from Velocity)",
      formula: "fs = V² / gr",
      description: "Calculate lateral acceleration factor for motorcycle curve negotiation using velocity",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "V",
          label: "Velocity",
          unit: "velocity",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "45"
        },
        {
          key: "g",
          label: "Gravity Acceleration",
          unit: "acceleration",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "32.2",
          defaultValue: 32.2
        },
        {
          key: "r",
          label: "Radius",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "150"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { V, g, r } = inputs;
        
        // fs = V² / (g × r)
        const lateralFriction = (V * V) / (g * r);
        
        return {
          lateralFriction: lateralFriction,
          velocity: V,
          gravity: g,
          radius: r,
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          accelUnit: unitSystem === 'imperial' ? 'ft/s²' : 'm/s²'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { V, g, r } = inputs;
        const velocityUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        const accelUnit = unitSystem === 'imperial' ? 'ft/s²' : 'm/s²';
        
        return [
          "Given:",
          `Velocity (V) = ${V} ${velocityUnit}`,
          `Gravity (g) = ${g} ${accelUnit}`,
          `Radius (r) = ${r} ${distanceUnit}`,
          "",
          "Formula: fs = V² / gr",
          `Substitution: fs = ${V}² / (${g} × ${r})`,
          `Calculation: fs = ${V * V} / ${g * r}`,
          `Result: fs = ${result.lateralFriction.toFixed(3)}`
        ];
      },

      resultUnit: "coefficient",
      tags: ["motorcycle", "lateral", "friction", "curve"],
      relatedFormulas: ["motorcycle_lateral_friction_speed", "motorcycle_lean_angle", "motorcycle_radius_velocity"]
    },

    motorcycleLateralFrictionSpeed: {
      id: "motorcycle_lateral_friction_speed",
      name: "Motorcycle Lateral Friction (from Speed)",
      formula: "fs = S² / 14.98r",
      description: "Calculate lateral acceleration factor for motorcycle curve negotiation using speed in mph",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "S",
          label: "Speed",
          unit: "speed",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "35"
        },
        {
          key: "r",
          label: "Radius",
          unit: "distance",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "150"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { S, r } = inputs;
        
        // fs = S² / (14.98 × r)
        const lateralFriction = (S * S) / (14.98 * r);
        
        return {
          lateralFriction: lateralFriction,
          speed: S,
          radius: r,
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h',
          distanceUnit: unitSystem === 'imperial' ? 'ft' : 'm'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { S, r } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Speed (S) = ${S} ${speedUnit}`,
          `Radius (r) = ${r} ${distanceUnit}`,
          "",
          "Formula: fs = S² / 14.98r",
          `Substitution: fs = ${S}² / (14.98 × ${r})`,
          `Calculation: fs = ${S * S} / ${14.98 * r}`,
          `Result: fs = ${result.lateralFriction.toFixed(3)}`
        ];
      },

      resultUnit: "coefficient",
      tags: ["motorcycle", "lateral", "friction", "speed", "curve"],
      relatedFormulas: ["motorcycle_lateral_friction_velocity", "motorcycle_lean_angle", "motorcycle_radius_speed"]
    },

    motorcycleLeanAngle: {
      id: "motorcycle_lean_angle",
      name: "Motorcycle Lean Angle",
      formula: "θ = Tan⁻¹fs",
      description: "Calculate the lean angle of a motorcycle from lateral friction factor",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "fs",
          label: "Lateral Friction Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.01, max: 2.0, required: true },
          placeholder: "0.75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { fs } = inputs;
        
        // θ = Tan⁻¹(fs) - result in radians, convert to degrees
        const leanAngleRadians = Math.atan(fs);
        const leanAngleDegrees = leanAngleRadians * (180 / Math.PI);
        
        return {
          leanAngleDegrees: leanAngleDegrees,
          leanAngleRadians: leanAngleRadians,
          lateralFriction: fs
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { fs } = inputs;
        
        return [
          "Given:",
          `Lateral Friction Factor (fs) = ${fs}`,
          "",
          "Formula: θ = Tan⁻¹fs",
          `Substitution: θ = Tan⁻¹(${fs})`,
          `Calculation: θ = ${result.leanAngleRadians.toFixed(4)} radians`,
          `Result: θ = ${result.leanAngleDegrees.toFixed(2)}°`
        ];
      },

      resultUnit: "angle",
      tags: ["motorcycle", "lean", "angle"],
      relatedFormulas: ["motorcycle_lateral_friction_velocity", "motorcycle_lateral_friction_speed"]
    },

    motorcycleRadiusVelocity: {
      id: "motorcycle_radius_velocity",
      name: "Motorcycle Radius (from Velocity)",
      formula: "r = V² / fsg",
      description: "Calculate radius for motorcycle curve negotiation using velocity and lateral friction",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "V",
          label: "Velocity",
          unit: "velocity",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "45"
        },
        {
          key: "fs",
          label: "Lateral Friction Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.01, max: 2.0, required: true },
          placeholder: "0.75"
        },
        {
          key: "g",
          label: "Gravity Acceleration",
          unit: "acceleration",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "32.2",
          defaultValue: 32.2
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { V, fs, g } = inputs;
        
        // r = V² / (fs × g)
        const radius = (V * V) / (fs * g);
        
        return {
          radius: radius,
          velocity: V,
          lateralFriction: fs,
          gravity: g,
          radiusUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          velocityUnit: unitSystem === 'imperial' ? 'ft/s' : 'm/s',
          accelUnit: unitSystem === 'imperial' ? 'ft/s²' : 'm/s²'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { V, fs, g } = inputs;
        const velocityUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
        const accelUnit = unitSystem === 'imperial' ? 'ft/s²' : 'm/s²';
        const radiusUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Velocity (V) = ${V} ${velocityUnit}`,
          `Lateral Friction Factor (fs) = ${fs}`,
          `Gravity (g) = ${g} ${accelUnit}`,
          "",
          "Formula: r = V² / fsg",
          `Substitution: r = ${V}² / (${fs} × ${g})`,
          `Calculation: r = ${V * V} / ${fs * g}`,
          `Result: r = ${result.radius.toFixed(2)} ${radiusUnit}`
        ];
      },

      resultUnit: "distance",
      tags: ["motorcycle", "radius", "velocity", "curve"],
      relatedFormulas: ["motorcycle_radius_speed", "motorcycle_lateral_friction_velocity"]
    },

    motorcycleRadiusSpeed: {
      id: "motorcycle_radius_speed",
      name: "Motorcycle Radius (from Speed)",
      formula: "r = S² / 14.98fs",
      description: "Calculate radius for motorcycle curve negotiation using speed in mph and lateral friction",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "S",
          label: "Speed",
          unit: "speed",
          type: "number",
          validation: { min: 0.1, required: true },
          placeholder: "35"
        },
        {
          key: "fs",
          label: "Lateral Friction Factor",
          unit: "coefficient",
          type: "number",
          validation: { min: 0.01, max: 2.0, required: true },
          placeholder: "0.75"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { S, fs } = inputs;
        
        // r = S² / (14.98 × fs)
        const radius = (S * S) / (14.98 * fs);
        
        return {
          radius: radius,
          speed: S,
          lateralFriction: fs,
          radiusUnit: unitSystem === 'imperial' ? 'ft' : 'm',
          speedUnit: unitSystem === 'imperial' ? 'mph' : 'km/h'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { S, fs } = inputs;
        const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';
        const radiusUnit = unitSystem === 'imperial' ? 'ft' : 'm';
        
        return [
          "Given:",
          `Speed (S) = ${S} ${speedUnit}`,
          `Lateral Friction Factor (fs) = ${fs}`,
          "",
          "Formula: r = S² / 14.98fs",
          `Substitution: r = ${S}² / (14.98 × ${fs})`,
          `Calculation: r = ${S * S} / ${14.98 * fs}`,
          `Result: r = ${result.radius.toFixed(2)} ${radiusUnit}`
        ];
      },

      resultUnit: "distance",
      tags: ["motorcycle", "radius", "speed", "curve"],
      relatedFormulas: ["motorcycle_radius_velocity", "motorcycle_lateral_friction_speed"]
    },

    motorcycleSpeedFromRPM: {
      id: "motorcycle_speed_from_rpm",
      name: "Motorcycle Speed from RPM",
      formula: "S = (Engine RPM × Rw) / (Final Gear Ratio × 1681)",
      description: "Calculate vehicle speed (mph) from engine RPM, wheel radius, and gear ratios",
      category: "pedestrianMotorcycle",
      
      inputs: [
        {
          key: "rpm",
          label: "Engine RPM",
          unit: "rpm",
          type: "number",
          validation: { min: 1, max: 15000, required: true },
          placeholder: "3500"
        },
        {
          key: "Rw",
          label: "Radius of Drive Wheel (Rw)",
          unit: "wheelRadius",
          type: "number",
          validation: { min: 1, max: 50, required: true },
          placeholder: "12.5"
        },
        {
          key: "finalGearRatio",
          label: "Final Gear Ratio",
          unit: "ratio",
          type: "number",
          validation: { min: 0.1, max: 20, required: true },
          placeholder: "4.5"
        }
      ],

      calculate: (inputs, unitSystem) => {
        const { rpm, Rw, finalGearRatio } = inputs;
        
        // S = (Engine RPM × Rw) / (Final Gear Ratio × 1681)
        // This formula directly calculates speed in MPH
        const speed = (rpm * Rw) / (finalGearRatio * 1681);
        
        // Convert to metric if needed
        let convertedSpeed = speed;
        let speedUnit = 'mph';
        
        if (unitSystem === 'metric') {
          convertedSpeed = speed * 1.60934; // mph to km/h
          speedUnit = 'km/h';
        }
        
        return {
          speed: convertedSpeed,
          speedUnit: speedUnit,
          rpm: rpm,
          wheelRadius: Rw,
          finalGearRatio: finalGearRatio,
          wheelRadiusUnit: unitSystem === 'imperial' ? 'inches' : 'cm'
        };
      },

      generateSteps: (inputs, unitSystem, result) => {
        const { rpm, Rw, finalGearRatio } = inputs;
        const wheelRadiusUnit = unitSystem === 'imperial' ? 'inches' : 'cm';
        
        return [
          "Given:",
          `Engine RPM = ${rpm}`,
          `Wheel Radius (Rw) = ${Rw} ${wheelRadiusUnit}`,
          `Final Gear Ratio = ${finalGearRatio}`,
          "",
          "Formula: S = (Engine RPM × Rw) / (Final Gear Ratio × 1681)",
          `Substitution: S = (${rpm} × ${Rw}) / (${finalGearRatio} × 1681)`,
          `Calculation: S = ${rpm * Rw} / ${finalGearRatio * 1681}`,
          `Result: S = ${result.speed.toFixed(2)} ${result.speedUnit}`
        ];
      },

      resultUnit: "speed",
      tags: ["motorcycle", "rpm", "speed", "gear", "ratio"],
      relatedFormulas: []
    }
  }
};

export default pedestrianMotorcycleCategory;