# Data Model: Fuel Calculator

**Feature**: Fuel Calculator for Assetto Corsa Competizione  
**Date**: 2026-01-05

## Overview

This document defines the data structures and entities used in the fuel calculator application. All data is client-side only (no backend), stored in memory during runtime. Future preset functionality will extend these models to include persistence via IndexedDB.

## Core Entities

### 1. RaceConfiguration

Represents the user-entered parameters for a race calculation.

**Fields**:
- `mode` (string, required): Race length input mode - `"laps"` or `"time"`
- `raceLength` (number, required): 
  - In `"laps"` mode: Number of laps (integer, > 0)
  - In `"time"` mode: Race duration in seconds (number, > 0)
- `averageLapTime` (number, optional): Average lap time in seconds (required when mode is `"time"`, > 0)
- `estimatedLaps` (number, computed): Calculated estimated number of laps when mode is `"time"` (computed from raceLength / averageLapTime)
- `tankCapacity` (number, required): Maximum fuel capacity in liters (number, > 0)
- `fuelPerLap` (number, required): Estimated fuel consumption per lap in liters (number, > 0)
- `bufferLaps` (number, required): Number of buffer laps to add to final stint (integer, ≥ 0)

**Validation Rules**:
- All numeric fields must be positive numbers greater than zero (except `bufferLaps` which can be zero)
- `mode` must be exactly `"laps"` or `"time"`
- When `mode` is `"time"`, `averageLapTime` is required
- When `mode` is `"time"`, `estimatedLaps` is computed and displayed to user
- `raceLength` in `"laps"` mode must be an integer
- `bufferLaps` must be an integer

**State Transitions**:
- Initial state: Empty/default values
- Valid state: All required fields filled with valid values
- Invalid state: Any validation rule violated (prevents calculation)

**Future Extensions** (for preset functionality):
- `id` (string, optional): Unique identifier for saved preset
- `name` (string, optional): User-provided name for preset
- `track` (string, optional): Track name/tag
- `car` (string, optional): Car name/tag
- `class` (string, optional): Racing class tag
- `createdAt` (Date, optional): Timestamp when preset was created
- `updatedAt` (Date, optional): Timestamp when preset was last modified

---

### 2. StintCalculation

Represents the calculated fuel requirements for a single stint.

**Fields**:
- `stintNumber` (number, required): Sequential number of this stint (1, 2, 3, ...)
- `fuelAmount` (number, required): Fuel needed for this stint in liters (number, > 0, ≤ tankCapacity)
- `startLap` (number, required): Starting lap number for this stint (integer, ≥ 1)
- `endLap` (number, required): Ending lap number (pit lap) for this stint (integer, > startLap, ≤ raceLength)
- `lapCount` (number, computed): Number of laps in this stint (endLap - startLap + 1)
- `isFinalStint` (boolean, required): Whether this is the final stint of the race
- `includesBuffer` (boolean, computed): Whether buffer laps are included (true only for final stint)

**Validation Rules**:
- `fuelAmount` must not exceed `tankCapacity`
- `endLap` must be greater than `startLap`
- `endLap` must not exceed total race length
- `startLap` for first stint is always 1
- `endLap` for final stint equals race length
- Final stint includes buffer laps in fuel calculation

**State Transitions**:
- Calculated: Created from RaceConfiguration and PitStrategy
- Updated: Recalculated when pit lap changes
- Invalid: If pit lap adjustments create impossible configuration

**Relationships**:
- Belongs to a RaceConfiguration (used for calculation)
- Affected by PitStrategy (pit lap timing)

---

### 3. PitStrategy

Represents the pit stop timing configuration for the race.

**Fields**:
- `pitLaps` (Array<number>, required): Array of lap numbers where pit stops occur
  - Length: `numberOfStints - 1` (one pit stop per stint except final)
  - Each value: Lap number to pit on (integer, > 0, < raceLength)
  - Sorted in ascending order
- `numberOfStints` (number, computed): Total number of stints required (calculated from race configuration)

**Validation Rules**:
- `pitLaps` array length must equal `numberOfStints - 1`
- Each pit lap must be:
  - Greater than previous pit lap (if any)
  - Less than race length
  - Greater than minimum viable lap (lap where fuel would run out if pitting earlier)
- Pit laps must allow sufficient fuel for each subsequent stint

**State Transitions**:
- Initial: Calculated from RaceConfiguration (optimal pit strategy)
- Adjusted: User modifies pit lap via slider
- Recalculated: Stint calculations updated when pit laps change
- Invalid: If adjustment creates impossible configuration (prevented by slider constraints)

**Relationships**:
- Derived from RaceConfiguration
- Affects StintCalculation[] (determines fuel distribution)

---

## Data Flow

### Calculation Flow

1. **User Input** → `RaceConfiguration` (validated)
2. **Calculate Stints** → Determine `numberOfStints` from `RaceConfiguration`
3. **Initial Pit Strategy** → Generate optimal `PitStrategy` (even distribution)
4. **Calculate Stints** → Generate `StintCalculation[]` for each stint
5. **Display Results** → Show fuel amounts and pit lap sliders
6. **User Adjusts Pit Lap** → Update `PitStrategy.pitLaps[]`
7. **Recalculate Affected Stints** → Update `StintCalculation[]` for affected stints

### Validation Flow

1. **Field Input** → Validate individual field (inline validation)
2. **Form Submission** → Validate complete `RaceConfiguration`
3. **Calculation** → Validate `PitStrategy` constraints
4. **Pit Lap Adjustment** → Validate slider bounds before updating

---

## Edge Cases & Constraints

### Single Stint Scenario
- When total fuel needed ≤ tank capacity: `numberOfStints = 1`
- `PitStrategy.pitLaps = []` (empty array, no pit stops)
- Single `StintCalculation` with `isFinalStint = true`
- No pit lap sliders displayed

### Impossible Race Scenario
- When total fuel needed > (tankCapacity × maximum possible stints)
- Maximum stints = floor(raceLength / minimumLapsPerStint)
- System should display error message, prevent calculation

### Buffer Laps Application
- Buffer laps only applied to final stint
- Final stint fuel = (laps in final stint + bufferLaps) × fuelPerLap
- All other stints use full tank capacity

### Time Mode Calculations
- `estimatedLaps = raceLength / averageLapTime` (may be fractional)
- Use fractional laps for fuel calculations (no rounding)
- Display estimated laps to user for verification

---

## Data Persistence (Future)

When preset functionality is added:
- `RaceConfiguration` will be stored in IndexedDB
- IndexedDB schema will include:
  - Primary key: `id` (auto-generated)
  - Indexes: `track`, `car`, `class`, `createdAt`
- No persistence required for `StintCalculation` or `PitStrategy` (computed on-demand)

---

## Type Definitions (JavaScript)

```javascript
// RaceConfiguration
{
  mode: 'laps' | 'time',
  raceLength: number,
  averageLapTime?: number,  // required when mode === 'time'
  estimatedLaps?: number,   // computed when mode === 'time'
  tankCapacity: number,
  fuelPerLap: number,
  bufferLaps: number
}

// StintCalculation
{
  stintNumber: number,
  fuelAmount: number,
  startLap: number,
  endLap: number,
  lapCount: number,         // computed: endLap - startLap + 1
  isFinalStint: boolean,
  includesBuffer: boolean   // computed: isFinalStint
}

// PitStrategy
{
  pitLaps: number[],       // length = numberOfStints - 1
  numberOfStints: number   // computed
}
```

