// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\lib\search-utils.ts

import type { AnimalCategory } from '@/data/animals';
import type { SearchFilters } from '@/types';

/**
 * Search option interface for standardized search results
 * Extracted from SimpleHeroSearch for reuse across homepage sections
 */
export interface SearchOption {
  id: string;
  name: string;
  type: 'animal' | 'location';
  slug: string;
  count: number;
  illustration?: 'koala' | 'orangutan' | 'lion' | 'turtle' | 'elephant';
  flag?: string;
  description: string;
}

/**
 * URL generation utilities for consistent SEO-friendly URLs
 */
export const urlGenerators = {
  /**
   * Generate opportunity URL for animal or location filtering
   * Maintains existing SEO structure: /opportunities/[slug]
   */
  generateOpportunityURL: (type: 'animal' | 'location', slug: string): string => {
    return `/opportunities/${slug}`;
  },

  /**
   * Generate explore URL for discovery pages
   */
  generateExploreURL: (slug: string): string => {
    return `/explore/${slug}`;
  },

  /**
   * Generate search URL with filters
   */
  generateSearchURL: (filters: SearchFilters): string => {
    const params = new URLSearchParams();
    
    if (filters.location) params.set('location', filters.location);
    if (filters.animalTypes?.length) params.set('animals', filters.animalTypes.join(','));
    if (filters.durationMin) params.set('duration_min', filters.durationMin.toString());
    if (filters.durationMax) params.set('duration_max', filters.durationMax.toString());
    if (filters.costMax) params.set('cost_max', filters.costMax.toString());
    if (filters.searchTerm) params.set('q', filters.searchTerm);

    const query = params.toString();
    return `/opportunities${query ? `?${query}` : ''}`;
  }
};

/**
 * Animal data utilities for consistent count formatting and categorization
 */
export const animalUtils = {
  /**
   * Format animal count for display (e.g., "73 projects", "127+ opportunities")
   */
  formatAnimalCount: (count: number, type: 'projects' | 'opportunities' | 'volunteers' | 'countries' = 'projects'): string => {
    if (count >= 100) {
      return `${Math.floor(count / 10) * 10}+ ${type}`;
    } else if (count >= 50) {
      return `${Math.floor(count / 5) * 5}+ ${type}`;
    } else {
      return `${count} ${type}`;
    }
  },

  /**
   * Get animals by category with optional filtering
   */
  getAnimalsByCategory: (animals: AnimalCategory[], filters?: {
    trending?: boolean;
    minProjects?: number;
    countries?: number[];
  }): AnimalCategory[] => {
    let filtered = [...animals];

    if (filters?.trending !== undefined) {
      filtered = filtered.filter(animal => animal.trending === filters.trending);
    }

    if (filters?.minProjects !== undefined) {
      filtered = filtered.filter(animal => animal.projects >= filters.minProjects);
    }

    if (filters?.countries?.length) {
      filtered = filtered.filter(animal => filters.countries!.includes(animal.countries));
    }

    return filtered;
  },

  /**
   * Get top animals by project count
   */
  getTopAnimals: (animals: AnimalCategory[], limit: number = 5): AnimalCategory[] => {
    return [...animals]
      .sort((a, b) => b.projects - a.projects)
      .slice(0, limit);
  },

  /**
   * Convert AnimalCategory to SearchOption for consistent interface
   */
  animalToSearchOption: (animal: AnimalCategory): SearchOption => {
    return {
      id: animal.id,
      name: animal.name,
      type: 'animal',
      slug: animal.id,
      count: animal.projects,
      illustration: animal.illustration,
      description: animal.description
    };
  }
};

/**
 * Location data utilities
 */
export const locationUtils = {
  /**
   * Standard location search options
   * Extracted from SimpleHeroSearch for consistency
   */
  getStandardLocations: (): SearchOption[] => {
    return [
      {
        id: 'costa-rica',
        name: 'Costa Rica',
        type: 'location',
        slug: 'costa-rica',
        count: 94,
        flag: '🇨🇷',
        description: 'Tropical wildlife conservation'
      },
      {
        id: 'thailand',
        name: 'Thailand',
        type: 'location',
        slug: 'thailand',
        count: 68,
        flag: '🇹🇭',
        description: 'Elephant sanctuaries & rescue'
      },
      {
        id: 'south-africa',
        name: 'South Africa',
        type: 'location',
        slug: 'south-africa',
        count: 112,
        flag: '🇿🇦',
        description: 'Big Five conservation'
      },
      {
        id: 'australia',
        name: 'Australia',
        type: 'location',
        slug: 'australia',
        count: 85,
        flag: '🇦🇺',
        description: 'Wildlife rehabilitation'
      },
      {
        id: 'indonesia',
        name: 'Indonesia',
        type: 'location',
        slug: 'indonesia',
        count: 76,
        flag: '🇮🇩',
        description: 'Rainforest & marine protection'
      }
    ];
  },

  /**
   * Format location count for display
   */
  formatLocationCount: (count: number): string => {
    return animalUtils.formatAnimalCount(count, 'projects');
  }
};

/**
 * Search filtering utilities
 */
export const searchUtils = {
  /**
   * Filter search options by query string
   */
  filterSearchOptions: (options: SearchOption[], query: string, limit: number = 6): SearchOption[] => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    
    return options
      .filter(option =>
        option.name.toLowerCase().includes(lowercaseQuery) ||
        option.description.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, limit);
  },

  /**
   * Group search options by type
   */
  groupSearchOptions: (options: SearchOption[]) => {
    return {
      animals: options.filter(opt => opt.type === 'animal'),
      locations: options.filter(opt => opt.type === 'location')
    };
  },

  /**
   * Get all search options (animals + locations) for unified search
   */
  getAllSearchOptions: (animals: AnimalCategory[]): SearchOption[] => {
    const animalOptions = animals.map(animalUtils.animalToSearchOption);
    const locationOptions = locationUtils.getStandardLocations();
    
    return [...animalOptions, ...locationOptions];
  }
};

/**
 * Navigation utilities for consistent routing
 */
export const navigationUtils = {
  /**
   * Handle search option selection with proper navigation
   */
  handleSearchSelection: (option: SearchOption): void => {
    const url = urlGenerators.generateOpportunityURL(option.type, option.slug);
    window.location.href = url;
  },

  /**
   * Generate breadcrumb data for current page
   */
  generateBreadcrumbs: (currentPath: string): Array<{label: string, href?: string}> => {
    const segments = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/' }];

    if (segments[0] === 'opportunities') {
      breadcrumbs.push({ label: 'Opportunities', href: '/opportunities' });
      
      if (segments[1]) {
        // Convert slug back to readable name
        const name = segments[1].split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        breadcrumbs.push({ label: name });
      }
    }

    return breadcrumbs;
  }
};

/**
 * Validation utilities
 */
export const validationUtils = {
  /**
   * Validate search filters
   */
  validateSearchFilters: (filters: SearchFilters): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (filters.durationMin && filters.durationMax) {
      if (filters.durationMin > filters.durationMax) {
        errors.push('Minimum duration cannot be greater than maximum duration');
      }
    }

    if (filters.durationMin && filters.durationMin < 1) {
      errors.push('Minimum duration must be at least 1 week');
    }

    if (filters.costMax && filters.costMax < 0) {
      errors.push('Maximum cost cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Sanitize search term
   */
  sanitizeSearchTerm: (term: string): string => {
    return term.trim().slice(0, 100); // Limit length for security
  }
};

/**
 * Re-export commonly used functions for convenience
 */
export const {
  generateOpportunityURL,
  generateExploreURL,
  generateSearchURL
} = urlGenerators;

export const {
  formatAnimalCount,
  getAnimalsByCategory,
  getTopAnimals,
  animalToSearchOption
} = animalUtils;

export const {
  getStandardLocations,
  formatLocationCount
} = locationUtils;

export const {
  filterSearchOptions,
  groupSearchOptions,
  getAllSearchOptions
} = searchUtils;

export const {
  handleSearchSelection,
  generateBreadcrumbs
} = navigationUtils;

export const {
  validateSearchFilters,
  sanitizeSearchTerm
} = validationUtils;

// Export types for external use
export type { SearchOption };
