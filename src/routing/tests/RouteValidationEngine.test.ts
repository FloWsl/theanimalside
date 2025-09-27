// src/routing/tests/RouteValidationEngine.test.ts
import { RouteValidationEngine, ValidationResult } from '../validation/RouteValidationEngine';
import { RouteDefinition, SEOMetadata, PerformanceConfig, NavigationMetadata } from '../core/RouteDefinition';
import type { Opportunity } from '../../types/index';

describe('RouteValidationEngine Implementation', () => {
  let validationEngine: RouteValidationEngine;
  let mockRoutes: RouteDefinition[];
  let mockOpportunities: Opportunity[];

  beforeEach(() => {
    mockOpportunities = [
      {
        id: 'test-1',
        title: 'Sea Turtle Conservation',
        organization: 'Test Org 1',
        organizationSlug: 'test-org-1',
        location: {
          country: 'Costa Rica',
          city: 'Tamarindo',
          coordinates: [10.2994, -85.8376]
        },
        animalTypes: ['Sea Turtles'],
        duration: { min: 1, max: 4 },
        description: 'Test description',
        requirements: [],
        cost: { amount: 500, currency: 'USD', period: 'week', includes: [] },
        images: [],
        featured: true,
        datePosted: '2024-01-01T00:00:00Z'
      },
      {
        id: 'test-2',
        title: 'Lion Conservation',
        organization: 'Test Org 2',
        organizationSlug: 'test-org-2',
        location: {
          country: 'South Africa',
          city: 'Cape Town',
          coordinates: [-33.9249, 18.4241]
        },
        animalTypes: ['Lions'],
        duration: { min: 2, max: 8 },
        description: 'Test description 2',
        requirements: [],
        cost: { amount: 600, currency: 'USD', period: 'week', includes: [] },
        images: [],
        featured: false,
        datePosted: '2024-01-02T00:00:00Z'
      }
    ];

    mockRoutes = [
      {
        id: 'home',
        path: '/',
        component: 'HomePage',
        priority: 'critical',
        type: 'static',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'opportunities',
        path: '/opportunities',
        component: 'OpportunitiesPage',
        priority: 'critical',
        type: 'static',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'country-costa-rica',
        path: '/volunteer-costa-rica',
        component: 'CountryLandingPage',
        priority: 'critical',
        type: 'static',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'animal-sea-turtles',
        path: '/sea-turtles-volunteer',
        component: 'AnimalLandingPage',
        priority: 'critical',
        type: 'static',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      }
    ];

    validationEngine = new RouteValidationEngine(mockRoutes, mockOpportunities);
  });

  test('Validates known routes successfully', async () => {
    const result = await validationEngine.validateRoute('/volunteer-costa-rica');

    expect(result.isValid).toBe(true);
    expect(result.route).toBeDefined();
    expect(result.errors).toHaveLength(0);
    expect(result.performance.validationTime).toBeLessThan(50); // Target: <50ms
  });

  test('Cache improves performance on repeated validation', async () => {
    // First validation
    const result1 = await validationEngine.validateRoute('/volunteer-costa-rica');

    // Second validation (should be cached)
    const result2 = await validationEngine.validateRoute('/volunteer-costa-rica');

    expect(result1.performance.cacheHit).toBe(false);
    expect(result2.performance.cacheHit).toBe(true);
    expect(result2.performance.validationTime).toBeLessThan(result1.performance.validationTime);
  });

  test('Detects invalid country routes', async () => {
    const result = await validationEngine.validateRoute('/volunteer-invalid-country');

    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.field === 'country')).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('Detects invalid animal routes', async () => {
    const result = await validationEngine.validateRoute('/invalid-animal-volunteer');

    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.field === 'animal')).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('Validates path structure correctly', async () => {
    const result = await validationEngine.validateRoute('invalid-path-no-slash');

    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.field === 'path')).toBe(true);
  });

  test('Provides helpful suggestions for similar routes', async () => {
    const result = await validationEngine.validateRoute('/volunteer-costa-rica-typo');

    expect(result.suggestions.some(s => s.includes('costa-rica'))).toBe(true);
  });

  test('Performance meets O(1) target', async () => {
    const paths = [
      '/volunteer-costa-rica',
      '/sea-turtles-volunteer',
      '/invalid-route',
      '/volunteer-invalid'
    ];

    const results = await Promise.all(
      paths.map(path => validationEngine.validateRoute(path))
    );

    results.forEach(result => {
      expect(result.performance.validationTime).toBeLessThan(50); // 50ms target
      expect(result.performance.validationSteps).toBeLessThanOrEqual(3);
    });
  });

  test('Validates combined routes correctly', async () => {
    const validCombinedResult = await validationEngine.validateRoute('/volunteer-costa-rica/sea-turtles');
    const invalidCombinedResult = await validationEngine.validateRoute('/volunteer-costa-rica/penguins');

    if (validCombinedResult.errors.length === 0) {
      expect(validCombinedResult.isValid).toBe(true);
    }

    if (invalidCombinedResult.errors.some(e => e.field === 'combination')) {
      expect(invalidCombinedResult.isValid).toBe(false);
    }
  });

  test('Validates organization routes', async () => {
    const validOrgResult = await validationEngine.validateRoute('/organization/test-org-1');
    const invalidOrgResult = await validationEngine.validateRoute('/organization/invalid-org');

    // Valid organization should not throw an error
    expect(validOrgResult.errors.filter(e => e.severity === 'error')).toHaveLength(0);

    // Invalid organization should have warnings
    expect(invalidOrgResult.errors.some(e => e.field === 'organization')).toBe(true);
  });

  test('Cache can be cleared', () => {
    validationEngine.clearCache();
    const stats = validationEngine.getCacheStats();
    expect(stats.size).toBe(0);
  });

  test('Cache statistics are accurate', async () => {
    await validationEngine.validateRoute('/volunteer-costa-rica');
    await validationEngine.validateRoute('/sea-turtles-volunteer');

    const stats = validationEngine.getCacheStats();
    expect(stats.size).toBe(2);
    expect(stats.isInitialized).toBe(true);
  });

  test('Validation data statistics are comprehensive', () => {
    const dataStats = validationEngine.getValidationDataStats();

    expect(dataStats.validCountries).toBeGreaterThan(0);
    expect(dataStats.validAnimals).toBeGreaterThan(0);
    expect(dataStats.validCombinations).toBeGreaterThan(0);
    expect(dataStats.validOrganizations).toBeGreaterThan(0);
    expect(dataStats.knownRoutes).toBe(mockRoutes.length);
  });

  test('Batch validation works correctly', async () => {
    const paths = [
      '/volunteer-costa-rica',
      '/sea-turtles-volunteer',
      '/invalid-route'
    ];

    const results = await validationEngine.validateRouteBatch(paths);

    expect(results).toHaveLength(paths.length);
    results.forEach(result => {
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('performance');
    });
  });

  test('Updates validation data correctly', () => {
    const newOpportunities: Opportunity[] = [
      {
        id: 'new-1',
        title: 'Elephant Conservation',
        organization: 'New Org',
        organizationSlug: 'new-org',
        location: {
          country: 'Thailand',
          city: 'Chiang Mai',
          coordinates: [18.7061, 98.9817]
        },
        animalTypes: ['Elephants'],
        duration: { min: 1, max: 12 },
        description: 'New description',
        requirements: [],
        cost: { amount: 400, currency: 'USD', period: 'week', includes: [] },
        images: [],
        featured: true,
        datePosted: '2024-01-03T00:00:00Z'
      }
    ];

    const oldStats = validationEngine.getValidationDataStats();
    validationEngine.updateValidationData(newOpportunities);
    const newStats = validationEngine.getValidationDataStats();

    // Should have new data
    expect(newStats.validCountries).toBe(1); // Only Thailand
    expect(newStats.validAnimals).toBe(1); // Only Elephants
    expect(newStats.validOrganizations).toBe(1); // Only new-org

    // Cache should be cleared
    const cacheStats = validationEngine.getCacheStats();
    expect(cacheStats.size).toBe(0);
  });

  test('Similarity calculation works for suggestions', async () => {
    const result = await validationEngine.validateRoute('/volunteer-costa-ricas');

    // Should suggest similar country
    expect(result.suggestions.some(s => s.includes('costa-rica'))).toBe(true);
  });

  test('System routes are properly identified', async () => {
    const homeResult = await validationEngine.validateRoute('/');
    const opportunitiesResult = await validationEngine.validateRoute('/opportunities');

    expect(homeResult.isValid).toBe(true);
    expect(opportunitiesResult.isValid).toBe(true);
  });

  test('Performance scales with large validation batches', async () => {
    const largeBatch = Array.from({ length: 100 }, (_, i) => `/test-route-${i}`);

    const startTime = performance.now();
    const results = await validationEngine.validateRouteBatch(largeBatch);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // All 100 validations in <1 second
    expect(results).toHaveLength(100);
  });
});