/**
 * Stint results component
 * Displays calculated fuel requirements for each stint
 */

import { formatFuel, formatLapRange } from '../utils/helpers.js';
import './pit-lap-slider.js';

class StintResults extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.stints = [];
    this.pitStrategy = null;
    this.raceLength = 0;
    this.bufferLaps = 0;
    this.sliders = new Map();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  static get observedAttributes() {
    return ['hidden'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'hidden') {
      this.style.display = newValue !== null ? 'none' : 'block';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .results-container {
          background: var(--color-bg, #ffffff);
          border-radius: var(--border-radius-lg, 0.75rem);
          padding: var(--spacing-lg, 1.5rem);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
        }
        
        .results-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: var(--spacing-lg, 1.5rem);
          color: var(--color-text, #1f2937);
        }
        
        .stint-card {
          background: var(--color-bg-light, #f9fafb);
          border: 2px solid var(--color-border, #e5e7eb);
          border-radius: var(--border-radius-md, 0.5rem);
          padding: var(--spacing-md, 1rem);
          margin-bottom: var(--spacing-md, 1rem);
          transition: all var(--transition-base, 200ms ease-in-out);
        }
        
        .stint-card:last-child {
          margin-bottom: 0;
        }
        
        .stint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm, 0.5rem);
        }
        
        .stint-number {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text, #1f2937);
        }
        
        .badge {
          display: inline-block;
          padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
          border-radius: var(--border-radius-sm, 0.375rem);
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .badge-final {
          background: var(--color-success, #10b981);
          color: white;
        }
        
        .badge-buffer {
          background: var(--color-warning, #f59e0b);
          color: white;
        }
        
        .stint-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md, 1rem);
          margin-top: var(--spacing-sm, 0.5rem);
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 0.875rem;
          color: var(--color-text-light, #6b7280);
          margin-bottom: var(--spacing-xs, 0.25rem);
        }
        
        .detail-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text, #1f2937);
        }
        
        .fuel-amount {
          font-size: 1.5rem;
          color: var(--color-primary, #2563eb);
        }
        
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl, 3rem);
          color: var(--color-text-light, #6b7280);
        }
        
        .pit-slider-container {
          margin-top: var(--spacing-md, 1rem);
          padding-top: var(--spacing-md, 1rem);
          border-top: 1px solid var(--color-border, #e5e7eb);
        }
        
        @media (min-width: 768px) {
          .stint-details {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      </style>
      
      <div class="results-container">
        <h2 class="results-title">Fuel Requirements</h2>
        <div id="results-content"></div>
      </div>
    `;
  }

  updateStints(stints) {
    this.stints = stints;
    this.updateDisplay();
  }

  updatePitStrategy(pitStrategy) {
    this.pitStrategy = pitStrategy;
    this.updateDisplay();
  }

  updateDisplay() {
    // Ensure shadow DOM is ready
    if (!this.shadowRoot) {
      return;
    }
    
    const content = this.shadowRoot.querySelector('#results-content');
    
    if (!content) {
      return;
    }
    
    if (!this.stints || this.stints.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <p>Enter race parameters and click "Calculate Fuel Requirements" to see results.</p>
        </div>
      `;
      this.setAttribute('hidden', '');
      return;
    }
    
    this.removeAttribute('hidden');
    
    let html = '';
    
    this.stints.forEach((stint, index) => {
      const isLast = index === this.stints.length - 1;
      
      html += `
        <div class="stint-card">
          <div class="stint-header">
            <span class="stint-number">Stint ${stint.stintNumber}</span>
            <div>
              ${stint.isFinalStint ? '<span class="badge badge-final">Final Stint</span>' : ''}
              ${stint.includesBuffer && this.bufferLaps > 0 ? `<span class="badge badge-buffer">Includes ${this.bufferLaps} buffer laps</span>` : ''}
            </div>
          </div>
          <div class="stint-details">
            <div class="detail-item">
              <span class="detail-label">Fuel Amount</span>
              <span class="detail-value fuel-amount">${formatFuel(stint.fuelAmount)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Lap Range</span>
              <span class="detail-value">${formatLapRange(stint.startLap, stint.endLap)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Laps</span>
              <span class="detail-value">${stint.lapCount}</span>
            </div>
          </div>
          ${!isLast && this.pitStrategy && this.pitStrategy.pitLaps ? `
            <div class="pit-slider-container">
              <pit-lap-slider 
                pit-index="${index}"
                min-lap="${this.calculateMinLap(index)}"
                max-lap="${this.calculateMaxLap(index)}"
                current-lap="${this.pitStrategy.pitLaps[index]}"
              ></pit-lap-slider>
            </div>
          ` : ''}
        </div>
      `;
    });
    
    content.innerHTML = html;
    
    // Attach event listeners to sliders after rendering
    this.attachSliderListeners();
  }
  
  calculateMinLap(pitIndex) {
    // Minimum is the previous pit lap + 1, or 1 if first pit
    if (pitIndex === 0) {
      return 1;
    }
    return (this.pitStrategy?.pitLaps[pitIndex - 1] || 0) + 1;
  }
  
  calculateMaxLap(pitIndex) {
    // Maximum is the next pit lap - 1, or race length if last pit
    if (pitIndex >= (this.pitStrategy?.pitLaps.length || 0) - 1) {
      return Math.max(1, Math.ceil(this.raceLength) - 1);
    }
    return (this.pitStrategy?.pitLaps[pitIndex + 1] || Math.ceil(this.raceLength)) - 1;
  }
  
  attachEventListeners() {
    // Listen for calculation-complete events from parent
    this.addEventListener('calculation-complete', (e) => {
      if (e.detail.stints) {
        this.updateStints(e.detail.stints);
      }
      if (e.detail.pitStrategy) {
        this.updatePitStrategy(e.detail.pitStrategy);
      }
    });
  }
  
  attachSliderListeners() {
    // Find all sliders and attach listeners
    const sliders = this.shadowRoot.querySelectorAll('pit-lap-slider');
    sliders.forEach((slider, index) => {
      slider.addEventListener('pit-lap-change', (e) => {
        this.handlePitLapChange(e.detail.pitIndex, e.detail.lap);
      });
    });
  }
  
  handlePitLapChange(pitIndex, lap) {
    // Forward event to parent
    this.dispatchEvent(new CustomEvent('pit-lap-change', {
      detail: {
        pitIndex,
        lap
      },
      bubbles: true,
      composed: true
    }));
  }


  set stints(value) {
    this._stints = value;
    this.updateDisplay();
  }

  get stints() {
    return this._stints || [];
  }

  set pitStrategy(value) {
    this._pitStrategy = value;
  }

  get pitStrategy() {
    return this._pitStrategy;
  }

  set raceLength(value) {
    this._raceLength = value;
  }

  get raceLength() {
    return this._raceLength;
  }
}

customElements.define('stint-results', StintResults);

