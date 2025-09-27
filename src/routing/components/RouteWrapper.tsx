// src/routing/components/RouteWrapper.tsx
// IMPLEMENTATION TARGET: Route validation and context management

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { RouteDefinition } from '../core/RouteDefinition';
import { RouteValidationEngine, ValidationResult } from '../validation/RouteValidationEngine';
import { useRouteAnalytics } from '../../utils/routeAnalytics';
import { motion } from 'framer-motion';

interface RouteWrapperProps {
  route: RouteDefinition;
  validator: RouteValidationEngine;
  children: React.ReactNode;
}

export const RouteWrapper: React.FC<RouteWrapperProps> = ({
  route,
  validator,
  children
}) => {
  const params = useParams();
  const location = useLocation();
  const { trackRouteView, trackRouteValidation } = useRouteAnalytics();

  const [validationState, setValidationState] = useState<{
    isValidating: boolean;
    result: ValidationResult | null;
  }>({
    isValidating: true,
    result: null
  });

  // Validate route when parameters change
  useEffect(() => {
    const validateRoute = async () => {
      setValidationState({ isValidating: true, result: null });

      try {
        const startTime = performance.now();
        const result = await validator.validateRoute(route.path, params);
        const validationTime = performance.now() - startTime;

        // Track validation performance
        trackRouteValidation(route.id, result.isValid, validationTime);

        setValidationState({
          isValidating: false,
          result
        });

        // Track successful route views
        if (result.isValid) {
          trackRouteView(route.id, location.pathname, params);
        }

      } catch (error) {
        console.error(`🚨 Route validation error for ${route.id}:`, error);
        setValidationState({
          isValidating: false,
          result: {
            isValid: false,
            errors: [{ field: 'system', message: 'Validation system error', severity: 'error' }],
            suggestions: [],
            performance: { validationTime: 0, cacheHit: false, validationSteps: 0 }
          }
        });
      }
    };

    // Only validate dynamic routes
    if (route.validation || route.path.includes(':')) {
      validateRoute();
    } else {
      // Static routes are always valid
      setValidationState({
        isValidating: false,
        result: {
          isValid: true,
          errors: [],
          suggestions: [],
          performance: { validationTime: 0, cacheHit: true, validationSteps: 1 }
        }
      });
      trackRouteView(route.id, location.pathname, params);
    }
  }, [route, params, location.pathname, validator, trackRouteView, trackRouteValidation]);

  // Apply SEO metadata
  useEffect(() => {
    if (validationState.result?.isValid) {
      // Update document title
      document.title = route.seo.title;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', route.seo.description);

      // Update canonical URL if specified
      if (route.seo.canonical) {
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', route.seo.canonical);
      }
    }
  }, [route.seo, validationState.result]);

  // Show loading state during validation
  if (validationState.isValidating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-soft-cream"
      >
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest/70 text-sm">Validating route...</p>
        </div>
      </motion.div>
    );
  }

  // Handle invalid routes
  if (!validationState.result?.isValid) {
    console.warn(`🚨 Invalid route: ${route.path}`, validationState.result?.reason);
    return <Navigate to="/404" replace state={{
      attemptedRoute: location.pathname,
      reason: validationState.result?.reason
    }} />;
  }

  // Render valid route with performance optimizations
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="route-wrapper"
      data-route-id={route.id}
      data-route-type={route.type}
    >
      {children}
    </motion.div>
  );
};

export default RouteWrapper;