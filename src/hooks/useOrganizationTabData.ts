// 🗃️ React Query Hooks for Organization Tab Data
// Each tab gets its own data hook to call the proper database methods

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrganizationService } from '../services/organizationService';

// ==================== QUERY KEY FACTORIES ====================

export const organizationTabKeys = {
  all: ['organization-tabs'] as const,
  overview: (orgId: string) => [...organizationTabKeys.all, 'overview', orgId] as const,
  experience: (orgId: string) => [...organizationTabKeys.all, 'experience', orgId] as const,
  practical: (orgId: string) => [...organizationTabKeys.all, 'practical', orgId] as const,
  location: (orgId: string) => [...organizationTabKeys.all, 'location', orgId] as const,
  stories: (orgId: string) => [...organizationTabKeys.all, 'stories', orgId] as const,
  connect: (orgId: string) => [...organizationTabKeys.all, 'connect', orgId] as const,
  essentials: (orgId: string) => [...organizationTabKeys.all, 'essentials', orgId] as const,
};

// ==================== TAB DATA HOOKS ====================

/**
 * Hook for OverviewTab data
 * Uses: OrganizationService.getOverview()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationOverview(organizationSlug: string) {
  return useQuery({
    queryKey: organizationTabKeys.overview(organizationSlug),
    queryFn: () => OrganizationService.getOverview(organizationSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

/**
 * Hook for ExperienceTab data
 * Uses: OrganizationService.getExperience()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationExperience(organizationSlug: string) {
  return useQuery({
    queryKey: organizationTabKeys.experience(organizationSlug),
    queryFn: () => OrganizationService.getExperience(organizationSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

/**
 * Hook for PracticalTab data
 * Uses: OrganizationService.getPractical()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationPractical(organizationSlug: string) {
  return useQuery({
    queryKey: organizationTabKeys.practical(organizationSlug),
    queryFn: () => OrganizationService.getPractical(organizationSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

/**
 * Hook for LocationTab data
 * Uses: OrganizationService.getLocation()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationLocation(organizationSlug: string) {
  return useQuery({
    queryKey: organizationTabKeys.location(organizationSlug),
    queryFn: () => OrganizationService.getLocation(organizationSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

/**
 * Hook for StoriesTab data
 * Uses: OrganizationService.getStories()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationStories(organizationSlug: string, options = {}) {
  return useQuery({
    queryKey: organizationTabKeys.stories(organizationSlug),
    queryFn: () => OrganizationService.getStories(organizationSlug, options),
    staleTime: 2 * 60 * 1000, // 2 minutes (stories change more frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

/**
 * Hook for ConnectTab data
 * Uses: OrganizationService.getConnect()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationConnect(organizationSlug: string) {
  return useQuery({
    queryKey: organizationTabKeys.connect(organizationSlug),
    queryFn: () => OrganizationService.getConnect(organizationSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

/**
 * Hook for EssentialInfoSidebar data
 * Uses: OrganizationService.getEssentials()
 * Note: Accepts organization slug (not UUID)
 */
export function useOrganizationEssentials(organizationSlug: string) {
  return useQuery({
    queryKey: organizationTabKeys.essentials(organizationSlug),
    queryFn: () => OrganizationService.getEssentials(organizationSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!organizationSlug,
  });
}

// ==================== UTILITY HOOKS ====================

/**
 * Hook for standardized loading/error handling across all tabs
 */
export function useTabDataState<T>(
  queryResult: ReturnType<typeof useQuery<T>>,
  tabName: string
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
      tabName
    }
  };
}

// ==================== CONTACT FORM SUBMISSION ====================

/**
 * Hook for submitting contact forms
 */
export function useSubmitContactForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: OrganizationService.submitContactForm,
    onSuccess: (data, variables) => {
      // Optionally invalidate connect data to refresh application process info
      queryClient.invalidateQueries({
        queryKey: organizationTabKeys.connect(variables.organizationSlug)
      });
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    }
  });
}