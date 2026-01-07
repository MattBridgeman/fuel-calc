# Research: Fuel Calculator Implementation

**Feature**: Fuel Calculator for Assetto Corsa Competizione  
**Date**: 2026-01-05  
**Purpose**: Resolve technical clarifications and establish implementation patterns

## Research Areas

### 1. Testing Approach for Native Browser Technologies

**Question**: What testing framework/approach should be used for a vanilla JavaScript + Web Components application with no third-party dependencies?

**Research Findings**:
- **Web Test Runner**: Native browser testing solution that runs tests in actual browsers without framework dependencies. Supports ES modules, works with native Web Components, and provides good browser compatibility testing.
- **Playwright**: Modern end-to-end testing framework that supports Web Components and provides excellent mobile device emulation. Good for integration testing and accessibility testing.
- **Vitest**: Fast unit test runner that works with vanilla JavaScript, but requires build tooling setup.

**Decision**: Use **Web Test Runner** for unit and component tests, **Playwright** for integration and E2E tests.

**Rationale**: 
- Web Test Runner runs tests in real browsers without requiring a framework, aligning with native-first approach
- Playwright provides comprehensive testing including mobile viewports and accessibility checks
- Both tools work with vanilla JavaScript and Web Components without additional dependencies
- Supports the constitution requirement for testing business logic and critical user flows

**Alternatives Considered**:
- Jest: Requires build tooling and doesn't natively support Web Components well
- Mocha/Chai: Works but Web Test Runner provides better browser-native experience
- Cypress: Heavier dependency, Playwright provides better mobile testing

---

### 2. Performance Goals and Metrics

**Question**: What are the specific performance targets for calculation response time and Lighthouse scores?

**Research Findings**:
- **Constitution Requirement**: Lighthouse score MUST maintain 90+ for Performance, Accessibility, Best Practices, SEO
- **Success Criteria from Spec**: 
  - SC-001: Calculations in under 5 seconds from form submission
  - SC-002: Pit lap slider updates within 1 second
- **Industry Standards**: 
  - First Input Delay (FID) < 100ms
  - Largest Contentful Paint (LCP) < 2.5s
  - Time to Interactive (TTI) < 3.5s

**Decision**: 
- **Calculation Response Time**: < 100ms (well under 5s requirement, enabling real-time feel)
- **Slider Update Time**: < 50ms (well under 1s requirement for instant feedback)
- **Lighthouse Scores**: 90+ across all categories (constitution requirement)
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

**Rationale**:
- Fuel calculations are simple mathematical operations (addition, division, comparison) that should complete in milliseconds
- Real-time slider updates require sub-100ms response for perceived instant feedback
- Lighthouse 90+ ensures optimal user experience and aligns with constitution
- These targets are achievable with native JavaScript and proper optimization

**Alternatives Considered**:
- Targeting only the spec minimums (5s, 1s): Would provide poor user experience
- More aggressive targets (< 10ms): Unnecessary optimization for simple calculations

---

### 3. Web Components Architecture Patterns

**Question**: What patterns should be used for organizing Web Components in a vanilla JavaScript application?

**Research Findings**:
- **Custom Elements**: Use class-based custom elements extending HTMLElement
- **Shadow DOM**: Use for style encapsulation, but consider light DOM for easier styling in some cases
- **Event Communication**: Use CustomEvents for component communication
- **State Management**: For simple apps, component-level state is sufficient; avoid over-engineering

**Decision**: 
- Use class-based custom elements with Shadow DOM for style encapsulation
- Use CustomEvents for parent-child and sibling component communication
- Keep state in components; use a simple event bus pattern if needed for cross-component communication
- Follow naming convention: kebab-case for element names (e.g., `fuel-calculator`)

**Rationale**:
- Native Web Components provide encapsulation without framework overhead
- Shadow DOM prevents style conflicts while maintaining clean component boundaries
- CustomEvents provide decoupled communication between components
- Simple state management avoids unnecessary complexity for this feature scope

**Alternatives Considered**:
- Light DOM only: Would require careful CSS scoping and lose encapsulation benefits
- Complex state management library: Unnecessary for single-page calculator app
- Framework wrapper: Violates native-first principle

---

### 4. Build Tooling for Native Web App

**Question**: What build tooling is appropriate for a native web app that needs transpilation and optimization?

**Research Findings**:
- **Vite**: Fast, modern build tool with excellent ES module support and native browser development
- **Rollup**: Lightweight bundler, good for libraries and simple apps
- **Webpack**: More complex, but widely used
- **esbuild**: Extremely fast, but less mature ecosystem

**Decision**: Use **Vite** for development and production builds.

**Rationale**:
- Fast development server with native ES module support
- Excellent PWA plugin support for manifest and service worker
- Good production optimization (minification, tree-shaking)
- Minimal configuration needed
- Aligns with constitution's build steps permitted principle

**Alternatives Considered**:
- No build tool: Would limit browser compatibility and optimization opportunities
- Webpack: More complex than needed for this project
- Rollup: Good alternative, but Vite provides better developer experience

---

### 5. PWA Implementation Details

**Question**: What are the specific requirements for PWA manifest and service worker implementation?

**Research Findings**:
- **Manifest.json**: Required fields include name, short_name, start_url, display, icons, theme_color
- **Service Worker**: Need to cache static assets and HTML for offline functionality
- **Icons**: Multiple sizes required (192x192, 512x512 minimum)
- **Display Mode**: "standalone" for app-like experience

**Decision**:
- Implement manifest.json with all required PWA fields
- Service worker with cache-first strategy for static assets
- Cache HTML and CSS for offline access
- Provide icons in 192x192 and 512x512 sizes
- Use "standalone" display mode

**Rationale**:
- Meets constitution requirement for PWA with service worker and manifest
- Cache-first strategy ensures app works offline
- Standalone mode provides native app-like experience
- Standard PWA implementation patterns

**Alternatives Considered**:
- Network-first strategy: Would require network for basic functionality
- Minimal caching: Would not meet offline capability requirement

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Testing | Web Test Runner + Playwright | Native browser testing, Web Component support |
| Performance | < 100ms calculations, < 50ms slider updates, Lighthouse 90+ | Exceeds spec requirements, ensures optimal UX |
| Web Components | Class-based custom elements, Shadow DOM, CustomEvents | Native encapsulation, clean architecture |
| Build Tooling | Vite | Fast, PWA support, minimal config |
| PWA | Full manifest + service worker with cache-first | Meets constitution requirements |

## Implementation Notes

- All decisions align with constitution principles (native-first, dependency minimization, PWA)
- Performance targets are conservative and achievable with native JavaScript
- Testing approach supports both unit and integration testing without framework dependencies
- Build tooling is justified per constitution's build steps permitted principle

