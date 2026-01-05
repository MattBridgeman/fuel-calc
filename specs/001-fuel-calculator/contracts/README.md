# Contracts Directory

This directory contains interface contracts for the Fuel Calculator application.

## Files

- **component-interfaces.md**: Web Component API contracts, service interfaces, and event communication patterns

## Contract Types

### Component Contracts
Define the public API for each Web Component:
- Custom element name
- Attributes
- Properties
- Methods
- Events (emitted and listened to)
- Internal structure

### Service Contracts
Define the business logic service interfaces:
- Function signatures
- Parameters and return types
- Validation rules
- Algorithm descriptions

### Event Contracts
Define the event-driven communication patterns between components.

## Usage

These contracts serve as:
1. **Implementation Guide**: Developers implement components to match these contracts
2. **Testing Reference**: Tests verify components conform to contracts
3. **Documentation**: API reference for component usage
4. **Integration Points**: Define how components interact

## Contract Compliance

All implementations MUST:
- Match the defined interfaces exactly
- Emit/listen to specified events
- Follow the event communication patterns
- Maintain backward compatibility when contracts change

