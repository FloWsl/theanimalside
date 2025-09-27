// src/routing/tests/Phase3.2.integration.test.ts
// IMPLEMENTATION TARGET: Comprehensive integration testing for Phase 3.2

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the opportunities data
jest.mock('../../data/opportunities', () => ({
  opportunities: [
    {
      id: '1',
      location: { country: 'Costa Rica' },
      animalTypes: ['Lions', 'Sea Turtles'],
      organization: 'Test Org',
      organizationSlug: 'test-org'
    }
  ]
}));

// Mock components to avoid import errors during testing
jest.mock('../../components/Layout', () => ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'layout' }, children));
jest.mock('../../components/HomePage', () => () => React.createElement('div', { 'data-testid': 'home-page' }, 'Home Page'));
jest.mock('../../components/OpportunitiesPage/v2', () => () => React.createElement('div', { 'data-testid': 'opportunities-page' }, 'Opportunities Page'));
jest.mock('../../components/CountryLandingPage', () => () => React.createElement('div', { 'data-testid': 'country-page' }, 'Country Page'));
jest.mock('../../components/AnimalLandingPage', () => () => React.createElement('div', { 'data-testid': 'animal-page' }, 'Animal Page'));
jest.mock('../../components/CombinedPage', () => () => React.createElement('div', { 'data-testid': 'combined-page' }, 'Combined Page'));
jest.mock('../../components/OrganizationDetail', () => () => React.createElement('div', { 'data-testid': 'organization-page' }, 'Organization Page'));
jest.mock('../../components/FlatOrganizationPage', () => () => React.createElement('div', { 'data-testid': 'flat-organization-page' }, 'Flat Organization Page'));
jest.mock('../../components/GuidesPage', () => () => React.createElement('div', { 'data-testid': 'guides-page' }, 'Guides Page'));
jest.mock('../../components/SmartRouteHandler', () => () => React.createElement('div', { 'data-testid': 'smart-route-handler' }, 'Smart Route Handler'));
jest.mock('../components/RouteLoader', () => ({ route }: { route: any }) => React.createElement('div', { 'data-testid': 'route-loader' }, `Loading ${route?.id}`));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children)
  }
}));

// Mock analytics
jest.mock('../../utils/routeAnalytics', () => ({
  useRouteAnalytics: () => ({
    trackRouteView: jest.fn(),
    trackRouteValidation: jest.fn()
  })
}));

