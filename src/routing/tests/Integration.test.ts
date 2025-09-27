// src/routing/tests/Integration.test.ts
import { RouteGenerator } from '../core/RouteGenerator';
import { RoutePriorityCalculator } from '../core/RoutePriorityCalculator';
import { RouteValidationEngine } from '../validation/RouteValidationEngine';
import type { Opportunity } from '../../types/index';

describe('Phase 3.1 Foundation Integration', () => {
  let routeGenerator: RouteGenerator;
  let priorityCalculator: RoutePriorityCalculator;
  let validationEngine: RouteValidationEngine;
  let mockOpportunities: Opportunity[];

  beforeEach(() => {
    mockOpportunities = [
      {
        id: 'test-opp-1',
        title: 'Sea Turtle Conservation in Costa Rica',
        organization: 'Test Organization 1',
        organizationSlug: 'test-org-1',
        location: {
          country: 'Costa Rica',
          city: 'Tamarindo',
          coordinates: [10.2994, -85.8376]
        },
        animalTypes: ['Sea Turtles', 'Sloths'],
        duration: { min: 1, max: 4 },
        description: 'Test opportunity description',
        requirements: ['Beginner friendly'],
        cost: {
          amount: 500,
          currency: 'USD',
          period: 'week',
          includes: ['Accommodation', 'Meals']
        },
        images: ['test-image.jpg'],
        featured: true,
        datePosted: '2024-01-01T00:00:00Z'
      },
      {
        id: 'test-opp-2',
        title: 'Elephant Conservation in Thailand',
        organization: 'Test Organization 2',
        organizationSlug: 'test-org-2',
        location: {
          country: 'Thailand',
          city: 'Chiang Mai',
          coordinates: [18.7061, 98.9817]
        },
        animalTypes: ['Elephants'],
        duration: { min: 2, max: 8 },
        description: 'Test opportunity description 2',
        requirements: ['Some experience preferred'],
        cost: {
          amount: 600,
          currency: 'USD',
          period: 'week',
          includes: ['Accommodation']
        },
        images: ['test-image-2.jpg'],
        featured: false,
        datePosted: '2024-01-02T00:00:00Z'
      }
    ];

    routeGenerator = new RouteGenerator(mockOpportunities);
    priorityCalculator = new RoutePriorityCalculator();
  });

  test('Complete route generation and validation pipeline', async () => {
    // 1. Generate routes
    const generatedRoutes = routeGenerator.generateAllRoutes();
    expect(generatedRoutes.length).toBeGreaterThan(0);

    // 2. Calculate optimal ordering
    const orderingResult = priorityCalculator.calculateOrder(generatedRoutes);
    expect(orderingResult.conflicts.filter(c => c.severity === 'critical')).toHaveLength(0);

    // 3. Initialize validation engine
    validationEngine = new RouteValidationEngine(orderingResult.orderedRoutes, mockOpportunities);

    // 4. Validate all generated routes
    const validationResults = await Promise.all(
      orderingResult.orderedRoutes.map(route =>
        validationEngine.validateRoute(route.path)
      )
    );

    validationResults.forEach((result, index) => {
      expect(result.isValid).toBe(true);
      expect(result.route).toEqual(orderingResult.orderedRoutes[index]);
    });
  });

  test('Performance requirements are met across all components', async () => {
    // Route generation performance
    const genStart = performance.now();
    const generatedRoutes = routeGenerator.generateAllRoutes();
    const genEnd = performance.now();
    expect(genEnd - genStart).toBeLessThan(100); // Sub-100ms target

    // Route ordering performance
    const orderStart = performance.now();
    const orderingResult = priorityCalculator.calculateOrder(generatedRoutes);
    const orderEnd = performance.now();
    expect(orderEnd - orderStart).toBeLessThan(50); // Sub-50ms target

    // Route validation performance
    validationEngine = new RouteValidationEngine(orderingResult.orderedRoutes, mockOpportunities);

    const valStart = performance.now();
    await validationEngine.validateRoute('/volunteer-costa-rica');
    const valEnd = performance.now();
    expect(valEnd - valStart).toBeLessThan(10); // Sub-10ms target
  });

  test('Route conflicts are properly detected and resolved', () => {
    const generatedRoutes = routeGenerator.generateAllRoutes();

    // Add potentially problematic routes
    const problematicRoutes = [
      ...generatedRoutes,
      {
        id: 'catch-all-early',
        path: '*',
        component: 'NotFound',
        priority: 'low' as const,
        type: 'system' as const,
        seo: {
          title: 'Page Not Found',
          description: 'Not found',
          keywords: ['404'],
          changefreq: 'yearly' as const,
          priority: 0.1
        },
        performance: {
          lazyLoad: false,
          preload: 'none' as const,
          cacheStrategy: 'none' as const,
          bundleSplit: false
        },
        navigation: {
          enabledFlows: [],
          contextPreservation: false,
          analyticsEvents: ['404'],
          breadcrumbPath: ['Home', 'Not Found']
        }
      }
    ];

    const result = priorityCalculator.calculateOrder(problematicRoutes);

    // Should reorder to put catch-all route last
    const orderedPaths = result.orderedRoutes.map(r => r.path);
    expect(orderedPaths[orderedPaths.length - 1]).toBe('*');

    // Should not have critical conflicts after ordering
    const criticalConflicts = result.conflicts.filter(c => c.severity === 'critical');
    expect(criticalConflicts.length).toBe(0);
  });

  test('Data-driven route generation accuracy', () => {
    const routes = routeGenerator.generateAllRoutes();

    // Should have country routes for each unique country in opportunities
    const countryRoutes = routes.filter(r => r.path.match(/^\/volunteer-[a-z-]+$/) && !r.path.includes('/'));
    const uniqueCountries = new Set(mockOpportunities.map(o => o.location.country));
    expect(countryRoutes.length).toBe(uniqueCountries.size);

    // Should have animal routes for each unique animal type
    const animalRoutes = routes.filter(r => r.path.match(/^\/[a-z-]+-volunteer$/) && !r.path.includes('/volunteer'));
    const uniqueAnimals = new Set(mockOpportunities.flatMap(o => o.animalTypes));
    expect(animalRoutes.length).toBe(uniqueAnimals.size);

    // Should have organization routes for each organization with slug
    const orgRoutes = routes.filter(r => r.path.startsWith('/organization/'));
    const orgsWithSlugs = mockOpportunities.filter(o => o.organizationSlug);
    expect(orgRoutes.length).toBe(orgsWithSlugs.length);
  });

  test('SEO optimization is consistent across all routes', () => {
    const routes = routeGenerator.generateAllRoutes();

    routes.forEach(route => {
      // SEO metadata validation
      expect(route.seo.title).toBeDefined();
      expect(route.seo.title.length).toBeGreaterThan(10);
      expect(route.seo.title.length).toBeLessThan(70);

      expect(route.seo.description).toBeDefined();
      expect(route.seo.description.length).toBeGreaterThan(20);
      expect(route.seo.description.length).toBeLessThan(170);

      expect(route.seo.keywords).toBeInstanceOf(Array);
      expect(route.seo.keywords.length).toBeGreaterThan(0);

      expect(route.seo.priority).toBeGreaterThanOrEqual(0);
      expect(route.seo.priority).toBeLessThanOrEqual(1);

      // Combined routes should have canonical URLs
      if (route.id.includes('combined-animal')) {
        expect(route.seo.canonical).toBeDefined();
      }
    });
  });

  test('Navigation flows are properly configured', () => {
    const routes = routeGenerator.generateAllRoutes();

    routes.forEach(route => {
      expect(route.navigation.enabledFlows).toBeInstanceOf(Array);
      expect(route.navigation.analyticsEvents).toBeInstanceOf(Array);
      expect(route.navigation.breadcrumbPath).toBeInstanceOf(Array);
      expect(typeof route.navigation.contextPreservation).toBe('boolean');

      // Country pages should enable flow to animals and combined pages
      if (route.path.startsWith('/volunteer-') && !route.path.includes('/')) {
        expect(route.navigation.enabledFlows).toContain('to-animal');
        expect(route.navigation.enabledFlows).toContain('to-combined');
      }

      // Animal pages should enable flow to countries and combined pages
      if (route.path.endsWith('-volunteer') && !route.path.includes('/volunteer')) {
        expect(route.navigation.enabledFlows).toContain('to-country');
        expect(route.navigation.enabledFlows).toContain('to-combined');
      }
    });
  });

  test('Validation engine integrates seamlessly with generated routes', async () => {
    const routes = routeGenerator.generateAllRoutes();
    const orderingResult = priorityCalculator.calculateOrder(routes);
    validationEngine = new RouteValidationEngine(orderingResult.orderedRoutes, mockOpportunities);

    // Test validation of various route types
    const testPaths = [
      '/', // Home
      '/opportunities', // Core route
      '/volunteer-costa-rica', // Country route
      '/sea-turtles-volunteer', // Animal route
      '/volunteer-costa-rica/sea-turtles', // Combined route
      '/organization/test-org-1' // Organization route
    ];

    for (const path of testPaths) {
      const result = await validationEngine.validateRoute(path);

      // Known routes should validate successfully
      if (orderingResult.orderedRoutes.some(r => r.path === path)) {
        expect(result.isValid).toBe(true);
        expect(result.route).toBeDefined();
      }
    }
  });

  test('Performance monitoring and statistics work correctly', async () => {
    const routes = routeGenerator.generateAllRoutes();
    const orderingResult = priorityCalculator.calculateOrder(routes);
    validationEngine = new RouteValidationEngine(orderingResult.orderedRoutes, mockOpportunities);

    // Generate performance report
    const performanceReport = priorityCalculator.generatePerformanceReport(routes);
    expect(performanceReport.totalRoutes).toBe(routes.length);

    // Check validation statistics
    const cacheStats = validationEngine.getCacheStats();
    expect(cacheStats.isInitialized).toBe(true);

    const dataStats = validationEngine.getValidationDataStats();
    expect(dataStats.knownRoutes).toBe(orderingResult.orderedRoutes.length);

    // Route health analysis
    const healthAnalysis = priorityCalculator.analyzeRouteHealth(routes);
    expect(healthAnalysis.score).toBeGreaterThanOrEqual(0);
    expect(healthAnalysis.score).toBeLessThanOrEqual(100);
  });

  test('System handles edge cases gracefully', async () => {
    const routes = routeGenerator.generateAllRoutes();
    const orderingResult = priorityCalculator.calculateOrder(routes);
    validationEngine = new RouteValidationEngine(orderingResult.orderedRoutes, mockOpportunities);

    // Test empty opportunity data
    const emptyGenerator = new RouteGenerator([]);
    const emptyRoutes = emptyGenerator.generateAllRoutes();
    expect(emptyRoutes.length).toBeGreaterThan(0); // Should still have core and system routes

    // Test invalid route paths
    const invalidPaths = [
      'invalid-path-no-slash',
      '/volunteer-nonexistent-country',
      '/nonexistent-animal-volunteer',
      ''
    ];

    for (const path of invalidPaths) {
      const result = await validationEngine.validateRoute(path);
      if (result.errors.filter(e => e.severity === 'error').length > 0) {
        expect(result.isValid).toBe(false);
        expect(result.suggestions.length).toBeGreaterThan(0);
      }
    }
  });

  test('Memory usage remains stable under load', async () => {
    const initialMemoryUsage = process.memoryUsage().heapUsed;

    // Generate routes multiple times
    for (let i = 0; i < 10; i++) {
      const generator = new RouteGenerator(mockOpportunities);
      const routes = generator.generateAllRoutes();
      const calculator = new RoutePriorityCalculator();
      const result = calculator.calculateOrder(routes);
      const validator = new RouteValidationEngine(result.orderedRoutes, mockOpportunities);

      // Perform some validations
      await validator.validateRoute('/volunteer-costa-rica');
      await validator.validateRoute('/sea-turtles-volunteer');
    }

    const finalMemoryUsage = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemoryUsage - initialMemoryUsage;

    // Memory increase should be reasonable (less than 50MB for this test)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});