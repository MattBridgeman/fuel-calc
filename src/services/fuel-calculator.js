/**
 * Fuel calculator service for race strategy calculations
 */

import { validateField } from './validation.js';

/**
 * Validates a complete race configuration
 * @param {Object} configuration - RaceConfiguration object
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateConfiguration(configuration) {
  const errors = [];

  // Validate mode
  const modeResult = validateField('mode', configuration.mode);
  if (!modeResult.valid) {
    errors.push(modeResult.message);
  }

  // Validate raceLength
  const raceLengthResult = validateField('raceLength', configuration.raceLength, configuration);
  if (!raceLengthResult.valid) {
    errors.push(`Race length: ${raceLengthResult.message}`);
  }

  // Validate averageLapTime if in time mode
  if (configuration.mode === 'time') {
    const lapTimeResult = validateField('averageLapTime', configuration.averageLapTime, configuration);
    if (!lapTimeResult.valid) {
      errors.push(`Average lap time: ${lapTimeResult.message}`);
    }
  }

  // Validate tankCapacity
  const tankResult = validateField('tankCapacity', configuration.tankCapacity);
  if (!tankResult.valid) {
    errors.push(`Tank capacity: ${tankResult.message}`);
  }

  // Validate fuelPerLap
  const fuelPerLapResult = validateField('fuelPerLap', configuration.fuelPerLap);
  if (!fuelPerLapResult.valid) {
    errors.push(`Fuel per lap: ${fuelPerLapResult.message}`);
  }

  // Validate bufferLaps
  const bufferResult = validateField('bufferLaps', configuration.bufferLaps);
  if (!bufferResult.valid) {
    errors.push(`Buffer laps: ${bufferResult.message}`);
  }

  // Check if race is possible
  if (errors.length === 0) {
    const totalLaps = configuration.mode === 'laps' 
      ? configuration.raceLength 
      : (configuration.raceLength / configuration.averageLapTime);
    
    const totalFuelNeeded = totalLaps * configuration.fuelPerLap + 
                           (configuration.bufferLaps * configuration.fuelPerLap);
    
    const maxPossibleStints = Math.floor(totalLaps / 1); // Minimum 1 lap per stint
    const maxPossibleFuel = maxPossibleStints * configuration.tankCapacity;
    
    if (totalFuelNeeded > maxPossibleFuel) {
      errors.push('Race is impossible: total fuel needed exceeds maximum possible capacity');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculates the number of stints and fuel requirements
 * @param {Object} configuration - RaceConfiguration object
 * @param {Object} [pitStrategy] - Optional PitStrategy object (if not provided, optimal strategy is calculated)
 * @returns {Array} Array of StintCalculation objects
 */
export function calculateStints(configuration, pitStrategy = null) {
  // Validate configuration first
  const validation = validateConfiguration(configuration);
  if (!validation.valid) {
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }

  // Calculate total laps
  const totalLaps = configuration.mode === 'laps'
    ? configuration.raceLength
    : (configuration.raceLength / configuration.averageLapTime);

  // Calculate total fuel needed
  const totalFuelNeeded = totalLaps * configuration.fuelPerLap + 
                         (configuration.bufferLaps * configuration.fuelPerLap);

  // Calculate number of stints required
  const numberOfStints = Math.ceil(totalFuelNeeded / configuration.tankCapacity);

  // Use provided pit strategy or calculate optimal one
  const strategy = pitStrategy || calculateOptimalPitStrategy(configuration);

  // Generate stint calculations
  const stints = [];
  
  for (let i = 0; i < numberOfStints; i++) {
    const stintNumber = i + 1;
    const isFinalStint = (i === numberOfStints - 1);
    
    // Calculate start and end laps
    const startLap = i === 0 ? 1 : strategy.pitLaps[i - 1] + 1;
    const endLap = isFinalStint ? Math.ceil(totalLaps) : strategy.pitLaps[i];
    
    // Calculate laps in this stint
    const lapCount = endLap - startLap + 1;
    
    // Calculate fuel needed
    let fuelAmount;
    if (isFinalStint) {
      // Final stint includes buffer laps
      const finalLaps = lapCount + configuration.bufferLaps;
      fuelAmount = finalLaps * configuration.fuelPerLap;
      // Cap at tank capacity
      fuelAmount = Math.min(fuelAmount, configuration.tankCapacity);
    } else {
      // Other stints use full tank capacity
      fuelAmount = configuration.tankCapacity;
    }

    stints.push({
      stintNumber,
      fuelAmount: Math.round(fuelAmount * 100) / 100, // Round to 2 decimal places
      startLap,
      endLap,
      lapCount,
      isFinalStint,
      includesBuffer: isFinalStint
    });
  }

  return stints;
}

