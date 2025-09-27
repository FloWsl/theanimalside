/**
 * Route Configuration Design Validation Tests
 *
 * Validates the type safety, completeness, and correctness of the
 * route configuration system design.
 */

import {
  RouteDefinition,
  RouteGenerationContext,
  isValidRouteDefinition,
  isHighTrafficRoute,
  generateRouteId,
  HIGH_TRAFFIC_COUNTRIES,
  HIGH_TRAFFIC_ANIMALS,
  HIGH_TRAFFIC_COMBINATIONS,
  PERFORMANCE_TARGETS,
  DEFAULT_PERFORMANCE_CONFIG
} from '../RouteDefinition';
import RouteGenerator from '../RouteGenerator';
import RoutePriorityCalculator from '../RoutePriorityCalculator';

// Mock data for testing
const mockOpportunities = [
  {
    id: '1',
    title: 'Sea Turtle Conservation Costa Rica',
    location: { country: 'Costa Rica', region: 'Guanacaste' },
    animalTypes: ['Sea Turtles', 'Marine Life'],
    organizationSlug: 'sea-turtle-conservancy-costa-rica'
  },
  {
    id: '2',
    title: 'Elephant Sanctuary Thailand',
    location: { country: 'Thailand', region: 'Chiang Mai' },
    animalTypes: ['Elephants', 'Asian Elephants'],
    organizationSlug: 'elephant-nature-park-thailand'
  },
  {
    id: '3',
    title: 'Lion Conservation South Africa',
    location: { country: 'South Africa', region: 'Western Cape' },
    animalTypes: ['Lions', 'Big Cats'],
    organizationSlug: 'african-lion-safari-south-africa'
  }
];

const mockOrganizations = [
  {
    id: '1',
    slug: 'sea-turtle-conservancy-costa-rica',
    name: 'Sea Turtle Conservancy Costa Rica'
  },
  {
    id: '2',
    slug: 'elephant-nature-park-thailand',
    name: 'Elephant Nature Park Thailand'
  }
];

const mockContext: RouteGenerationContext = {
  opportunities: mockOpportunities,
  organizations: mockOrganizations,
  highTrafficRoutes: ['/volunteer-costa-rica', '/lions-volunteer'],
  validCombinations: [
    { animal: 'sea-turtles', country: 'costa-rica' },
    { animal: 'elephants', country: 'thailand' },
    { animal: 'lions', country: 'south-africa' }
  ]
};

