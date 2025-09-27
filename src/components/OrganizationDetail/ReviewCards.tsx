// src/components/OrganizationDetail/ReviewCards.tsx
import React, { useState, useMemo } from 'react';
import {
  Star,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
  Verified,
  ThumbsUp
} from 'lucide-react';
import { OrganizationTestimonial } from '../../types';
import { generateStarArray } from '../../lib/rating-utils';

interface ReviewCardsProps {
  testimonials: OrganizationTestimonial[];
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
    const sorted = [...testimonials].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
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
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-deep-forest">
          Reviews ({testimonials.length})
        </h3>
        {testimonials.length > 1 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white border border-beige/60 rounded-md px-2 py-1 text-xs text-forest focus:outline-none focus:ring-1 focus:ring-rich-earth/50"
            aria-label="Sort reviews"
          >
            <option value="recent">Recent</option>
            <option value="highest">Highest</option>
            <option value="verified">Verified</option>
          </select>
        )}
      </div>

      {/* Compact Review Cards */}
      <div className="space-y-2">
        {displayedReviews.map((testimonial) => {
          const isExpanded = expandedReviews.has(testimonial.id);
          const shouldTruncate = testimonial.quote.length > 120;
          const displayText = isExpanded || !shouldTruncate 
            ? testimonial.quote 
            : truncateText(testimonial.quote, 120);

          return (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-3 border border-beige/40 hover:border-beige/60 transition-colors"
            >
              {/* Compact Header */}
              <div className="flex items-center gap-3 mb-2">
                {/* Small Avatar */}
                <div className="relative flex-shrink-0">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.volunteerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-sage-green/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-sage-green" />
                    </div>
                  )}
                  {testimonial.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
                      <Verified className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>

                {/* Name and Rating */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-deep-forest text-sm truncate">
                        {testimonial.volunteerName}
                      </span>
                      <span className="text-xs text-forest/60 truncate">
                        {testimonial.volunteerCountry}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {renderStars(testimonial.rating)}
                      <span className="text-xs font-medium text-deep-forest ml-1">
                        {testimonial.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-forest/80 leading-relaxed mb-2">
                "{displayText}"
              </blockquote>

              {/* Expand/Collapse Button */}
              {shouldTruncate && (
                <button
                  onClick={() => toggleExpanded(testimonial.id)}
                  className="inline-flex items-center gap-1 text-xs text-rich-earth hover:text-sunset transition-colors focus:outline-none mb-2"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Read more
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}

              {/* Program and Date */}
              <div className="flex items-center justify-between text-xs text-forest/60">
                <span className="px-2 py-0.5 bg-rich-earth/10 text-rich-earth rounded-full">
                  {testimonial.program}
                </span>
                <span>
                  {new Date(testimonial.date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Show More Button */}
      {testimonials.length > maxInitialReviews && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-rich-earth hover:text-sunset transition-colors focus:outline-none"
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                Show less
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show all {testimonials.length}
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Compact Trust Indicator */}
      <div className="bg-green-50/50 rounded-lg p-2 border border-green-200/40">
        <div className="flex items-center gap-2">
          <Verified className="w-3 h-3 text-green-600" />
          <span className="text-xs text-green-600 font-medium">Verified Reviews</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCards;