---
description: "Task list for Fuel Calculator for Assetto Corsa Competizione implementation"
---

# Tasks: Fuel Calculator for Assetto Corsa Competizione

**Input**: Design documents from `/specs/001-fuel-calculator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are not explicitly requested in the feature specification, so test tasks are not included. Testing can be added in a future phase if needed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Single-page application structure
- **Components**: `src/components/`
- **Services**: `src/services/`
- **Styles**: `src/styles/`
- **Public assets**: `public/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure (src/components/, src/services/, src/styles/, src/utils/, public/, tests/)
- [ ] T002 Initialize package.json with Vite, Web Test Runner, and Playwright as dev dependencies
- [ ] T003 [P] Create vite.config.js with PWA plugin configuration
- [ ] T004 [P] Create public/index.html with basic structure and manifest link
- [ ] T005 [P] Create public/manifest.json with PWA manifest fields (name, short_name, start_url, display, icons, theme_color)
- [ ] T006 [P] Create public/service-worker.js with cache-first strategy for static assets
- [ ] T007 [P] Create src/styles/main.css with global styles, CSS custom properties, typography, and mobile-first responsive breakpoints
- [ ] T008 [P] Create src/app.js as application entry point for component initialization

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create src/services/validation.js module with validateNumber() function
- [ ] T010 [P] Implement validateField() function in src/services/validation.js for context-aware field validation
- [ ] T011 [P] Implement validateTimeFormat() function in src/services/validation.js for time input parsing (mm:ss, seconds, decimal minutes)
- [ ] T012 Create src/services/fuel-calculator.js module with validateConfiguration() function
- [ ] T013 [P] Implement calculateStints() function in src/services/fuel-calculator.js for calculating stint requirements from RaceConfiguration
- [ ] T014 [P] Implement calculateOptimalPitStrategy() function in src/services/fuel-calculator.js for generating initial pit stop distribution
- [ ] T015 [P] Implement recalculateStints() function in src/services/fuel-calculator.js for updating stints when pit laps change
- [ ] T016 Create src/utils/helpers.js with utility functions for calculations and data transformations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Calculate Fuel Requirements for Race (Priority: P1) 🎯 MVP

**Goal**: Enable racing drivers to enter race parameters and receive immediate calculations showing number of stints required and fuel amount needed for each stint

**Independent Test**: Enter valid race parameters (race length in laps or time, tank capacity, fuel per lap, buffer laps) and verify that calculated number of stints and fuel per stint are mathematically correct and displayed clearly. Test both laps mode and time mode inputs.

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create src/components/race-input-form.js custom element class with Shadow DOM
- [ ] T018 [US1] Implement race length mode selector (laps/time) in src/components/race-input-form.js
- [ ] T019 [US1] Implement race length input field in src/components/race-input-form.js (number input for laps mode)
- [ ] T020 [US1] Implement average lap time input field in src/components/race-input-form.js (conditional on time mode, with time format parsing)
- [ ] T021 [US1] Implement tank capacity input field in src/components/race-input-form.js
- [ ] T022 [US1] Implement fuel per lap input field in src/components/race-input-form.js
- [ ] T023 [US1] Implement buffer laps input field in src/components/race-input-form.js
- [ ] T024 [US1] Implement inline validation with visual indicators (red borders, error messages) in src/components/race-input-form.js
- [ ] T025 [US1] Implement form-submit event emission with RaceConfiguration in src/components/race-input-form.js
- [ ] T026 [US1] Create src/components/stint-results.js custom element class with Shadow DOM
- [ ] T027 [US1] Implement stint result cards display in src/components/stint-results.js (fuel amount, lap range, stint number)
- [ ] T028 [US1] Implement final stint indicator and buffer laps display in src/components/stint-results.js
- [ ] T029 [US1] Implement empty state handling (hidden when no results) in src/components/stint-results.js
- [ ] T030 [US1] Create src/components/fuel-calculator.js root custom element class with Shadow DOM
- [ ] T031 [US1] Compose race-input-form and stint-results components in src/components/fuel-calculator.js
- [ ] T032 [US1] Implement form-submit event handling and calculation orchestration in src/components/fuel-calculator.js
- [ ] T033 [US1] Implement calculation-complete event emission with StintCalculation[] and PitStrategy in src/components/fuel-calculator.js
- [ ] T034 [US1] Implement calculation-error event handling and display in src/components/fuel-calculator.js
- [ ] T035 [US1] Implement single-stint race handling (no pit stops needed) in src/components/fuel-calculator.js
- [ ] T036 [US1] Create src/styles/components.css with component-specific styles (modern, light, rounded design)
- [ ] T037 [US1] Implement mobile-first responsive styling for form and results in src/styles/components.css
- [ ] T038 [US1] Ensure touch targets ≥44x44px and WCAG AA contrast compliance in src/styles/components.css
- [ ] T039 [US1] Register fuel-calculator component in src/app.js and mount to DOM
- [ ] T040 [US1] Register service worker in src/app.js for PWA functionality

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can enter race parameters and see fuel calculations displayed.

---

