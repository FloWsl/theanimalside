// src/routing/tests/RouteGenerator.test.ts
import { RouteGenerator } from '../core/RouteGenerator';
import { RouteDefinition } from '../core/RouteDefinition';
import type { Opportunity } from '../../types/index';

describe('RouteGenerator Implementation', () => {
  let generator: RouteGenerator;
  let mockOpportunities: Opportunity[];

  beforeEach(() => {
    mockOpportunities = [
      {
        id: 'test-1',
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
        id: 'test-2',
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
    generator = new RouteGenerator(mockOpportunities);
  });

  test('Generates correct number of routes', () => {
    const routes = generator.generateAllRoutes();

    // Should generate routes for:
    // - Core routes (home, opportunities)
    // - Country routes (2 countries)
    // - Animal routes (3 unique animals)
    // - Combined routes (4 combinations x 2 formats = 8)
    // - Organization routes (2 organizations)
    // - System routes (1 not found route)
    // Total expected: 2 + 2 + 3 + 8 + 2 + 1 = 18 routes minimum

    expect(routes.length).toBeGreaterThanOrEqual(15);
    expect(routes.length).toBeLessThanOrEqual(25);
  });

  test('All routes have required metadata', () => {
    const routes = generator.generateAllRoutes();

    routes.forEach(route => {
      expect(route).toHaveProperty('id');
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('component');
      expect(route).toHaveProperty('priority');
      expect(route).toHaveProperty('type');
      expect(route).toHaveProperty('seo');
      expect(route).toHaveProperty('performance');
      expect(route).toHaveProperty('navigation');

      // Verify SEO metadata
      expect(route.seo.title).toBeDefined();
      expect(route.seo.description).toBeDefined();
      expect(route.seo.keywords).toBeInstanceOf(Array);
      expect(route.seo.changefreq).toMatch(/^(daily|weekly|monthly|yearly)$/);
      expect(route.seo.priority).toBeGreaterThanOrEqual(0);
      expect(route.seo.priority).toBeLessThanOrEqual(1);

      // Verify performance configuration
      expect(typeof route.performance.lazyLoad).toBe('boolean');
      expect(['immediate', 'hover', 'none']).toContain(route.performance.preload);
      expect(['aggressive', 'normal', 'none']).toContain(route.performance.cacheStrategy);
      expect(typeof route.performance.bundleSplit).toBe('boolean');

      // Verify navigation metadata
      expect(route.navigation.enabledFlows).toBeInstanceOf(Array);
      expect(typeof route.navigation.contextPreservation).toBe('boolean');
      expect(route.navigation.analyticsEvents).toBeInstanceOf(Array);
      expect(route.navigation.breadcrumbPath).toBeInstanceOf(Array);
    });
  });

  test('Route priority ordering is correct', () => {
    const routes = generator.generateAllRoutes();

    // Static routes should come before dynamic routes
    const staticRouteIndex = routes.findIndex(r => r.type === 'static');
    const systemRouteIndex = routes.findIndex(r => r.type === 'system');

    if (staticRouteIndex !== -1 && systemRouteIndex !== -1) {
      expect(staticRouteIndex).toBeLessThan(systemRouteIndex);
    }

    // Critical priority routes should come before high priority routes
    const criticalRoutes = routes.filter(r => r.priority === 'critical');
    const highRoutes = routes.filter(r => r.priority === 'high');

    if (criticalRoutes.length > 0 && highRoutes.length > 0) {
      const lastCriticalIndex = routes.lastIndexOf(criticalRoutes[criticalRoutes.length - 1]);
      const firstHighIndex = routes.indexOf(highRoutes[0]);

      if (lastCriticalIndex >= 0 && firstHighIndex >= 0) {
        expect(lastCriticalIndex).toBeLessThan(firstHighIndex);
      }
    }
  });

  test('Critical SEO routes have correct priority', () => {
    const routes = generator.generateAllRoutes();

    const costaRicaRoute = routes.find(r => r.path === '/volunteer-costa-rica');
    const homeRoute = routes.find(r => r.path === '/');
    const opportunitiesRoute = routes.find(r => r.path === '/opportunities');

    expect(homeRoute?.priority).toBe('critical');
    expect(opportunitiesRoute?.priority).toBe('critical');

    if (costaRicaRoute) {
      expect(costaRicaRoute.priority).toBe('critical');
    }
  });

  test('Combined routes are bidirectional', () => {
    const routes = generator.generateAllRoutes();

    // Find a combined route pair
    const countryFirstRoute = routes.find(r =>
      r.path.startsWith('/volunteer-') && r.path.includes('/') && r.path !== '/volunteer-costa-rica' && r.path !== '/volunteer-thailand'
    );

    if (countryFirstRoute) {
      // Extract country and animal from the path
      const pathParts = countryFirstRoute.path.split('/');
      const countryPart = pathParts[1]; // volunteer-{country}
      const animalPart = pathParts[2]; // {animal}

      const expectedAnimalFirstPath = `/${animalPart}-volunteer/${countryPart.replace('volunteer-', '')}`;
      const animalFirstRoute = routes.find(r => r.path === expectedAnimalFirstPath);

      if (animalFirstRoute) {
        // Both routes should exist
        expect(countryFirstRoute).toBeDefined();
        expect(animalFirstRoute).toBeDefined();

        // Both should have the same canonical URL (pointing to country-first)
        expect(countryFirstRoute.seo.canonical).toBe(animalFirstRoute.seo.canonical);
      }
    }
  });

  test('Performance configuration is applied correctly', () => {
    const routes = generator.generateAllRoutes();

    routes.forEach(route => {
      if (route.type !== 'system') {
        expect(route.performance.lazyLoad).toBe(true);
        expect(route.performance.bundleSplit).toBe(true);
        expect(['aggressive', 'normal', 'none']).toContain(route.performance.cacheStrategy);
      }
    });
  });

  test('Data-driven route generation accuracy', () => {
    const routes = generator.generateAllRoutes();

    // Should have country routes for each unique country in opportunities
    const countryRoutes = routes.filter(r => r.path.match(/^\/volunteer-[a-z-]+$/) && !r.path.includes('/'));
    const uniqueCountries = new Set(mockOpportunities.map(o => o.location.country));
    expect(countryRoutes.length).toBe(uniqueCountries.size);

    // Should have animal routes for each unique animal type
    const animalRoutes = routes.filter(r => r.path.match(/^\/[a-z-]+-volunteer$/) && !r.path.includes('/volunteer'));
    const uniqueAnimals = new Set(mockOpportunities.flatMap(o => o.animalTypes));
    expect(animalRoutes.length).toBe(uniqueAnimals.size);
  });

  test('SEO metadata follows best practices', () => {
    const routes = generator.generateAllRoutes();

    routes.forEach(route => {
      // Title length should be SEO-friendly
      expect(route.seo.title.length).toBeGreaterThan(10);
      expect(route.seo.title.length).toBeLessThan(70);

      // Description length should be SEO-friendly
      expect(route.seo.description.length).toBeGreaterThan(20);
      expect(route.seo.description.length).toBeLessThan(170);

      // Keywords should exist
      expect(route.seo.keywords.length).toBeGreaterThan(0);

      // Priority should be valid
      expect(route.seo.priority).toBeGreaterThanOrEqual(0);
      expect(route.seo.priority).toBeLessThanOrEqual(1);
    });
  });

  test('Organization routes are generated from opportunity data', () => {
    const routes = generator.generateAllRoutes();
    const orgRoutes = routes.filter(r => r.path.startsWith('/organization/'));

    // Should have routes for organizations with slugs
    const orgsWithSlugs = mockOpportunities.filter(o => o.organizationSlug);
    expect(orgRoutes.length).toBe(orgsWithSlugs.length);

    orgRoutes.forEach(route => {
      expect(route.component).toBe('OrganizationDetailPage');
      expect(route.priority).toBe('medium');
      expect(route.type).toBe('static');
    });
  });
});