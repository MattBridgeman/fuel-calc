# Feature Specification: Fuel Calculator for Assetto Corsa Competizione

**Feature Branch**: `001-fuel-calculator`  
**Created**: 2024-12-19  
**Status**: Draft  
**Input**: User description: "initial app setup. This app should be a fuel calculation app for racing in Assetto Corsa Competizione. In races you need to set an amount of fuel in the tank that will get you through a 'stint'. In a sprint race, the fuel tank is big enough to carry all the fuel you will need for that sprint so the goal is to optimise having enough fuel to finish the race without running out of fuel or having to do 'fuel saving'. I would like the app to be a very simple interface where users can enter: race length, total tank capacity, est fuel per lap, and a buffer number of laps for any stint. The expected output when you submit this information is: number of stints required to complete the race, fuel needed per stint (value might be different depending on which lap you need to pit on), optional slider to move which lap to pit on (a recalculation of fuel needed per stint should be performed when the slider changes). For the design - use a modern, light and rounded look and feel. The following task (not this one) will be to save 'presets' where you can additional specify tags of the track, car and class - please consider this when doing the initial work here"

## Clarifications

### Session 2024-12-19

- Q: How should error messages and validation feedback be presented to users? → A: Inline validation with real-time feedback - show error messages directly below/next to each invalid field as the user types or on blur, with visual indicators (red borders, icons)
- Q: How are buffer laps applied to stint calculations? → A: Buffer laps applied only to final stint - all stints except the last use full tank capacity, final stint includes buffer laps
- Q: When there are multiple stints, does the pit lap slider control only the first pit stop or all pit stops? → A: Multiple sliders - one slider per pit stop, allowing independent control of each pit stop timing
- Q: How should race length be specified? → A: Two options supported: (1) Race length in laps (direct input), (2) Race length in time (requires average lap time to calculate estimated laps)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate Fuel Requirements for Race (Priority: P1)

A racing driver needs to determine how much fuel to load for each stint of a race. They enter the race parameters (race length in either laps or time, tank capacity, fuel consumption per lap, and buffer laps) and receive immediate calculations showing how many stints are needed and the fuel amount required for each stint.

**Why this priority**: This is the core functionality that delivers the primary value - enabling drivers to optimize fuel strategy without manual calculations. Without this, the app has no purpose.

**Independent Test**: Can be fully tested by entering valid race parameters and verifying that the calculated number of stints and fuel per stint are mathematically correct and displayed clearly. Delivers immediate value by eliminating manual fuel calculations.

**Acceptance Scenarios**:

1. **Given** a user has opened the fuel calculator app, **When** they select "laps" mode and enter race length (e.g., 30 laps), tank capacity (e.g., 120L), fuel per lap (e.g., 3.5L), and buffer laps (e.g., 2), **Then** the system displays the number of stints required and fuel needed for each stint
2. **Given** a user selects "time" mode for race length, **When** they enter race duration (e.g., 60 minutes) and average lap time (e.g., 2:00), **Then** the system calculates estimated number of laps and uses this for fuel calculations
3. **Given** a user has entered all required parameters, **When** they submit the form, **Then** the calculation results appear immediately without page refresh
4. **Given** a race requires multiple stints, **When** the system calculates fuel requirements, **Then** it displays fuel amounts for each stint, with buffer laps applied only to the final stint
5. **Given** a race can be completed in a single stint (total fuel needed fits in tank), **When** the system calculates, **Then** it displays "1 stint required" with the total fuel amount needed

---

### User Story 2 - Adjust Pit Stop Laps to Optimize Strategy (Priority: P2)

A racing driver wants to experiment with different pit stop strategies by adjusting which lap they pit on for each stint. They use individual sliders (one per pit stop) to change pit lap timings independently, and the system recalculates fuel requirements for affected stints based on the new pit strategy.

**Why this priority**: This enables strategic decision-making by allowing drivers to see how different pit strategies affect fuel requirements. It's a key differentiator from simple calculators.

**Independent Test**: Can be fully tested by entering race parameters, viewing initial calculations, then adjusting any pit lap slider and verifying that fuel per stint values update in real-time. Delivers value by enabling strategic optimization.

**Acceptance Scenarios**:

1. **Given** a user has calculated fuel requirements for a multi-stint race, **When** they adjust any pit lap slider to a different lap number, **Then** the fuel per stint values for affected stints recalculate and update immediately
2. **Given** a user moves a pit lap slider, **When** the new pit lap is selected, **Then** the fuel requirements for that stint and all subsequent stints are recalculated based on the new pit timing
3. **Given** a user adjusts a pit lap slider to an invalid value (e.g., beyond race length, before previous pit lap, or before minimum viable lap), **When** they attempt to set it, **Then** the system prevents invalid values and shows appropriate feedback
4. **Given** a race requires only one stint, **When** the user views the interface, **Then** no pit lap sliders are displayed (since no pit stop is needed)
5. **Given** a race requires N stints, **When** the system displays results, **Then** it shows N-1 pit lap sliders (one for each pit stop, excluding the final stint which has no pit stop)

---

### Edge Cases

