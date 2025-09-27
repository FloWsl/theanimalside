// src/routing/index.ts
// Main exports for the new routing system

// Core Components
export { RouteDefinition, RouteCategory, SEOMetadata, PerformanceConfig, NavigationMetadata } from './core/RouteDefinition';
export { RouteGenerator } from './core/RouteGenerator';
export { RoutePriorityCalculator, RouteOrderingResult, RouteConflict, RouteWarning } from './core/RoutePriorityCalculator';

// Validation Components
export { RouteValidationEngine, ValidationResult, ValidationError, ValidationPerformance } from './validation/RouteValidationEngine';

// Type exports for external use
export type {
  RouteValidationRule,
  RouteMetadata
} from './core/RouteDefinition';