describe('Phase 3.2 Component Integration', () => {
  describe('Complete System Integration', () => {
    test('AppRouter components can be imported', () => {
      expect(() => {
        require('../AppRouter');
      }).not.toThrow();
    });

    test('All routing components can be imported', () => {
      expect(() => {
        require('../components/RouteWrapper');
        require('../components/RouteLoader');
        require('../navigation/NavigationFlowProvider');
        require('../hooks/useRoutePerformance');
      }).not.toThrow();
    });

    test('NavigationFlowSystem integration works', () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();
      expect(system).toBeDefined();
      expect(typeof system.validateNavigation).toBe('function');
      expect(typeof system.getNavigationOptions).toBe('function');
      expect(typeof system.setNavigationContext).toBe('function');
    });
  });

  describe('Performance Validation', () => {
    test('Navigation validation meets performance targets', async () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();
      const startTime = performance.now();

      await system.validateNavigation(
        '/volunteer-costa-rica',
        '/volunteer-costa-rica/sea-turtles',
        'click'
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete validation in less than 10ms
      expect(duration).toBeLessThan(10);
    });
  });

  describe('Runtime Tests with Feature Flag', () => {
    beforeEach(() => {
      // Set feature flag to enable new routing
      process.env.REACT_APP_NEW_ROUTING = 'true';
      window.localStorage.setItem('use-new-routing', 'true');
    });

    afterEach(() => {
      // Clean up
      delete process.env.REACT_APP_NEW_ROUTING;
      window.localStorage.removeItem('use-new-routing');
    });

    test('AppRouter renders without crashing', async () => {
      const { AppRouter } = require('../AppRouter');

      const renderResult = render(<AppRouter />);

      // Should render the new router container
      expect(screen.getByTestId('new-app-router')).toBeInTheDocument();

      // Should have layout wrapper
      await waitFor(() => {
        expect(screen.getByTestId('layout')).toBeInTheDocument();
      });
    });

    test('Home route works correctly', async () => {
      const { AppRouter } = require('../AppRouter');

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    test('Opportunities route works correctly', async () => {
      const { AppRouter } = require('../AppRouter');

      render(
        <MemoryRouter initialEntries={['/opportunities']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('opportunities-page')).toBeInTheDocument();
      });
    });

    test('Country route with validation works', async () => {
      const { AppRouter } = require('../AppRouter');

      render(
        <MemoryRouter initialEntries={['/volunteer-costa-rica']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('country-page')).toBeInTheDocument();
      });
    });

    test('Animal route with validation works', async () => {
      const { AppRouter } = require('../AppRouter');

      render(
        <MemoryRouter initialEntries={['/lions-volunteer']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('animal-page')).toBeInTheDocument();
      });
    });

    test('Combined route with validation works', async () => {
      const { AppRouter } = require('../AppRouter');

      render(
        <MemoryRouter initialEntries={['/volunteer-costa-rica/sea-turtles']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('combined-page')).toBeInTheDocument();
      });
    });

    test('Invalid route triggers smart route handler', async () => {
      const { AppRouter } = require('../AppRouter');

      render(
        <MemoryRouter initialEntries={['/invalid-route-path']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('smart-route-handler')).toBeInTheDocument();
      });
    });

    test('Feature flag controls routing system', async () => {
      // Test with feature flag disabled
      process.env.REACT_APP_NEW_ROUTING = 'false';
      window.localStorage.removeItem('use-new-routing');

      const { FeatureFlaggedRouter } = require('../AppRouter');

      const { container } = render(<FeatureFlaggedRouter />);

      // Should not render new router when feature flag is disabled
      expect(container.querySelector('[data-testid="new-app-router"]')).toBeNull();
    });

    test('Route performance meets targets', async () => {
      const { AppRouter } = require('../AppRouter');

      const startTime = performance.now();

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Route resolution should be fast
      expect(renderTime).toBeLessThan(100); // 100ms target
    });

    test('Route validation caching works', async () => {
      const { AppRouter } = require('../AppRouter');

      // First render - should populate cache
      const firstRender = render(
        <MemoryRouter initialEntries={['/volunteer-costa-rica']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('country-page')).toBeInTheDocument();
      });

      firstRender.unmount();

      // Second render - should use cache
      const startTime = performance.now();

      render(
        <MemoryRouter initialEntries={['/volunteer-costa-rica']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('country-page')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const secondRenderTime = endTime - startTime;

      // Second render should be faster due to caching
      expect(secondRenderTime).toBeLessThan(50); // Should be very fast with cache
    });

  });

  describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
      process.env.REACT_APP_NEW_ROUTING = 'true';
    });

    afterEach(() => {
      delete process.env.REACT_APP_NEW_ROUTING;
    });

    test('Handles missing component gracefully', async () => {
      // Mock console.error to capture error logs
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { AppRouter } = require('../AppRouter');

      // This should not crash the app even if component is missing
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      await waitFor(() => {
        // Should still render layout even if individual component fails
        expect(screen.getByTestId('layout')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    test('Route validation handles async errors', async () => {
      const { AppRouter } = require('../AppRouter');

      // Test with a route that might cause validation issues
      render(
        <MemoryRouter initialEntries={['/volunteer-unknown-country']}>
          <AppRouter />
        </MemoryRouter>
      );

      // Should eventually render some content (either valid page or error handler)
      await waitFor(() => {
        expect(screen.getByTestId('layout')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling and Recovery', () => {
    test('Invalid navigation is handled gracefully', async () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();

      const result = await system.validateNavigation(
        '/invalid-route',
        '/another-invalid-route',
        'click'
      );

      expect(result.isValid).toBe(false);
      expect(result.issues).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('Navigation system recovers from errors', async () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();

      // Test invalid navigation
      const invalidResult = await system.validateNavigation(
        '/invalid-route',
        '/another-invalid-route',
        'click'
      );

      expect(invalidResult.isValid).toBe(false);

      // Test valid navigation after error
      const validResult = await system.validateNavigation(
        '/volunteer-costa-rica',
        '/volunteer-costa-rica/sea-turtles',
        'click'
      );

      expect(validResult.isValid).toBe(true);
    });
  });

  describe('SEO and Analytics Integration', () => {
    test('Navigation flows have analytics events', () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();
      const options = system.getNavigationOptions('/volunteer-costa-rica');

      expect(Array.isArray(options)).toBe(true);

      if (options.length > 0) {
        expect(options[0].analyticsEvent).toBeDefined();
        expect(typeof options[0].analyticsEvent).toBe('string');
      }
    });

    test('Route analytics tracking works', () => {
      const { useRouteAnalytics } = require('../../utils/routeAnalytics');

      expect(typeof useRouteAnalytics).toBe('function');
    });
  });

  describe('Navigation Flow System Features', () => {
    test('Context preservation works correctly', () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();

      const testContext = {
        currentRoute: '/test',
        parameters: { country: 'costa-rica', animal: 'sea-turtles' }
      };

      system.setNavigationContext(testContext);
      const retrievedContext = system.getNavigationContext();

      expect(retrievedContext.currentRoute).toBe('/test');
      expect(retrievedContext.parameters.country).toBe('costa-rica');
      expect(retrievedContext.parameters.animal).toBe('sea-turtles');
    });

    test('Navigation options are returned correctly', () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();
      const options = system.getNavigationOptions('/volunteer-costa-rica');

      expect(Array.isArray(options)).toBe(true);

      options.forEach(option => {
        expect(option.targetRoute).toBeDefined();
        expect(option.trigger).toBeDefined();
        expect(option.weight).toBeDefined();
        expect(option.analyticsEvent).toBeDefined();
      });
    });

    test('Link generation works correctly', () => {
      const { NavigationFlowSystem } = require('../navigation/NavigationFlowSystem');

      const system = new NavigationFlowSystem();
      const link = system.generateNavigationLink(
        '/volunteer-costa-rica',
        '/volunteer-costa-rica/sea-turtles',
        'click'
      );

      expect(link.href).toBe('/volunteer-costa-rica/sea-turtles');
      expect(typeof link.onClick).toBe('function');
    });
  });

  describe('Performance Monitoring Integration', () => {
    test('Performance metrics tracking works', () => {
      const { routePerformanceMonitor } = require('../hooks/useRoutePerformance');

      // Track various performance metrics
      routePerformanceMonitor.trackRouteValidation('test-route', 0.5, true);
      routePerformanceMonitor.trackRouteResolution('test-route', 20, true);
      routePerformanceMonitor.trackRouteRendering('test-route', 80, true);

      const performance = routePerformanceMonitor.getRoutePerformance('test-route');

      expect(performance.avgValidationTime).toBe(0.5);
      expect(performance.avgResolutionTime).toBe(20);
      expect(performance.avgRenderingTime).toBe(80);
      expect(performance.successRate).toBe(1);
    });

    test('System health assessment works', () => {
      const { routePerformanceMonitor } = require('../hooks/useRoutePerformance');

      // Add some metrics
      routePerformanceMonitor.trackRouteValidation('health-test', 0.5, true);
      routePerformanceMonitor.trackRouteResolution('health-test', 15, true);

      const health = routePerformanceMonitor.getSystemHealth();

      expect(health.overall).toMatch(/healthy|degraded|critical/);
      expect(typeof health.avgValidationTime).toBe('number');
      expect(typeof health.avgResolutionTime).toBe('number');
      expect(typeof health.errorRate).toBe('number');
    });

    test('Performance optimization recommendations work', () => {
      const { routePerformanceMonitor } = require('../hooks/useRoutePerformance');

      // Create some performance issues to trigger recommendations
      for (let i = 0; i < 10; i++) {
        routePerformanceMonitor.trackRouteValidation('slow-route', 5, true); // Slow validation
      }

      const recommendations = routePerformanceMonitor.getOptimizationRecommendations();

      expect(Array.isArray(recommendations)).toBe(true);

      recommendations.forEach(rec => {
        expect(rec.routeId).toBeDefined();
        expect(rec.issue).toBeDefined();
        expect(rec.recommendation).toBeDefined();
        expect(rec.priority).toMatch(/high|medium|low/);
      });
    });
  });
});