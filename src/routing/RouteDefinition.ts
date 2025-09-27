/**
 * Route Architecture Configuration System
 *
 * Single source of truth for all route definitions in the application.
 * Provides type-safe, data-driven route configuration with performance optimization.
 *
 * Based on Phase 1 findings:
 * - 19 routes to KEEP (core navigation UX)
 * - 7 routes to MODERNIZE (performance improvements)
 * - 3 routes to DELETE (zero legacy code)
 * - 11 valid animal/country combinations from data
 */

import type { ComponentType } from 'react';
import type { Opportunity, Organization } from '../types';

// ============================================================================
// CORE TYPE DEFINITIONS
// ============================================================================

/**
 * Route validation rules for dynamic routes
 */
export interface RouteValidationRule {
  parameter: string;
  validator: 'country' | 'animal' | 'organization' | 'combination';
  required: boolean;
  customValidator?: (value: string) => Promise<boolean>;
}

/**
 * SEO metadata configuration for routes
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  priority: number; // 0.0 to 1.0 for sitemap.xml
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  structuredData?: Record<string, any>;
}

/**
 * Performance configuration for routes
 */
export interface PerformanceConfig {
  preload: 'immediate' | 'hover' | 'viewport' | 'none';
  cacheStrategy: 'aggressive' | 'normal' | 'minimal' | 'none';
  bundleSplit: boolean;
  criticalCSS: boolean;
  maxResolutionTime: number; // milliseconds
}

/**
 * Navigation flow metadata for UX preservation
 */
export interface NavigationMetadata {
  category: 'core' | 'country' | 'animal' | 'combined' | 'organization' | 'system';
  enabledFlows: Array<'to-animal' | 'to-country' | 'to-combined' | 'to-opportunities' | 'to-organization'>;
  contextPreservation: boolean;
  analyticsEvent: string;
  breadcrumbGeneration: 'auto' | 'custom' | 'none';
}

/**
 * Complete route definition interface
 * Single source of truth for all route configuration
 */
export interface RouteDefinition {
  // Identification
  id: string;                          // Unique identifier for the route
  path: string;                        // React Router path pattern
  component: string;                   // Component name for lazy loading

  // Classification
  type: 'static' | 'dynamic' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dataSource: 'static' | 'opportunities' | 'organizations' | 'mixed';

  // Validation (for dynamic routes)
  validation?: RouteValidationRule[];

  // Metadata
  seo: SEOMetadata;
  performance: PerformanceConfig;
  navigation: NavigationMetadata;

  // Route-specific configuration
  params?: Record<string, string>;     // Default parameter values
  guards?: string[];                   // Route guard functions
  redirects?: Record<string, string>;  // Redirect mappings
}

/**
 * Route generation context with all necessary data
 */
export interface RouteGenerationContext {
  opportunities: Opportunity[];
  organizations: Organization[];
  highTrafficRoutes: string[];         // From analytics/SEO data
  validCombinations: Array<{animal: string, country: string}>;
}

/**
 * Route validation result
 */
