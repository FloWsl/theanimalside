import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OrganizationService } from '../services/organizationService';
import { generateDatabaseOrganizationPageSEO, useSEO } from '../utils/seoUtils';
import { parseRoute, isValidAnimalSlug, isValidCountrySlug } from '../utils/routeUtils';
import type { Organization } from '../types/database';

// Lazy load CombinedPage for dynamic routing
const CombinedPage = React.lazy(() => import('./CombinedPage'));

/**
 * FlatOrganizationPage - Handler for direct organization access routes
 * 
 * Handles routes like /{orgSlug} and redirects to proper organization detail
 * with enhanced SEO metadata for flat URL structure.
 * 
 * Examples:
 * - /toucan-rescue-ranch-costa-rica → Organization detail page
 * - /marine-conservation-thailand → Organization detail page  
 * - /elephant-sanctuary-kenya → Organization detail page
 */

const FlatOrganizationPage: React.FC = () => {
  const { orgSlug, firstSegment, secondSegment } = useParams<{ 
    orgSlug?: string;
    firstSegment?: string; 
    secondSegment?: string;
  }>();

  // Validate route - could be organization or combined animal-country route
  const routeValidation = React.useMemo(() => {
    // Handle two-segment routes (animal-country combinations)
    if (firstSegment && secondSegment) {
      // Parse the full pathname to check for combined routes like /orangutans-volunteer/costa-rica
      const fullPath = window.location.pathname;
      const parsedRoute = parseRoute(fullPath);

      if (parsedRoute.type === 'combined' && parsedRoute.params.animal && parsedRoute.params.country) {
        // Validate both animal and country
        const isValidAnimal = isValidAnimalSlug(parsedRoute.params.animal);
        const isValidCountry = isValidCountrySlug(parsedRoute.params.country);
        
        if (isValidAnimal && isValidCountry) {
          return { 
            type: 'combined', 
            isValid: true, 
            shouldRedirect: false, 
            redirectTo: null,
            animal: parsedRoute.params.animal,
            country: parsedRoute.params.country
          };
        }
      }
      
      return {
        type: 'invalid',
        isValid: false,
        shouldRedirect: true,
        redirectTo: '/opportunities'
      };
    }

    // Handle single-segment routes (organization slugs)
    if (!orgSlug) return { type: 'invalid', isValid: false, shouldRedirect: true, redirectTo: '/opportunities' };

    // For organization routes, we'll validate asynchronously with React Query
    // so return organization type to enable the query
    return { type: 'organization', isValid: true, shouldRedirect: false, redirectTo: null };
  }, [orgSlug, firstSegment, secondSegment]);

  // Query organization by slug (only if route is organization type)
  const { data: organization, isLoading: isOrgLoading, error: orgError } = useQuery({
    queryKey: ['organization', orgSlug],
    queryFn: () => OrganizationService.getOrganizationBySlug(orgSlug!),
    enabled: !!orgSlug && routeValidation.type === 'organization',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query organization slug validation
  const { data: isValidOrg = false, isLoading: isValidationLoading } = useQuery({
    queryKey: ['organization-validation', orgSlug],
    queryFn: () => OrganizationService.isValidOrganizationSlug(orgSlug!),
    enabled: !!orgSlug && routeValidation.type === 'organization',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });


  // Generate and apply SEO metadata 
  const seoMetadata = React.useMemo(() => {
    if (routeValidation.type === 'organization' && organization) {
      return generateDatabaseOrganizationPageSEO(organization);
    }
    
    if (routeValidation.type === 'combined') {
      // Generate SEO for combined route
      const animal = routeValidation.animal || '';
      const country = routeValidation.country || '';
      return {
        title: `${animal.charAt(0).toUpperCase() + animal.slice(1)} Volunteer Programs in ${country.charAt(0).toUpperCase() + country.slice(1)} | The Animal Side`,
        description: `Discover ${animal} conservation volunteer opportunities in ${country}. Find verified programs and make a difference in wildlife conservation.`,
        keywords: [animal, 'volunteer', country, 'conservation', 'wildlife']
      };
    }
    
    return {
      title: 'Page Not Found | The Animal Side',
      description: 'The page you are looking for could not be found. Browse our directory of verified wildlife conservation organizations.',
      keywords: ['wildlife organizations', 'conservation', 'volunteer opportunities']
    };
  }, [organization, routeValidation]);

  useSEO(seoMetadata);

  // Handle invalid organization routes
  if (routeValidation.shouldRedirect && routeValidation.redirectTo) {
    return <Navigate to={routeValidation.redirectTo} replace />;
  }

  // Show loading state while validating organization
  if (routeValidation.type === 'organization' && (isValidationLoading || isOrgLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-cream">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest/70 text-sm">Loading organization...</p>
        </div>
      </div>
    );
  }


  // Handle organization validation error or invalid organization (only after loading completes)
  if (routeValidation.type === 'organization' && !isValidationLoading && !isOrgLoading && (!isValidOrg || !organization || orgError)) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-hero text-deep-forest mb-4">
            Organization Not Found
          </h1>
          <p className="text-body text-forest/80 mb-8">
            We couldn't find an organization with the name "{orgSlug}". 
            It may have been moved or the URL might be incorrect.
          </p>
          <div className="space-y-4">
            <a 
              href="/opportunities"
              className="inline-block w-full px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-deep-earth transition-colors font-medium"
            >
              Browse All Organizations
            </a>
            <a 
              href="/"
              className="inline-block w-full px-6 py-3 border-2 border-rich-earth text-rich-earth rounded-lg hover:bg-rich-earth hover:text-white transition-colors font-medium"
            >
              Return to Home
            </a>
          </div>
          
          {/* Help text for debugging */}
          <div className="mt-8 text-sm text-forest/60">
            Looking for a specific organization? Try searching from our{' '}
            <a href="/opportunities" className="text-rich-earth hover:underline">
              opportunities page
            </a>
            .
          </div>
        </div>
      </div>
    );
  }

  // Handle missing orgSlug parameter
  if (!orgSlug) {
    return <Navigate to="/opportunities" replace />;
  }

  // Render combined page for animal-country routes
  if (routeValidation.type === 'combined' && routeValidation.isValid) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-soft-cream">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-forest/70 text-sm">Loading...</p>
          </div>
        </div>
      }>
        <CombinedPage type="animal-country" />
      </React.Suspense>
    );
  }


  // Render the full organization detail component (only if we have valid organization)
  if (organization) {
    return (
      <OrganizationDetailWrapper 
        organization={organization} 
        flatUrl={true}
      />
    );
  }

  // This should not happen due to validation above, but provide fallback
  return <Navigate to="/opportunities" replace />;
};

/**
 * Wrapper component to pass organization data to OrganizationDetail
 * This ensures the component receives the organization without needing to refetch
 */
interface OrganizationDetailWrapperProps {
  organization: Organization;
  flatUrl?: boolean;
}

const OrganizationDetailWrapper: React.FC<OrganizationDetailWrapperProps> = ({ 
  organization,
  flatUrl = false 
}) => {
  // Extract the slug from the current URL since we need to maintain the slug-based routing
  const currentPath = window.location.pathname;
  const urlSlug = currentPath.replace('/', ''); // Remove leading slash to get the slug
  
  return (
    <div className="organization-detail-flat-wrapper">
      {/* Add a subtle indicator that this is a direct organization URL */}
      {flatUrl && (
        <div className="sr-only">
          Direct organization page: {organization.name}
        </div>
      )}
      
      {/* Redirect to the legacy route format that OrganizationDetail expects */}
      <Navigate to={`/organization/${urlSlug}${window.location.search}`} replace />
    </div>
  );
};

export default FlatOrganizationPage;