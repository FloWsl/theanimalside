// 🗃️ React Query Hooks for Organization Data
// Provides clean, cacheable interface for all organization data with loading states

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrganizationService } from '../services/organizationService';
import { ContactService, type ContactFormData, type ApplicationFormData } from '../services/contactService';
import type {
  OrganizationOverview,
  OrganizationExperience,
  OrganizationPractical,
  OrganizationLocation,
  OrganizationStories,
  OrganizationEssentials,
  TestimonialFilters,
  MediaFilters,
  OrganizationFilters,
  PaginationOptions
} from '../types/database';

// ==================== QUERY KEY FACTORIES ====================

export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters: OrganizationFilters) => [...organizationKeys.lists(), filters] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  overview: (id: string) => [...organizationKeys.detail(id), 'overview'] as const,
  experience: (id: string) => [...organizationKeys.detail(id), 'experience'] as const,
  practical: (id: string) => [...organizationKeys.detail(id), 'practical'] as const,
  location: (id: string) => [...organizationKeys.detail(id), 'location'] as const,
  stories: (id: string, filters?: TestimonialFilters) => [...organizationKeys.detail(id), 'stories', filters] as const,
  essentials: (id: string) => [...organizationKeys.detail(id), 'essentials'] as const,
  testimonials: (id: string, filters?: TestimonialFilters) => [...organizationKeys.detail(id), 'testimonials', filters] as const,
  media: (id: string, filters?: MediaFilters) => [...organizationKeys.detail(id), 'media', filters] as const,
};

// ==================== ORGANIZATION DATA HOOKS ====================

/**
 * Get organization basic info
 * Used for: Page metadata, routing, basic display
 */
