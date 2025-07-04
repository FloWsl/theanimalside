import { animalCategories } from '../data/animals';
import { OrganizationService } from '../services/organizationService';
import type { Organization } from '../types/database';

/**
 * Route Generation Utilities
 * 
 * Provides consistent URL generation for all new SEO-friendly routes
 * and utilities for route validation and data mapping.
 */

// Type definitions for route parameters
export interface RouteParams {
  country?: string;
  animal?: string;
  orgSlug?: string;
}

// Route generation functions

/**
 * Generate country landing page route
 * @param country - Country name (e.g., "Costa Rica")
 * @returns Route like "/volunteer-costa-rica"
 * 
 * Note: Now uses explicit routes instead of dynamic parameters
 * for better SEO and route predictability
 */
export const generateCountryRoute = (country: string): string => {
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  
  // Validate against supported countries for explicit routing
  const supportedCountries = [
    'costa-rica', 'thailand', 'south-africa', 'australia', 
    'indonesia', 'kenya', 'ecuador', 'peru', 'brazil', 'india'
  ];
  
  if (!supportedCountries.includes(countrySlug)) {
    console.warn(`Country "${countrySlug}" not supported in explicit routes. Add to App.tsx routes.`);
  }
  
  return `/volunteer-${countrySlug}`;
};

/**
 * Generate animal landing page route  
 * @param animal - Animal type (e.g., "Lions")
 * @returns Route like "/lions-volunteer"
 * 
 * Note: Now uses explicit routes instead of dynamic parameters
 * for better SEO and route predictability
 */
export const generateAnimalRoute = (animal: string): string => {
  const animalSlug = animal.toLowerCase().replace(/\s+/g, '-');
  
  // Validate against supported animals for explicit routing
  const supportedAnimals = [
    'lions', 'elephants', 'sea-turtles', 'orangutans', 'koalas', 
    'tigers', 'pandas', 'rhinos', 'whales', 'dolphins'
  ];
  
  if (!supportedAnimals.includes(animalSlug)) {
    console.warn(`Animal "${animalSlug}" not supported in explicit routes. Add to App.tsx routes.`);
  }
  
  return `/${animalSlug}-volunteer`;
};

/**
 * Generate combined route (country + animal)
 * @param country - Country name
 * @param animal - Animal type  
 * @param format - Route format preference
 * @returns Route like "/volunteer-costa-rica/lions" or "/lions-volunteer/costa-rica"
 */
export const generateCombinedRoute = (
  country: string, 
  animal: string, 
  format: 'country-first' | 'animal-first' = 'country-first'
): string => {
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const animalSlug = animal.toLowerCase().replace(/\s+/g, '-');
  
  if (format === 'country-first') {
    return `/volunteer-${countrySlug}/${animalSlug}`;
  } else {
    return `/${animalSlug}-volunteer/${countrySlug}`;
  }
};

/**
 * Generate organization route
 * @param organization - Organization data or slug
 * @returns Route like "/toucan-rescue-ranch-costa-rica"
 */
export const generateOrganizationRoute = (organization: Organization | string): string => {
  const slug = typeof organization === 'string' ? organization : organization.slug;
  return `/${slug}`;
};

/**
 * Generate the best SEO route for an opportunity (organization slug)
 * @param organizationSlug - Organization slug
 * @returns SEO-friendly route for this organization
 */
export const generateOpportunityRoute = (organizationSlug: string): string => {
  return generateOrganizationRoute(organizationSlug);
};

// Route validation functions

/**
 * Check if a slug is a valid organization slug (async)
 * @param slug - Potential organization slug
 * @returns Promise<True> if slug matches a real organization
 */
export const isValidOrganizationSlugAsync = async (slug: string): Promise<boolean> => {
  return await OrganizationService.isValidOrganizationSlug(slug);
};

/**
 * Check if a country slug is valid
 * @param countrySlug - Country slug (e.g., "costa-rica")
 * @returns True if country exists in database
 */
export const isValidCountrySlug = (countrySlug: string): boolean => {
  // For now, use a hardcoded list of supported countries
  // In the future, this could query the database for available countries
  const supportedCountries = [
    'costa-rica', 'thailand', 'south-africa', 'australia', 
    'indonesia', 'kenya', 'ecuador', 'peru', 'brazil', 'india'
  ];
  
  return supportedCountries.includes(countrySlug);
};

/**
 * Check if an animal slug is valid
 * @param animalSlug - Animal slug (e.g., "lions")
 * @returns True if animal exists in categories or database
 */
