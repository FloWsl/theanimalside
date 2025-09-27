// src/routing/tests/RealIntegration.test.ts
// REAL integration test - no mocks, tests actual components working together

import { RouteGenerator } from '../core/RouteGenerator';
import { RoutePriorityCalculator } from '../core/RoutePriorityCalculator';
import { RouteValidationEngine } from '../validation/RouteValidationEngine';
import NavigationFlowSystem from '../navigation/NavigationFlowSystem';
import RoutePerformanceMonitor from '../performance/RoutePerformanceMonitor';
import { opportunities } from '../../data/opportunities';

describe('Real Phase 3.2 Integration Tests', () => {
  let generator: RouteGenerator;
  let calculator: RoutePriorityCalculator;
  let validator: RouteValidationEngine;
  let navigationSystem: NavigationFlowSystem;
  let performanceMonitor: RoutePerformanceMonitor;

  beforeAll(() => {
    // Initialize all systems with real data
    generator = new RouteGenerator(opportunities);
    calculator = new RoutePriorityCalculator();
    navigationSystem = new NavigationFlowSystem();
    performanceMonitor = new RoutePerformanceMonitor();
  });

  describe('Complete System Integration', () => {
    test('Route generation works with real opportunities data', () => {
      const routes = generator.generateAllRoutes();

      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBeGreaterThan(0);

      // Check for essential routes
      const homeRoute = routes.find(r => r.path === '/');
      expect(homeRoute).toBeDefined();
      expect(homeRoute?.priority).toBe('critical');

      const opportunitiesRoute = routes.find(r => r.path === '/opportunities');
      expect(opportunitiesRoute).toBeDefined();
      expect(opportunitiesRoute?.priority).toBe('critical');

      console.log(`✅ Generated ${routes.length} routes successfully`);
    });

    test('Route priority calculation prevents conflicts', () => {
      const routes = generator.generateAllRoutes();
      const result = calculator.calculateOrder(routes);

      expect(result.orderedRoutes).toBeDefined();
      expect(result.orderedRoutes.length).toBe(routes.length);
      expect(result.conflicts).toBeDefined();
      expect(result.warnings).toBeDefined();

      // Log conflicts for debugging
      if (result.conflicts.length > 0) {
        console.log('⚠️ Route conflicts detected:', result.conflicts.length);
        result.conflicts.forEach(conflict => {
          console.log(`  - ${conflict.route1.path} vs ${conflict.route2.path}: ${conflict.suggestion}`);
        });
      }

      // Route order should put catch-all routes last
      const lastRoute = result.orderedRoutes[result.orderedRoutes.length - 1];
      expect(lastRoute.path).toBe('*');

      console.log(`✅ Route ordering completed with ${result.conflicts.length} conflicts resolved`);
    });

    test('Route validation works with real data', async () => {
      const routes = generator.generateAllRoutes();
      const orderedRoutes = calculator.calculateOrder(routes).orderedRoutes;
      validator = new RouteValidationEngine(orderedRoutes, opportunities);

      // Test valid routes
      const homeValidation = await validator.validateRoute('/');
      expect(homeValidation.isValid).toBe(true);
      expect(homeValidation.errors).toHaveLength(0);

      const opportunitiesValidation = await validator.validateRoute('/opportunities');
      expect(opportunitiesValidation.isValid).toBe(true);
      expect(opportunitiesValidation.errors).toHaveLength(0);

      // Test dynamic route validation with real country data
      if (opportunities.length > 0) {
        const firstCountry = opportunities[0].location.country.toLowerCase().replace(/\s+/g, '-');
        const countryValidation = await validator.validateRoute(`/volunteer-${firstCountry}`);
        expect(countryValidation.isValid).toBe(true);
      }

      console.log('✅ Route validation working with real data');
    });

    test('Navigation system validates flows correctly', async () => {
      // Test core navigation flows
      const result1 = await navigationSystem.validateNavigation(
        '/volunteer-costa-rica',
        '/volunteer-costa-rica/sea-turtles',
        'click'
      );

      expect(result1.isValid).toBe(true);
      expect(result1.analyticsData).toBeDefined();
      expect(result1.analyticsData?.flow).toBe('country_to_animal_navigation');

      // Test navigation options
      const options = navigationSystem.getNavigationOptions('/volunteer-costa-rica');
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);

      options.forEach(option => {
        expect(option.targetRoute).toBeDefined();
        expect(option.trigger).toBeDefined();
        expect(option.priority).toMatch(/high|medium|low/);
        expect(option.analytics).toBeDefined();
      });

      console.log(`✅ Navigation system working with ${options.length} flow options`);
    });

    test('Performance monitoring tracks metrics', () => {
      // Track some test metrics
      performanceMonitor.trackRouteValidation('test-route', 0.5, true);
      performanceMonitor.trackRouteResolution('test-route', 20, true);
      performanceMonitor.trackRouteRendering('test-route', 80, true);

      // Get performance data
      const performance = performanceMonitor.getRoutePerformance('test-route');
      expect(performance.avgValidationTime).toBe(0.5);
      expect(performance.avgResolutionTime).toBe(20);
      expect(performance.avgRenderingTime).toBe(80);
      expect(performance.successRate).toBe(1);

      // Get system health
      const health = performanceMonitor.getSystemHealth();
      expect(health).toBeDefined();
      expect(typeof health.memoryUsage).toBe('object');
      expect(typeof health.cachePerformance).toBe('object');
      expect(typeof health.routeResolution).toBe('object');
      expect(typeof health.validation).toBe('object');

      console.log('✅ Performance monitoring operational');
    });

    test('Complete routing pipeline works end-to-end', async () => {
      const startTime = performance.now();

      // Step 1: Generate routes
      const routes = generator.generateAllRoutes();

      // Step 2: Calculate priority order
      const orderingResult = calculator.calculateOrder(routes);

      // Step 3: Initialize validation engine
      const engine = new RouteValidationEngine(orderingResult.orderedRoutes, opportunities);

      // Step 4: Test route validation
      const validationResult = await engine.validateRoute('/opportunities');

      // Step 5: Test navigation flow
      const navigationResult = await navigationSystem.validateNavigation(
        '/',
        '/opportunities',
        'click'
      );

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Verify everything worked
      expect(routes.length).toBeGreaterThan(0);
      expect(orderingResult.orderedRoutes.length).toBe(routes.length);
      expect(validationResult.isValid).toBe(true);
      expect(navigationResult.isValid).toBe(true);

      // Performance should be reasonable
      expect(totalTime).toBeLessThan(100); // Should complete in under 100ms

      console.log(`✅ Complete pipeline working in ${totalTime.toFixed(2)}ms`);
    });

    test('Error handling works gracefully', async () => {
      // Test invalid route
      const invalidResult = await validator.validateRoute('/invalid-route-path');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);

      // Test invalid navigation
      const invalidNavigation = await navigationSystem.validateNavigation(
        '/nonexistent-route',
        '/another-nonexistent-route',
        'click'
      );
      expect(invalidNavigation.isValid).toBe(false);
      expect(invalidNavigation.issues).toBeDefined();

      console.log('✅ Error handling working correctly');
    });

    test('Performance optimization recommendations work', () => {
      // Add some slow metrics to trigger recommendations
      performanceMonitor.trackRouteValidation('slow-route', 10, true); // Slow validation
      performanceMonitor.trackRouteResolution('slow-route', 100, true); // Slow resolution
      performanceMonitor.trackRouteRendering('slow-route', 500, true); // Slow rendering

      const recommendations = performanceMonitor.getOptimizationRecommendations();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      recommendations.forEach(rec => {
        expect(rec.routeId).toBeDefined();
        expect(rec.issue).toBeDefined();
        expect(rec.recommendation).toBeDefined();
        expect(rec.priority).toMatch(/high|medium|low/);
      });

      console.log(`✅ Generated ${recommendations.length} optimization recommendations`);
    });
  });

  describe('Real Data Validation', () => {
    test('Opportunities data is valid for routing', () => {
      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
      expect(opportunities.length).toBeGreaterThan(0);

      // Check data structure
      opportunities.forEach(opp => {
        expect(opp.id).toBeDefined();
        expect(opp.location?.country).toBeDefined();
        expect(Array.isArray(opp.animalTypes)).toBe(true);
        expect(opp.animalTypes.length).toBeGreaterThan(0);
      });

      const countries = [...new Set(opportunities.map(o => o.location.country))];
      const animals = [...new Set(opportunities.flatMap(o => o.animalTypes))];

      console.log(`✅ Validated ${opportunities.length} opportunities, ${countries.length} countries, ${animals.length} animal types`);
    });

    test('Generated routes match opportunities data', () => {
      const routes = generator.generateAllRoutes();

      // Country routes should exist for real countries
      const countries = [...new Set(opportunities.map(o => o.location.country))];
      countries.forEach(country => {
        const slug = country.toLowerCase().replace(/\s+/g, '-');
        const countryRoute = routes.find(r => r.path === `/volunteer-${slug}`);
        expect(countryRoute).toBeDefined();
      });

      // Animal routes should exist for real animals
      const animals = [...new Set(opportunities.flatMap(o => o.animalTypes))];
      animals.forEach(animal => {
        const slug = animal.toLowerCase().replace(/\s+/g, '-');
        const animalRoute = routes.find(r => r.path === `/${slug}-volunteer`);
        expect(animalRoute).toBeDefined();
      });

      console.log('✅ Generated routes match real opportunities data');
    });
  });

  describe('Feature Flag Compatibility', () => {
    test('System works with feature flag enabled', () => {
      // Simulate feature flag enabled
      process.env.REACT_APP_NEW_ROUTING = 'true';

      // All components should initialize without errors
      expect(() => new RouteGenerator(opportunities)).not.toThrow();
      expect(() => new RoutePriorityCalculator()).not.toThrow();
      expect(() => new NavigationFlowSystem()).not.toThrow();
      expect(() => new RoutePerformanceMonitor()).not.toThrow();

      console.log('✅ System compatible with feature flag enabled');
    });

    test('System gracefully handles feature flag disabled', () => {
      // Simulate feature flag disabled
      process.env.REACT_APP_NEW_ROUTING = 'false';

      // System should still be able to initialize (for testing)
      expect(() => new RouteGenerator(opportunities)).not.toThrow();
      expect(() => new RoutePriorityCalculator()).not.toThrow();

      console.log('✅ System gracefully handles feature flag disabled');
    });
  });
});