export function useOrganizationBasic(slug: string) {
  return useQuery({
    queryKey: organizationKeys.detail(slug),
    queryFn: () => OrganizationService.getBasicInfo(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!slug
  });
}

/**
 * Get overview tab data
 * Used for: OverviewTab component
 */
export function useOrganizationOverview(organizationId: string) {
  return useQuery({
    queryKey: organizationKeys.overview(organizationId),
    queryFn: () => OrganizationService.getOverview(organizationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get experience tab data
 * Used for: ExperienceTab component
 */
export function useOrganizationExperience(organizationId: string) {
  return useQuery({
    queryKey: organizationKeys.experience(organizationId),
    queryFn: () => OrganizationService.getExperience(organizationId),
    staleTime: 10 * 60 * 1000, // 10 minutes (less frequent updates)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get practical tab data
 * Used for: PracticalTab component, EssentialInfoSidebar
 */
export function useOrganizationPractical(organizationId: string) {
  return useQuery({
    queryKey: organizationKeys.practical(organizationId),
    queryFn: () => OrganizationService.getPractical(organizationId),
    staleTime: 15 * 60 * 1000, // 15 minutes (stable data)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get location tab data
 * Used for: LocationTab component
 */
export function useOrganizationLocation(organizationId: string) {
  return useQuery({
    queryKey: organizationKeys.location(organizationId),
    queryFn: () => OrganizationService.getLocation(organizationId),
    staleTime: 20 * 60 * 1000, // 20 minutes (very stable data)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get stories tab data
 * Used for: StoriesTab component
 */
export function useOrganizationStories(
  organizationId: string, 
  filters: TestimonialFilters = {}
) {
  return useQuery({
    queryKey: organizationKeys.stories(organizationId, filters),
    queryFn: () => OrganizationService.getStories(organizationId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get essential info for sidebar
 * Used for: EssentialInfoSidebar component
 */
export function useOrganizationEssentials(organizationId: string) {
  return useQuery({
    queryKey: organizationKeys.essentials(organizationId),
    queryFn: () => OrganizationService.getEssentials(organizationId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get paginated testimonials
 * Used for: Testimonial pagination, infinite scroll
 */
export function useTestimonials(
  organizationId: string,
  filters: TestimonialFilters = {}
) {
  return useQuery({
    queryKey: organizationKeys.testimonials(organizationId, filters),
    queryFn: () => OrganizationService.getTestimonials(organizationId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Get media items with filtering
 * Used for: Photo galleries, modal displays
 */
export function useOrganizationMedia(
  organizationId: string,
  filters: MediaFilters = {}
) {
  return useQuery({
    queryKey: organizationKeys.media(organizationId, filters),
    queryFn: () => OrganizationService.getMedia(organizationId, filters),
    staleTime: 15 * 60 * 1000, // 15 minutes (stable media)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    enabled: !!organizationId
  });
}

/**
 * Search organizations with filters
 * Used for: Organization listing pages, search results
 */
export function useOrganizationSearch(
  filters: OrganizationFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 12 }
) {
  return useQuery({
    queryKey: organizationKeys.list({ ...filters, ...pagination }),
    queryFn: () => OrganizationService.searchOrganizations(filters, pagination),
    staleTime: 2 * 60 * 1000, // 2 minutes (fresh for search)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    keepPreviousData: true // For pagination UX
  });
}

// ==================== TAB-SPECIFIC HOOKS WITH LOADING STATES ====================

/**
 * Hook for tab components with standardized loading/error states
 */
export function useTabData<T>(
  queryResult: ReturnType<typeof useQuery<T>>,
  tabName: string
) {
  const { data, isLoading, error, isError, refetch } = queryResult;

  return {
    data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    // Standardized loading component props
    loadingProps: {
      isLoading,
      error: error as Error | null,
      retry: refetch,
      tabName
    }
  };
}

// ==================== FORM SUBMISSION HOOKS ====================

/**
 * Submit contact form
 * Used for: ConnectTab "I Have Questions" flow
 */
export function useSubmitContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, formData }: { 
      organizationId: string; 
      formData: ContactFormData 
    }) => ContactService.submitContactForm(organizationId, formData),
    onSuccess: (data, variables) => {
      // Invalidate organization data to refresh any counters
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.organizationId)
      });
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    }
  });
}

/**
 * Submit volunteer application
 * Used for: ConnectTab "I'm Ready to Apply" flow
 */
export function useSubmitApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, applicationData }: {
      organizationId: string;
      applicationData: ApplicationFormData
    }) => ContactService.submitApplication(organizationId, applicationData),
    onSuccess: (data, variables) => {
      // Invalidate organization data to refresh any counters
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.organizationId)
      });
    },
    onError: (error) => {
      console.error('Application submission failed:', error);
    }
  });
}

/**
 * Check for existing submissions
 * Used for: Preventing duplicate submissions
 */
export function useCheckExistingSubmission(organizationId: string, email: string) {
  return useQuery({
    queryKey: ['existingSubmission', organizationId, email],
    queryFn: () => ContactService.checkExistingSubmission(organizationId, email),
    enabled: !!organizationId && !!email && email.includes('@'),
    staleTime: 0, // Always fresh check
    retry: 1
  });
}

// ==================== PREFETCHING UTILITIES ====================

/**
 * Prefetch all tab data for better UX
 * Used for: Preloading tab content on page load
 */
export function usePrefetchOrganizationTabs(organizationId: string) {
  const queryClient = useQueryClient();

  const prefetchTabs = async () => {
    if (!organizationId) return;

    // Prefetch all tab data in parallel
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: organizationKeys.overview(organizationId),
        queryFn: () => OrganizationService.getOverview(organizationId),
        staleTime: 5 * 60 * 1000
      }),
      queryClient.prefetchQuery({
        queryKey: organizationKeys.experience(organizationId),
        queryFn: () => OrganizationService.getExperience(organizationId),
        staleTime: 10 * 60 * 1000
      }),
      queryClient.prefetchQuery({
        queryKey: organizationKeys.practical(organizationId),
        queryFn: () => OrganizationService.getPractical(organizationId),
        staleTime: 15 * 60 * 1000
      }),
      queryClient.prefetchQuery({
        queryKey: organizationKeys.stories(organizationId, { limit: 4 }),
        queryFn: () => OrganizationService.getStories(organizationId, { limit: 4 }),
        staleTime: 5 * 60 * 1000
      })
    ]);
  };

  return { prefetchTabs };
}

// ==================== ERROR HANDLING UTILITIES ====================

/**
 * Standard error handling for organization data
 */
export function useOrganizationErrorHandler() {
  const handleError = (error: Error, context: string) => {
    console.error(`Organization ${context} error:`, error);
    
    // You can add error reporting service here
    // errorReportingService.captureException(error, { context });
    
    return {
      message: 'Unable to load organization data. Please try again.',
      retry: true
    };
  };

  return { handleError };
}

// ==================== LOADING STATE COMPONENTS ====================

export interface TabLoadingProps {
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
  tabName: string;
}

export function getLoadingComponent(props: TabLoadingProps) {
  if (props.isLoading) {
    return `Loading ${props.tabName} data...`;
  }
  
  if (props.error) {
    return {
      error: props.error.message,
      retry: props.retry
    };
  }
  
  return null;
}