/**
 * Calculates optimal pit strategy (even distribution)
 * @param {Object} configuration - RaceConfiguration object
 * @returns {Object} PitStrategy object
 */
export function calculateOptimalPitStrategy(configuration) {
  // Calculate total laps
  const totalLaps = configuration.mode === 'laps'
    ? configuration.raceLength
    : (configuration.raceLength / configuration.averageLapTime);

  // Calculate total fuel needed
  const totalFuelNeeded = totalLaps * configuration.fuelPerLap + 
                         (configuration.bufferLaps * configuration.fuelPerLap);

  // Calculate number of stints
  const numberOfStints = Math.ceil(totalFuelNeeded / configuration.tankCapacity);

  // Single stint - no pit stops needed
  if (numberOfStints === 1) {
    return {
      pitLaps: [],
      numberOfStints: 1
    };
  }

  // Calculate optimal pit laps (even distribution)
  const pitLaps = [];
  const lapsPerStint = totalLaps / numberOfStints;

  for (let i = 1; i < numberOfStints; i++) {
    const pitLap = Math.round(i * lapsPerStint);
    // Ensure pit lap is within valid range
    const validPitLap = Math.max(1, Math.min(pitLap, Math.ceil(totalLaps) - 1));
    pitLaps.push(validPitLap);
  }

  return {
    pitLaps,
    numberOfStints
  };
}

/**
 * Recalculates stints when pit lap changes
 * @param {Object} configuration - RaceConfiguration object
 * @param {Object} pitStrategy - Updated PitStrategy object
 * @returns {Array} Updated array of StintCalculation objects
 */
export function recalculateStints(configuration, pitStrategy) {
  // Validate configuration
  const validation = validateConfiguration(configuration);
  if (!validation.valid) {
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }

  // Validate pit strategy
  if (!pitStrategy || !Array.isArray(pitStrategy.pitLaps)) {
    throw new Error('Invalid pit strategy');
  }

  // Calculate total laps
  const totalLaps = configuration.mode === 'laps'
    ? configuration.raceLength
    : (configuration.raceLength / configuration.averageLapTime);

  const numberOfStints = pitStrategy.numberOfStints || pitStrategy.pitLaps.length + 1;

  // Validate pit laps are in order and within bounds
  for (let i = 0; i < pitStrategy.pitLaps.length; i++) {
    const pitLap = pitStrategy.pitLaps[i];
    
    // Check bounds
    if (pitLap < 1 || pitLap >= Math.ceil(totalLaps)) {
      throw new Error(`Pit lap ${pitLap} is out of bounds`);
    }
    
    // Check ordering
    if (i > 0 && pitLap <= pitStrategy.pitLaps[i - 1]) {
      throw new Error(`Pit laps must be in ascending order`);
    }
  }

  // Recalculate stints with updated pit strategy
  const stints = [];
  
  for (let i = 0; i < numberOfStints; i++) {
    const stintNumber = i + 1;
    const isFinalStint = (i === numberOfStints - 1);
    
    // Calculate start and end laps
    const startLap = i === 0 ? 1 : pitStrategy.pitLaps[i - 1] + 1;
    const endLap = isFinalStint ? Math.ceil(totalLaps) : pitStrategy.pitLaps[i];
    
    // Calculate laps in this stint
    const lapCount = endLap - startLap + 1;
    
    // Calculate fuel needed
    let fuelAmount;
    if (isFinalStint) {
      // Final stint includes buffer laps
      const finalLaps = lapCount + configuration.bufferLaps;
      fuelAmount = finalLaps * configuration.fuelPerLap;
      // Cap at tank capacity
      fuelAmount = Math.min(fuelAmount, configuration.tankCapacity);
    } else {
      // Other stints use full tank capacity
      fuelAmount = configuration.tankCapacity;
    }

    stints.push({
      stintNumber,
      fuelAmount: Math.round(fuelAmount * 100) / 100, // Round to 2 decimal places
      startLap,
      endLap,
      lapCount,
      isFinalStint,
      includesBuffer: isFinalStint
    });
  }

  return stints;
}

