# Component Interface Contracts

**Feature**: Fuel Calculator for Assetto Corsa Competizione  
**Date**: 2026-01-05  
**Type**: Web Component API Contracts

## Overview

This document defines the public interfaces for Web Components used in the fuel calculator application. All components are custom elements following the Web Components standard.

## Component Contracts

### 1. `<fuel-calculator>`

Root application component that orchestrates the fuel calculation workflow.

**Custom Element Name**: `fuel-calculator`

**Attributes**:
- None (root component)

**Properties** (public API):
- None (internal state only)

**Methods** (public API):
- None (handles internal coordination)

**Events Emitted**:
- `calculation-complete` (CustomEvent): Fired when calculation completes
  - `detail`: `{ stints: StintCalculation[], pitStrategy: PitStrategy }`
- `calculation-error` (CustomEvent): Fired when calculation fails
  - `detail`: `{ message: string, field?: string }`

**Events Listened To**:
- `form-submit` from `<race-input-form>`: Triggers calculation
- `pit-lap-change` from `<pit-lap-slider>`: Triggers recalculation

**Slots**:
- Default slot: Contains child components

**Internal Structure**:
```html
<fuel-calculator>
  <race-input-form></race-input-form>
  <stint-results></stint-results>
</fuel-calculator>
```

---

### 2. `<race-input-form>`

Form component for entering race configuration parameters.

**Custom Element Name**: `race-input-form`

**Attributes**:
- None

**Properties** (public API):
- `configuration` (RaceConfiguration, getter/setter): Current race configuration
- `valid` (boolean, getter): Whether form is valid

**Methods** (public API):
- `validate()`: Validates all fields, returns boolean
- `getConfiguration()`: Returns RaceConfiguration object
- `reset()`: Resets form to initial state

**Events Emitted**:
- `form-submit` (CustomEvent): Fired when form is submitted with valid data
  - `detail`: `{ configuration: RaceConfiguration }`
- `form-change` (CustomEvent): Fired when any field changes
  - `detail`: `{ field: string, value: any, valid: boolean }`
- `validation-error` (CustomEvent): Fired when validation fails
  - `detail`: `{ field: string, message: string }`

**Events Listened To**:
- None (leaf component)

**Form Fields** (internal):
- Race length mode selector (laps/time)
- Race length input (number)
- Average lap time input (number, conditional on mode)
- Tank capacity input (number)
- Fuel per lap input (number)
- Buffer laps input (number)
- Submit button

**Validation**:
- Inline validation on blur/input
- Visual indicators (red borders, error messages)
- Prevents submission if invalid

---

### 3. `<stint-results>`

Component that displays calculated stint results and pit lap sliders.

**Custom Element Name**: `stint-results`

**Attributes**:
- `hidden` (boolean): Controls visibility (hidden when no results)

**Properties** (public API):
- `stints` (StintCalculation[], getter/setter): Array of stint calculations
- `pitStrategy` (PitStrategy, getter/setter): Current pit strategy
- `raceLength` (number, getter/setter): Total race length (for slider bounds)

**Methods** (public API):
- `updateStints(stints: StintCalculation[])`: Updates displayed stints
- `updatePitStrategy(pitStrategy: PitStrategy)`: Updates pit strategy and sliders

**Events Emitted**:
- `pit-lap-change` (CustomEvent): Fired when any pit lap slider changes
  - `detail`: `{ pitIndex: number, lap: number }`

**Events Listened To**:
- `calculation-complete` from `<fuel-calculator>`: Updates display

**Internal Structure**:
- Stint result cards (one per stint)
- Pit lap sliders (one per pit stop)
- Fuel amount displays

**Display Format**:
- Each stint: "Stint X: Y.YY L (Laps A-B)"
- Final stint indicator: "Final Stint" badge
- Buffer laps indicator: "Includes X buffer laps"

---

### 4. `<pit-lap-slider>`

Individual slider control for adjusting pit stop lap timing.

**Custom Element Name**: `pit-lap-slider`

**Attributes**:
- `pit-index` (number, required): Index of this pit stop (0-based)
- `min-lap` (number, required): Minimum allowed lap number
- `max-lap` (number, required): Maximum allowed lap number
- `current-lap` (number, required): Current pit lap value

**Properties** (public API):
- `pitIndex` (number, getter/setter): Index of pit stop
- `minLap` (number, getter/setter): Minimum lap bound
- `maxLap` (number, getter/setter): Maximum lap bound
- `currentLap` (number, getter/setter): Current selected lap
- `disabled` (boolean, getter/setter): Whether slider is disabled

**Methods** (public API):
- `setBounds(min: number, max: number)`: Updates slider bounds
- `setValue(lap: number)`: Sets slider value programmatically

