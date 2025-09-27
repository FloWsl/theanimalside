import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import AnimalLandingPage from './AnimalLandingPage';

/**
 * Dynamic Animal Landing Page with route validation
 * Validates animal routes against opportunities data and renders appropriate content
 */
const DynamicAnimalLandingPage: React.FC = () => {
  const params = useParams<{ animal: string }>();
  const { isValidAnimalRoute } = useDynamicRoutes();

  // Extract animal slug from route parameters
  const animalSlug = useMemo(() => {
    // Handle both :animal-volunteer and explicit routes
    if (params.animal) {
      return params.animal;
    }

    // Fallback: extract from URL path for backward compatibility
    const pathname = window.location.pathname;
    if (pathname.includes('-volunteer')) {
      return pathname.replace('/', '').replace('-volunteer', '');
    }

    return '';
  }, [params.animal]);

  // Validate the animal route
  const isValid = useMemo(() => {
    if (!animalSlug) return false;
    return isValidAnimalRoute(animalSlug);
  }, [animalSlug, isValidAnimalRoute]);

  // If route is invalid, redirect to 404 page
  if (!isValid) {
    return <Navigate to="/404" replace />;
  }

  // Render the existing AnimalLandingPage component
  return <AnimalLandingPage />;
};

export default DynamicAnimalLandingPage;