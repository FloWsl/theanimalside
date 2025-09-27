// src/routing/tests/RoutePriorityCalculator.test.ts
import { RoutePriorityCalculator, RouteOrderingResult } from '../core/RoutePriorityCalculator';
import { RouteDefinition, SEOMetadata, PerformanceConfig, NavigationMetadata } from '../core/RouteDefinition';

describe('RoutePriorityCalculator Implementation', () => {
  let calculator: RoutePriorityCalculator;
  let testRoutes: RouteDefinition[];

  beforeEach(() => {
    calculator = new RoutePriorityCalculator();
    testRoutes = [
      // Static routes
      {
        id: 'country-costa-rica',
        path: '/volunteer-costa-rica',
        component: 'CountryLandingPage',
        type: 'static',
        priority: 'critical',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'combined-static',
        path: '/volunteer-costa-rica/sea-turtles',
        component: 'CombinedPage',
        type: 'static',
        priority: 'high',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'animal-lions',
        path: '/lions-volunteer',
        component: 'AnimalLandingPage',
        type: 'static',
        priority: 'critical',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      // Dynamic routes (if any)
      {
        id: 'country-dynamic',
        path: '/volunteer-:country',
        component: 'CountryLandingPage',
        type: 'dynamic',
        priority: 'medium',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'combined-dynamic',
        path: '/volunteer-:country/:animal',
        component: 'CombinedPage',
        type: 'dynamic',
        priority: 'medium',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      // System routes
      {
        id: 'org-catchall',
        path: '/:orgSlug',
        component: 'FlatOrganizationPage',
        type: 'system',
        priority: 'low',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'not-found',
        path: '*',
        component: 'NotFoundPage',
        type: 'system',
        priority: 'low',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      }
    ];
  });

  test('Static routes come before dynamic routes', () => {
    const result = calculator.calculateOrder(testRoutes);
    const orderedRoutes = result.orderedRoutes;

    const firstDynamicIndex = orderedRoutes.findIndex(r => r.type === 'dynamic');
    const lastStaticIndex = orderedRoutes.map((r, i) => r.type === 'static' ? i : -1)
      .filter(i => i !== -1)
      .pop();

    if (firstDynamicIndex !== -1 && lastStaticIndex !== undefined) {
      expect(lastStaticIndex).toBeLessThan(firstDynamicIndex);
    }
  });

  test('More specific paths come before less specific paths', () => {
    const result = calculator.calculateOrder(testRoutes);
    const orderedRoutes = result.orderedRoutes;

    const specificRoute = orderedRoutes.find(r => r.path === '/volunteer-costa-rica/sea-turtles');
    const generalRoute = orderedRoutes.find(r => r.path === '/volunteer-costa-rica');

    if (specificRoute && generalRoute) {
      const specificIndex = orderedRoutes.indexOf(specificRoute);
      const generalIndex = orderedRoutes.indexOf(generalRoute);
      expect(specificIndex).toBeLessThan(generalIndex);
    }
  });

  test('Critical priority routes come first', () => {
    const result = calculator.calculateOrder(testRoutes);
    const orderedRoutes = result.orderedRoutes;

    const criticalRoutes = orderedRoutes.filter(r => r.priority === 'critical');
    const highRoutes = orderedRoutes.filter(r => r.priority === 'high');

    if (criticalRoutes.length > 0 && highRoutes.length > 0) {
      const lastCriticalIndex = orderedRoutes.lastIndexOf(criticalRoutes[criticalRoutes.length - 1]);
      const firstHighIndex = orderedRoutes.indexOf(highRoutes[0]);
      expect(lastCriticalIndex).toBeLessThan(firstHighIndex);
    }
  });

  test('Catch-all route comes last', () => {
    const result = calculator.calculateOrder(testRoutes);
    const orderedRoutes = result.orderedRoutes;

    const catchAllRoute = orderedRoutes.find(r => r.path === '*');
    if (catchAllRoute) {
      expect(orderedRoutes.indexOf(catchAllRoute)).toBe(orderedRoutes.length - 1);
    }
  });

  test('Detects path overlap conflicts', () => {
    const conflictingRoutes: RouteDefinition[] = [
      {
        id: 'static-specific',
        path: '/volunteer-costa-rica',
        component: 'CountryLandingPage',
        type: 'static',
        priority: 'high',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'dynamic-general',
        path: '/volunteer-:country',
        component: 'CountryLandingPage',
        type: 'dynamic',
        priority: 'medium',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      }
    ];

    const result = calculator.calculateOrder(conflictingRoutes);
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.conflicts[0].conflictType).toBe('path-overlap');
  });

  test('Generates valid React Router JSX', () => {
    const result = calculator.calculateOrder(testRoutes.slice(0, 3)); // Use first 3 routes
    const jsx = calculator.generateReactRouterJSX(result.orderedRoutes);

    expect(jsx).toContain('<Routes>');
    expect(jsx).toContain('<Route path=');
    expect(jsx).toContain('</Routes>');
    expect(jsx).toContain('element=');
    expect(jsx).toContain('Suspense');
  });

  test('Warning for system routes not at end', () => {
    const testRoutesWithBadOrder: RouteDefinition[] = [
      {
        id: 'system-early',
        path: '/:orgSlug',
        component: 'FlatOrganizationPage',
        type: 'system',
        priority: 'low',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      ...testRoutes.slice(0, 3)
    ];

    const result = calculator.calculateOrder(testRoutesWithBadOrder);
    const systemWarnings = result.warnings.filter(w => w.warningType === 'performance');
    expect(systemWarnings.length).toBeGreaterThan(0);
  });

  test('Route health analysis provides useful insights', () => {
    const health = calculator.analyzeRouteHealth(testRoutes);

    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
    expect(health.issues).toBeInstanceOf(Array);
    expect(health.suggestions).toBeInstanceOf(Array);
  });

  test('Performance report includes comprehensive metrics', () => {
    const report = calculator.generatePerformanceReport(testRoutes);

    expect(report.totalRoutes).toBe(testRoutes.length);
    expect(report.staticRoutes).toBe(testRoutes.filter(r => r.type === 'static').length);
    expect(report.dynamicRoutes).toBe(testRoutes.filter(r => r.type === 'dynamic').length);
    expect(report.systemRoutes).toBe(testRoutes.filter(r => r.type === 'system').length);
    expect(typeof report.averageSpecificity).toBe('number');
    expect(report.mostSpecificRoute).toBeDefined();
    expect(report.leastSpecificRoute).toBeDefined();
  });

  test('Path specificity calculation works correctly', () => {
    const result = calculator.calculateOrder(testRoutes);

    // More specific path should have higher specificity score
    const specificPath = '/volunteer-costa-rica/sea-turtles';
    const generalPath = '/volunteer-costa-rica';
    const catchAllPath = '*';

    // This is tested indirectly through ordering
    const orderedRoutes = result.orderedRoutes;
    const specificRoute = orderedRoutes.find(r => r.path === specificPath);
    const generalRoute = orderedRoutes.find(r => r.path === generalPath);
    const catchAllRoute = orderedRoutes.find(r => r.path === catchAllPath);

    if (specificRoute && generalRoute) {
      const specificIndex = orderedRoutes.indexOf(specificRoute);
      const generalIndex = orderedRoutes.indexOf(generalRoute);
      expect(specificIndex).toBeLessThan(generalIndex);
    }

    if (catchAllRoute) {
      const catchAllIndex = orderedRoutes.indexOf(catchAllRoute);
      expect(catchAllIndex).toBe(orderedRoutes.length - 1);
    }
  });

  test('No conflicts or warnings for well-ordered routes', () => {
    const wellOrderedRoutes: RouteDefinition[] = [
      {
        id: 'home',
        path: '/',
        component: 'HomePage',
        type: 'static',
        priority: 'critical',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'opportunities',
        path: '/opportunities',
        component: 'OpportunitiesPage',
        type: 'static',
        priority: 'critical',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      },
      {
        id: 'not-found',
        path: '*',
        component: 'NotFoundPage',
        type: 'system',
        priority: 'low',
        seo: {} as SEOMetadata,
        performance: {} as PerformanceConfig,
        navigation: {} as NavigationMetadata
      }
    ];

    const result = calculator.calculateOrder(wellOrderedRoutes);
    const criticalConflicts = result.conflicts.filter(c => c.severity === 'critical');

    expect(criticalConflicts.length).toBe(0);
  });
});