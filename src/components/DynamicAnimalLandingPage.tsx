import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import AnimalLandingPage from './AnimalLandingPage';

/**
 * Dynamic Animal Landing Page with route validation
 * Validates animal routes against opportunities data and renders appropriate content
 */
const DynamicAnimalLandingPage: React.FC = () => {
  const params = useParams<{ animalName: string }>();
  const { isValidAnimalRoute } = useDynamicRoutes();

  console.log('🦁 DynamicAnimalLandingPage rendered with params:', params);

  // Extract animal slug from route parameters
  const animalSlug = useMemo(() => {
    if (params.animalName) {
      // Verify this actually ends with "-volunteer" and extract animal name
      if (params.animalName.endsWith('-volunteer')) {
        return params.animalName.replace('-volunteer', '');
      }
    }

    return '';
  }, [params.animalName]);

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