describe('Route Configuration Design', () => {
  describe('Type Safety Validation', () => {
    test('All route definitions are type-safe', () => {
      const generator = new RouteGenerator(mockContext);
      const result = generator.generateAllRoutes();

      expect(result.routes).toHaveLength(22); // Based on Phase 1: 25 total - 3 legacy
      expect(result.errors).toHaveLength(0);

      // Validate each route is properly typed
      result.routes.forEach(route => {
        expect(isValidRouteDefinition(route)).toBe(true);
        expect(route).toHaveProperty('id');
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('component');
        expect(route).toHaveProperty('type');
        expect(route).toHaveProperty('priority');
        expect(route).toHaveProperty('seo');
        expect(route).toHaveProperty('performance');
        expect(route).toHaveProperty('navigation');
      });
    });

    test('Route categories cover all use cases', () => {
      const generator = new RouteGenerator(mockContext);
      const result = generator.generateAllRoutes();

      const categories = result.routes.map(r => r.navigation.category);
      const uniqueCategories = [...new Set(categories)];

      expect(uniqueCategories).toContain('core');
      expect(uniqueCategories).toContain('country');
      expect(uniqueCategories).toContain('animal');
      expect(uniqueCategories).toContain('combined');
      expect(uniqueCategories).toContain('organization');
      expect(uniqueCategories).toContain('system');
    });

    test('All required metadata is present', () => {
      const generator = new RouteGenerator(mockContext);
      const result = generator.generateAllRoutes();

      result.routes.forEach(route => {
        // SEO metadata validation
        expect(route.seo).toHaveProperty('title');
        expect(route.seo).toHaveProperty('description');
        expect(route.seo).toHaveProperty('keywords');
        expect(route.seo).toHaveProperty('priority');
        expect(route.seo).toHaveProperty('changefreq');

        // Performance metadata validation
        expect(route.performance).toHaveProperty('preload');
        expect(route.performance).toHaveProperty('cacheStrategy');
        expect(route.performance).toHaveProperty('bundleSplit');
        expect(route.performance).toHaveProperty('maxResolutionTime');

        // Navigation metadata validation
        expect(route.navigation).toHaveProperty('category');
        expect(route.navigation).toHaveProperty('enabledFlows');
        expect(route.navigation).toHaveProperty('analyticsEvent');
      });
    });
  });

  describe('Performance Configuration', () => {
    test('Performance targets are realistic and measurable', () => {
      expect(PERFORMANCE_TARGETS.CRITICAL_RESOLUTION_TIME).toBeLessThan(50);
      expect(PERFORMANCE_TARGETS.VALIDATION_TIME).toBeLessThan(5);
      expect(PERFORMANCE_TARGETS.BUNDLE_SIZE_LIMIT).toBeGreaterThan(0);
      expect(PERFORMANCE_TARGETS.MEMORY_LIMIT).toBeGreaterThan(0);
    });

    test('Default performance configs match route priorities', () => {
      expect(DEFAULT_PERFORMANCE_CONFIG.critical.maxResolutionTime)
        .toBe(PERFORMANCE_TARGETS.CRITICAL_RESOLUTION_TIME);
      expect(DEFAULT_PERFORMANCE_CONFIG.high.maxResolutionTime)
        .toBe(PERFORMANCE_TARGETS.HIGH_RESOLUTION_TIME);

      // Critical routes should have aggressive caching
      expect(DEFAULT_PERFORMANCE_CONFIG.critical.cacheStrategy).toBe('aggressive');
      expect(DEFAULT_PERFORMANCE_CONFIG.critical.preload).toBe('immediate');

      // Low priority routes should be minimal
      expect(DEFAULT_PERFORMANCE_CONFIG.low.preload).toBe('none');
      expect(DEFAULT_PERFORMANCE_CONFIG.low.cacheStrategy).toBe('minimal');
    });
  });

  describe('High Traffic Route Identification', () => {
    test('High traffic countries are correctly identified', () => {
      expect(HIGH_TRAFFIC_COUNTRIES).toContain('costa-rica');
      expect(HIGH_TRAFFIC_COUNTRIES).toContain('thailand');
      expect(HIGH_TRAFFIC_COUNTRIES).toContain('south-africa');
    });

    test('High traffic animals are correctly identified', () => {
      expect(HIGH_TRAFFIC_ANIMALS).toContain('lions');
      expect(HIGH_TRAFFIC_ANIMALS).toContain('elephants');
      expect(HIGH_TRAFFIC_ANIMALS).toContain('sea-turtles');
    });

    test('isHighTrafficRoute function works correctly', () => {
      expect(isHighTrafficRoute('/volunteer-costa-rica')).toBe(true);
      expect(isHighTrafficRoute('/lions-volunteer')).toBe(true);
      expect(isHighTrafficRoute('/volunteer-costa-rica/sea-turtles')).toBe(true);
      expect(isHighTrafficRoute('/sea-turtles-volunteer/costa-rica')).toBe(true);

      expect(isHighTrafficRoute('/volunteer-unknown-country')).toBe(false);
      expect(isHighTrafficRoute('/unknown-animal-volunteer')).toBe(false);
    });
  });

  describe('Route ID Generation', () => {
    test('generateRouteId creates unique, readable IDs', () => {
      expect(generateRouteId('/', 'static')).toBe('static-home');
      expect(generateRouteId('/volunteer-costa-rica', 'static')).toBe('static-volunteer-costa-rica');
      expect(generateRouteId('/volunteer-:country', 'dynamic')).toBe('dynamic-volunteer-country');
      expect(generateRouteId('/:animal-volunteer/:country', 'dynamic')).toBe('dynamic-animal-volunteer-country');
      expect(generateRouteId('*', 'system')).toBe('system-catchall');
    });

    test('Route IDs are unique across all generated routes', () => {
      const generator = new RouteGenerator(mockContext);
      const result = generator.generateAllRoutes();

      const routeIds = result.routes.map(r => r.id);
      const uniqueIds = new Set(routeIds);

      expect(uniqueIds.size).toBe(routeIds.length); // No duplicates
    });
  });

  describe('Route Validation Rules', () => {
    test('Dynamic routes have appropriate validation rules', () => {
      const generator = new RouteGenerator(mockContext);
      const result = generator.generateAllRoutes();

      const dynamicRoutes = result.routes.filter(r => r.type === 'dynamic');

      dynamicRoutes.forEach(route => {
        if (route.path.includes(':')) {
          expect(route.validation).toBeDefined();
          expect(route.validation.length).toBeGreaterThan(0);

          route.validation.forEach(rule => {
            expect(rule).toHaveProperty('parameter');
            expect(rule).toHaveProperty('validator');
            expect(rule).toHaveProperty('required');
          });
        }
      });
    });

    test('Combined routes have combination validation', () => {
      const generator = new RouteGenerator(mockContext);
      const result = generator.generateAllRoutes();

      const combinedRoutes = result.routes.filter(r =>
        r.navigation.category === 'combined' && r.type === 'dynamic'
      );

      combinedRoutes.forEach(route => {
        const hasCombinationValidation = route.validation?.some(rule =>
          rule.validator === 'combination'
        );
        expect(hasCombinationValidation).toBe(true);
      });
    });
  });
});

