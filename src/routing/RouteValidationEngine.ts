/**
 * Route Validation Engine - O(1) Performance System
 *
 * Provides instant route validation through precomputed maps.
 * Target: <1ms validation performance for all route types.
 *
 * Key Features:
 * - O(1) validation lookup instead of O(n) filtering
 * - Precomputed validation maps for maximum performance
 * - Comprehensive validation result metadata
 * - Memory-efficient caching strategy
 */

import type {
  RouteDefinition,
  RouteValidationResult,
  RouteGenerationContext
} from './RouteDefinition';
import {
  formatCountrySlug,
  formatAnimalSlug,
  formatCountryName,
  formatAnimalName
} from '../utils/routeUtils';
import type { Opportunity, Organization } from '../types';

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

export interface ValidationCacheStats {
  totalEntries: number;
  hitRate: number;
  avgLookupTime: number;
  memoryUsage: number; // bytes
  lastUpdated: number; // timestamp
}

export interface RouteValidationMetadata {
  validationTime: number;        // milliseconds
  cacheHit: boolean;
  validatorUsed: string;
  availableAlternatives?: string[];
  matchConfidence?: number;      // 0-1 for fuzzy matches
}

export interface DetailedValidationResult extends RouteValidationResult {
  metadata: RouteValidationMetadata;
  debugInfo?: {
    checkedKeys: string[];
    availableKeys: string[];
    nearMatches: string[];
  };
}

// ============================================================================
// VALIDATION KEY GENERATION
// ============================================================================

class ValidationKeyGenerator {
  /**
   * Generate consistent cache keys for different validation types
   */
  static country(countrySlug: string): string {
    return `country:${countrySlug.toLowerCase()}`;
  }

  static animal(animalSlug: string): string {
    return `animal:${animalSlug.toLowerCase()}`;
  }

  static combination(animalSlug: string, countrySlug: string): string {
    return `combo:${animalSlug.toLowerCase()}:${countrySlug.toLowerCase()}`;
  }

  static organization(orgSlug: string): string {
    return `org:${orgSlug.toLowerCase()}`;
  }

  static route(path: string, params: Record<string, string> = {}): string {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b)) // Consistent ordering
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return `route:${path}${paramString ? `?${paramString}` : ''}`;
  }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

class ValidationPerformanceMonitor {
  private lookupTimes: number[] = [];
  private cacheHits = 0;
  private cacheMisses = 0;
  private startTime = Date.now();

  recordLookup(duration: number, wasHit: boolean): void {
    this.lookupTimes.push(duration);
    if (wasHit) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }

    // Keep only last 1000 measurements for memory efficiency
    if (this.lookupTimes.length > 1000) {
      this.lookupTimes = this.lookupTimes.slice(-1000);
    }
  }

  getStats(): ValidationCacheStats {
    const totalLookups = this.cacheHits + this.cacheMisses;
    const hitRate = totalLookups > 0 ? this.cacheHits / totalLookups : 0;
    const avgLookupTime = this.lookupTimes.length > 0
      ? this.lookupTimes.reduce((sum, time) => sum + time, 0) / this.lookupTimes.length
      : 0;

    return {
      totalEntries: totalLookups,
      hitRate,
      avgLookupTime,
      memoryUsage: this.estimateMemoryUsage(),
      lastUpdated: Date.now()
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    const lookupTimesMemory = this.lookupTimes.length * 8; // 8 bytes per number
    const counterMemory = 24; // 3 counters * 8 bytes
    return lookupTimesMemory + counterMemory;
  }

  reset(): void {
    this.lookupTimes = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.startTime = Date.now();
  }
}

// ============================================================================
// MAIN VALIDATION ENGINE
// ============================================================================

export class RouteValidationEngine {
  private validationCache: Map<string, RouteValidationResult>;
  private reverseIndexes: Map<string, Set<string>>;
  private performanceMonitor: ValidationPerformanceMonitor;
  private lastCacheUpdate: number;
  private cacheVersion: string;

  constructor(context: RouteGenerationContext) {
    this.validationCache = new Map();
    this.reverseIndexes = new Map();
    this.performanceMonitor = new ValidationPerformanceMonitor();
    this.lastCacheUpdate = 0;
    this.cacheVersion = this.generateCacheVersion(context);

    this.precomputeValidations(context);
  }

  // ========================================================================
  // PUBLIC VALIDATION API
  // ========================================================================

