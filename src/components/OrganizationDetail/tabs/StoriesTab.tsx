// src/components/OrganizationDetail/tabs/StoriesTab.tsx
import React from 'react';
import { useOrganizationStories } from '../../../hooks/useOrganizationData';

// Industry-standard components following Airbnb/TripAdvisor patterns
import RatingOverview from '../RatingOverview';
import ExternalImmersionLinks from '../ExternalImmersionLinks';
import ReviewCards from '../ReviewCards';
import SharedTabSection from '../SharedTabSection';
import { Zap } from 'lucide-react';

interface StoriesTabProps {
  organizationId: string;
  onTabChange?: (tabId: string) => void;
}

const StoriesTab: React.FC<StoriesTabProps> = ({ organizationId, onTabChange }) => {
  // Fetch testimonials using React Query
  const { data: storiesData, isLoading, error } = useOrganizationStories(organizationId);
  
  // Extract testimonials and organization data from the stories data
  const testimonials = storiesData?.testimonials || [];
  const organization = storiesData?.organization;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-nature-md">
        <div className="flex items-center justify-center py-12">
          <div className="text-forest/60">Loading volunteer stories...</div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="space-nature-md">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600">Error loading volunteer stories. Please try again.</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-nature-md">
      {/* Level 1: Essential Experience Overview - Always Visible */}
      <SharedTabSection
        title="Volunteer Stories"
        variant="hero"
        level="essential"
        icon={Zap}
      >
        <p className="text-body-large text-forest/90 max-w-3xl mx-auto">
          Read authentic stories from volunteers who have experienced wildlife conservation firsthand. 
          These testimonials showcase real experiences and outcomes from our programs.
        </p>
      </SharedTabSection>

    <div className="space-y-8">
      {/* Social Proof Summary - Industry Standard Rating Overview */}
      <RatingOverview 
        testimonials={testimonials}
        organizationName={organization?.name || 'Conservation Organization'}
      />
      
      {/* External Content Links - Authentic Volunteer-Created Content */}
      <ExternalImmersionLinks 
        organizationName={organization?.name || 'Conservation Organization'}
        testimonials={testimonials}
      />
      
      {/* Detailed Reviews - TripAdvisor-Style Review Cards */}
      <ReviewCards 
        testimonials={testimonials}
        maxInitialReviews={4}
      />
      
      {/* Simple Call-to-Action - Industry Standard Single Action */}
      {onTabChange && (
        <div className="bg-white rounded-2xl p-6 border border-beige/60 text-center">
          <h3 className="text-card-title font-display font-semibold text-deep-forest mb-3">
            Ready to join them?
          </h3>
          <p className="text-body text-forest/80 mb-4 max-w-lg mx-auto">
            Start your wildlife conservation journey and create your own story.
          </p>
          <button
            onClick={() => onTabChange('connect')}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default StoriesTab;