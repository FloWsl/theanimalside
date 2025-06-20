import { opportunities } from '../data/opportunities';
import { organizationDetails, getOrganizationBySlug } from '../data/organizationDetails';
import { animalCategories } from '../data/animals';
import type { Opportunity, OrganizationDetail } from '../types';

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
export const generateOrganizationRoute = (organization: OrganizationDetail | string): string => {
  const slug = typeof organization === 'string' ? organization : organization.slug;
  return `/${slug}`;
};

/**
 * Generate the best SEO route for an opportunity
 * @param opportunity - Opportunity data
 * @returns Most SEO-friendly route for this opportunity
 */
export const generateOpportunityRoute = (opportunity: Opportunity): string => {
  // Priority: Find organization first, then fall back to country/animal combination
  
  // Try to find the organization for this opportunity
  const organization = organizationDetails.find(org => 
    org.name === opportunity.organization ||
    org.programs.some(program => program.title === opportunity.title)
  );
  
  if (organization) {
    return generateOrganizationRoute(organization);
  }
  
  // Fall back to combined country/animal route
  const primaryAnimal = opportunity.animalTypes[0];
  if (primaryAnimal) {
    return generateCombinedRoute(opportunity.location.country, primaryAnimal, 'country-first');
  }
  
  // Last resort: country route
  return generateCountryRoute(opportunity.location.country);
};

// Route validation functions

/**
 * Check if a slug is a valid organization slug
 * @param slug - Potential organization slug
 * @returns True if slug matches a real organization
 */
export const isValidOrganizationSlug = (slug: string): boolean => {
  return getOrganizationBySlug(slug) !== undefined;
};

/**
 * Check if a country slug is valid
 * @param countrySlug - Country slug (e.g., "costa-rica")
 * @returns True if country exists in opportunities data
 */
export const isValidCountrySlug = (countrySlug: string): boolean => {
  const countryName = formatCountryName(countrySlug);
  return opportunities.some(opp => opp.location.country === countryName);
};

/**
 * Check if an animal slug is valid
 * @param animalSlug - Animal slug (e.g., "lions")
 * @returns True if animal exists in categories or opportunities
 */
export const isValidAnimalSlug = (animalSlug: string): boolean => {
  // Check against animal categories
  const inCategories = animalCategories.some(cat => cat.id === animalSlug);
  if (inCategories) return true;
  
  // Check against opportunity animal types
  const animalName = formatAnimalName(animalSlug);
  return opportunities.some(opp => 
    opp.animalTypes.some(type => 
      type.toLowerCase().includes(animalName.toLowerCase()) ||
      animalName.toLowerCase().includes(type.toLowerCase())
    )
  );
};

// Reverse mapping functions (URL → Data)

/**
 * Get opportunities for a country route
 * @param countrySlug - Country slug from URL
 * @returns Opportunities in that country
 */
export const getOpportunitiesForCountry = (countrySlug: string): Opportunity[] => {
  const countryName = formatCountryName(countrySlug);
  return opportunities.filter(opp => opp.location.country === countryName);
};

/**
 * Get opportunities for an animal route
 * @param animalSlug - Animal slug from URL
 * @returns Opportunities with that animal type
 */
export const getOpportunitiesForAnimal = (animalSlug: string): Opportunity[] => {
  const animalName = formatAnimalName(animalSlug);
  return opportunities.filter(opp => 
    opp.animalTypes.some(type => {
      const normalizedType = type.toLowerCase();
      const normalizedAnimal = animalName.toLowerCase();
      
      // Direct match
      if (normalizedType === normalizedAnimal) return true;
      
      // Partial matches for related terms
      if (animalSlug === 'lions' && (normalizedType.includes('lion') || normalizedType.includes('big cat'))) return true;
      if (animalSlug === 'elephants' && normalizedType.includes('elephant')) return true;
      if (animalSlug === 'sea-turtles' && (normalizedType.includes('turtle') || normalizedType.includes('marine'))) return true;
      if (animalSlug === 'orangutans' && (normalizedType.includes('orangutan') || normalizedType.includes('primate'))) return true;
      if (animalSlug === 'primates' && normalizedType.includes('primate')) return true;
      if (animalSlug === 'marine' && normalizedType.includes('marine')) return true;
      if (animalSlug === 'big-cats' && (normalizedType.includes('lion') || normalizedType.includes('leopard') || normalizedType.includes('cheetah') || normalizedType.includes('cat'))) return true;
      
      return false;
    })
  );
};

/**
 * Get opportunities for a combined country + animal route
 * @param countrySlug - Country slug from URL
 * @param animalSlug - Animal slug from URL  
 * @returns Opportunities matching both criteria
 */
export const getOpportunitiesForCombined = (countrySlug: string, animalSlug: string): Opportunity[] => {
  const countryOpportunities = getOpportunitiesForCountry(countrySlug);
  const animalName = formatAnimalName(animalSlug);
  
  return countryOpportunities.filter(opp => 
    opp.animalTypes.some(type => {
      const normalizedType = type.toLowerCase();
      const normalizedAnimal = animalName.toLowerCase();
      
      // Same matching logic as getOpportunitiesForAnimal
      if (normalizedType === normalizedAnimal) return true;
      if (animalSlug === 'lions' && (normalizedType.includes('lion') || normalizedType.includes('big cat'))) return true;
      if (animalSlug === 'elephants' && normalizedType.includes('elephant')) return true;
      if (animalSlug === 'sea-turtles' && (normalizedType.includes('turtle') || normalizedType.includes('marine'))) return true;
      if (animalSlug === 'orangutans' && (normalizedType.includes('orangutan') || normalizedType.includes('primate'))) return true;
      if (animalSlug === 'primates' && normalizedType.includes('primate')) return true;
      if (animalSlug === 'marine' && normalizedType.includes('marine')) return true;
      if (animalSlug === 'big-cats' && (normalizedType.includes('lion') || normalizedType.includes('leopard') || normalizedType.includes('cheetah') || normalizedType.includes('cat'))) return true;
      
      return false;
    })
  );
};

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
    if (isValidOrganizationSlug(segment)) {
      return { type: 'organization', params: { orgSlug: segment } };
    }
    
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