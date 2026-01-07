/**
 * Utility helper functions for calculations and data transformations
 */

/**
 * Rounds a number to specified decimal places
 * @param {number} value - Number to round
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {number}
 */
export function roundToDecimals(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a number as a string with specified decimal places
 * @param {number} value - Number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string}
 */
export function formatNumber(value, decimals = 2) {
  return roundToDecimals(value, decimals).toFixed(decimals);
}

/**
 * Formats fuel amount for display
 * @param {number} liters - Fuel amount in liters
 * @returns {string}
 */
export function formatFuel(liters) {
  return `${formatNumber(liters, 2)} L`;
}

/**
 * Formats lap range for display
 * @param {number} startLap - Starting lap number
 * @param {number} endLap - Ending lap number
 * @returns {string}
 */
export function formatLapRange(startLap, endLap) {
  if (startLap === endLap) {
    return `Lap ${startLap}`;
  }
  return `Laps ${startLap}-${endLap}`;
}

/**
 * Clamps a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Checks if a value is within a range (inclusive)
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  return value >= min && value <= max;
}