## Phase 4: User Story 2 - Adjust Pit Stop Laps to Optimize Strategy (Priority: P2)

**Goal**: Enable racing drivers to experiment with different pit stop strategies by adjusting which lap they pit on for each stint, with real-time recalculation of fuel requirements

**Independent Test**: Enter race parameters for a multi-stint race, view initial calculations, then adjust any pit lap slider and verify that fuel per stint values update in real-time (< 50ms response time). Verify that invalid slider values are prevented.

### Implementation for User Story 2

- [ ] T041 [P] [US2] Create src/components/pit-lap-slider.js custom element class with Shadow DOM
- [ ] T042 [US2] Implement native <input type="range"> slider with min/max bounds in src/components/pit-lap-slider.js
- [ ] T043 [US2] Implement pit-lap-change event emission with pitIndex and lap number in src/components/pit-lap-slider.js
- [ ] T044 [US2] Implement ARIA labels and keyboard navigation support in src/components/pit-lap-slider.js
- [ ] T045 [US2] Implement slider bounds validation (prevent invalid values) in src/components/pit-lap-slider.js
- [ ] T046 [US2] Integrate pit-lap-slider components into src/components/stint-results.js (one slider per pit stop, N-1 sliders for N stints)
- [ ] T047 [US2] Implement pit-lap-change event handling in src/components/stint-results.js
- [ ] T048 [US2] Implement pit-lap-change event forwarding to parent in src/components/stint-results.js
- [ ] T049 [US2] Implement pit-lap-change event handling and recalculation orchestration in src/components/fuel-calculator.js
- [ ] T050 [US2] Implement real-time recalculation of affected stints when pit lap changes in src/components/fuel-calculator.js (using recalculateStints service)
- [ ] T051 [US2] Implement slider bounds calculation based on previous/next pit stops in src/components/fuel-calculator.js
- [ ] T052 [US2] Implement slider value updates when pit strategy changes in src/components/stint-results.js
- [ ] T053 [US2] Ensure slider updates complete within 50ms for real-time feel in src/components/fuel-calculator.js
- [ ] T054 [US2] Implement visual feedback for invalid slider states in src/components/pit-lap-slider.js
- [ ] T055 [US2] Style pit-lap-slider with modern, rounded design in src/styles/components.css
- [ ] T056 [US2] Ensure slider touch targets ≥44x44px for mobile interaction in src/styles/components.css

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can calculate fuel requirements and adjust pit stop strategies with real-time updates.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T057 [P] Enhance service worker with cache versioning and offline fallback in public/service-worker.js
- [ ] T058 [P] Generate and add PWA icons (192x192 and 512x512) to public/icons/
- [ ] T059 [P] Optimize bundle size and ensure Lighthouse 90+ scores (Performance, Accessibility, Best Practices, SEO)
- [ ] T060 [P] Verify Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] T061 [P] Ensure calculation response time < 100ms (measure and optimize if needed)
- [ ] T062 [P] Ensure slider update time < 50ms (measure and optimize if needed)
- [ ] T063 [P] Complete accessibility audit: keyboard navigation, screen reader support, WCAG 2.1 AA compliance
- [ ] T064 [P] Cross-browser testing: Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] T065 [P] Mobile device testing: verify responsive design from 320px+ to 1920px+
- [ ] T066 [P] Code cleanup and refactoring for maintainability
- [ ] T067 [P] Verify data structure supports future preset functionality (track, car, class tags) without breaking changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on User Story 1 components (stint-results, fuel-calculator) but should be independently testable

### Within Each User Story

- Models/services before components
- Core components before integration
- Form component before results component
- Results component before sliders
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Story 1 can start
- User Story 2 can start after User Story 1 components are created
- All Polish tasks marked [P] can run in parallel
- Different components within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all form field implementations together:
Task: "Implement race length mode selector (laps/time) in src/components/race-input-form.js"
Task: "Implement tank capacity input field in src/components/race-input-form.js"
Task: "Implement fuel per lap input field in src/components/race-input-form.js"
Task: "Implement buffer laps input field in src/components/race-input-form.js"

# Launch all service functions together:
Task: "Implement calculateStints() function in src/services/fuel-calculator.js"
Task: "Implement calculateOptimalPitStrategy() function in src/services/fuel-calculator.js"
Task: "Implement recalculateStints() function in src/services/fuel-calculator.js"
```

---

## Parallel Example: User Story 2

```bash
# Launch slider implementation and integration together:
Task: "Create src/components/pit-lap-slider.js custom element class with Shadow DOM"
Task: "Integrate pit-lap-slider components into src/components/stint-results.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (form and calculation)
   - Developer B: User Story 1 (results display)
3. Once User Story 1 is done:
   - Developer A: User Story 2 (slider component)
   - Developer B: User Story 2 (slider integration and recalculation)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Performance targets: < 100ms calculations, < 50ms slider updates, Lighthouse 90+
- All components must support keyboard navigation and screen readers (WCAG 2.1 AA)
- Mobile-first responsive design from 320px+ to 1920px+
- Touch targets must be ≥44x44px
- Modern, light, rounded visual design throughout

