<!--
Sync Impact Report:
Version change: [none] → 1.0.0
Modified principles: N/A (initial creation)
Added sections: Core Principles, Technology Constraints, Development Standards, Governance
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - No changes needed (generic template)
  ✅ tasks-template.md - No changes needed (generic template)
Follow-up TODOs: None
-->

# Fuel Calc Constitution

## Core Principles

### I. Light-Weight Architecture
Applications MUST prioritize minimal resource consumption and fast load times. Every feature addition MUST justify its impact on bundle size, memory usage, and performance. Unnecessary abstractions and overhead are prohibited. Rationale: Ensures optimal user experience, especially on mobile devices and slower networks.

### II. Progressive Web App (PWA)
Applications MUST be built as Progressive Web Apps with service worker support, offline capabilities, and installability. MUST include manifest.json with appropriate icons and metadata. MUST work reliably offline or with degraded functionality when network is unavailable. Rationale: Provides native app-like experience without app store distribution, improving accessibility and user engagement.

### III. Native Browser Technologies First
MUST favor native browser APIs and standards over third-party libraries. Use Web Components, Fetch API, Service Workers, IndexedDB, CSS Grid/Flexbox, and other native features before considering external dependencies. External libraries are only acceptable when native alternatives are insufficient or unavailable. Rationale: Reduces dependency burden, improves performance, ensures long-term maintainability, and leverages browser optimizations.

### IV. Responsive Design (Mobile-First)
Design and development MUST follow mobile-first methodology. All layouts MUST be responsive and adapt seamlessly from mobile (320px+) to desktop (1920px+) viewports. Mobile experience is the primary target; desktop enhancements are secondary. Rationale: Ensures optimal experience across all devices and screen sizes, prioritizing the majority of users.

### V. Mobile-Friendly User Experience
All interactions MUST be optimized for touch interfaces. Touch targets MUST be at least 44x44px. Scrolling, gestures, and navigation MUST feel natural on mobile devices. Performance MUST be prioritized for mobile hardware constraints. Rationale: Mobile devices are the primary access point for most users; poor mobile experience directly impacts adoption and satisfaction.

### VI. Clean User Interface
UI MUST follow modern design principles: clear visual hierarchy, consistent spacing, readable typography, appropriate color contrast (WCAG AA minimum), and intuitive navigation. Visual clutter MUST be minimized. Design decisions MUST prioritize user comprehension and task completion. Rationale: Clean UI reduces cognitive load, improves usability, and enhances professional appearance.

### VII. Clean Code Standards
Code MUST be readable, well-organized, and maintainable. Functions MUST be small and focused. Naming MUST be descriptive and consistent. Comments MUST explain "why" not "what". Code structure MUST follow established patterns consistently. Refactoring is encouraged when code quality degrades. Rationale: Clean code reduces bugs, accelerates development, and enables long-term maintainability.

### VIII. Dependency Minimization
External dependencies MUST be avoided unless absolutely necessary. Each dependency addition MUST be justified with clear rationale. Prefer copying small utility functions over importing entire libraries. Regularly audit and remove unused dependencies. Rationale: Dependencies introduce security risks, version conflicts, bundle bloat, and maintenance overhead. Minimal dependencies improve security and performance.

### IX. Build Steps Permitted
Build steps and tooling (e.g., bundlers, transpilers, minifiers) are acceptable and encouraged when they improve code quality, performance, or developer experience. Build tools MUST be justified and documented. Rationale: Modern build tooling enables optimization, code splitting, and developer productivity while maintaining runtime performance.

## Technology Constraints

- **Primary Platform**: Web browsers (modern evergreen browsers)
- **Architecture**: Single Page Application (SPA) as PWA
- **Storage**: IndexedDB for client-side persistence, localStorage for simple preferences
- **Styling**: Native CSS with CSS Grid/Flexbox; CSS custom properties for theming
- **JavaScript**: ES6+ with transpilation for browser compatibility as needed
- **Build Tools**: Acceptable (webpack, vite, rollup, etc.) but must be justified

## Development Standards

- **Code Style**: Consistent formatting enforced via tooling (Prettier, ESLint)
- **Testing**: Unit tests for business logic; integration tests for critical user flows
- **Performance**: Lighthouse score MUST maintain 90+ for Performance, Accessibility, Best Practices, SEO
- **Accessibility**: WCAG 2.1 AA compliance required
- **Browser Support**: Latest 2 versions of Chrome, Firefox, Safari, Edge

## Governance

This constitution supersedes all other development practices and guidelines. All code reviews MUST verify compliance with these principles. Amendments require:

1. Documentation of the proposed change
2. Rationale for the amendment
3. Impact assessment on existing codebase
4. Approval before implementation

Complexity additions MUST be justified in code reviews. When principles conflict, mobile-first and light-weight take precedence.

**Version**: 1.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05
