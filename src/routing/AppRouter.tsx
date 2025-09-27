// src/routing/AppRouter.tsx
// IMPLEMENTATION TARGET: Clean implementation using Phase 2 architecture

import React, { Suspense, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RouteGenerator } from './core/RouteGenerator';
import { RoutePriorityCalculator } from './core/RoutePriorityCalculator';
import { RouteValidationEngine } from './validation/RouteValidationEngine';
import { opportunities } from '../data/opportunities';
import Layout from '../components/Layout';
import RouteWrapper from './components/RouteWrapper';
import RouteLoader from './components/RouteLoader';

// Feature flag for gradual rollout
const useNewRouting = () => {
  // Environment-based feature flag
  return process.env.REACT_APP_NEW_ROUTING === 'true' ||
         window.localStorage.getItem('use-new-routing') === 'true';
};

export const AppRouter: React.FC = () => {
  // Initialize routing system components
  const { orderedRoutes, routeValidator } = useMemo(() => {
    const generator = new RouteGenerator(opportunities);
    const calculator = new RoutePriorityCalculator();

    const allRoutes = generator.generateAllRoutes();
    const orderingResult = calculator.calculateOrder(allRoutes);
    const validator = new RouteValidationEngine(orderingResult.orderedRoutes, opportunities);

    // Log any critical conflicts (should be none due to Phase 2 validation)
    if (orderingResult.conflicts.length > 0) {
      console.error('🚨 Route conflicts detected:', orderingResult.conflicts);
    }

    return {
      orderedRoutes: orderingResult.orderedRoutes,
      routeValidator: validator
    };
  }, []);

  // Route component mapping
  const componentMap = useMemo(() => ({
    'HomePage': React.lazy(() => import('../components/HomePage')),
    'OpportunitiesPage': React.lazy(() => import('../components/OpportunitiesPage/v2')),
    'CountryLandingPage': React.lazy(() => import('../components/CountryLandingPage')),
    'AnimalLandingPage': React.lazy(() => import('../components/AnimalLandingPage')),
    'CombinedPage': React.lazy(() => import('../components/CombinedPage')),
    'OrganizationDetail': React.lazy(() => import('../components/OrganizationDetail')),
    'FlatOrganizationPage': React.lazy(() => import('../components/FlatOrganizationPage')),
    'GuidesPage': React.lazy(() => import('../components/GuidesPage')),
    'SmartRouteHandler': React.lazy(() => import('../components/SmartRouteHandler'))
  }), []);

  return (
    <div data-testid="new-app-router">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {orderedRoutes.map(route => {
            const Component = componentMap[route.component as keyof typeof componentMap];

            if (!Component) {
              console.error(`🚨 Component not found: ${route.component}`);
              return null;
            }

            return (
              <Route
                key={route.id}
                path={route.path}
                element={
                  <RouteWrapper
                    route={route}
                    validator={routeValidator}
                  >
                    <Suspense fallback={<RouteLoader route={route} />}>
                      <Component />
                    </Suspense>
                  </RouteWrapper>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
};

// Legacy router wrapper for feature flag rollout
export const FeatureFlaggedRouter: React.FC = () => {
  const shouldUseNewRouting = useNewRouting();

  if (shouldUseNewRouting) {
    return <AppRouter />;
  }

  // Import legacy App component
  const LegacyApp = React.lazy(() => import('../App'));

  return (
    <Suspense fallback={<RouteLoader route={{ id: 'legacy', component: 'LegacyApp' }} />}>
      <LegacyApp />
    </Suspense>
  );
};

export default FeatureFlaggedRouter;