export const isValidAnimalSlug = (animalSlug: string): boolean => {
  // Check against animal categories
  const inCategories = animalCategories.some(cat => cat.id === animalSlug);
  if (inCategories) return true;
  
  // For now, use a hardcoded list of supported animals
  // In the future, this could query the database for available animal types
  const supportedAnimals = [
    'lions', 'elephants', 'sea-turtles', 'orangutans', 'koalas', 
    'tigers', 'pandas', 'rhinos', 'whales', 'dolphins', 'primates',
    'marine', 'birds', 'reptiles', 'big-cats'
  ];
  
  return supportedAnimals.includes(animalSlug);
};

// Reverse mapping functions (URL → Data)

// Note: Opportunity filtering functions have been removed
// as they relied on mock data. These will be replaced with
// database queries in the OrganizationService.

// Helper functions for name formatting

/**
 * Convert country slug to formatted name
 * @param slug - Country slug (e.g., "costa-rica")
 * @returns Formatted name (e.g., "Costa Rica")
 */
export const formatCountryName = (slug: string): string => {
  const countryMap: Record<string, string> = {
    'costa-rica': 'Costa Rica',
    'south-africa': 'South Africa',
    'thailand': 'Thailand',
    'australia': 'Australia',
    'indonesia': 'Indonesia',
    'kenya': 'Kenya',
    'ecuador': 'Ecuador',
    'peru': 'Peru',
    'brazil': 'Brazil',
    'india': 'India'
  };
  
  return countryMap[slug] || slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Convert animal slug to formatted name
 * @param slug - Animal slug (e.g., "sea-turtles")
 * @returns Formatted name (e.g., "Sea Turtles")
 */
export const formatAnimalName = (slug: string): string => {
  const animalMap: Record<string, string> = {
    'lions': 'Lions',
    'elephants': 'Elephants',
    'sea-turtles': 'Sea Turtles',
    'orangutans': 'Orangutans',
    'koalas': 'Koalas',
    'tigers': 'Tigers',
    'pandas': 'Giant Pandas',
    'rhinos': 'Rhinos',
    'whales': 'Whales',
    'dolphins': 'Dolphins',
    'primates': 'Primates',
    'marine': 'Marine Life',
    'birds': 'Birds',
    'reptiles': 'Reptiles',
    'big-cats': 'Big Cats'
  };
  
  return animalMap[slug] || slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Convert country name to slug
 * @param name - Country name (e.g., "Costa Rica")
 * @returns Slug (e.g., "costa-rica")
 */
export const formatCountrySlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Convert animal name to slug
 * @param name - Animal name (e.g., "Sea Turtles")
 * @returns Slug (e.g., "sea-turtles")
 */
export const formatAnimalSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Route parsing utilities

/**
 * Parse a URL pathname and determine route type and parameters
 * @param pathname - URL pathname (e.g., "/volunteer-costa-rica/lions")
 * @returns Route type and extracted parameters
 */
export const parseRoute = (pathname: string): {
  type: 'home' | 'opportunities' | 'country' | 'animal' | 'combined' | 'organization' | 'legacy' | 'unknown';
  params: RouteParams;
} => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return { type: 'home', params: {} };
  }
  
  if (segments[0] === 'opportunities') {
    return { type: 'opportunities', params: {} };
  }
  
  if (segments[0] === 'organization' && segments[1]) {
    return { type: 'legacy', params: { orgSlug: segments[1] } };
  }
  
  // Single segment routes
  if (segments.length === 1) {
    const segment = segments[0];
    
    // Country route: volunteer-{country}
    if (segment.startsWith('volunteer-')) {
      const country = segment.replace('volunteer-', '');
      return { type: 'country', params: { country } };
    }
    
    // Animal route: {animal}-volunteer
    if (segment.endsWith('-volunteer')) {
      const animal = segment.replace('-volunteer', '');
      return { type: 'animal', params: { animal } };
    }
    
    // Conservation route: {category}-conservation  
    if (segment.endsWith('-conservation')) {
      const animal = segment.replace('-conservation', '');
      return { type: 'animal', params: { animal } };
    }
    
    // Organization route: {orgSlug}
    // Note: Organization validation is now async, so we'll assume it's an organization
    // and validate later in the component with React Query
    return { type: 'organization', params: { orgSlug: segment } };
    
    return { type: 'unknown', params: {} };
  }
  
  // Two segment routes
  if (segments.length === 2) {
    const [first, second] = segments;
    
    // Combined route: volunteer-{country}/{animal}
    if (first.startsWith('volunteer-')) {
      const country = first.replace('volunteer-', '');
      return { type: 'combined', params: { country, animal: second } };
    }
    
    // Combined route: {animal}-volunteer/{country}
    if (first.endsWith('-volunteer')) {
      const animal = first.replace('-volunteer', '');
      return { type: 'combined', params: { animal, country: second } };
    }
    
    return { type: 'unknown', params: {} };
  }
  
  return { type: 'unknown', params: {} };
};