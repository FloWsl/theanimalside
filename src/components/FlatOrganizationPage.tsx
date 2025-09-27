import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { generateOrganizationPageSEO, useSEO } from '../utils/seoUtils';
import { isValidOrganizationSlug, parseRoute } from '../utils/routeUtils';
import { useOrganizationBasic } from '../hooks/useOrganizationData';
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
  const { orgSlug } = useParams<{ orgSlug: string }>();
  
  // Fetch organization data from database
  const { data: organization, isLoading, error } = useOrganizationBasic(orgSlug || '');
  
  // Skip query if no orgSlug
  if (!orgSlug) {
    return <Navigate to="/opportunities" replace />;
  }

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
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-forest/70 text-sm">Loading organization...</p>
        </div>
      </div>
    );
  }

  // Handle database errors or organization not found
  if (error || !organization) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-hero text-deep-forest mb-4">
            Organization Not Found
          </h1>
          <p className="text-body text-forest/80 mb-8">
            We couldn't find an organization with the slug "{orgSlug}". 
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

  // Redirect valid organization slugs to structured route
  if (organization) {
    return <Navigate to={`/organization/${orgSlug}`} replace />;
  }
  
  // This should not be reached due to error handling above
  return <Navigate to="/opportunities" replace />;
};

export default FlatOrganizationPage;