- What happens when the race length is less than or equal to the number of laps that can be completed on a full tank? (Single stint scenario)
- What happens when the total fuel required exceeds what can be carried in multiple stints? (Impossible race scenario)
- How does the system handle invalid input values (negative numbers, zero, non-numeric text)? System displays inline error messages with visual indicators (red borders, icons) directly below or next to the invalid field as the user types or on blur
- What happens when the buffer laps exceed the race length?
- How does the system handle very large numbers (e.g., 1000+ lap races)?
- What happens when fuel per lap is zero or negative?
- How does the system handle decimal values for fuel per lap (e.g., 3.7L per lap)?
- What happens when a pit lap slider is set to lap 1, overlaps with another pit stop, or is set to the final lap of the race?
- How does the system handle time-based race length input? System calculates estimated laps by dividing race duration by average lap time
- What happens when average lap time is zero, negative, or exceeds race duration?
- How does the system handle time format input (e.g., minutes:seconds, total seconds, or decimal minutes)?
- What happens when the calculated number of laps from time-based input results in a fractional lap count?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a selector/toggle for race length input mode: (1) laps mode - direct input of number of laps, (2) time mode - input of race duration and average lap time to calculate estimated laps
- **FR-001a**: System MUST provide input fields for total tank capacity (liters), estimated fuel per lap (liters), and buffer laps (number of laps) in both modes
- **FR-001b**: When time mode is selected, System MUST provide input fields for race duration and average lap time, and MUST calculate estimated number of laps by dividing race duration by average lap time
- **FR-001c**: When time mode is used, System MUST display the calculated estimated number of laps to the user so they can verify the calculation
- **FR-002**: System MUST validate that all input values are positive numbers greater than zero, using inline validation that displays error messages directly below or next to each invalid field with visual indicators (red borders, icons) as the user types or on field blur
- **FR-003**: System MUST calculate the number of stints required to complete the race based on tank capacity, fuel consumption, and race length (either directly provided in laps mode or calculated from time in time mode)
- **FR-004**: System MUST calculate fuel needed for each stint, ensuring no stint exceeds tank capacity. All stints except the final one use full tank capacity; the final stint includes buffer laps in its fuel calculation
- **FR-005**: System MUST display calculation results immediately upon form submission
- **FR-006**: System MUST provide one slider control per pit stop to independently adjust which lap to pit on for each stint (when multiple stints are required)
- **FR-007**: System MUST recalculate fuel per stint values in real-time when any pit lap slider is adjusted, updating the affected stint and all subsequent stints
- **FR-008**: System MUST prevent each pit lap slider from being set to invalid values (e.g., beyond race length, before previous pit lap, or before minimum viable lap)
- **FR-009**: System MUST display fuel requirements for each stint in a clear, readable format
- **FR-010**: System MUST handle single-stint races (where entire race can be completed on one tank) and display appropriate messaging
- **FR-011**: System MUST apply buffer laps only to the final stint calculation to ensure sufficient fuel margin for race completion
- **FR-012**: System MUST present a modern, light, and rounded visual design throughout the interface
- **FR-013**: System MUST structure data and UI components to support future preset functionality (track, car, class tags) without requiring major refactoring

### Key Entities *(include if feature involves data)*

- **Race Configuration**: Represents the user-entered parameters for a race calculation. Contains: race length mode (laps or time), race length value (laps count or time duration), average lap time (required when time mode is selected), tank capacity (liters), fuel per lap (liters), buffer laps (count). When time mode is used, the system calculates estimated laps from race duration and average lap time. This entity will be extended in future to include track, car, and class tags for presets.

- **Stint Calculation**: Represents the calculated fuel requirements for a single stint. Contains: stint number, fuel amount needed (liters), lap range (start lap to pit lap), and whether it's the final stint. Multiple stint calculations make up a complete race strategy.

- **Pit Strategy**: Represents the pit stop timing configuration. Contains: pit lap numbers for each pit stop (which lap to pit on for each stint) and affects how fuel is distributed across stints. Each pit stop timing is independently adjustable via its own slider control.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enter all required race parameters and receive fuel calculations in under 5 seconds from form submission
- **SC-002**: Users can adjust any pit lap slider and see updated fuel calculations update within 1 second of slider movement
- **SC-003**: 100% of valid input combinations produce mathematically correct fuel calculations
- **SC-004**: Users can complete a full fuel strategy calculation workflow (enter parameters, view results, adjust pit laps) in under 30 seconds
- **SC-005**: The interface presents all information clearly enough that users can understand their fuel strategy without additional documentation or training
- **SC-006**: Invalid inputs are caught and prevented before calculation, with clear feedback provided to users within 2 seconds of invalid entry

## Assumptions

- Users understand basic racing terminology (stints, pit stops, fuel consumption)
- Race length can be specified either as complete laps (integer values) or as time duration with average lap time
- When time mode is used, the calculated number of laps may be fractional, but the system will use this for fuel calculations (rounding or truncation behavior to be determined in implementation)
- Fuel consumption per lap is consistent throughout the race (no variation for different track sections or conditions)
- Tank capacity represents the maximum fuel that can be loaded at once
- Buffer laps are applied only to the final stint; all other stints use full tank capacity
- The app is used on devices with sufficient screen space to display inputs and results simultaneously (desktop or tablet, not constrained to mobile phone screens)
- Future preset functionality will require storing race configurations with additional metadata (track, car, class), so the current data structure should be designed to accommodate these fields without breaking changes

## Out of Scope

- Saving and loading presets (tracked as separate feature)
- Historical race data tracking
- Multi-car or team fuel strategy comparisons
- Weather or track condition adjustments to fuel consumption
- Integration with Assetto Corsa Competizione game data
- Export functionality (PDF, CSV, etc.)
- User accounts or authentication
- Sharing fuel strategies with other users
