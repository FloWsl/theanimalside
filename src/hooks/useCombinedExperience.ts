/**
 * Combined Experience Data Hook - Story 5 Integration
 * 
 * React Query hook for fetching and caching combined experience content.
 * Provides optimized data access for CombinedPage.tsx components.
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { combinedExperienceService } from '../services/combinedExperienceService';
import type { CombinedExperienceContent } from '../data/combinedExperiences';

/**
 * Hook for fetching single combined experience
 * @param countrySlug - Country identifier (e.g., "costa-rica")
 * @param animalSlug - Animal identifier (e.g., "sea-turtles")
 * @param options - Query options
 * @returns Query result with combined experience data
 */
export const useCombinedExperience = (
  countrySlug: string,
  animalSlug: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<CombinedExperienceContent | null, Error> => {
  return useQuery({
    queryKey: ['combined-experience', countrySlug, animalSlug],
    queryFn: () => combinedExperienceService.getCombinedExperience(countrySlug, animalSlug),
    enabled: options?.enabled !== false && !!countrySlug && !!animalSlug,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: options?.cacheTime || 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook for fetching all combined experiences
 * @param options - Query options
 * @returns Query result with all combined experiences
 */
export const useAllCombinedExperiences = (
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<CombinedExperienceContent[], Error> => {
  return useQuery({
    queryKey: ['combined-experiences', 'all'],
    queryFn: () => combinedExperienceService.getAllCombinedExperiences(),
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime || 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime || 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

/**
 * Hook for fetching combined experiences by country
 * @param countrySlug - Country identifier
 * @param options - Query options
 * @returns Query result with country's combined experiences
 */
export const useCombinedExperiencesByCountry = (
  countrySlug: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<CombinedExperienceContent[], Error> => {
  return useQuery({
    queryKey: ['combined-experiences', 'country', countrySlug],
    queryFn: () => combinedExperienceService.getCombinedExperiencesByCountry(countrySlug),
    enabled: options?.enabled !== false && !!countrySlug,
    staleTime: options?.staleTime || 10 * 60 * 1000, // 10 minutes
    cacheTime: options?.cacheTime || 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

/**
 * Hook for checking combined experience existence
 * @param countrySlug - Country identifier
 * @param animalSlug - Animal identifier
 * @param options - Query options
 * @returns Query result with existence boolean
 */
export const useCombinedExperienceExists = (
  countrySlug: string,
  animalSlug: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<boolean, Error> => {
  return useQuery({
    queryKey: ['combined-experience-exists', countrySlug, animalSlug],
    queryFn: () => combinedExperienceService.combinedExperienceExists(countrySlug, animalSlug),
    enabled: options?.enabled !== false && !!countrySlug && !!animalSlug,
    staleTime: options?.staleTime || 30 * 60 * 1000, // 30 minutes
    cacheTime: options?.cacheTime || 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
};

/**
 * Hook for fetching combined experience metadata (SEO)
 * @param countrySlug - Country identifier
 * @param animalSlug - Animal identifier
 * @param options - Query options
 * @returns Query result with SEO metadata
 */
export const useCombinedExperienceMetadata = (
  countrySlug: string,
  animalSlug: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<{ title: string; description: string; slug: string } | null, Error> => {
  return useQuery({
    queryKey: ['combined-experience-metadata', countrySlug, animalSlug],
    queryFn: () => combinedExperienceService.getCombinedExperienceMetadata(countrySlug, animalSlug),
    enabled: options?.enabled !== false && !!countrySlug && !!animalSlug,
    staleTime: options?.staleTime || 60 * 60 * 1000, // 1 hour
    cacheTime: options?.cacheTime || 2 * 60 * 60 * 1000, // 2 hours
    retry: 1,
  });
};

/**
 * Prefetch combined experience data
 * Useful for preloading data on page navigation
 * @param queryClient - React Query client instance
 * @param countrySlug - Country identifier
 * @param animalSlug - Animal identifier
 */
export const prefetchCombinedExperience = async (
  queryClient: any,
  countrySlug: string,
  animalSlug: string
) => {
  await queryClient.prefetchQuery({
    queryKey: ['combined-experience', countrySlug, animalSlug],
    queryFn: () => combinedExperienceService.getCombinedExperience(countrySlug, animalSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Invalidate combined experience cache
 * Useful for content updates and cache management
 * @param queryClient - React Query client instance
 * @param countrySlug - Optional country filter
 * @param animalSlug - Optional animal filter
 */
export const invalidateCombinedExperienceCache = async (
  queryClient: any,
  countrySlug?: string,
  animalSlug?: string
) => {
  if (countrySlug && animalSlug) {
    // Invalidate specific combined experience
    await queryClient.invalidateQueries({
      queryKey: ['combined-experience', countrySlug, animalSlug]
    });
  } else if (countrySlug) {
    // Invalidate all combined experiences for a country
    await queryClient.invalidateQueries({
      queryKey: ['combined-experiences', 'country', countrySlug]
    });
  } else {
    // Invalidate all combined experience queries
    await queryClient.invalidateQueries({
      queryKey: ['combined-experience']
    });
    await queryClient.invalidateQueries({
      queryKey: ['combined-experiences']
    });
  }
};