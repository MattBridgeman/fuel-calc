/**
 * Validation service for form fields and data validation
 */

/**
 * Validates a numeric value
 * @param {any} value - Value to validate
 * @param {number} [min] - Minimum allowed value
 * @param {number} [max] - Maximum allowed value
 * @returns {{valid: boolean, message?: string}}
 */
export function validateNumber(value, min, max) {
  // Check if value is empty
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: 'Value is required' };
  }

  // Convert to number
  const num = Number(value);

  // Check if it's a valid number
  if (isNaN(num)) {
    return { valid: false, message: 'Must be a valid number' };
  }

  // Check if it's finite
  if (!isFinite(num)) {
    return { valid: false, message: 'Must be a finite number' };
  }

  // Check minimum
  if (min !== undefined && num < min) {
    return { valid: false, message: `Must be at least ${min}` };
  }

  // Check maximum
  if (max !== undefined && num > max) {
    return { valid: false, message: `Must be at most ${max}` };
  }

  // Check if positive (default requirement)
  if (num <= 0 && (min === undefined || min > 0)) {
    return { valid: false, message: 'Must be greater than zero' };
  }

  return { valid: true };
}

/**
 * Validates a field with context-aware rules
 * @param {string} field - Field name to validate
 * @param {any} value - Field value
 * @param {Object} [configuration] - Optional full configuration for context-aware validation
 * @returns {{valid: boolean, message?: string}}
 */
export function validateField(field, value, configuration = {}) {
  switch (field) {
    case 'mode':
      if (value !== 'laps' && value !== 'time') {
        return { valid: false, message: 'Mode must be "laps" or "time"' };
      }
      return { valid: true };

    case 'raceLength':
      const raceLengthResult = validateNumber(value, 0.1);
      if (!raceLengthResult.valid) {
        return raceLengthResult;
      }
      // In laps mode, raceLength should be an integer
      if (configuration.mode === 'laps') {
        const num = Number(value);
        if (!Number.isInteger(num)) {
          return { valid: false, message: 'Race length must be a whole number in laps mode' };
        }
      }
      return { valid: true };

    case 'averageLapTime':
      // Required only in time mode
      if (configuration.mode === 'time') {
        const lapTimeResult = validateNumber(value, 0.1);
        if (!lapTimeResult.valid) {
          return { valid: false, message: 'Average lap time is required in time mode' };
        }
      }
      return { valid: true };

    case 'tankCapacity':
      return validateNumber(value, 0.1);

    case 'fuelPerLap':
      return validateNumber(value, 0.001);

    case 'bufferLaps':
      const bufferResult = validateNumber(value, 0);
      if (!bufferResult.valid) {
        return bufferResult;
      }
      // Buffer laps should be an integer
      const num = Number(value);
      if (!Number.isInteger(num)) {
        return { valid: false, message: 'Buffer laps must be a whole number' };
      }
      return { valid: true };

    default:
      return { valid: true };
  }
}

/**
 * Validates and parses time format input
 * Supports formats: mm:ss, seconds (number), decimal minutes (e.g., 1.5)
 * @param {string} value - Time input string
 * @returns {{valid: boolean, message?: string, seconds?: number}}
 */
export function validateTimeFormat(value) {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: 'Time is required' };
  }

  const str = String(value).trim();

  // Try parsing as mm:ss format
  const mmssMatch = str.match(/^(\d{1,2}):(\d{2})$/);
  if (mmssMatch) {
    const minutes = parseInt(mmssMatch[1], 10);
    const seconds = parseInt(mmssMatch[2], 10);
    
    if (seconds >= 60) {
      return { valid: false, message: 'Seconds must be less than 60' };
    }
    
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) {
      return { valid: false, message: 'Time must be greater than zero' };
    }
    
    return { valid: true, seconds: totalSeconds };
  }

  // Try parsing as decimal number (could be seconds or minutes)
  const num = Number(str);
  if (!isNaN(num) && isFinite(num)) {
    if (num <= 0) {
      return { valid: false, message: 'Time must be greater than zero' };
    }
    
    // If number is less than 100, assume it's minutes (e.g., 1.5 minutes = 90 seconds)
    // If number is 100 or greater, assume it's seconds (e.g., 120 seconds)
    const totalSeconds = num < 100 ? num * 60 : num;
    
    return { valid: true, seconds: totalSeconds };
  }

  return { valid: false, message: 'Invalid time format. Use mm:ss, seconds, or decimal minutes' };
}

