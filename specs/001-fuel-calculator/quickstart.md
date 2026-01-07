# Quick Start Guide: Fuel Calculator Implementation

**Feature**: Fuel Calculator for Assetto Corsa Competizione  
**Date**: 2026-01-05

## Overview

This guide provides a step-by-step approach to implementing the fuel calculator feature. Follow this sequence to build the application incrementally.

## Prerequisites

- Node.js 18+ installed
- Modern browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of:
  - JavaScript (ES6+)
  - Web Components
  - HTML/CSS
  - Vite build tool

## Setup Steps

### 1. Initialize Project Structure

```bash
# Create directory structure
mkdir -p src/{components,services,styles,utils}
mkdir -p public/{icons}
mkdir -p tests/{unit,integration}

# Initialize package.json with Vite
npm init -y
npm install -D vite @web/test-runner playwright
```

### 2. Configure Vite

Create `vite.config.js`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 3. Create PWA Manifest

Create `public/manifest.json`:

```json
{
  "name": "Fuel Calculator for ACC",
  "short_name": "Fuel Calc",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4. Create Service Worker

Create `public/service-worker.js` (basic cache-first strategy):

```javascript
const CACHE_NAME = 'fuel-calc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/app.js',
  '/src/styles/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Implementation Sequence

### Phase 1: Core Business Logic (No UI)

**Goal**: Implement calculation engine without UI dependencies.

**Steps**:
1. Create `src/services/validation.js`
   - Implement `validateNumber()`
   - Implement `validateField()`
   - Implement `validateTimeFormat()`
   - Write unit tests

2. Create `src/services/fuel-calculator.js`
   - Implement `validateConfiguration()`
   - Implement `calculateStints()`
   - Implement `calculateOptimalPitStrategy()`
   - Implement `recalculateStints()`
   - Write unit tests for all calculation scenarios

**Test**: Run unit tests to verify calculations are correct.

---

### Phase 2: Basic Form Component

**Goal**: Create input form with validation.

**Steps**:
1. Create `src/components/race-input-form.js`
   - Define custom element class
   - Create shadow DOM
   - Add form fields (mode selector, inputs)
   - Implement inline validation
   - Emit `form-submit` event on valid submission
   - Style with modern, light, rounded design

2. Create `src/styles/components.css`
   - Define component styles
   - Ensure mobile-first responsive design
   - Touch targets ≥44x44px
   - WCAG AA contrast compliance

**Test**: Manual testing - enter values, verify validation, submit form.

---

### Phase 3: Results Display Component

**Goal**: Display calculation results.

**Steps**:
1. Create `src/components/stint-results.js`
   - Define custom element class
   - Create shadow DOM
   - Display stint cards with fuel amounts
   - Show lap ranges for each stint
   - Handle empty state (no results)
   - Style results display

2. Integrate with calculation service
   - Listen to `calculation-complete` event
   - Update display when results change

**Test**: Submit form, verify results display correctly.

---

### Phase 4: Pit Lap Sliders

**Goal**: Add interactive pit lap adjustment.

**Steps**:
1. Create `src/components/pit-lap-slider.js`
   - Define custom element class
   - Create native `<input type="range">` slider
   - Implement min/max bounds
   - Emit `pit-lap-change` event
   - Add ARIA labels for accessibility
   - Style slider (modern, rounded)

2. Integrate sliders into `stint-results`
   - Generate one slider per pit stop
   - Handle slider value changes
   - Emit events to parent

**Test**: Adjust sliders, verify events fire correctly.

---

### Phase 5: Root Component & Integration

**Goal**: Connect all components together.

**Steps**:
1. Create `src/components/fuel-calculator.js`
   - Define root custom element
   - Compose child components
   - Handle event coordination:
     - `form-submit` → calculate → emit `calculation-complete`
     - `pit-lap-change` → recalculate → emit `calculation-complete`
   - Handle error states

2. Create `src/app.js`
   - Initialize application
   - Register service worker
   - Mount `<fuel-calculator>` component

3. Create `public/index.html`
   - Basic HTML structure
   - Link manifest.json
   - Import app.js

**Test**: End-to-end workflow - enter data, see results, adjust sliders.

---

### Phase 6: Styling & Polish

**Goal**: Achieve modern, light, rounded design.

**Steps**:
1. Create `src/styles/main.css`
   - Global styles
   - CSS custom properties for theming
   - Typography
   - Layout (CSS Grid/Flexbox)
   - Mobile-first responsive breakpoints

2. Refine component styles
   - Ensure consistent rounded corners
   - Light color scheme
   - Proper spacing and hierarchy
   - Smooth transitions/animations

3. Test responsive design
   - Mobile (320px+)
   - Tablet (768px+)
   - Desktop (1920px+)

**Test**: Visual testing across viewports, accessibility audit.

---

### Phase 7: PWA Features

**Goal**: Enable offline functionality and installability.

**Steps**:
1. Enhance service worker
   - Cache all static assets
   - Cache HTML
   - Implement cache versioning
   - Handle offline fallback

2. Add PWA icons
   - Generate 192x192 and 512x512 icons
   - Place in `public/icons/`

3. Test PWA functionality
   - Install app
   - Test offline mode
   - Verify manifest

**Test**: Install app, go offline, verify functionality.

---

### Phase 8: Testing & Optimization

**Goal**: Ensure quality and performance.

**Steps**:
1. Write integration tests
   - Test complete user workflows
   - Test component interactions
   - Test edge cases

2. Performance optimization
   - Measure Lighthouse scores
   - Optimize bundle size
   - Ensure < 100ms calculations
   - Ensure < 50ms slider updates

3. Accessibility audit
   - Keyboard navigation
   - Screen reader testing
   - WCAG 2.1 AA compliance

**Test**: Run full test suite, Lighthouse audit, accessibility audit.

---

## Development Workflow

### Running Development Server

```bash
npm run dev  # Start Vite dev server
```

### Running Tests

```bash
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:all         # Run all tests
```

### Building for Production

```bash
npm run build  # Build optimized production bundle
npm run preview  # Preview production build
```

## Key Implementation Notes

### Web Components Pattern

```javascript
// Example component structure
class RaceInputForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>/* component styles */</style>
      <!-- component HTML -->
    `;
  }

  // Event handling, validation, etc.
}

customElements.define('race-input-form', RaceInputForm);
```

### Event Communication

```javascript
// Emit event
this.dispatchEvent(new CustomEvent('form-submit', {
  detail: { configuration: this.configuration },
  bubbles: true
}));

// Listen to event
this.addEventListener('calculation-complete', (event) => {
  this.updateDisplay(event.detail.stints);
});
```

### Validation Pattern

```javascript
// Inline validation on blur
input.addEventListener('blur', () => {
  const result = validateField('tankCapacity', input.value);
  if (!result.valid) {
    this.showError(result.message);
  } else {
    this.clearError();
  }
});
```

## Common Pitfalls to Avoid

1. **Don't use frameworks**: Stick to vanilla JavaScript and Web Components
2. **Don't add dependencies**: Use only native browser APIs
3. **Don't skip mobile testing**: Test on actual mobile devices
4. **Don't forget accessibility**: Keyboard navigation and screen readers
5. **Don't ignore performance**: Monitor Lighthouse scores during development

## Next Steps After Implementation

1. Code review against contracts
2. Performance audit (Lighthouse)
3. Accessibility audit (WCAG 2.1 AA)
4. Cross-browser testing
5. Mobile device testing
6. User acceptance testing

## Resources

- [Web Components Specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Vite Documentation](https://vitejs.dev/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

