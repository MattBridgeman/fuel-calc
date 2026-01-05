# Implementation Plan: Fuel Calculator for Assetto Corsa Competizione

**Branch**: `001-fuel-calculator` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fuel-calculator/spec.md`
**User Input**: use browser native technologies for implementation, avoid 3rd party dependencies, use web components where sensible

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A Progressive Web App (PWA) fuel calculator for racing strategy that allows drivers to calculate fuel requirements per stint based on race length, tank capacity, fuel consumption, and buffer laps. The app provides real-time recalculation when adjusting pit stop lap timings via interactive sliders. Built using native browser technologies (Web Components, vanilla JavaScript, native CSS) with no third-party dependencies, following mobile-first responsive design principles.

**Technical Approach**: 
- Web Components architecture with 4 custom elements: `<fuel-calculator>`, `<race-input-form>`, `<stint-results>`, `<pit-lap-slider>`
- Service layer for business logic: `FuelCalculatorService` and `ValidationService`
- Event-driven communication between components using CustomEvents
- Vite build tooling for development and production optimization
- Web Test Runner + Playwright for testing
- Performance targets: < 100ms calculations, < 50ms slider updates, Lighthouse 90+

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: None (native browser APIs only)  
**Build Tooling**: Vite (for development server, transpilation, and production optimization)  
**Storage**: N/A for initial feature (future presets will use IndexedDB per constitution)  
**Testing**: Web Test Runner (unit/component tests) + Playwright (integration/E2E tests)  
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: web (Single Page Application as PWA)  
**Performance Goals**: Calculation response < 100ms, slider updates < 50ms, Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO), Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1  
**Constraints**: Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO), WCAG 2.1 AA compliance, mobile-first responsive (320px+ to 1920px+), offline-capable PWA, touch targets ≥44x44px  
**Scale/Scope**: Single-page application with form inputs, calculation engine, and interactive slider controls; ~5-10 custom Web Components; client-side only (no backend)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check (Phase 0)

### ✅ I. Light-Weight Architecture
**Status**: PASS  
**Rationale**: Using native browser technologies with no third-party dependencies ensures minimal bundle size and fast load times. Web Components provide encapsulation without framework overhead.

### ✅ II. Progressive Web App (PWA)
**Status**: PASS  
**Rationale**: Application will be built as PWA with service worker, manifest.json, and offline capabilities. Required for installability and native app-like experience.

### ✅ III. Native Browser Technologies First
**Status**: PASS  
**Rationale**: Using Web Components, vanilla JavaScript, native CSS, Fetch API, and other native browser APIs. No third-party libraries required for core functionality.

### ✅ IV. Responsive Design (Mobile-First)
**Status**: PASS  
**Rationale**: Design will follow mobile-first methodology, responsive from 320px+ to 1920px+. Mobile experience is primary target per constitution.

### ✅ V. Mobile-Friendly User Experience
**Status**: PASS  
**Rationale**: Touch targets will be ≥44x44px. Interactions optimized for touch interfaces. Performance prioritized for mobile hardware.

### ✅ VI. Clean User Interface
**Status**: PASS  
**Rationale**: Modern, light, rounded design specified in requirements. Will follow WCAG AA contrast requirements and clear visual hierarchy.

### ✅ VII. Clean Code Standards
**Status**: PASS  
**Rationale**: Code will be readable, well-organized, with small focused functions. Consistent naming and structure.

### ✅ VIII. Dependency Minimization
**Status**: PASS  
**Rationale**: Zero third-party dependencies. Using only native browser APIs and Web Components.

### ✅ IX. Build Steps Permitted
**Status**: PASS  
**Rationale**: Build tooling acceptable for transpilation, bundling, and optimization. Vite selected in research phase for PWA support and minimal config.

**Pre-Research Gate Result**: ✅ ALL CHECKS PASS - Proceeded to Phase 0

---

### Post-Design Check (Phase 1)

### ✅ I. Light-Weight Architecture
**Status**: PASS  
**Rationale**: Architecture confirmed: Web Components with no framework overhead, vanilla JavaScript, native CSS. Minimal bundle size expected. Performance targets (< 100ms calculations) ensure fast execution.

### ✅ II. Progressive Web App (PWA)
**Status**: PASS  
**Rationale**: Design includes manifest.json, service worker with cache-first strategy, PWA icons. Offline capability designed into architecture. Installability supported.

### ✅ III. Native Browser Technologies First
**Status**: PASS  
**Rationale**: Design uses only Web Components (Custom Elements, Shadow DOM), vanilla JavaScript, native CSS, CustomEvents. No third-party libraries. Vite is build tool only (justified per Principle IX).

### ✅ IV. Responsive Design (Mobile-First)
**Status**: PASS  
**Rationale**: Component design includes mobile-first CSS approach. Touch targets ≥44x44px specified. Responsive breakpoints defined (320px+ to 1920px+). Mobile experience prioritized.

### ✅ V. Mobile-Friendly User Experience
**Status**: PASS  
**Rationale**: Touch-optimized interactions designed. Slider controls sized for touch. Performance targets prioritize mobile hardware. Responsive layout ensures mobile usability.

### ✅ VI. Clean User Interface
**Status**: PASS  
**Rationale**: Modern, light, rounded design specified. Component contracts include accessibility requirements. WCAG AA compliance built into design. Clear visual hierarchy planned.

### ✅ VII. Clean Code Standards
**Status**: PASS  
**Rationale**: Component architecture promotes small, focused components. Service layer separates business logic. Clear contracts define interfaces. Code organization supports maintainability.

### ✅ VIII. Dependency Minimization
**Status**: PASS  
**Rationale**: Zero runtime dependencies. Only build-time tooling (Vite) which is justified. Testing tools (Web Test Runner, Playwright) are dev dependencies only. No third-party libraries in production bundle.

### ✅ IX. Build Steps Permitted
**Status**: PASS  
**Rationale**: Vite selected for justified reasons: PWA plugin support, ES module development, production optimization. Build tooling improves developer experience and enables optimization without runtime overhead.

**Post-Design Gate Result**: ✅ ALL CHECKS PASS - Ready for Implementation

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/          # Web Components (custom elements)
│   ├── fuel-calculator.js
│   ├── race-input-form.js
│   ├── stint-results.js
│   └── pit-lap-slider.js
├── services/           # Business logic
│   ├── fuel-calculator.js
│   └── validation.js
├── styles/            # CSS files
│   ├── main.css
│   └── components.css
├── utils/             # Utility functions
│   └── helpers.js
└── app.js             # Application entry point

public/
├── index.html
├── manifest.json      # PWA manifest
├── service-worker.js  # Service worker for offline support
└── icons/            # PWA icons

tests/
├── unit/             # Unit tests for business logic
└── integration/      # Integration tests for components
```

**Structure Decision**: Single-page web application structure. Components organized by Web Components in `src/components/`, business logic in `src/services/`, styles separated, and PWA assets in `public/`. This structure supports future preset functionality without major refactoring.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