**Events Emitted**:
- `pit-lap-change` (CustomEvent): Fired on slider value change
  - `detail`: `{ pitIndex: number, lap: number }`

**Events Listened To**:
- None (leaf component)

**Validation**:
- Enforces min/max bounds
- Prevents invalid values (e.g., overlapping with other pits)
- Visual feedback for invalid state

**Accessibility**:
- ARIA labels: "Pit stop {pitIndex + 1} lap"
- Keyboard navigation support
- Screen reader announcements on value change

---

## Service Contracts

### 5. FuelCalculatorService

Business logic service for fuel calculations.

**Module**: `src/services/fuel-calculator.js`

**Exports**:
- `calculateStints(configuration: RaceConfiguration): StintCalculation[]`
- `calculateOptimalPitStrategy(configuration: RaceConfiguration): PitStrategy`
- `recalculateStints(configuration: RaceConfiguration, pitStrategy: PitStrategy): StintCalculation[]`
- `validateConfiguration(configuration: RaceConfiguration): { valid: boolean, errors: string[] }`

**Function: calculateStints**

```typescript
function calculateStints(
  configuration: RaceConfiguration
): StintCalculation[]
```

**Parameters**:
- `configuration`: RaceConfiguration object with all required fields

**Returns**: Array of StintCalculation objects, one per stint

**Throws**: Error if configuration is invalid or race is impossible

**Algorithm**:
1. Calculate total fuel needed: `raceLength × fuelPerLap + (bufferLaps × fuelPerLap)`
2. Calculate number of stints: `ceil(totalFuel / tankCapacity)`
3. Generate optimal pit strategy (even distribution)
4. Calculate fuel for each stint based on pit strategy
5. Apply buffer laps to final stint only

---

**Function: calculateOptimalPitStrategy**

```typescript
function calculateOptimalPitStrategy(
  configuration: RaceConfiguration
): PitStrategy
```

**Parameters**:
- `configuration`: RaceConfiguration object

**Returns**: PitStrategy with optimally distributed pit laps

**Algorithm**:
- Distributes pit stops evenly across race length
- Ensures each stint has sufficient fuel
- Returns empty array if single stint

---

**Function: recalculateStints**

```typescript
function recalculateStints(
  configuration: RaceConfiguration,
  pitStrategy: PitStrategy
): StintCalculation[]
```

**Parameters**:
- `configuration`: RaceConfiguration object
- `pitStrategy`: Updated pit strategy with modified pit laps

**Returns**: Updated array of StintCalculation objects

**Algorithm**:
- Recalculates fuel for stints affected by pit lap changes
- Validates that new pit strategy is feasible
- Updates all subsequent stints when earlier pit lap changes

---

**Function: validateConfiguration**

```typescript
function validateConfiguration(
  configuration: RaceConfiguration
): { valid: boolean, errors: string[] }
```

**Parameters**:
- `configuration`: RaceConfiguration object to validate

**Returns**: Object with `valid` boolean and `errors` array

**Validation Rules**:
- All required fields present
- All numeric fields > 0
- Mode is 'laps' or 'time'
- If mode is 'time', averageLapTime is provided
- Race is not impossible (total fuel can be carried)

---

### 6. ValidationService

Field-level validation utilities.

**Module**: `src/services/validation.js`

**Exports**:
- `validateField(field: string, value: any, configuration?: RaceConfiguration): { valid: boolean, message?: string }`
- `validateNumber(value: any, min?: number, max?: number): { valid: boolean, message?: string }`
- `validateTimeFormat(value: string): { valid: boolean, message?: string, seconds?: number }`

**Function: validateField**

Validates individual form fields with context-aware rules.

**Function: validateNumber**

Validates numeric input with optional min/max bounds.

**Function: validateTimeFormat**

Parses and validates time input (supports mm:ss, seconds, decimal minutes).

---

## Event Communication Pattern

### Event Flow

```
User Input
  ↓
<race-input-form> emits 'form-submit'
  ↓
<fuel-calculator> receives event
  ↓
FuelCalculatorService.calculateStints()
  ↓
<fuel-calculator> emits 'calculation-complete'
  ↓
<stint-results> receives event, updates display
  ↓
User adjusts <pit-lap-slider>
  ↓
<pit-lap-slider> emits 'pit-lap-change'
  ↓
<fuel-calculator> receives event
  ↓
FuelCalculatorService.recalculateStints()
  ↓
<fuel-calculator> emits 'calculation-complete'
  ↓
<stint-results> updates display
```

---

## Accessibility Contracts

All components MUST:
- Support keyboard navigation
- Provide ARIA labels and roles
- Announce state changes to screen readers
- Maintain focus management
- Support high contrast mode
- Meet WCAG 2.1 AA standards

---

## Browser Compatibility

All components MUST work in:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

Polyfills: None required (using only standard Web Components APIs)

