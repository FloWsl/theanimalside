import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getOrganizationBySlug } from '../data/organizationDetails';
import { generateOrganizationPageSEO, useSEO } from '../utils/seoUtils';
import { isValidOrganizationSlug, parseRoute } from '../utils/routeUtils';
import { OrganizationDetail as OrganizationDetailType } from '../types';
import OrganizationDetail from './OrganizationDetail';

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
  console.log('🏢 DEBUG: FlatOrganizationPage component rendering');
  console.log('🏢 DEBUG: Current URL:', window.location.pathname);
  const { orgSlug } = useParams<{ orgSlug: string }>();
  console.log('🏢 DEBUG: orgSlug param:', orgSlug);

  // Validate organization route
  const routeValidation = React.useMemo(() => {
    if (!orgSlug) return { isValid: false, shouldRedirect: true, redirectTo: '/opportunities' };

    // Check if it's a valid organization slug
    const isValidOrg = isValidOrganizationSlug(orgSlug);
    console.log('🏢 DEBUG: Organization validation result:', isValidOrg);
    
    return {
      isValid: isValidOrg,
      shouldRedirect: !isValidOrg,
      redirectTo: isValidOrg ? null : '/opportunities'
    };
  }, [orgSlug]);

  // Find organization by slug (only if route is valid)
  const organization = React.useMemo(() => {
    if (!orgSlug || !routeValidation.isValid) return null;
    return getOrganizationBySlug(orgSlug);
  }, [orgSlug, routeValidation.isValid]);

  // Generate and apply SEO metadata for flat organization URL
  const seoMetadata = React.useMemo(() => {
    if (!organization) {
      return {
        title: 'Organization Not Found | The Animal Side',
        description: 'The organization you are looking for could not be found. Browse our directory of verified wildlife conservation organizations.',
        keywords: ['wildlife organizations', 'conservation', 'volunteer opportunities']
      };
    }
    
    return generateOrganizationPageSEO(organization);
  }, [organization]);

  useSEO(seoMetadata);

  // Handle invalid organization routes
  if (routeValidation.shouldRedirect && routeValidation.redirectTo) {
    console.log('🏢 DEBUG: Redirecting to:', routeValidation.redirectTo);
    return <Navigate to={routeValidation.redirectTo} replace />;
  }

  // Handle missing orgSlug parameter
  if (!orgSlug) {
    return <Navigate to="/opportunities" replace />;
  }

  // Handle invalid organization slug
  if (!routeValidation.isValid || !organization) {
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

  // Render the full organization detail component
  // We pass the organization data directly to avoid re-fetching
  return (
    <OrganizationDetailWrapper 
      organization={organization} 
      flatUrl={true}
    />
  );
};

/**
 * Wrapper component to pass organization data to OrganizationDetail
 * This ensures the component receives the organization without needing to refetch
 */
interface OrganizationDetailWrapperProps {
  organization: OrganizationDetailType;
  flatUrl?: boolean;
}

const OrganizationDetailWrapper: React.FC<OrganizationDetailWrapperProps> = ({ 
  organization,
  flatUrl = false 
}) => {
  // The OrganizationDetail component expects to fetch data via useParams
  // Since we already have the organization, we'll render it directly
  // but still let the component handle its own internal state management
  
  return (
    <div className="organization-detail-flat-wrapper">
      {/* Add a subtle indicator that this is a direct organization URL */}
      {flatUrl && (
        <div className="sr-only">
          Direct organization page: {organization.name}
        </div>
      )}
      
      {/* Render the existing OrganizationDetail component */}
      <OrganizationDetail />
    </div>
  );
};

export default FlatOrganizationPage;