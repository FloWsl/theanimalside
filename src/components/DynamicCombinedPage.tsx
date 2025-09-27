import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import CombinedPage from './CombinedPage';

interface DynamicCombinedPageProps {
  type: 'country-animal' | 'animal-country';
}

/**
 * Dynamic Combined Page with route validation
 * Validates combined animal/country routes against opportunities data
 */
const DynamicCombinedPage: React.FC<DynamicCombinedPageProps> = ({ type }) => {
  const params = useParams<{ country?: string; animal?: string }>();
  const { isValidCountryRoute, isValidAnimalRoute, isValidCombination } = useDynamicRoutes();

  // Extract country and animal slugs based on route type
  const { countrySlug, animalSlug } = useMemo(() => {
    if (type === 'country-animal') {
      // Route: volunteer-:country/:animal → params: { country: "costa-rica", animal: "lions" }
      return {
        countrySlug: params.country || '',
        animalSlug: params.animal || ''
      };
    } else {
      // Route: :animal-volunteer/:country → params: { animal: "lions", country: "costa-rica" }
      return {
        countrySlug: params.country || '',
        animalSlug: params.animal || ''
      };
    }
  }, [type, params]);

  // Validate the combined route
  const isValid = useMemo(() => {
    // Basic parameter validation
    if (!countrySlug || !animalSlug) return false;

    // Individual route validation
    const countryValid = isValidCountryRoute(countrySlug);
    const animalValid = isValidAnimalRoute(animalSlug);

    if (!countryValid || !animalValid) return false;

    // Combination validation - check if this specific combination exists
    return isValidCombination(animalSlug, countrySlug);
  }, [countrySlug, animalSlug, isValidCountryRoute, isValidAnimalRoute, isValidCombination]);

  // If route is invalid, redirect to 404 page
  if (!isValid) {
    return <Navigate to="/404" replace />;
  }

  // Render the existing CombinedPage component with the correct type
  return <CombinedPage type={type} />;
};

export default DynamicCombinedPage;