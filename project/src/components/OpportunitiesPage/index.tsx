import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import SearchFilters from './SearchFilters';
import OpportunityCard from './OpportunityCard';
import { opportunities } from '../../data/opportunities';
import { Opportunity, SearchFilters as SearchFiltersType } from '../../types';
import { MapPin, Leaf } from 'lucide-react';

const OpportunitiesPage: React.FC = () => {
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(opportunities);
  const [activeFilters, setActiveFilters] = useState<SearchFiltersType>({});
  
  const handleFilterChange = (filters: SearchFiltersType) => {
    setActiveFilters(filters);
    
    let filtered = [...opportunities];
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchLower) || 
        opp.description.toLowerCase().includes(searchLower) ||
        opp.organization.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.location.country.toLowerCase().includes(locationLower) || 
        opp.location.city.toLowerCase().includes(locationLower)
      );
    }
    
    if (filters.animalTypes && filters.animalTypes.length > 0) {
      filtered = filtered.filter(opp => 
        filters.animalTypes!.some(type => opp.animalTypes.includes(type))
      );
    }
    
    if (filters.durationMin !== undefined) {
      filtered = filtered.filter(opp => opp.duration.min >= filters.durationMin!);
    }
    
    if (filters.durationMax !== undefined) {
      filtered = filtered.filter(opp => 
        opp.duration.max === null || opp.duration.max <= filters.durationMax!
      );
    }
    
    if (filters.costMax !== undefined) {
      filtered = filtered.filter(opp => 
        opp.cost.amount === null || opp.cost.amount <= filters.costMax!
      );
    }
    
    setFilteredOpportunities(filtered);
  };
  
  return (
    <>
      <Helmet>
        <title>Wildlife Volunteer Opportunities | Wild Harmony</title>
        <meta 
          name="description" 
          content="Browse volunteer opportunities worldwide to work with wildlife in animal rescue, rehabilitation and care centers." 
        />
      </Helmet>
      
      <section className="relative py-24 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-texture"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-accent-400" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                Find Your Calling
              </h1>
            </div>
            <p className="text-xl text-primary-100 max-w-2xl">
              Discover meaningful opportunities to make a difference in wildlife conservation. 
              Filter by location, species, duration, and more to find your perfect match.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 bg-cream">
        <div className="container mx-auto px-4 md:px-6">
          <SearchFilters onFilterChange={handleFilterChange} />
          
          {Object.keys(activeFilters).length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-secondary-700 font-medium">Active filters:</span>
                {activeFilters.searchTerm && (
                  <span className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full text-sm font-medium">
                    Search: {activeFilters.searchTerm}
                  </span>
                )}
                {activeFilters.location && (
                  <span className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {activeFilters.location}
                  </span>
                )}
                {activeFilters.animalTypes?.map(type => (
                  <span key={type} className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full text-sm font-medium">
                    {type}
                  </span>
                ))}
                {(activeFilters.durationMin !== undefined || activeFilters.durationMax !== undefined) && (
                  <span className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full text-sm font-medium">
                    Duration: {activeFilters.durationMin || 'Any'} - {activeFilters.durationMax || 'Any'} weeks
                  </span>
                )}
                {activeFilters.costMax !== undefined && (
                  <span className="bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full text-sm font-medium">
                    Max Cost: ${activeFilters.costMax}
                  </span>
                )}
              </div>
            </motion.div>
          )}
          
          {filteredOpportunities.length === 0 ? (
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Leaf className="w-16 h-16 text-secondary-300 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-semibold mb-3 text-forest">
                No opportunities found
              </h3>
              <p className="text-secondary-600 mb-6">
                Try adjusting your filters or broadening your search criteria to find more opportunities.
              </p>
              <button
                onClick={() => handleFilterChange({})}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {filteredOpportunities.map((opportunity, index) => (
                <OpportunityCard 
                  key={opportunity.id} 
                  opportunity={opportunity}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default OpportunitiesPage;