export interface RouteValidationResult {
  isValid: boolean;
  route?: RouteDefinition;
  reason?: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Route generation result for batch operations
 */
export interface RouteGenerationResult {
  routes: RouteDefinition[];
  statistics: {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    validationRules: number;
  };
  warnings: string[];
  errors: string[];
}

// ============================================================================
// ROUTE CATEGORY CONSTANTS
// ============================================================================

/**
 * Core static routes that never change
 */
export const CORE_STATIC_ROUTES = [
  'home',
  'opportunities',
  'guides',
  'not-found',
  'catch-all'
] as const;

/**
 * High-traffic country routes for explicit SEO optimization
 * Based on Phase 1 analysis of organic traffic
 */
export const HIGH_TRAFFIC_COUNTRIES = [
  'costa-rica',
  'thailand',
  'south-africa'
] as const;

/**
 * High-traffic animal routes for explicit SEO optimization
 * Based on Phase 1 analysis of conversion rates
 */
export const HIGH_TRAFFIC_ANIMALS = [
  'lions',
  'elephants',
  'sea-turtles'
] as const;

/**
 * High-traffic combined routes for explicit SEO optimization
 * Based on Phase 1 analysis of conversion rates
 */
export const HIGH_TRAFFIC_COMBINATIONS = [
  { country: 'costa-rica', animal: 'sea-turtles' },
  { country: 'thailand', animal: 'elephants' },
  { country: 'costa-rica', animal: 'sea-turtles', reverse: true } // animal-first format
] as const;

/**
 * Conservation routes that map to animal categories
 */
export const CONSERVATION_ROUTES = [
  'wildlife-conservation',
  'marine-conservation',
  'forest-conservation'
] as const;

/**
 * Legacy routes that should be deleted (Phase 1 findings)
 */
export const LEGACY_ROUTES_TO_DELETE = [
  '/organization/:slug',
  '/organization/:slug/program/:programSlug',
  '/organization/:slug/programs'
] as const;

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Performance targets for different route types
 */
export const PERFORMANCE_TARGETS = {
  CRITICAL_RESOLUTION_TIME: 25,      // ms - Critical routes
  HIGH_RESOLUTION_TIME: 50,          // ms - High priority routes
  MEDIUM_RESOLUTION_TIME: 100,       // ms - Medium priority routes
  LOW_RESOLUTION_TIME: 200,          // ms - Low priority routes
  VALIDATION_TIME: 1,                // ms - Route validation
  BUNDLE_SIZE_LIMIT: 250,            // KB - Individual route bundles
  MEMORY_LIMIT: 10                   // MB - Memory increase under load
} as const;

/**
 * SEO priority mappings for different route types
 */
export const SEO_PRIORITY_MAP = {
  'core': 1.0,
  'country': 0.9,
  'animal': 0.9,
  'combined': 0.8,
  'organization': 0.7,
  'system': 0.1
} as const;

/**
 * Default performance configurations by route type
 */
export const DEFAULT_PERFORMANCE_CONFIG: Record<string, PerformanceConfig> = {
  critical: {
    preload: 'immediate',
    cacheStrategy: 'aggressive',
    bundleSplit: true,
    criticalCSS: true,
    maxResolutionTime: PERFORMANCE_TARGETS.CRITICAL_RESOLUTION_TIME
  },
  high: {
    preload: 'hover',
    cacheStrategy: 'normal',
    bundleSplit: true,
    criticalCSS: false,
    maxResolutionTime: PERFORMANCE_TARGETS.HIGH_RESOLUTION_TIME
  },
  medium: {
    preload: 'viewport',
    cacheStrategy: 'normal',
    bundleSplit: false,
    criticalCSS: false,
    maxResolutionTime: PERFORMANCE_TARGETS.MEDIUM_RESOLUTION_TIME
  },
  low: {
    preload: 'none',
    cacheStrategy: 'minimal',
    bundleSplit: false,
    criticalCSS: false,
    maxResolutionTime: PERFORMANCE_TARGETS.LOW_RESOLUTION_TIME
  }
} as const;

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

/**
 * Type guard for route definitions
 */
export function isValidRouteDefinition(route: any): route is RouteDefinition {
  return (
    typeof route === 'object' &&
    typeof route.id === 'string' &&
    typeof route.path === 'string' &&
    typeof route.component === 'string' &&
    ['static', 'dynamic', 'system'].includes(route.type) &&
    ['critical', 'high', 'medium', 'low'].includes(route.priority) &&
    typeof route.seo === 'object' &&
    typeof route.performance === 'object' &&
    typeof route.navigation === 'object'
  );
}

/**
 * Type guard for high traffic routes
 */
export function isHighTrafficRoute(path: string): boolean {
  const highTrafficPatterns = [
    ...HIGH_TRAFFIC_COUNTRIES.map(c => `/volunteer-${c}`),
    ...HIGH_TRAFFIC_ANIMALS.map(a => `/${a}-volunteer`),
    ...HIGH_TRAFFIC_COMBINATIONS.map(combo => `/volunteer-${combo.country}/${combo.animal}`),
    ...HIGH_TRAFFIC_COMBINATIONS.filter(c => c.reverse).map(combo => `/${combo.animal}-volunteer/${combo.country}`)
  ];

  return highTrafficPatterns.includes(path);
}

/**
 * Utility to generate route ID from path
 */
export function generateRouteId(path: string, type: string): string {
  const cleanPath = path
    .replace(/^\//, '')           // Remove leading slash
    .replace(/\/:(\w+)/g, '-$1')  // Convert params to readable format
    .replace(/\*/g, 'catchall')   // Handle catch-all routes
    .replace(/\//g, '-')          // Convert slashes to dashes
    || 'home';                    // Handle root path

  return `${type}-${cleanPath}`;
}

export default RouteDefinition;