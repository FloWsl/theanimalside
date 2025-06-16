import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Leaf } from 'lucide-react';
import { Opportunity } from '../../../types';
import { V2SearchFilters } from './index';
import OpportunityCard from './OpportunityCard';
import OpportunityGridSkeleton from './OpportunityGridSkeleton';

interface OpportunityGridProps {
  opportunities: Opportunity[];
  filters: V2SearchFilters;
}

const INITIAL_LOAD = 9; // 3x3 grid for better visual balance
const LOAD_MORE_COUNT = 6; // Load 6 more at a time

const OpportunityGrid: React.FC<OpportunityGridProps> = ({
  opportunities,
  filters
}) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [loading, setLoading] = useState(false);
  
  // Visible opportunities
  const visibleOpportunities = useMemo(() => {
    return opportunities.slice(0, visibleCount);
  }, [opportunities, visibleCount]);
  
  const hasMoreToLoad = visibleCount < opportunities.length;
  
  // Load more opportunities
  const handleLoadMore = async () => {
    setLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, opportunities.length));
    setLoading(false);
  };
  
  // Reset visible count when filters change
  React.useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [filters]);
  
  // Simple opportunity display - let users create their own discovery through filtering
  
  // Generate helpful messaging based on filters
  const getFilterMessage = () => {
    if (opportunities.length === 0) {
      if (Object.keys(filters).length === 0) {
        return "No opportunities available at the moment.";
      }
      return "No opportunities match your current filters. Try adjusting your search criteria.";
    }
    
    if (filters.locations && filters.locations.length > 0) {
      if (filters.locations.length === 1) {
        return `Conservation opportunities in ${filters.locations[0]}`;
      } else {
        return `Conservation opportunities in ${filters.locations.join(', ')}`;
      }
    }
    
    if (filters.animalTypes && filters.animalTypes.length > 0) {
      return `Opportunities working with ${filters.animalTypes.join(', ')}`;
    }
    
    if (filters.costRange === 'free') {
      return "Free volunteer programs - no cost to participate";
    }
    
    return "Browse all available conservation opportunities";
  };
  
  if (opportunities.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Leaf className="w-16 h-16 text-sage-green/40 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-deep-forest mb-4">
              {Object.keys(filters).length === 0 ? "No Opportunities Available" : "No Matches Found"}
            </h3>
            <p className="text-forest/70 mb-8">
              {getFilterMessage()}
            </p>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => window.location.reload()}
                className="bg-sage-green hover:bg-sage-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-6">
        {/* Header with messaging */}
        <div className="mb-8">
          <p className="text-forest/70 text-lg mb-2">
            {getFilterMessage()}
          </p>
          <p className="text-forest/60 text-sm">
            Showing {visibleOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>
        
        {/* Opportunities Grid - Clean and simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleOpportunities.map((opportunity, index) => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity}
                index={index}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Load More Section */}
        {hasMoreToLoad && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-warm-beige to-transparent mx-auto mb-4"></div>
              <p className="text-forest/60 text-sm mb-6">
                {opportunities.length - visibleCount} more opportunities available
              </p>
            </div>
            
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-sage-green hover:bg-sage-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 mx-auto"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <span>Load More Opportunities</span>
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-forest/50 text-xs mt-4">
              Take your time. The right opportunity will call to you.
            </p>
          </motion.div>
        )}
        
        {/* Loading skeleton for new items */}
        {loading && (
          <div className="mt-8">
            <OpportunityGridSkeleton count={LOAD_MORE_COUNT} />
          </div>
        )}
        
        {/* End of results message */}
        {!hasMoreToLoad && opportunities.length > INITIAL_LOAD && (
          <motion.div 
            className="text-center mt-12 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-warm-beige to-transparent mx-auto mb-4"></div>
            <p className="text-forest/60">
              You've seen all {opportunities.length} opportunities
              {Object.keys(filters).length > 0 && " that match your filters"}
            </p>
            <p className="text-forest/50 text-sm mt-2">
              Try adjusting your filters to discover more conservation programs
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OpportunityGrid;