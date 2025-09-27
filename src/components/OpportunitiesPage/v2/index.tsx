import React, { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOpportunitiesV2 } from '../../../hooks/useOpportunityData';
import { SearchFilters } from '../../../types';
import OpportunitiesPageHero from './OpportunitiesPageHero';
import Breadcrumb, { useBreadcrumbs } from '../../ui/Breadcrumb';

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
export interface V2SearchFilters extends SearchFilters {
  costRange?: 'free' | 'under-500' | 'under-1000' | 'any';
  locations?: string[]; // Multi-select locations
}

const OpportunitiesPageV2: React.FC = () => {
  const [filters, setFilters] = useState<V2SearchFilters>({});
  const breadcrumbs = useBreadcrumbs();
  
  // Fetch opportunities from database with filters
  const { data: opportunitiesData, isLoading, error } = useOpportunitiesV2(filters);
  
  // Extract opportunities from the API response
  const opportunities = opportunitiesData?.data || [];
  const totalCount = opportunitiesData?.count || 0;
  
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
    const count = opportunities.length;
    let description = `Discover ${count} verified wildlife conservation volunteer opportunities worldwide. `;
    
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
            resultCount={opportunities.length}
            totalCount={totalCount}
          />
        </Suspense>
        
        {/* Results Grid */}
        <Suspense fallback={<GridLoader />}>
          {error ? (
            <div className="container mx-auto px-6 py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700">Error loading opportunities: {error.message}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <GridLoader />
          ) : (
            <OpportunityGrid 
              opportunities={opportunities}
              filters={filters}
            />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default OpportunitiesPageV2;