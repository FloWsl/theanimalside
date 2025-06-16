import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { opportunities } from '../../../data/opportunities';
import { SearchFilters } from '../../../types';
import OpportunitiesPageHero from './OpportunitiesPageHero';

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
  
  // Smart filtering logic with performance optimization
  const filteredOpportunities = useMemo(() => {
    // Early return if no filters
    if (Object.keys(filters).length === 0) return opportunities;
    
    let filtered = opportunities;
    
    // Multi-location filtering
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter(opp => 
        filters.locations!.some(location => 
          opp.location.country.toLowerCase().includes(location.toLowerCase()) || 
          opp.location.city.toLowerCase().includes(location.toLowerCase())
        )
      );
    }
    
    // Animal type filtering
    if (filters.animalTypes && filters.animalTypes.length > 0) {
      filtered = filtered.filter(opp => 
        filters.animalTypes!.some(type => 
          opp.animalTypes.some(oppType => 
            oppType.toLowerCase().includes(type.toLowerCase())
          )
        )
      );
    }
    
    // Cost range filtering
    if (filters.costRange) {
      switch (filters.costRange) {
        case 'free':
          filtered = filtered.filter(opp => opp.cost.amount === 0);
          break;
        case 'under-500':
          filtered = filtered.filter(opp => 
            opp.cost.amount === 0 || (opp.cost.amount && opp.cost.amount <= 500)
          );
          break;
        case 'under-1000':
          filtered = filtered.filter(opp => 
            opp.cost.amount === 0 || (opp.cost.amount && opp.cost.amount <= 1000)
          );
          break;
        default:
          // 'any' - no filtering
          break;
      }
    }
    
    // Duration filtering
    if (filters.durationMin !== undefined) {
      filtered = filtered.filter(opp => opp.duration.min >= filters.durationMin!);
    }
    
    if (filters.durationMax !== undefined) {
      filtered = filtered.filter(opp => 
        opp.duration.max === null || opp.duration.max <= filters.durationMax!
      );
    }
    
    // Search term filtering
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchLower) || 
        opp.description.toLowerCase().includes(searchLower) ||
        opp.organization.toLowerCase().includes(searchLower) ||
        opp.animalTypes.some(animal => animal.toLowerCase().includes(searchLower))
      );
    }
    
    // Smart sorting: FREE first, then featured, then by date
    return filtered.sort((a, b) => {
      // Free opportunities first
      if (a.cost.amount === 0 && b.cost.amount !== 0) return -1;
      if (a.cost.amount !== 0 && b.cost.amount === 0) return 1;
      
      // Then featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Finally by date
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    });
  }, [filters]);
  
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
    const count = filteredOpportunities.length;
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
        {/* Hero Section */}
        <OpportunitiesPageHero />
        
        {/* Filters Section */}
        <Suspense fallback={<FilterLoader />}>
          <OpportunityFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredOpportunities.length}
            totalCount={opportunities.length}
          />
        </Suspense>
        
        {/* Results Grid */}
        <Suspense fallback={<GridLoader />}>
          <OpportunityGrid 
            opportunities={filteredOpportunities}
            filters={filters}
          />
        </Suspense>
      </div>
    </>
  );
};

export default OpportunitiesPageV2;