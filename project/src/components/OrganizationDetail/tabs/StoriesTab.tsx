// src/components/OrganizationDetail/tabs/StoriesTab.tsx
import React from 'react';
import { OrganizationDetail } from '../../../types';
import TestimonialsSection from '../TestimonialsSection';
import PhotoGallery from '../PhotoGallery';

interface StoriesTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const StoriesTab: React.FC<StoriesTabProps> = ({ organization, onTabChange }) => {
  return (
    <div className="space-y-8">
      {/* Photo Gallery - Fixed props to match PhotoGallery component interface */}
      <PhotoGallery 
        gallery={organization.gallery}
        organizationName={organization.name}
      />
      
      {/* Testimonials - Reusing existing component */}
      <TestimonialsSection testimonials={organization.testimonials} />
      
      {/* Inspired by Stories? Next Steps */}
      {onTabChange && (
        <div className="bg-gradient-to-br from-rich-earth/5 via-gentle-lemon/5 to-warm-sunset/5 rounded-3xl p-8 shadow-nature-xl border border-rich-earth/10">
          <div className="text-center space-y-6">
            <h3 className="text-feature text-deep-forest">Ready to Create Your Own Story?</h3>
            <p className="text-body-large text-forest/90 max-w-2xl mx-auto">
              Join these incredible volunteers and make your own impact in wildlife conservation.
            </p>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <button
                onClick={() => onTabChange('experience')}
                className="p-4 bg-white rounded-xl border border-warm-sunset/30 hover:border-warm-sunset/60 transition-all text-center"
              >
                <div className="font-semibold text-deep-forest mb-1">See Daily Life</div>
                <div className="text-sm text-deep-forest/70">What you'll actually do</div>
              </button>
              <button
                onClick={() => onTabChange('practical')}
                className="p-4 bg-white rounded-xl border border-sage-green/30 hover:border-sage-green/60 transition-all text-center"
              >
                <div className="font-semibold text-deep-forest mb-1">Check Requirements</div>
                <div className="text-sm text-deep-forest/70">Costs and preparation</div>
              </button>
              <button
                onClick={() => onTabChange('connect')}
                className="p-4 bg-white rounded-xl border border-rich-earth/30 hover:border-rich-earth/60 transition-all text-center"
              >
                <div className="font-semibold text-deep-forest mb-1">Apply Now</div>
                <div className="text-sm text-deep-forest/70">Start your journey</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesTab;