/**
 * Country Data Hook - Database Ready
 * 
 * Centralizes country-specific data fetching for future database integration.
 * Currently uses static data but is structured for seamless Supabase migration.
 */

import React from 'react';
import { opportunities } from '../data/opportunities';
import { animalCategories } from '../data/animals';
import { getContentHub } from '../data/contentHubs';
import { formatCountryName } from '../utils/routeUtils';
import type { Opportunity } from '../types';
import type { ContentHubData } from '../data/contentHubs';

interface CountryDataResult {
  countryName: string;
  opportunities: Opportunity[];
  contentHub: ContentHubData | undefined;
  availableAnimals: typeof animalCategories;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching country-specific data
 * 
 * @param countrySlug - Country identifier (e.g., "costa-rica")
 * @returns Country data and loading states
 * 
 * Future: This will use React Query with Supabase:
 * - useQuery(['country', countrySlug], () => supabase.from('countries').select())
 * - useQuery(['opportunities', countrySlug], () => supabase.from('opportunities').select())
 * - useQuery(['content-hubs', countrySlug], () => supabase.from('content_hubs').select())
 */
export const useCountryData = (countrySlug: string): CountryDataResult => {
  // Future: Replace with React Query loading state
  const isLoading = false;
  const error = null;

  // Parse country name
  const countryName = React.useMemo(() => {
    return formatCountryName(countrySlug);
  }, [countrySlug]);

  // Filter opportunities by country
  // Future: This will be a database query with proper indexing
  const countryOpportunities = React.useMemo(() => {
    return opportunities.filter(opp => opp.location.country === countryName);
  }, [countryName]);

  // Get content hub data
  // Future: This will query content_hubs table with RLS policies
  const contentHub = React.useMemo(() => {
    return getContentHub(countrySlug);
  }, [countrySlug]);

  // Get available animal types for this country
  // Future: This will use a JOIN query across opportunities and animal_categories
  const availableAnimals = React.useMemo(() => {
    const animalTypes = [...new Set(countryOpportunities.flatMap(opp => opp.animalTypes))];
    
    return animalCategories.filter(animal => 
      animalTypes.some(type => {
        // Improved mapping logic for better animal matching
        const normalizedType = type.toLowerCase();
        const normalizedAnimalId = animal.id.replace('-', ' ');
        const normalizedAnimalName = animal.name.toLowerCase();
        
        // Direct matches
        if (normalizedType.includes(normalizedAnimalId) || normalizedAnimalName.includes(normalizedType)) {
          return true;
        }
        
        // Special mappings for Costa Rica context
        if (normalizedType.includes('primate') && animal.id === 'orangutans') {
          return true; // Primates → Orangutans (closest match in categories)
        }
        
        if (normalizedType.includes('marine') && animal.id === 'sea-turtles') {
          return true; // Marine Life → Sea Turtles (relevant for Costa Rica)
        }
        
        return false;
      })
    );
  }, [countryOpportunities]);

  return {
    countryName,
    opportunities: countryOpportunities,
    contentHub,
    availableAnimals,
    isLoading,
    error
  };
};

/**
 * Database Migration Notes:
 * 
 * 1. Countries Table:
 *    - id, name, slug, flag_emoji, timezone, etc.
 * 
 * 2. Opportunities Table:
 *    - country_id (foreign key)
 *    - animal_types (JSONB array)
 *    - location (JSONB with country, city, coordinates)
 * 
 * 3. Content Hubs Table:
 *    - country_id or animal_id (foreign keys)
 *    - cultural_context (JSONB)
 *    - key_species (JSONB)
 *    - conservation_content (JSONB)
 * 
 * 4. Indexes:
 *    - opportunities.country_id
 *    - opportunities.animal_types (GIN index for JSONB)
 *    - content_hubs.country_id
 * 
 * 5. RLS Policies:
 *    - Public read access for published content
 *    - Admin-only write access
 */