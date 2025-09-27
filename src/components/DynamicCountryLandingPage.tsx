import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import CountryLandingPage from './CountryLandingPage';

/**
 * Dynamic Country Landing Page with route validation
 * Validates country routes against opportunities data and renders appropriate content
 */
const DynamicCountryLandingPage: React.FC = () => {
  const params = useParams<{ country: string }>();
  const { isValidCountryRoute } = useDynamicRoutes();

  // Extract country slug from route parameters
  const countrySlug = useMemo(() => {
    // Handle both volunteer-:country and explicit routes
    if (params.country) {
      return params.country;
    }

    // Fallback: extract from URL path for backward compatibility
    const pathname = window.location.pathname;
    if (pathname.startsWith('/volunteer-')) {
      return pathname.replace('/volunteer-', '');
    }

    return '';
  }, [params.country]);

  // Validate the country route
  const isValid = useMemo(() => {
    if (!countrySlug) return false;
    return isValidCountryRoute(countrySlug);
  }, [countrySlug, isValidCountryRoute]);

  // If route is invalid, redirect to 404 page
  if (!isValid) {
    return <Navigate to="/404" replace />;
  }

  // Render the existing CountryLandingPage component
  return <CountryLandingPage />;
};

export default DynamicCountryLandingPage;