  /**
   * Validate a route with parameters - O(1) performance
   */
  validateRoute(path: string, params: Record<string, string> = {}): DetailedValidationResult {
    const startTime = performance.now();

    try {
      const result = this.performValidation(path, params);
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Performance monitoring
      this.performanceMonitor.recordLookup(duration, result.metadata.cacheHit);

      // Warn if validation exceeds target
      if (duration > 1) {
        console.warn(`Route validation exceeded 1ms target: ${duration.toFixed(2)}ms for ${path}`);
      }

      return result;

    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      return {
        isValid: false,
        reason: `Validation error: ${error.message}`,
        metadata: {
          validationTime: duration,
          cacheHit: false,
          validatorUsed: 'error-handler'
        }
      };
    }
  }

  /**
   * Validate country route
   */
  validateCountry(countrySlug: string): DetailedValidationResult {
    return this.validateByKey(
      ValidationKeyGenerator.country(countrySlug),
      'country',
      countrySlug
    );
  }

  /**
   * Generic validation method with performance tracking
   */
  private validateByKey(
    key: string,
    type: string,
    identifier: string
  ): DetailedValidationResult {
    const startTime = performance.now();

    // Check cache first
    if (this.validationCache.has(key)) {
      const cached = this.validationCache.get(key)!;
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Record cache hit
      this.performanceMonitor.recordLookup(duration, true);

      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          validationTime: duration,
          cacheHit: true
        }
      };
    }

    // Cache miss - compute result
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Record cache miss
    this.performanceMonitor.recordLookup(duration, false);

    const result: DetailedValidationResult = {
      isValid: false,
      reason: `${type} "${identifier}" not found in precomputed validations`,
      metadata: {
        validationTime: duration,
        cacheHit: false,
        validatorUsed: 'validateByKey',
        availableAlternatives: []
      }
    };

    // Cache the negative result
    this.validationCache.set(key, result);

    return result;
  }

  /**
   * Validate animal route
   */
  validateAnimal(animalSlug: string): DetailedValidationResult {
    return this.validateByKey(
      ValidationKeyGenerator.animal(animalSlug),
      'animal',
      animalSlug
    );
  }

  /**
   * Validate animal/country combination
   */
  validateCombination(animalSlug: string, countrySlug: string): DetailedValidationResult {
    return this.validateByKey(
      ValidationKeyGenerator.combination(animalSlug, countrySlug),
      'combination',
      `${animalSlug} + ${countrySlug}`
    );
  }

  /**
   * Validate organization route
   */
  validateOrganization(orgSlug: string): DetailedValidationResult {
    return this.validateByKey(
      ValidationKeyGenerator.organization(orgSlug),
      'organization',
      orgSlug
    );
  }

  // ========================================================================
  // PERFORMANCE & MONITORING
  // ========================================================================

  /**
   * Get validation cache statistics
   */
  getCacheStats(): ValidationCacheStats {
    return this.performanceMonitor.getStats();
  }

  /**
   * Get debug information about cache contents
   */
  getDebugInfo(): {
    cacheSize: number;
    cacheVersion: string;
    sampleKeys: string[];
    reverseIndexSize: number;
  } {
    const sampleKeys = Array.from(this.validationCache.keys()).slice(0, 10);

    return {
      cacheSize: this.validationCache.size,
      cacheVersion: this.cacheVersion,
      sampleKeys,
      reverseIndexSize: this.reverseIndexes.size
    };
  }

  /**
   * Force cache refresh with new data
   */
  refreshCache(context: RouteGenerationContext): void {
    const newVersion = this.generateCacheVersion(context);

    if (newVersion !== this.cacheVersion) {
      console.log('🔄 Refreshing route validation cache...');

      this.validationCache.clear();
      this.reverseIndexes.clear();
      this.performanceMonitor.reset();

      this.precomputeValidations(context);
      this.cacheVersion = newVersion;
      this.lastCacheUpdate = Date.now();

      console.log(`✅ Cache refreshed: ${this.validationCache.size} entries`);
    }
  }

  // ========================================================================
  // PRIVATE VALIDATION LOGIC
  // ========================================================================

  private performValidation(path: string, params: Record<string, string>): DetailedValidationResult {
    const startTime = performance.now();

    // Try exact route match first
    const routeKey = ValidationKeyGenerator.route(path, params);
    const routeResult = this.validationCache.get(routeKey);

    if (routeResult) {
      return {
        ...routeResult,
        metadata: {
          validationTime: performance.now() - startTime,
          cacheHit: true,
          validatorUsed: 'exact-route-match'
        }
      };
    }

    // Try parameter-based validation
    const paramResult = this.validateByParameters(path, params);
    if (paramResult) {
      return {
        ...paramResult,
        metadata: {
          validationTime: performance.now() - startTime,
          cacheHit: true,
          validatorUsed: 'parameter-based'
        }
      };
    }

    // No match found
    return {
      isValid: false,
      reason: 'Route not found in validation cache',
      suggestions: this.generateSuggestions(path, params),
      metadata: {
        validationTime: performance.now() - startTime,
        cacheHit: false,
        validatorUsed: 'no-match'
      }
    };
  }

  private validateByParameters(path: string, params: Record<string, string>): RouteValidationResult | null {
    // Handle common parameter patterns
    if (params.country && params.animal) {
      // Combined route validation
      const result = this.validateCombination(params.animal, params.country);
      return result.isValid ? { isValid: true } : null;
    }

    if (params.country) {
      // Country route validation
      const result = this.validateCountry(params.country);
      return result.isValid ? { isValid: true } : null;
    }

    if (params.animal) {
      // Animal route validation
      const result = this.validateAnimal(params.animal);
      return result.isValid ? { isValid: true } : null;
    }

    if (params.orgSlug) {
      // Organization route validation
      const result = this.validateOrganization(params.orgSlug);
      return result.isValid ? { isValid: true } : null;
    }

    return null;
  }

  // ========================================================================
  // CACHE PRECOMPUTATION
  // ========================================================================

  private precomputeValidations(context: RouteGenerationContext): void {
    const startTime = performance.now();
    console.log('🏗️ Precomputing route validations...');

    // Precompute country validations
    this.precomputeCountryValidations(context.opportunities);

    // Precompute animal validations
    this.precomputeAnimalValidations(context.opportunities);

    // Precompute combination validations
    this.precomputeCombinationValidations(context.opportunities);

    // Precompute organization validations
    this.precomputeOrganizationValidations(context.organizations);

    // Build reverse indexes for suggestions
    this.buildReverseIndexes();

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`✅ Precomputation complete: ${this.validationCache.size} entries in ${duration.toFixed(2)}ms`);

    // Warn if precomputation is slow
    if (duration > 50) {
      console.warn(`⚠️ Precomputation exceeded 50ms target: ${duration.toFixed(2)}ms`);
    }
  }

  private precomputeCountryValidations(opportunities: Opportunity[]): void {
    const countries = new Set<string>();

    opportunities.forEach(opp => {
      const countrySlug = formatCountrySlug(opp.location.country);
      countries.add(countrySlug);
    });

    countries.forEach(countrySlug => {
      const key = ValidationKeyGenerator.country(countrySlug);
      this.validationCache.set(key, {
        isValid: true,
        route: {
          id: `country-${countrySlug}`,
          path: `/volunteer-${countrySlug}`,
          type: 'country'
        } as any // Simplified for validation
      });
    });

    console.log(`📍 Precomputed ${countries.size} country validations`);
  }

  private precomputeAnimalValidations(opportunities: Opportunity[]): void {
    const animals = new Set<string>();

    opportunities.forEach(opp => {
      opp.animalTypes.forEach(animalType => {
        const animalSlug = formatAnimalSlug(animalType);
        animals.add(animalSlug);
      });
    });

    animals.forEach(animalSlug => {
      const key = ValidationKeyGenerator.animal(animalSlug);
      this.validationCache.set(key, {
        isValid: true,
        route: {
          id: `animal-${animalSlug}`,
          path: `/${animalSlug}-volunteer`,
          type: 'animal'
        } as any // Simplified for validation
      });
    });

    console.log(`🦁 Precomputed ${animals.size} animal validations`);
  }

  private precomputeCombinationValidations(opportunities: Opportunity[]): void {
    const combinations = new Set<string>();

    opportunities.forEach(opp => {
      const countrySlug = formatCountrySlug(opp.location.country);

      opp.animalTypes.forEach(animalType => {
        const animalSlug = formatAnimalSlug(animalType);
        const comboKey = ValidationKeyGenerator.combination(animalSlug, countrySlug);

        if (!this.validationCache.has(comboKey)) {
          this.validationCache.set(comboKey, {
            isValid: true,
            route: {
              id: `combined-${countrySlug}-${animalSlug}`,
              path: `/volunteer-${countrySlug}/${animalSlug}`,
              type: 'combined'
            } as any // Simplified for validation
          });
          combinations.add(comboKey);
        }
      });
    });

    console.log(`🔗 Precomputed ${combinations.size} combination validations`);
  }

  private precomputeOrganizationValidations(organizations: Organization[]): void {
    organizations.forEach(org => {
      const key = ValidationKeyGenerator.organization(org.slug);
      this.validationCache.set(key, {
        isValid: true,
        route: {
          id: `org-${org.slug}`,
          path: `/${org.slug}`,
          type: 'organization'
        } as any // Simplified for validation
      });
    });

    console.log(`🏢 Precomputed ${organizations.length} organization validations`);
  }

  private buildReverseIndexes(): void {
    // Build indexes for fast suggestion generation
    this.validationCache.forEach((result, key) => {
      const [type] = key.split(':');

      if (!this.reverseIndexes.has(type)) {
        this.reverseIndexes.set(type, new Set());
      }

      this.reverseIndexes.get(type)!.add(key);
    });
  }

  // ========================================================================
  // SUGGESTION GENERATION
  // ========================================================================

  private generateSuggestions(path: string, params: Record<string, string>): string[] {
    const suggestions: string[] = [];

    // Try to suggest based on path pattern
    if (path.includes('volunteer-')) {
      const countryPart = path.split('volunteer-')[1];
      if (countryPart) {
        suggestions.push(...this.generateCountrySuggestions(countryPart));
      }
    }

    if (path.includes('-volunteer')) {
      const animalPart = path.split('-volunteer')[0].replace('/', '');
      if (animalPart) {
        suggestions.push(...this.generateAnimalSuggestions(animalPart));
      }
    }

    // Parameter-based suggestions
    if (params.country) {
      suggestions.push(...this.generateCountrySuggestions(params.country));
    }
    if (params.animal) {
      suggestions.push(...this.generateAnimalSuggestions(params.animal));
    }

    return [...new Set(suggestions)].slice(0, 3); // Unique, max 3 suggestions
  }

  private generateSuggestionsForType(type: string, value: string): string[] {
    switch (type) {
      case 'country':
        return this.generateCountrySuggestions(value);
      case 'animal':
        return this.generateAnimalSuggestions(value);
      case 'organization':
        return this.generateOrganizationSuggestions(value);
      default:
        return [];
    }
  }

  private generateCountrySuggestions(attempted: string): string[] {
    const countryKeys = this.reverseIndexes.get('country') || new Set();
    return this.findSimilarKeys(attempted, Array.from(countryKeys), 'country');
  }

  private generateAnimalSuggestions(attempted: string): string[] {
    const animalKeys = this.reverseIndexes.get('animal') || new Set();
    return this.findSimilarKeys(attempted, Array.from(animalKeys), 'animal');
  }

  private generateOrganizationSuggestions(attempted: string): string[] {
    const orgKeys = this.reverseIndexes.get('org') || new Set();
    return this.findSimilarKeys(attempted, Array.from(orgKeys), 'org');
  }

  private findSimilarKeys(attempted: string, availableKeys: string[], type: string): string[] {
    const similarities = availableKeys
      .map(key => {
        const value = key.replace(`${type}:`, '');
        return {
          key,
          value,
          similarity: this.calculateSimilarity(attempted, value)
        };
      })
      .filter(item => item.similarity > 0.3) // 30% similarity threshold
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    return similarities.map(item => item.value);
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (distance / maxLength);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i += 1) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j += 1) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private getAvailableForType(type: string): string[] {
    const keys = this.reverseIndexes.get(type) || new Set();
    return Array.from(keys)
      .map(key => key.replace(`${type}:`, ''))
      .slice(0, 5); // Limit to 5 for brevity
  }

  // ========================================================================
  // UTILITIES
  // ========================================================================

  private generateCacheVersion(context: RouteGenerationContext): string {
    // Generate a version string based on data content
    const opportunityCount = context.opportunities.length;
    const organizationCount = context.organizations.length;
    const combinationCount = context.validCombinations.length;

    return `v${opportunityCount}-${organizationCount}-${combinationCount}`;
  }
}

export default RouteValidationEngine;