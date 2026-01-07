/**
 * Root fuel calculator component
 * Orchestrates the fuel calculation workflow
 */

import { calculateStints, calculateOptimalPitStrategy, recalculateStints, validateConfiguration } from '../services/fuel-calculator.js';
import './race-input-form.js';
import './stint-results.js';

class FuelCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.configuration = null;
    this.currentStints = [];
    this.currentPitStrategy = null;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-lg, 1.5rem);
        }
        
        .calculator-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl, 2rem);
        }
        
        .error-message {
          background: var(--color-error, #ef4444);
          color: white;
          padding: var(--spacing-md, 1rem);
          border-radius: var(--border-radius-md, 0.5rem);
          margin-bottom: var(--spacing-md, 1rem);
          display: none;
        }
        
        .error-message.show {
          display: block;
        }
        
        @media (min-width: 1024px) {
          .calculator-container {
            flex-direction: row;
          }
          
          race-input-form {
            flex: 1;
          }
          
          stint-results {
            flex: 1;
          }
        }
      </style>
      
      <div class="calculator-container">
        <div class="error-message" id="errorMessage"></div>
        <race-input-form></race-input-form>
        <stint-results></stint-results>
      </div>
    `;
  }

  attachEventListeners() {
    // Use requestAnimationFrame to ensure custom elements are fully upgraded
    requestAnimationFrame(() => {
      const form = this.shadowRoot.querySelector('race-input-form');
      const results = this.shadowRoot.querySelector('stint-results');
      
      if (!form || !results) {
        console.error('Failed to find required child components');
        return;
      }
      
      // Listen for form submission
      form.addEventListener('form-submit', (e) => {
        this.handleFormSubmit(e.detail.configuration);
      });
      
      // Listen for pit lap changes
      results.addEventListener('pit-lap-change', (e) => {
        this.handlePitLapChange(e.detail.pitIndex, e.detail.lap);
      });
    });
  }

  handleFormSubmit(configuration) {
    try {
      // Clear any previous errors
      this.clearError();
      
      // Validate configuration
      const validation = validateConfiguration(configuration);
      if (!validation.valid) {
        this.showError(validation.errors.join(', '));
        return;
      }
      
      // Store configuration
      this.configuration = configuration;
      
      // Calculate optimal pit strategy
      this.currentPitStrategy = calculateOptimalPitStrategy(configuration);
      
      // Calculate stints
      this.currentStints = calculateStints(configuration, this.currentPitStrategy);
      
      // Handle single-stint race (no pit stops)
      if (this.currentStints.length === 1) {
        // Single stint - no sliders needed
        this.updateResults();
        this.emitCalculationComplete();
        return;
      }
      
      // Update results display
      this.updateResults();
      
      // Emit calculation complete event
      this.emitCalculationComplete();
      
    } catch (error) {
      this.showError(error.message);
      this.emitCalculationError(error.message);
    }
  }

  handlePitLapChange(pitIndex, lap) {
    try {
      // Clear any previous errors
      this.clearError();
      
      if (!this.configuration || !this.currentPitStrategy) {
        return;
      }
      
      // Calculate slider bounds to validate
      const minLap = pitIndex === 0 ? 1 : (this.currentPitStrategy.pitLaps[pitIndex - 1] + 1);
      const maxLap = pitIndex >= this.currentPitStrategy.pitLaps.length - 1
        ? Math.ceil(this.getRaceLength()) - 1
        : (this.currentPitStrategy.pitLaps[pitIndex + 1] - 1);
      
      // Validate bounds
      if (lap < minLap || lap > maxLap) {
        this.showError(`Pit lap must be between ${minLap} and ${maxLap}`);
        return;
      }
      
      // Update pit strategy
      const updatedPitStrategy = {
        ...this.currentPitStrategy,
        pitLaps: [...this.currentPitStrategy.pitLaps]
      };
      
      updatedPitStrategy.pitLaps[pitIndex] = lap;
      
      // Recalculate stints (measure performance)
      const startTime = performance.now();
      this.currentStints = recalculateStints(this.configuration, updatedPitStrategy);
      const endTime = performance.now();
      
      // Ensure recalculation completes within 50ms
      if (endTime - startTime > 50) {
        console.warn(`Recalculation took ${endTime - startTime}ms, target is < 50ms`);
      }
      
      this.currentPitStrategy = updatedPitStrategy;
      
      // Update results display
      this.updateResults();
      
      // Emit calculation complete event
      this.emitCalculationComplete();
      
    } catch (error) {
      this.showError(error.message);
      this.emitCalculationError(error.message);
    }
  }
  
  getRaceLength() {
    if (!this.configuration) return 0;
    return this.configuration.mode === 'laps'
      ? this.configuration.raceLength
      : (this.configuration.raceLength / this.configuration.averageLapTime);
  }

  updateResults() {
    const results = this.shadowRoot.querySelector('stint-results');
    if (results) {
      results.updateStints(this.currentStints);
      results.updatePitStrategy(this.currentPitStrategy);
      if (this.configuration) {
        const raceLength = this.getRaceLength();
        results.raceLength = Math.ceil(raceLength);
        results.bufferLaps = this.configuration.bufferLaps || 0;
      }
    }
  }

  showError(message) {
    const errorElement = this.shadowRoot.querySelector('#errorMessage');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearError() {
    const errorElement = this.shadowRoot.querySelector('#errorMessage');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  emitCalculationComplete() {
    this.dispatchEvent(new CustomEvent('calculation-complete', {
      detail: {
        stints: this.currentStints,
        pitStrategy: this.currentPitStrategy
      },
      bubbles: true,
      composed: true
    }));
  }

  emitCalculationError(message) {
    this.dispatchEvent(new CustomEvent('calculation-error', {
      detail: {
        message: message
      },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('fuel-calculator', FuelCalculator);

