import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { OrganizationService } from '../../../services/organizationService';
import type { OrganizationFilters } from '../../../types/database';
import OpportunitiesPageHero from './OpportunitiesPageHero';
import Breadcrumb, { useBreadcrumbs } from '../../ui/Breadcrumb';
import { organizationDetails } from '../../../data/organizationDetails';

// Lazy load heavy components
const OpportunityFilters = lazy(() => import('./OpportunityFilters'));
const OpportunityGrid = lazy(() => import('./OpportunityGrid'));

// Lightweight loading component
const FilterLoader = () => (
  <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-beige/40 py-4">
    <div className="container mx-auto px-4 lg:px-6">
      <div className="animate-pulse">
        <div className="h-6 bg-warm-beige/40 rounded w-48 mb-2"></div>
        <div className="h-4 bg-warm-beige/30 rounded w-64"></div>
      </div>
    </div>
  </div>
);

const GridLoader = () => (
  <section className="py-8">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-warm-beige/30 rounded-2xl h-80"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Enhanced search filters for v2
export interface V2SearchFilters extends OrganizationFilters {
  costRange?: 'free' | 'under-500' | 'under-1000' | 'any';
  locations?: string[]; // Multi-select locations
}

const OpportunitiesPageV2: React.FC = () => {
  const [filters, setFilters] = useState<V2SearchFilters>({});
  const [page, setPage] = useState(1);
  const breadcrumbs = useBreadcrumbs();
  
  // Query organizations with filters
  const { data: organizationsResponse, isLoading, error } = useQuery({
    queryKey: ['organizations', filters, page],
    queryFn: () => OrganizationService.searchOrganizations(filters, { page, limit: 12 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add fallback to mock data when database is empty
  const organizations = useMemo(() => {
    const dbOrganizations = organizationsResponse?.data || [];
    
    // If database has no results, fall back to mock data
    if (dbOrganizations.length === 0) {
      
      // Filter mock data based on current filters
      let filteredMock = organizationDetails;
      
      if (filters.country) {
        filteredMock = filteredMock.filter((org: any) => 
          org.location.country === filters.country
        );
      }
      
      if (filters.locations && filters.locations.length > 0) {
        filteredMock = filteredMock.filter((org: any) => 
          filters.locations!.includes(org.location.country)
        );
      }
      
      // Convert to opportunity format for UI compatibility
      return filteredMock.map((org: any) => ({
        id: org.id,
        title: org.name,
        organization: org.name,
        description: org.tagline || org.mission || `Wildlife conservation opportunities`,
        location: { 
          country: org.location.country, 
          city: org.location.city || '', 
          coordinates: org.location.coordinates || [0, 0]
        },
        images: [org.heroImage || '/images/default-wildlife.jpg'],
        animalTypes: org.animalTypes || ['Wildlife'], 
        duration: { min: 2, max: 12 },
        cost: { amount: null, currency: 'USD', period: 'total', includes: [] },
        requirements: org.requirements || [],
        featured: org.featured || false,
        datePosted: new Date().toISOString(),
        slug: org.slug
      }));
    }
    
    // Convert database organizations to opportunity format
    return dbOrganizations.map(org => ({
      id: org.id,
      title: org.name,
      organization: org.name,
      description: org.tagline || org.mission || `Wildlife conservation opportunities`,
      location: { 
        country: org.country, 
        city: org.city || '', 
        coordinates: [0, 0] // Default coordinates
      },
      images: [org.hero_image || '/images/default-wildlife.jpg'],
      animalTypes: ['Wildlife'], // Default animal type - could be enhanced with actual data
      duration: { min: 2, max: 12 },
      cost: { amount: null, currency: 'USD', period: 'total', includes: [] },
      requirements: [],
      featured: org.featured || false,
      datePosted: org.created_at || new Date().toISOString(),
      slug: org.slug
    }));
  }, [organizationsResponse, filters]);
  const hasMore = organizationsResponse?.has_more || false;
  
  const handleFilterChange = (newFilters: V2SearchFilters) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters({});
  };
  
  // Generate dynamic page title based on filters
  const generatePageTitle = () => {
    let title = 'Wildlife Conservation Volunteer Opportunities';
    
    if (filters.locations && filters.locations.length === 1) {
      title = `Wildlife Volunteering in ${filters.locations[0]} | The Animal Side`;
    } else if (filters.locations && filters.locations.length > 1) {
      title = `Wildlife Volunteering in ${filters.locations.length} Countries | The Animal Side`;
    } else if (filters.animalTypes && filters.animalTypes.length === 1) {
      title = `${filters.animalTypes[0]} Conservation Volunteering | The Animal Side`;
    } else if (filters.costRange === 'free') {
      title = 'Free Wildlife Volunteer Opportunities | The Animal Side';
    }
    
    return title;
  };
  
  const generatePageDescription = () => {
    const count = organizationsResponse?.count || 0;
    let description = `Discover ${count} verified wildlife conservation organizations worldwide. `;
    
    if (filters.locations && filters.locations.length > 0) {
      description += `Work with wildlife in ${filters.locations.join(', ')}. `;
    }
    if (filters.animalTypes && filters.animalTypes.length > 0) {
      description += `Specializing in ${filters.animalTypes.join(', ')} conservation. `;
    }
    if (filters.costRange === 'free') {
      description += 'All programs are completely free. ';
    }
    
    description += 'Apply directly to ethical organizations with authentic reviews.';
    
    return description;
  };
  
  return (
    <>
      <Helmet>
        <title>{generatePageTitle()}</title>
        <meta name="description" content={generatePageDescription()} />
        <meta name="keywords" content="wildlife volunteer, conservation, animals, volunteer abroad, ethical volunteering" />
        <meta property="og:title" content={generatePageTitle()} />
        <meta property="og:description" content={generatePageDescription()} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://theanimalside.com/opportunities" />
      </Helmet>
      
      <div className="min-h-screen bg-soft-cream">
        {/* Breadcrumb Navigation - Top of page */}
        <div className="bg-soft-cream/80 backdrop-blur-sm border-b border-warm-beige/30">
          <div className="container mx-auto px-6 py-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>

        {/* Hero Section */}
        <OpportunitiesPageHero />
        
        {/* Filters Section */}
        <Suspense fallback={<FilterLoader />}>
          <OpportunityFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={organizations.length}
            totalCount={organizationsResponse?.count || 0}
          />
        </Suspense>
        
        {/* Results Grid */}
        <Suspense fallback={<GridLoader />}>
          {isLoading ? (
            <GridLoader />
          ) : error ? (
            <div className="py-8">
              <div className="container mx-auto px-6 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-section text-deep-forest mb-2">Unable to Load Organizations</h2>
                <p className="text-body text-forest/70">Please try again later.</p>
              </div>
            </div>
          ) : (
            <OpportunityGrid 
              opportunities={organizations}
              filters={filters}
            />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default OpportunitiesPageV2;