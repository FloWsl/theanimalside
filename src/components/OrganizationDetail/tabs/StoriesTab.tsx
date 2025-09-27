// src/components/OrganizationDetail/tabs/StoriesTab.tsx
import React from 'react';
import { OrganizationDetail } from '../../../types';
import { Testimonial } from '../../../types/database';
import { useOrganizationStories, useTabDataState } from '../../../hooks/useOrganizationTabData';

// Industry-standard components following Airbnb/TripAdvisor patterns
import RatingOverview from '../RatingOverview';
import ExternalImmersionLinks from '../ExternalImmersionLinks';
import ReviewCards from '../ReviewCards';
import SharedTabSection from '../SharedTabSection';
import { Zap } from 'lucide-react';
interface StoriesTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const StoriesTab: React.FC<StoriesTabProps> = ({ organization, onTabChange }) => {
  // Fetch real database data using proper service method
  const storiesQuery = useOrganizationStories(organization.slug);
  const { data: storiesData, isLoading, error } = useTabDataState(storiesQuery, 'Stories');

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          {/* Hero Section Skeleton */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8">
            <div className="bg-warm-beige/40 h-64 rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 px-4">
                <div className="h-8 bg-white/60 rounded w-48 mx-auto" />
                <div className="h-4 bg-white/60 rounded w-80 mx-auto" />
                <div className="h-4 bg-white/60 rounded w-72 mx-auto" />
              </div>
            </div>
          </div>

          {/* Rating Overview Section Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-warm-beige/40 p-8 mb-8">
            <div className="h-8 bg-warm-beige/40 rounded w-1/3 mb-6" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-warm-beige/40 rounded-full mx-auto mb-4" />
                <div className="h-6 bg-warm-beige/40 rounded w-12 mx-auto mb-2" />
                <div className="h-4 bg-warm-beige/40 rounded w-20 mx-auto" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 bg-warm-beige/40 rounded w-16" />
                    <div className="flex-1 h-2 bg-warm-beige/40 rounded" />
                    <div className="h-4 bg-warm-beige/40 rounded w-8" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-warm-beige/40 rounded w-32" />
                <div className="h-4 bg-warm-beige/40 rounded w-24" />
                <div className="h-4 bg-warm-beige/40 rounded w-28" />
              </div>
            </div>
          </div>

          {/* External Links Section Skeleton */}
          <div className="bg-gradient-to-br from-sage-green/5 to-warm-sunset/5 rounded-2xl p-8 mb-8">
            <div className="h-8 bg-warm-beige/40 rounded w-1/4 mb-6" />
            <div className="grid md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/80 rounded-xl p-4">
                  <div className="h-32 bg-warm-beige/40 rounded-lg mb-4" />
                  <div className="h-4 bg-warm-beige/40 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-warm-beige/40 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>

          {/* Review Cards Section Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-warm-beige/40 p-8">
            <div className="h-8 bg-warm-beige/40 rounded w-1/3 mb-6" />
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-warm-beige/20 to-gentle-lemon/10 rounded-xl p-6 border border-warm-beige/40">
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-warm-beige/40 rounded" />
                    ))}
                  </div>
                  {/* Quote */}
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-warm-beige/40 rounded w-full" />
                    <div className="h-4 bg-warm-beige/40 rounded w-4/5" />
                    <div className="h-4 bg-warm-beige/40 rounded w-3/5" />
                  </div>
                  {/* Author info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warm-beige/40 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-4 bg-warm-beige/40 rounded w-24" />
                      <div className="h-3 bg-warm-beige/40 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="text-center py-8">
          <p className="text-forest/60 mb-4">Unable to load stories information</p>
          <button 
            onClick={() => storiesQuery.refetch()}
            className="px-4 py-2 bg-rich-earth text-white rounded hover:bg-deep-earth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use database data if available, otherwise fallback to organization data
  const testimonials = storiesData?.testimonials || [];
  const statistics = storiesData?.statistics;
  
  // Transform database testimonials to legacy format for compatibility with existing components
  const transformedTestimonials = testimonials.map((testimonial: Testimonial) => ({
    id: testimonial.id,
    volunteerName: testimonial.volunteer_name || 'Anonymous Volunteer',
    volunteerCountry: testimonial.volunteer_country || 'Unknown',
    volunteerAge: testimonial.volunteer_age,
    program: testimonial.program_name || 'Conservation Program',
    duration: `${testimonial.duration_weeks || 4} week${(testimonial.duration_weeks || 4) !== 1 ? 's' : ''}`,
    quote: testimonial.quote || 'No testimonial provided',
    rating: testimonial.rating || 5,
    date: testimonial.experience_date || testimonial.created_at,
    avatar: testimonial.avatar_url,
    verified: testimonial.verified || false
  }));

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
      {/* Show content if testimonials exist, otherwise show "no testimonials" message */}
      {transformedTestimonials && transformedTestimonials.length > 0 ? (
        <>
          {/* Social Proof Summary - Industry Standard Rating Overview */}
          <RatingOverview 
            testimonials={transformedTestimonials}
            organizationName={organization.name}
            totalVolunteersHosted={statistics?.volunteers_hosted}
          />
          
          {/* External Content Links - Authentic Volunteer-Created Content */}
          <ExternalImmersionLinks 
            organizationName={organization.name}
            testimonials={transformedTestimonials}
          />
          
          {/* Detailed Reviews - TripAdvisor-Style Review Cards */}
          <ReviewCards 
            testimonials={transformedTestimonials}
            maxInitialReviews={8}
          />
        </>
      ) : (
        /* No testimonials available */
        <div className="bg-gradient-to-br from-soft-cream via-warm-beige/20 to-gentle-lemon/10 rounded-2xl p-8 lg:p-12 border border-warm-beige/40 shadow-nature text-center">
          <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-forest/30" />
          </div>
          <h3 className="text-xl lg:text-2xl font-semibold text-deep-forest mb-4">
            No Volunteer Stories Available
          </h3>
          <p className="text-base lg:text-lg text-forest/70 leading-relaxed max-w-2xl mx-auto mb-6">
            Volunteer testimonials for this organization are not currently available. Check back soon as we continue to add authentic volunteer experiences.
          </p>
          <div className="bg-white/60 rounded-xl p-4 border border-warm-beige/40">
            <p className="text-sm text-forest/60 italic">
              Contact the organization directly to learn more about volunteer experiences and to inquire about their programs.
            </p>
          </div>
        </div>
      )}
      
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