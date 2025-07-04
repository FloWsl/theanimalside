// 📊 Statistics Hooks - React Query integration with caching
// Provides cached access to dynamic statistics from Supabase

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatisticsService } from '../services/statisticsService';
import type { 
  AnimalStatistics, 
  CountryStatistics, 
  GlobalStatistics, 
  CombinedStatistics 
} from '../services/statisticsService';

// ==================== QUERY KEY FACTORIES ====================

export const statisticsKeys = {
  all: ['statistics'] as const,
  animals: () => [...statisticsKeys.all, 'animals'] as const,
  animal: (animalType: string) => [...statisticsKeys.animals(), animalType] as const,
  countries: () => [...statisticsKeys.all, 'countries'] as const,
  country: (country: string) => [...statisticsKeys.countries(), country] as const,
  global: () => [...statisticsKeys.all, 'global'] as const,
  combined: (animalType?: string, country?: string) => [...statisticsKeys.all, 'combined', animalType, country] as const,
};

// ==================== ANIMAL STATISTICS HOOKS ====================

/**
 * Get all animal type statistics with caching
 */
export function useAnimalStatistics(useCache: boolean = true) {
  return useQuery({
    queryKey: [...statisticsKeys.animals(), useCache ? 'cached' : 'live'],
    queryFn: () => StatisticsService.getAnimalStatistics(useCache),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false
  });
}

/**
 * Get statistics for a specific animal type
 */