describe('Data-Driven Route Generation', () => {
  test('Generates correct number of country routes', () => {
    const generator = new RouteGenerator(mockContext);
    const result = generator.generateAllRoutes();

    // Should generate static routes for high-traffic countries + 1 dynamic route
    const countryRoutes = result.routes.filter(r => r.navigation.category === 'country');

    // 3 high-traffic static routes + 1 dynamic route
    expect(countryRoutes.length).toBe(4);
  });

  test('Generates correct number of animal routes', () => {
    const generator = new RouteGenerator(mockContext);
    const result = generator.generateAllRoutes();

    // Should generate static routes for high-traffic animals + 1 dynamic route
    const animalRoutes = result.routes.filter(r => r.navigation.category === 'animal');

    // 3 high-traffic static routes + 3 conservation routes + 1 dynamic route
    expect(animalRoutes.length).toBe(7);
  });

  test('All generated routes have required metadata', () => {
    const generator = new RouteGenerator(mockContext);
    const result = generator.generateAllRoutes();

    result.routes.forEach(route => {
      expect(route.id).toBeTruthy();
      expect(route.path).toBeTruthy();
      expect(route.component).toBeTruthy();
      expect(route.seo).toBeDefined();
      expect(route.performance).toBeDefined();
      expect(route.navigation).toBeDefined();
    });
  });

  test('Route generation completes within performance target', () => {
    const generator = new RouteGenerator(mockContext);

    const startTime = performance.now();
    const result = generator.generateAllRoutes();
    const endTime = performance.now();

    const generationTime = endTime - startTime;
    expect(generationTime).toBeLessThan(10); // Target: <10ms
    expect(result.errors).toHaveLength(0);
  });

  test('Generated routes maintain data consistency', () => {
    const generator = new RouteGenerator(mockContext);
    const result = generator.generateAllRoutes();

    // Check that country routes reference actual countries from opportunities
    const countryRoutes = result.routes.filter(r =>
      r.navigation.category === 'country' && r.type === 'static'
    );

    countryRoutes.forEach(route => {
      const countryFromPath = route.path.replace('/volunteer-', '');
      const hasOpportunities = mockOpportunities.some(opp =>
        opp.location.country.toLowerCase().replace(' ', '-') === countryFromPath
      );
      expect(hasOpportunities).toBe(true);
    });
  });
});

