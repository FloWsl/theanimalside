import { useMemo } from 'react';
import { opportunities } from '../data/opportunities';
import { formatAnimalSlug, formatCountrySlug, formatAnimalName, formatCountryName } from '../utils/routeUtils';

interface DynamicRouteConfig {
  supportedAnimals: string[];
  supportedCountries: string[];
  validCombinations: Array<{animal: string, country: string}>;
}

interface ValidRoute {
  path: string;
  title: string;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  priority: number;
  type: 'animal' | 'country' | 'combined';
}

/**
 * Dynamic route validation hook that extracts valid routes from opportunities data
 * Replaces static route lists with data-driven approach for auto-generation
 */
export const useDynamicRoutes = () => {
  const config = useMemo<DynamicRouteConfig>(() => {
    // Extract unique animals from all opportunities
    const animalsSet = new Set<string>();
    opportunities.forEach(opp => {
      opp.animalTypes.forEach(animal => {
        // Normalize animal names to slugs
        const slug = formatAnimalSlug(animal);
        animalsSet.add(slug);
      });
    });

    // Extract unique countries from all opportunities
    const countriesSet = new Set<string>();
    opportunities.forEach(opp => {
      const slug = formatCountrySlug(opp.location.country);
      countriesSet.add(slug);
    });

    const animals = Array.from(animalsSet);
    const countries = Array.from(countriesSet);

    // Generate valid combinations based on actual data
    const combinations: Array<{animal: string, country: string}> = [];
    animals.forEach(animal => {
      countries.forEach(country => {
        // Check if this combination actually exists in opportunities
        const hasOpportunity = opportunities.some(opp => {
          const countryMatches = formatCountrySlug(opp.location.country) === country;
          const animalMatches = opp.animalTypes.some(type =>
            formatAnimalSlug(type) === animal
          );
          return countryMatches && animalMatches;
        });

        if (hasOpportunity) {
          combinations.push({ animal, country });
        }
      });
    });

    return {
      supportedAnimals: animals,
      supportedCountries: countries,
      validCombinations: combinations
    };
  }, []);

  const validationFunctions = useMemo(() => ({
    /**
     * Check if an animal route is valid
     * @param slug - Animal slug (e.g., "lions")
     */
    isValidAnimalRoute: (slug: string): boolean => {
      return config.supportedAnimals.includes(slug);
    },

    /**
     * Check if a country route is valid
     * @param slug - Country slug (e.g., "costa-rica")
     */
    isValidCountryRoute: (slug: string): boolean => {
      return config.supportedCountries.includes(slug);
    },

    /**
     * Check if an animal/country combination is valid
     * @param animal - Animal slug
     * @param country - Country slug
     */
    isValidCombination: (animal: string, country: string): boolean => {
      return config.validCombinations.some(c =>
        c.animal === animal && c.country === country
      );
    },

    /**
     * Get all valid route paths for sitemap generation
     */
    getAllValidRoutes: (): ValidRoute[] => {
      const routes: ValidRoute[] = [];

      // Add country routes
      config.supportedCountries.forEach(country => {
        const countryName = formatCountryName(country);
        routes.push({
          path: `/volunteer-${country}`,
          title: `${countryName} Volunteer Programs`,
          changefreq: 'weekly',
          priority: 0.8,
          type: 'country'
        });
      });

      // Add animal routes
      config.supportedAnimals.forEach(animal => {
        const animalName = formatAnimalName(animal);
        routes.push({
          path: `/${animal}-volunteer`,
          title: `${animalName} Volunteer Programs`,
          changefreq: 'weekly',
          priority: 0.8,
          type: 'animal'
        });
      });

      // Add combined routes (both directions)
      config.validCombinations.forEach(combo => {
        const animalName = formatAnimalName(combo.animal);
        const countryName = formatCountryName(combo.country);

        // Country-first format: /volunteer-costa-rica/lions
        routes.push({
          path: `/volunteer-${combo.country}/${combo.animal}`,
          title: `${animalName} Volunteer Programs in ${countryName}`,
          changefreq: 'monthly',
          priority: 0.9,
          type: 'combined'
        });

        // Animal-first format: /lions-volunteer/costa-rica
        routes.push({
          path: `/${combo.animal}-volunteer/${combo.country}`,
          title: `${animalName} Volunteer Programs in ${countryName}`,
          changefreq: 'monthly',
          priority: 0.9,
          type: 'combined'
        });
      });

      return routes;
    },

    /**
     * Get route suggestions for fuzzy matching
     * @param attemptedRoute - The route user tried to access
     * @param routeType - Type of route being attempted
     */
    getRouteSuggestions: (
      attemptedRoute: string,
      routeType: 'animal' | 'country' | 'combined' | 'unknown'
    ): Array<{route: string, title: string, matchReason: string}> => {
      const suggestions: Array<{route: string, title: string, matchReason: string}> = [];

      if (routeType === 'animal' || routeType === 'unknown') {
        // Find close animal matches
        const attempted = attemptedRoute.replace('-volunteer', '').replace('/', '');
        config.supportedAnimals.forEach(animal => {
          if (isCloseMatch(attempted, animal)) {
            suggestions.push({
              route: `/${animal}-volunteer`,
              title: `${formatAnimalName(animal)} Volunteer Programs`,
              matchReason: 'Similar animal name'
            });
          }
        });
      }

      if (routeType === 'country' || routeType === 'unknown') {
        // Find close country matches
        const attempted = attemptedRoute.replace('volunteer-', '').replace('/', '');
        config.supportedCountries.forEach(country => {
          if (isCloseMatch(attempted, country)) {
            suggestions.push({
              route: `/volunteer-${country}`,
              title: `${formatCountryName(country)} Volunteer Programs`,
              matchReason: 'Similar country name'
            });
          }
        });
      }

      // Limit to top 3 suggestions
      return suggestions.slice(0, 3);
    }
  }), [config]);

  return {
    config,
    ...validationFunctions
  };
};

/**
 * Simple fuzzy matching for route suggestions
 * @param attempted - What user typed
 * @param target - Valid route option
 */
function isCloseMatch(attempted: string, target: string): boolean {
  // Exact match
  if (attempted === target) return true;

  // Case insensitive match
  if (attempted.toLowerCase() === target.toLowerCase()) return true;

  // Substring match
  if (target.toLowerCase().includes(attempted.toLowerCase()) ||
      attempted.toLowerCase().includes(target.toLowerCase())) {
    return true;
  }

  // Levenshtein distance check for typos (simple version)
  if (attempted.length >= 3 && target.length >= 3) {
    const distance = levenshteinDistance(attempted.toLowerCase(), target.toLowerCase());
    const maxDistance = Math.floor(Math.max(attempted.length, target.length) * 0.3);
    return distance <= maxDistance;
  }

  return false;
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

export default useDynamicRoutes;