export function useAnimalStatistic(animalType: string) {
  return useQuery({
    queryKey: statisticsKeys.animal(animalType),
    queryFn: () => StatisticsService.getAnimalStatistic(animalType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!animalType,
    retry: 2,
    refetchOnWindowFocus: false
  });
}

// ==================== COUNTRY STATISTICS HOOKS ====================

/**
 * Get all country statistics with caching
 */
export function useCountryStatistics(useCache: boolean = true) {
  return useQuery({
    queryKey: [...statisticsKeys.countries(), useCache ? 'cached' : 'live'],
    queryFn: () => StatisticsService.getCountryStatistics(useCache),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false
  });
}

/**
 * Get statistics for a specific country
 */
export function useCountryStatistic(country: string) {
  return useQuery({
    queryKey: statisticsKeys.country(country),
    queryFn: () => StatisticsService.getCountryStatistic(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!country,
    retry: 2,
    refetchOnWindowFocus: false
  });
}

// ==================== GLOBAL STATISTICS HOOKS ====================

/**
 * Get global platform statistics
 */
export function useGlobalStatistics() {
  return useQuery({
    queryKey: statisticsKeys.global(),
    queryFn: () => StatisticsService.getGlobalStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes (global stats change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false
  });
}

// ==================== COMBINED STATISTICS HOOKS ====================

/**
 * Get combined animal-country statistics
 */
export function useCombinedStatistics(animalType?: string, country?: string) {
  return useQuery({
    queryKey: statisticsKeys.combined(animalType, country),
    queryFn: () => StatisticsService.getCombinedStatistics(animalType, country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    refetchOnWindowFocus: false
  });
}

/**
 * Get specific animal-country combination statistics
 */
export function useAnimalCountryStatistic(animalType: string, country: string) {
  return useQuery({
    queryKey: statisticsKeys.combined(animalType, country),
    queryFn: () => StatisticsService.getAnimalCountryStatistic(animalType, country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!animalType && !!country,
    retry: 2,
    refetchOnWindowFocus: false
  });
}

// ==================== CACHE MANAGEMENT HOOKS ====================

/**
 * Cache refresh mutation
 */
export function useRefreshStatistics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => StatisticsService.refreshStatisticsCache(),
    onSuccess: () => {
      // Invalidate all statistics queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: statisticsKeys.all });
    },
    retry: 1
  });
}

/**
 * Get cache information
 */
export function useStatisticsCacheInfo() {
  return useQuery({
    queryKey: [...statisticsKeys.all, 'cache-info'],
    queryFn: () => StatisticsService.getCacheInfo(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Check every 2 minutes
    refetchOnWindowFocus: false
  });
}

// ==================== BACKGROUND CACHE REFRESH ====================

/**
 * Hook for automatic background cache refresh
 * Use this in a top-level component to maintain fresh data
 */
export function useBackgroundStatisticsRefresh() {
  const refreshMutation = useRefreshStatistics();
  const { data: cacheInfo } = useStatisticsCacheInfo();

  // Auto-refresh if cache is stale
  React.useEffect(() => {
    if (cacheInfo?.is_stale && !refreshMutation.isPending) {
      refreshMutation.mutate();
    }
  }, [cacheInfo?.is_stale, refreshMutation]);

  // Periodic refresh every 10 minutes
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshMutation.isPending) {
        refreshMutation.mutate();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [refreshMutation]);

  return {
    isRefreshing: refreshMutation.isPending,
    lastRefresh: cacheInfo?.last_updated,
    isStale: cacheInfo?.is_stale,
    manualRefresh: () => refreshMutation.mutate()
  };
}

// ==================== LEGACY COMPATIBILITY ====================

/**
 * Convert animal statistics to legacy AnimalCategory format
 * For backward compatibility with existing components
 */
export function useAnimalCategoriesFromStats(): any[] {
  const { data: animalStats = [], isLoading } = useAnimalStatistics();

  return React.useMemo(() => {
    if (isLoading) return [];

    return animalStats.map((stat: AnimalStatistics) => ({
      id: stat.animal_type.toLowerCase().replace(/\s+/g, '-'),
      name: stat.animal_type,
      projects: stat.total_projects,
      volunteers: stat.total_volunteers,
      countries: stat.countries_count,
      trending: stat.trending,
      // Default values for UI compatibility
      illustration: getAnimalIllustration(stat.animal_type),
      description: getAnimalDescription(stat.animal_type),
      image: getAnimalImage(stat.animal_type),
      color: getAnimalColor(stat.animal_type),
      bgColor: getAnimalBgColor(stat.animal_type),
      accentColor: getAnimalAccentColor(stat.animal_type)
    }));
  }, [animalStats, isLoading]);
}

// Helper functions for legacy compatibility
function getAnimalIllustration(animalType: string) {
  const map: Record<string, string> = {
    'Lions': 'lion',
    'Elephants': 'elephant', 
    'Sea Turtles': 'turtle',
    'Orangutans': 'orangutan',
    'Koalas': 'koala'
  };
  return map[animalType] || 'lion';
}

function getAnimalDescription(animalType: string) {
  const map: Record<string, string> = {
    'Lions': 'Save the kings of the savanna from extinction',
    'Elephants': 'Help protect gentle giants across Africa and Asia',
    'Sea Turtles': 'Protect ancient mariners on beaches worldwide',
    'Orangutans': 'Save our closest relatives in Borneo and Sumatra',
    'Koalas': 'Help Australia\'s most beloved marsupials survive'
  };
  return map[animalType] || 'Help protect this amazing species';
}

function getAnimalImage(animalType: string) {
  const map: Record<string, string> = {
    'Lions': 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Elephants': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'Sea Turtles': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };
  return map[animalType] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
}

function getAnimalColor(animalType: string) {
  const map: Record<string, string> = {
    'Lions': '#8B4513',
    'Elephants': '#87A96B',
    'Sea Turtles': '#5F7161'
  };
  return map[animalType] || '#87A96B';
}

function getAnimalBgColor(animalType: string) {
  return getAnimalColor(animalType) + '/10';
}

function getAnimalAccentColor(animalType: string) {
  const map: Record<string, string> = {
    'Lions': '#D2691E',
    'Elephants': '#5F7161',
    'Sea Turtles': '#87A96B'
  };
  return map[animalType] || '#5F7161';
}

// Add missing React import
import React from 'react';