describe('Route Priority Algorithm', () => {
  test('Static routes come before dynamic routes', () => {
    const calculator = new RoutePriorityCalculator();
    const routes: RouteDefinition[] = [
      {
        id: 'dynamic-test',
        path: '/volunteer-:country',
        component: 'DynamicCountryPage',
        type: 'dynamic',
        priority: 'high',
        dataSource: 'opportunities',
        seo: { title: 'Test', description: 'Test', keywords: [], priority: 0.5, changefreq: 'weekly' },
        performance: DEFAULT_PERFORMANCE_CONFIG.high,
        navigation: { category: 'country', enabledFlows: [], contextPreservation: true, analyticsEvent: 'test', breadcrumbGeneration: 'auto' }
      },
      {
        id: 'static-test',
        path: '/volunteer-costa-rica',
        component: 'CountryPage',
        type: 'static',
        priority: 'high',
        dataSource: 'opportunities',
        seo: { title: 'Test', description: 'Test', keywords: [], priority: 0.5, changefreq: 'weekly' },
        performance: DEFAULT_PERFORMANCE_CONFIG.high,
        navigation: { category: 'country', enabledFlows: [], contextPreservation: true, analyticsEvent: 'test', breadcrumbGeneration: 'auto' }
      }
    ];

    const result = calculator.calculateOptimalOrder(routes);
    expect(result.orderedRoutes[0].type).toBe('static');
    expect(result.orderedRoutes[1].type).toBe('dynamic');
  });

  test('More specific paths come first', () => {
    const calculator = new RoutePriorityCalculator();
    const routes: RouteDefinition[] = [
      {
        id: 'less-specific',
        path: '/volunteer-:country',
        component: 'DynamicCountryPage',
        type: 'dynamic',
        priority: 'medium',
        dataSource: 'opportunities',
        seo: { title: 'Test', description: 'Test', keywords: [], priority: 0.5, changefreq: 'weekly' },
        performance: DEFAULT_PERFORMANCE_CONFIG.medium,
        navigation: { category: 'country', enabledFlows: [], contextPreservation: true, analyticsEvent: 'test', breadcrumbGeneration: 'auto' }
      },
      {
        id: 'more-specific',
        path: '/volunteer-:country/:animal',
        component: 'CombinedPage',
        type: 'dynamic',
        priority: 'medium',
        dataSource: 'opportunities',
        seo: { title: 'Test', description: 'Test', keywords: [], priority: 0.5, changefreq: 'weekly' },
        performance: DEFAULT_PERFORMANCE_CONFIG.medium,
        navigation: { category: 'combined', enabledFlows: [], contextPreservation: true, analyticsEvent: 'test', breadcrumbGeneration: 'auto' }
      }
    ];

    const result = calculator.calculateOptimalOrder(routes);
    expect(result.orderedRoutes[0].path).toBe('/volunteer-:country/:animal');
    expect(result.orderedRoutes[1].path).toBe('/volunteer-:country');
  });

  test('Catch-all route is always last', () => {
    const generator = new RouteGenerator(mockContext);
    const generationResult = generator.generateAllRoutes();

    const calculator = new RoutePriorityCalculator();
    const result = calculator.calculateOptimalOrder(generationResult.routes);

    const lastRoute = result.orderedRoutes[result.orderedRoutes.length - 1];
    expect(lastRoute.path).toBe('*');
  });

  test('Home page route is first', () => {
    const generator = new RouteGenerator(mockContext);
    const generationResult = generator.generateAllRoutes();

    const calculator = new RoutePriorityCalculator();
    const result = calculator.calculateOptimalOrder(generationResult.routes);

    const firstRoute = result.orderedRoutes[0];
    expect(firstRoute.path).toBe('/');
  });

  test('Organization routes come after other dynamic routes', () => {
    const generator = new RouteGenerator(mockContext);
    const generationResult = generator.generateAllRoutes();

    const calculator = new RoutePriorityCalculator();
    const result = calculator.calculateOptimalOrder(generationResult.routes);

    const orgRouteIndex = result.orderedRoutes.findIndex(r => r.path === '/:orgSlug');
    const otherDynamicRoutes = result.orderedRoutes.filter(r =>
      r.type === 'dynamic' && r.path !== '/:orgSlug'
    );

    // Organization route should come after other dynamic routes
    otherDynamicRoutes.forEach(route => {
      const routeIndex = result.orderedRoutes.findIndex(r => r.id === route.id);
      expect(routeIndex).toBeLessThan(orgRouteIndex);
    });
  });
});

describe('Route Architecture Statistics', () => {
  test('Generated statistics are accurate', () => {
    const generator = new RouteGenerator(mockContext);
    const result = generator.generateAllRoutes();

    expect(result.statistics.total).toBe(result.routes.length);

    const actualByType = result.routes.reduce((acc, route) => {
      acc[route.type] = (acc[route.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(result.statistics.byType).toEqual(actualByType);

    const actualByCategory = result.routes.reduce((acc, route) => {
      acc[route.navigation.category] = (acc[route.navigation.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(result.statistics.byCategory).toEqual(actualByCategory);
  });

  test('Validation rules are counted correctly', () => {
    const generator = new RouteGenerator(mockContext);
    const result = generator.generateAllRoutes();

    const actualValidationRules = result.routes.reduce((sum, route) =>
      sum + (route.validation?.length || 0), 0
    );

    expect(result.statistics.validationRules).toBe(actualValidationRules);
  });
});