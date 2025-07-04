// src/components/OrganizationDetail/ReviewCards.tsx
import React, { useState, useMemo } from 'react';
import { 
  Star, 
  User, 
  MapPin, 
  Calendar, 
  ChevronDown,
  ChevronUp,
  Filter,
  Verified,
  ThumbsUp
} from 'lucide-react';
import { Testimonial } from '../../types/database';
import { generateStarArray } from '../../lib/rating-utils';

interface ReviewCardsProps {
  testimonials: Testimonial[];
  maxInitialReviews?: number;
}

type SortOption = 'recent' | 'highest' | 'verified';

const ReviewCards: React.FC<ReviewCardsProps> = ({ 
  testimonials, 
  maxInitialReviews = 4 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Sort testimonials based on selected option
  const sortedTestimonials = useMemo(() => {
    if (!testimonials || !Array.isArray(testimonials)) return [];
    const sorted = [...testimonials].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'verified':
          return Number(b.verified) - Number(a.verified);
        default:
          return 0;
      }
    });
    return sorted;
  }, [testimonials, sortBy]);

  // Determine which reviews to display
  const displayedReviews = showAll 
    ? sortedTestimonials 
    : sortedTestimonials.slice(0, maxInitialReviews);

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number) => {
    const stars = generateStarArray(rating);
    return (
      <div className="flex items-center gap-1">
        {stars.map((star, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              star === 'full' 
                ? 'text-yellow-400 fill-current' 
                : star === 'half'
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  if (testimonials.length === 0) {
    return (
      <div className="bg-cream rounded-2xl p-8 text-center">
        <Star className="w-12 h-12 text-forest/30 mx-auto mb-4" />
        <p className="text-forest/60">Reviews coming soon...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-card-title font-semibold text-deep-forest">
            Volunteer Reviews
          </h3>
          <p className="text-body-small text-forest/70">
            {testimonials.length} verified volunteer experience{testimonials.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest/60" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-beige/60 rounded-lg px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
            aria-label="Sort reviews"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="verified">Verified First</option>
          </select>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {displayedReviews.map((testimonial) => {
          const isExpanded = expandedReviews.has(testimonial.id);
          const shouldTruncate = testimonial.quote.length > 150;
          const displayText = isExpanded || !shouldTruncate 
            ? testimonial.quote 
            : truncateText(testimonial.quote);

          return (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-nature border border-beige/60 hover:shadow-nature-xl transition-all duration-300"
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.volunteer_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-sage-green/20 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <User className="w-6 h-6 text-sage-green" />
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  {testimonial.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-sm">
                      <Verified className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Review Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-deep-forest truncate">
                        {testimonial.volunteer_name}
                        {testimonial.volunteer_age && (
                          <span className="text-forest/60 font-normal ml-2">
                            ({testimonial.volunteer_age})
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-forest/70">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {testimonial.volunteer_country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(testimonial.experience_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      {renderStars(testimonial.rating)}
                      <span className="text-sm font-medium text-deep-forest">
                        {testimonial.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  {/* Program Info */}
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-rich-earth/10 text-rich-earth rounded-full text-xs font-medium">
                      {testimonial.program_name} • {testimonial.duration_weeks} weeks
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <blockquote className="text-forest leading-relaxed">
                  "{displayText}"
                </blockquote>
                
                {/* Read More/Less Button */}
                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpanded(testimonial.id)}
                    className="inline-flex items-center gap-1 text-sm text-rich-earth hover:text-sunset transition-colors focus:outline-none focus:ring-2 focus:ring-rich-earth/50 rounded"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Show less of review' : 'Show more of review'}
                  >
                    {isExpanded ? (
                      <>
                        Show less
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read more
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                {/* Review Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-beige/60">
                  <div className="flex items-center gap-2 text-xs text-forest/60">
                    {testimonial.verified && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Verified className="w-3 h-3" />
                        Verified Experience
                      </span>
                    )}
                  </div>
                  
                  {/* Helpful indicator (placeholder for future functionality) */}
                  <div className="flex items-center gap-1 text-xs text-forest/60">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful review</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show All/Less Button */}
      {testimonials.length > maxInitialReviews && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-rich-earth text-rich-earth rounded-full font-medium hover:bg-rich-earth hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                Show fewer reviews
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show all {testimonials.length} reviews
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Trust Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Verified className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-deep-forest">
              100% Verified Reviews
            </h4>
            <p className="text-xs text-forest/70">
              All reviews are from volunteers who completed programs with identity verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCards;