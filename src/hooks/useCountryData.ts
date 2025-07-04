/**
 * Country Data Hook - Database Integration
 * 
 * Centralizes country-specific data fetching using Supabase database.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrganizationService } from '../services/organizationService';
import { supabase } from '../services/supabase';
import { animalCategories } from '../data/animals';
import { opportunities } from '../data/opportunities';
import { getContentHub } from '../data/contentHubs';
import { formatCountryName } from '../utils/routeUtils';
import type { Organization } from '../types/database';
import type { ContentHubData } from '../data/contentHubs';

interface CountryDataResult {
  countryName: string;
  organizations: Organization[];
  contentHub: ContentHubData | undefined;
  availableAnimals: typeof animalCategories;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching country-specific data using Supabase database
 * 
 * @param countrySlug - Country identifier (e.g., "costa-rica")
 * @returns Country data and loading states
 */
export const useCountryData = (countrySlug: string): CountryDataResult => {
  // Parse country name
  const countryName = React.useMemo(() => {
    return formatCountryName(countrySlug);
  }, [countrySlug]);

  // Query organizations by country using database
  const { data: organizationsResponse, isLoading, error: queryError } = useQuery({
    queryKey: ['country-organizations', countryName],
    queryFn: () => OrganizationService.searchOrganizations({ country: countryName }, { page: 1, limit: 50 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!countryName,
  });

  const baseOrganizations = organizationsResponse?.data || [];

  // Separate query to get animal types for organizations in this country
  const { data: animalTypesResponse, isLoading: animalTypesLoading } = useQuery({
    queryKey: ['country-animal-types', countryName, baseOrganizations.length],
    queryFn: async () => {
      if (!baseOrganizations || baseOrganizations.length === 0) {
        return [];
      }
      
      // Get all animal types for organizations in this country
      const orgIds = baseOrganizations.map(org => org.id);
      const { data, error } = await supabase
        .from('animal_types')
        .select('animal_type, organization_id')
        .in('organization_id', orgIds);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!countryName && !isLoading && baseOrganizations.length > 0,
  });

  // Merge animal types data with organizations
  const organizations = React.useMemo(() => {
    const animalTypesData = animalTypesResponse || [];
    
    // Create a map of organization ID to animal types
    const animalTypesMap = new Map<string, string[]>();
    animalTypesData.forEach(item => {
      if (!animalTypesMap.has(item.organization_id)) {
        animalTypesMap.set(item.organization_id, []);
      }
      animalTypesMap.get(item.organization_id)!.push(item.animal_type);
    });
    
    // Merge animal types into organizations
    return baseOrganizations.map(org => ({
      ...org,
      animal_types: animalTypesMap.get(org.id) || []
    }));
  }, [baseOrganizations, animalTypesResponse]);

  // Get content hub data (still from static data for now)
  const contentHub = React.useMemo(() => {
    return getContentHub(countrySlug);
  }, [countrySlug]);

  // Get available animal types for this country (derived from database data)
  const availableAnimals = React.useMemo(() => {
    const animalTypesData = animalTypesResponse || [];
    
    
    if (animalTypesData.length === 0) {
      
      // Check static opportunities data for this country as fallback
      try {
        const countryOpportunities = opportunities.filter((opp: any) => 
          opp.location.country.toLowerCase() === countryName.toLowerCase()
        );
        
        if (countryOpportunities.length > 0) {
          // Get unique animal types from static opportunities
          const staticAnimalTypes = new Set<string>();
          countryOpportunities.forEach((opp: any) => {
            opp.animalTypes?.forEach((type: string) => {
              staticAnimalTypes.add(type.toLowerCase());
            });
          });
          
          
          // Map static animal types to our categories
          const matchedFromStatic = animalCategories.filter(category => {
            const categoryTerms = [
              category.name.toLowerCase(),
              category.id.toLowerCase(),
              ...category.name.toLowerCase().split(' ')
            ];
            
            return Array.from(staticAnimalTypes).some(animalType => {
              return categoryTerms.some(term => 
                animalType.includes(term) || term.includes(animalType)
              );
            });
          });
          
          return matchedFromStatic;
        }
      } catch (error) {
        // Silent fallback to avoid console noise
      }
      
      // Final fallback: return limited set of common animals
      return animalCategories.slice(0, 3);
    }
    
    // Get unique animal types from the database
    const animalTypesInCountry = new Set<string>();
    animalTypesData.forEach(item => {
      animalTypesInCountry.add(item.animal_type.toLowerCase());
    });
    
    
    // Map database animal types to our animal categories
    const matchedAnimals = animalCategories.filter(category => {
      // Check if category matches any animal type in the country
      const categoryTerms = [
        category.name.toLowerCase(),
        category.id.toLowerCase(),
        ...category.name.toLowerCase().split(' ')
      ];
      
      // Check if any category term matches any animal type
      const hasMatch = Array.from(animalTypesInCountry).some(animalType => {
        return categoryTerms.some(term => 
          animalType.includes(term) || term.includes(animalType)
        );
      });
      
      
      return hasMatch;
    });
    
    return matchedAnimals;
  }, [animalTypesResponse, countryName, baseOrganizations.length, organizations.length, isLoading, animalTypesLoading]);

  return {
    countryName,
    organizations,
    contentHub,
    availableAnimals,
    isLoading: isLoading || animalTypesLoading,
    error: queryError ? String(queryError) : null
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