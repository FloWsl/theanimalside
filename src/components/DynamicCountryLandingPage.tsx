import React, { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import CountryLandingPage from './CountryLandingPage';
import AnimalLandingPage from './AnimalLandingPage';
import CombinedPage from './CombinedPage';

/**
 * Smart Route Handler - analyzes any unmatched route and routes to appropriate component
 * Handles all dynamic routes: countries, animals, and combinations
 */
const DynamicCountryLandingPage: React.FC = () => {
  const location = useLocation();
  const { config } = useDynamicRoutes();


  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('📜 Scrolled to top for route:', location.pathname);
  }, [location.pathname]);

  const routeAnalysis = useMemo(() => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);


    // Single segment routes
    if (segments.length === 1) {
      const segment = segments[0];

      // Check for country route: volunteer-{country}
      if (segment.startsWith('volunteer-')) {
        const countrySlug = segment.replace('volunteer-', '');
        const isValidCountry = config.supportedCountries.includes(countrySlug);
        if (isValidCountry) {
          return { type: 'country', country: countrySlug };
        }
      }

      // Check for animal route: {animal}-volunteer
      if (segment.endsWith('-volunteer')) {
        const animalSlug = segment.replace('-volunteer', '');
        const isValidAnimal = config.supportedAnimals.includes(animalSlug);
        if (isValidAnimal) {
          return { type: 'animal', animal: animalSlug };
        }
      }
    }

    // Two segment routes (combined)
    if (segments.length === 2) {
      const [first, second] = segments;

      // Country-first: volunteer-{country}/{animal}
      if (first.startsWith('volunteer-')) {
        const countrySlug = first.replace('volunteer-', '');
        const animalSlug = second;

        const isValidCountry = config.supportedCountries.includes(countrySlug);
        const isValidAnimal = config.supportedAnimals.includes(animalSlug);
        const isValidCombination = config.validCombinations.some(c =>
          c.country === countrySlug && c.animal === animalSlug
        );


        if (isValidCountry && isValidAnimal && isValidCombination) {
          return { type: 'combined', country: countrySlug, animal: animalSlug, format: 'country-first' };
        }
      }

      // Animal-first: {animal}-volunteer/{country}
      if (first.endsWith('-volunteer')) {
        const animalSlug = first.replace('-volunteer', '');
        const countrySlug = second;

        const isValidAnimal = config.supportedAnimals.includes(animalSlug);
        const isValidCountry = config.supportedCountries.includes(countrySlug);
        const isValidCombination = config.validCombinations.some(c =>
          c.animal === animalSlug && c.country === countrySlug
        );


        if (isValidAnimal && isValidCountry && isValidCombination) {
          return { type: 'combined', animal: animalSlug, country: countrySlug, format: 'animal-first' };
        }
      }
    }

    return { type: 'unknown' };
  }, [location.pathname, config]);

  // Render appropriate component based on analysis
  switch (routeAnalysis.type) {
    case 'country':
      return <CountryLandingPage />;

    case 'animal':
      return <AnimalLandingPage />;

    case 'combined':
      return (
        <CombinedPage
          type={routeAnalysis.format === 'country-first' ? 'country-animal' : 'animal-country'}
        />
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-soft-cream">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-forest mb-4">404</h1>
            <p className="text-forest/70 mb-6">Page not found</p>
            <a href="/" className="text-sage-green hover:text-forest underline">
              Return Home
            </a>
          </div>
        </div>
      );
  }
};

export default DynamicCountryLandingPage;