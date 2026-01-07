/**
 * Pit lap slider component
 * Interactive slider for adjusting pit stop lap timing
 */

class PitLapSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._pitIndex = 0;
    this._minLap = 1;
    this._maxLap = 100;
    this._currentLap = 1;
    this._disabled = false;
  }

  static get observedAttributes() {
    return ['pit-index', 'min-lap', 'max-lap', 'current-lap', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'pit-index':
        this._pitIndex = parseInt(newValue, 10) || 0;
        break;
      case 'min-lap':
        this._minLap = parseInt(newValue, 10) || 1;
        this.updateSlider();
        break;
      case 'max-lap':
        this._maxLap = parseInt(newValue, 10) || 100;
        this.updateSlider();
        break;
      case 'current-lap':
        this._currentLap = parseInt(newValue, 10) || 1;
        this.updateSlider();
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        this.updateSlider();
        break;
    }
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.updateSlider();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .slider-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm, 0.5rem);
        }
        
        .slider-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: var(--color-text, #1f2937);
        }
        
        .slider-label-text {
          font-weight: 500;
        }
        
        .slider-value {
          font-weight: 600;
          color: var(--color-primary, #2563eb);
        }
        
        input[type="range"] {
          width: 100%;
          height: 8px;
          border-radius: var(--border-radius-sm, 0.375rem);
          background: var(--color-border, #e5e7eb);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          min-height: 44px;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-primary, #2563eb);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          transition: all var(--transition-base, 200ms ease-in-out);
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          background: var(--color-primary-dark, #1e40af);
          transform: scale(1.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-primary, #2563eb);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          transition: all var(--transition-base, 200ms ease-in-out);
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          background: var(--color-primary-dark, #1e40af);
          transform: scale(1.1);
        }
        
        input[type="range"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        input[type="range"]:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
        }
        
        input[type="range"]:disabled::-moz-range-thumb {
          cursor: not-allowed;
        }
        
        input[type="range"]:focus-visible {
          outline: 2px solid var(--color-border-focus, #2563eb);
          outline-offset: 4px;
        }
        
        .slider-error {
          color: var(--color-error, #ef4444);
          font-size: 0.875rem;
          display: none;
        }
        
        .slider-error.show {
          display: block;
        }
      </style>
      
      <div class="slider-container">
        <div class="slider-label">
          <span class="slider-label-text">Pit Stop ${this._pitIndex + 1} Lap</span>
          <span class="slider-value" id="valueDisplay">${this._currentLap}</span>
        </div>
        <input 
          type="range" 
          id="slider"
          min="${this._minLap}"
          max="${this._maxLap}"
          value="${this._currentLap}"
          aria-label="Pit stop ${this._pitIndex + 1} lap"
          aria-valuemin="${this._minLap}"
          aria-valuemax="${this._maxLap}"
          aria-valuenow="${this._currentLap}"
        />
        <span class="slider-error" id="errorMessage"></span>
      </div>
    `;
  }

  attachEventListeners() {
    const slider = this.shadowRoot.querySelector('#slider');
    
    slider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value, 10);
      this.updateValue(value, false);
    });
    
    slider.addEventListener('change', (e) => {
      const value = parseInt(e.target.value, 10);
      this.updateValue(value, true);
    });
    
    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentValue = parseInt(slider.value, 10);
        const step = e.key === 'ArrowLeft' ? -1 : 1;
        const newValue = Math.max(this._minLap, Math.min(this._maxLap, currentValue + step));
        this.updateValue(newValue, true);
      }
    });
  }

  updateSlider() {
    const slider = this.shadowRoot.querySelector('#slider');
    const valueDisplay = this.shadowRoot.querySelector('#valueDisplay');
    
    if (slider) {
      slider.min = this._minLap;
      slider.max = this._maxLap;
      slider.value = this._currentLap;
      slider.disabled = this._disabled;
      
      // Update ARIA attributes
      slider.setAttribute('aria-valuemin', this._minLap);
      slider.setAttribute('aria-valuemax', this._maxLap);
      slider.setAttribute('aria-valuenow', this._currentLap);
    }
    
    if (valueDisplay) {
      valueDisplay.textContent = this._currentLap;
    }
  }

  updateValue(value, emitEvent = false) {
    // Validate bounds
    if (value < this._minLap || value > this._maxLap) {
      this.showError(`Value must be between ${this._minLap} and ${this._maxLap}`);
      return;
    }
    
    this.clearError();
    this._currentLap = value;
    this.updateSlider();
    
    if (emitEvent) {
      this.emitPitLapChange();
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

  emitPitLapChange() {
    this.dispatchEvent(new CustomEvent('pit-lap-change', {
      detail: {
        pitIndex: this._pitIndex,
        lap: this._currentLap
      },
      bubbles: true,
      composed: true
    }));
  }

  // Public API methods
  setBounds(min, max) {
    this._minLap = min;
    this._maxLap = max;
    this.setAttribute('min-lap', min);
    this.setAttribute('max-lap', max);
    this.updateSlider();
  }

  setValue(lap) {
    this._currentLap = lap;
    this.setAttribute('current-lap', lap);
    this.updateSlider();
  }

  // Getters and setters
  get pitIndex() {
    return this._pitIndex;
  }

  set pitIndex(value) {
    this._pitIndex = value;
    this.setAttribute('pit-index', value);
  }

  get minLap() {
    return this._minLap;
  }

  set minLap(value) {
    this._minLap = value;
    this.setAttribute('min-lap', value);
  }

  get maxLap() {
    return this._maxLap;
  }

  set maxLap(value) {
    this._maxLap = value;
    this.setAttribute('max-lap', value);
  }

  get currentLap() {
    return this._currentLap;
  }

  set currentLap(value) {
    this._currentLap = value;
    this.setAttribute('current-lap', value);
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = value;
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

customElements.define('pit-lap-slider', PitLapSlider);

