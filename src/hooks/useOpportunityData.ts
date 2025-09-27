// 🗃️ React Query Hooks for Opportunity Data (Database-powered)
// Provides clean, cacheable interface for opportunity listings

import { useQuery } from '@tanstack/react-query';
import { OpportunityService } from '../services/opportunityService';
import type { PaginationOptions } from '../types/database';

// ==================== QUERY KEY FACTORIES ====================

export const opportunityKeys = {
  all: ['opportunities'] as const,
  lists: () => [...opportunityKeys.all, 'list'] as const,
  list: (filters: any) => [...opportunityKeys.lists(), filters] as const,
  byCountry: (country: string) => [...opportunityKeys.all, 'country', country] as const,
  byAnimal: (animal: string) => [...opportunityKeys.all, 'animal', animal] as const,
  byCombined: (country: string, animal: string) => [...opportunityKeys.all, 'combined', country, animal] as const,
};

// ==================== OPPORTUNITY DATA HOOKS ====================

/**
 * Get all opportunities (programs) with pagination
 * Used for: Main opportunities page
 */
export function useAllOpportunities(options: PaginationOptions = { page: 1, limit: 20 }) {
  return useQuery({
    queryKey: opportunityKeys.list({ pagination: options }),
    queryFn: () => OpportunityService.getAllOpportunities(options),
    staleTime: 2 * 60 * 1000, // 2 minutes (fresh for listings)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    keepPreviousData: true // For pagination UX
  });
}

/**
 * Get opportunities by country
 * Used for: Country landing pages
 */
export function useOpportunitiesByCountry(
  country: string, 
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  return useQuery({
    queryKey: opportunityKeys.byCountry(country),
    queryFn: () => OpportunityService.getOpportunitiesByCountry(country, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!country,
    keepPreviousData: true
  });
}

/**
 * Get opportunities by animal type
 * Used for: Animal landing pages
 */
export function useOpportunitiesByAnimal(
  animalType: string,
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  return useQuery({
    queryKey: opportunityKeys.byAnimal(animalType),
    queryFn: () => OpportunityService.getOpportunitiesByAnimal(animalType, options),
    staleTime: 5 * 60 * 1000, // 5 minutes  
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!animalType,
    keepPreviousData: true
  });
}

/**
 * Get opportunities by country and animal type
 * Used for: Combined pages (/volunteer-costa-rica/sea-turtles)
 */
export function useOpportunitiesByCombined(
  country: string,
  animalType: string,
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  return useQuery({
    queryKey: opportunityKeys.byCombined(country, animalType),
    queryFn: () => OpportunityService.getOpportunitiesByCountryAndAnimal(country, animalType, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes  
    retry: 2,
    enabled: !!country && !!animalType,
    keepPreviousData: true
  });
}

/**
 * Search opportunities with flexible filters
 * Used for: Search functionality, filtered results
 */
export function useOpportunitySearch(
  filters: {
    country?: string;
    animalType?: string;
    featured?: boolean;
    search?: string;
  },
  options: PaginationOptions = { page: 1, limit: 20 }
) {
  return useQuery({
    queryKey: opportunityKeys.list({ filters, pagination: options }),
    queryFn: () => OpportunityService.searchOpportunities(filters, options),
    staleTime: 2 * 60 * 1000, // 2 minutes (fresh for search)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    keepPreviousData: true,
    // Only fetch if we have some filter criteria
    enabled: !!(filters.country || filters.animalType || filters.search || filters.featured)
  });
}

/**
 * Get opportunities with V2 filters support
 * Used for: V2 opportunities page with multi-select filters
 */
export function useOpportunitiesV2(
  filters: {
    locations?: string[];
    animalTypes?: string[];
    costRange?: 'free' | 'under-500' | 'under-1000' | 'any';
    durationMin?: number;
    durationMax?: number;
    searchTerm?: string;
  },
  options: PaginationOptions = { page: 1, limit: 100 }
) {
  return useQuery({
    queryKey: opportunityKeys.list({ v2Filters: filters, pagination: options }),
    queryFn: () => OpportunityService.getOpportunitiesV2(filters, options),
    staleTime: 2 * 60 * 1000, // 2 minutes (fresh for listings)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    keepPreviousData: true,
    // Always enabled - no filters means show all
    enabled: true
  });
}

// ==================== UTILITY HOOKS ====================

/**
 * Hook for standardized loading/error handling
 */
export function useOpportunityListData<T>(
  queryResult: ReturnType<typeof useQuery<T>>,
  listType: string
) {
  const { data, isLoading, error, isError, refetch, isFetching } = queryResult;

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
    // Standardized loading component props
    loadingProps: {
      isLoading,
      isFetching,
      error: error as Error | null,
      retry: refetch,
      listType
    }
  };
}