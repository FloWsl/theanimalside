// src/components/OrganizationDetail/tabs/StoriesTab.tsx
import React from 'react';
import { OrganizationDetail } from '../../../types';

// Industry-standard components following Airbnb/TripAdvisor patterns
import RatingOverview from '../RatingOverview';
import ExternalImmersionLinks from '../ExternalImmersionLinks';
import ReviewCards from '../ReviewCards';

interface StoriesTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const StoriesTab: React.FC<StoriesTabProps> = ({ organization, onTabChange }) => {
  return (
    <div className="space-y-8">
      {/* Social Proof Summary - Industry Standard Rating Overview */}
      <RatingOverview 
        testimonials={organization.testimonials}
        organizationName={organization.name}
      />
      
      {/* External Content Links - Authentic Volunteer-Created Content */}
      <ExternalImmersionLinks 
        organizationName={organization.name}
        testimonials={organization.testimonials}
      />
      
      {/* Detailed Reviews - TripAdvisor-Style Review Cards */}
      <ReviewCards 
        testimonials={organization.testimonials}
        maxInitialReviews={4}
      />
      
      {/* Simple Call-to-Action - Industry Standard Single Action */}
      {onTabChange && (
        <div className="bg-white rounded-2xl p-6 border border-beige/60 text-center">
          <h3 className="text-subtitle font-semibold text-deep-forest mb-3">
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
  );
};

export default StoriesTab;