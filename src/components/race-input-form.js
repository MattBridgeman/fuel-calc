/**
 * Race input form component
 * Handles user input for race configuration
 */

import { validateField, validateTimeFormat } from '../services/validation.js';

class RaceInputForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.configuration = {
      mode: 'laps',
      raceLength: '',
      averageLapTime: '',
      tankCapacity: '',
      fuelPerLap: '',
      bufferLaps: '0'
    };
    this.fieldErrors = {};
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
        }
        
        .form-container {
          background: var(--color-bg, #ffffff);
          border-radius: var(--border-radius-lg, 0.75rem);
          padding: var(--spacing-lg, 1.5rem);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }
        
        .form-group {
          margin-bottom: var(--spacing-lg, 1.5rem);
        }
        
        label {
          display: block;
          margin-bottom: var(--spacing-sm, 0.5rem);
          font-weight: 500;
          color: var(--color-text, #1f2937);
        }
        
        .required {
          color: var(--color-error, #ef4444);
        }
        
        input[type="text"],
        input[type="number"],
        select {
          width: 100%;
          padding: var(--spacing-md, 1rem);
          border: 2px solid var(--color-border, #e5e7eb);
          border-radius: var(--border-radius-md, 0.5rem);
          font-size: 1rem;
          font-family: inherit;
          transition: border-color var(--transition-base, 200ms ease-in-out);
          min-height: 44px;
        }
        
        input:focus,
        select:focus {
          outline: none;
          border-color: var(--color-border-focus, #2563eb);
        }
        
        input.error,
        select.error {
          border-color: var(--color-error, #ef4444);
        }
        
        .error-message {
          color: var(--color-error, #ef4444);
          font-size: 0.875rem;
          margin-top: var(--spacing-xs, 0.25rem);
          display: none;
        }
        
        .error-message.show {
          display: block;
        }
        
        .mode-selector {
          display: flex;
          gap: var(--spacing-md, 1rem);
          margin-bottom: var(--spacing-md, 1rem);
        }
        
        .mode-option {
          flex: 1;
          padding: var(--spacing-md, 1rem);
          border: 2px solid var(--color-border, #e5e7eb);
          border-radius: var(--border-radius-md, 0.5rem);
          background: var(--color-bg, #ffffff);
          cursor: pointer;
          text-align: center;
          font-weight: 500;
          transition: all var(--transition-base, 200ms ease-in-out);
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mode-option:hover {
          border-color: var(--color-border-focus, #2563eb);
          background: var(--color-bg-light, #f9fafb);
        }
        
        .mode-option.selected {
          border-color: var(--color-primary, #2563eb);
          background: var(--color-primary, #2563eb);
          color: white;
        }
        
        button[type="submit"] {
          width: 100%;
          padding: var(--spacing-md, 1rem);
          background: var(--color-primary, #2563eb);
          color: white;
          border: none;
          border-radius: var(--border-radius-md, 0.5rem);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color var(--transition-base, 200ms ease-in-out);
          min-height: 44px;
        }
        
        button[type="submit"]:hover {
          background: var(--color-primary-dark, #1e40af);
        }
        
        button[type="submit"]:disabled {
          background: var(--color-secondary, #64748b);
          cursor: not-allowed;
        }
      </style>
      
      <form class="form-container">
        <div class="form-group">
          <label>Race Length Mode <span class="required">*</span></label>
          <div class="mode-selector">
            <div class="mode-option selected" data-mode="laps">Laps</div>
            <div class="mode-option" data-mode="time">Time</div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="raceLength">Race Length <span class="required">*</span></label>
          <input 
            type="number" 
            id="raceLength" 
            name="raceLength" 
            step="any"
            min="0.1"
            placeholder="Enter race length"
            required
          />
          <span class="error-message" id="raceLength-error"></span>
        </div>
        
        <div class="form-group" id="lapTimeGroup" style="display: none;">
          <label for="averageLapTime">Average Lap Time <span class="required">*</span></label>
          <input 
            type="text" 
            id="averageLapTime" 
            name="averageLapTime" 
            placeholder="mm:ss or seconds"
          />
          <span class="error-message" id="averageLapTime-error"></span>
        </div>
        
        <div class="form-group">
          <label for="tankCapacity">Tank Capacity (L) <span class="required">*</span></label>
          <input 
            type="number" 
            id="tankCapacity" 
            name="tankCapacity" 
            step="0.1"
            min="0.1"
            placeholder="Enter tank capacity"
            required
          />
          <span class="error-message" id="tankCapacity-error"></span>
        </div>
        
        <div class="form-group">
          <label for="fuelPerLap">Fuel Per Lap (L) <span class="required">*</span></label>
          <input 
            type="number" 
            id="fuelPerLap" 
            name="fuelPerLap" 
            step="0.001"
            min="0.001"
            placeholder="Enter fuel per lap"
            required
          />
          <span class="error-message" id="fuelPerLap-error"></span>
        </div>
        
        <div class="form-group">
          <label for="bufferLaps">Buffer Laps <span class="required">*</span></label>
          <input 
            type="number" 
            id="bufferLaps" 
            name="bufferLaps" 
            step="1"
            min="0"
            value="0"
            placeholder="Enter buffer laps"
            required
          />
          <span class="error-message" id="bufferLaps-error"></span>
        </div>
        
        <button type="submit">Calculate Fuel Requirements</button>
      </form>
    `;
  }

  attachEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const modeOptions = this.shadowRoot.querySelectorAll('.mode-option');
    const inputs = this.shadowRoot.querySelectorAll('input');
    
    // Mode selector
    modeOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.setMode(mode);
      });
    });
    
    // Input validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input.name, input.value);
      });
      
      input.addEventListener('input', () => {
        // Clear error on input
        this.clearFieldError(input.name);
      });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.submitForm();
      }
    });
  }

  setMode(mode) {
    this.configuration.mode = mode;
    const modeOptions = this.shadowRoot.querySelectorAll('.mode-option');
    const lapTimeGroup = this.shadowRoot.querySelector('#lapTimeGroup');
    
    modeOptions.forEach(option => {
      if (option.dataset.mode === mode) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    if (mode === 'time') {
      lapTimeGroup.style.display = 'block';
    } else {
      lapTimeGroup.style.display = 'none';
      this.configuration.averageLapTime = '';
    }
  }

  validateField(fieldName, value) {
    let result;
    
    if (fieldName === 'averageLapTime' && this.configuration.mode === 'time') {
      result = validateTimeFormat(value);
      if (result.valid) {
        this.configuration.averageLapTime = result.seconds;
      }
    } else {
      result = validateField(fieldName, value, this.configuration);
    }
    
    if (!result.valid) {
      this.showFieldError(fieldName, result.message);
      this.fieldErrors[fieldName] = result.message;
      return false;
    } else {
      this.clearFieldError(fieldName);
      delete this.fieldErrors[fieldName];
      
      // Update configuration
      if (fieldName !== 'averageLapTime' || this.configuration.mode === 'time') {
        this.configuration[fieldName] = value;
      }
      return true;
    }
  }

  showFieldError(fieldName, message) {
    const input = this.shadowRoot.querySelector(`[name="${fieldName}"]`);
    const errorElement = this.shadowRoot.querySelector(`#${fieldName}-error`);
    
    if (input) {
      input.classList.add('error');
    }
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearFieldError(fieldName) {
    const input = this.shadowRoot.querySelector(`[name="${fieldName}"]`);
    const errorElement = this.shadowRoot.querySelector(`#${fieldName}-error`);
    
    if (input) {
      input.classList.remove('error');
    }
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  validate() {
    let isValid = true;
    const inputs = this.shadowRoot.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      if (input.id === 'averageLapTime' && this.configuration.mode !== 'time') {
        return; // Skip if not in time mode
      }
      
      if (!this.validateField(input.name, input.value)) {
        isValid = false;
      }
    });
    
    return isValid && Object.keys(this.fieldErrors).length === 0;
  }

  submitForm() {
    // Build configuration object
    const config = {
      mode: this.configuration.mode,
      raceLength: parseFloat(this.configuration.raceLength),
      tankCapacity: parseFloat(this.configuration.tankCapacity),
      fuelPerLap: parseFloat(this.configuration.fuelPerLap),
      bufferLaps: parseInt(this.configuration.bufferLaps, 10)
    };
    
    if (this.configuration.mode === 'time') {
      config.averageLapTime = parseFloat(this.configuration.averageLapTime);
      config.estimatedLaps = config.raceLength / config.averageLapTime;
    }
    
    // Emit form-submit event
    this.dispatchEvent(new CustomEvent('form-submit', {
      detail: { configuration: config },
      bubbles: true,
      composed: true
    }));
  }

  reset() {
    this.configuration = {
      mode: 'laps',
      raceLength: '',
      averageLapTime: '',
      tankCapacity: '',
      fuelPerLap: '',
      bufferLaps: '0'
    };
    this.fieldErrors = {};
    this.setMode('laps');
    
    const inputs = this.shadowRoot.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.name === 'bufferLaps') {
        input.value = '0';
      } else {
        input.value = '';
      }
      this.clearFieldError(input.name);
    });
  }

  get valid() {
    return Object.keys(this.fieldErrors).length === 0 && 
           this.configuration.raceLength && 
           this.configuration.tankCapacity && 
           this.configuration.fuelPerLap;
  }

  getConfiguration() {
    return { ...this.configuration };
  }
}

customElements.define('race-input-form', RaceInputForm);

