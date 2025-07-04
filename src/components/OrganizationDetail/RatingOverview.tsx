// src/components/OrganizationDetail/RatingOverview.tsx
import React from 'react';
import { Star, Users, ThumbsUp, TrendingUp, Award } from 'lucide-react';
import { Testimonial } from '../../types/database';
import { 
  calculateAverageRating, 
  calculateRecommendationRate,
  getRatingText,
  generateStarArray
} from '../../lib/rating-utils';

interface RatingOverviewProps {
  testimonials: Testimonial[];
  organizationName: string;
  totalVolunteersHosted?: number;
}

const RatingOverview: React.FC<RatingOverviewProps> = ({ 
  testimonials, 
  organizationName,
  totalVolunteersHosted 
}) => {
  // Calculate key metrics using existing utility functions
  const averageRating = calculateAverageRating(testimonials);
  const recommendationRate = calculateRecommendationRate(testimonials);
  const ratingText = getRatingText(averageRating);
  const starArray = generateStarArray(averageRating);
  
  // Extract most mentioned positive themes from testimonials
  const getMostMentionedThemes = () => {
    if (!testimonials || !Array.isArray(testimonials)) return [];
    const themes = testimonials.reduce((acc, testimonial) => {
      const quote = testimonial.quote.toLowerCase();
      
      // Analyze testimonial content for common positive themes
      if (quote.includes('amazing') || quote.includes('incredible') || quote.includes('fantastic')) {
        acc.push('Amazing experience');
      }
      if (quote.includes('meaningful') || quote.includes('life-changing') || quote.includes('transformative')) {
        acc.push('Life-changing');
      }
      if (quote.includes('learn') || quote.includes('skills') || quote.includes('knowledge')) {
        acc.push('Educational');
      }
      if (quote.includes('staff') || quote.includes('team') || quote.includes('support')) {
        acc.push('Great support');
      }
      if (quote.includes('safe') || quote.includes('secure') || quote.includes('professional')) {
        acc.push('Safe & professional');
      }
      
      return acc;
    }, [] as string[]);
    
    // Get unique themes and take top 3
    const uniqueThemes = [...new Set(themes)];
    return uniqueThemes.slice(0, 3);
  };
  
  const topThemes = getMostMentionedThemes();
  
  // Show loading state if no testimonials
  if (testimonials.length === 0) {
    return (
      <div className="card-nature p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-beige rounded w-48 mb-4"></div>
          <div className="h-4 bg-beige rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-soft-cream via-warm-beige/30 to-gentle-lemon/10 rounded-2xl p-6 lg:p-8 shadow-nature-xl border border-warm-beige/60">
      
      {/* Main Rating Display - Airbnb Style */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
        
        {/* Left: Rating Summary */}
        <div className="flex items-center gap-6">
          
          {/* Large Rating Number */}
          <div className="text-center">
            <div className="text-feature font-bold text-rich-earth mb-1">
              {averageRating.toFixed(1)}
            </div>
            
            {/* Star Display */}
            <div className="flex items-center gap-1 mb-2">
              {starArray.map((type, index) => (
                <Star 
                  key={index}
                  className={`w-5 h-5 ${
                    type === 'full' 
                      ? 'text-yellow-400 fill-current' 
                      : type === 'half'
                      ? 'text-yellow-400 fill-current opacity-50'
                      : 'text-forest/20'
                  }`}
                />
              ))}
            </div>
            
            <div className="text-body-small text-forest/70">
              {ratingText}
            </div>
          </div>
          
          {/* Vertical Divider */}
          <div className="w-px h-16 bg-forest/10 hidden sm:block"></div>
          
          {/* Review Count & Recommendation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-green" />
              <span className="text-subtitle font-semibold text-forest">
                {testimonials.length} review{testimonials.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-rich-earth" />
              <span className="text-body text-forest/80">
                <span className="font-semibold text-rich-earth">{recommendationRate}%</span> would recommend
              </span>
            </div>
            
            {totalVolunteersHosted && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-golden-hour" />
                <span className="text-body text-forest/80">
                  <span className="font-semibold text-golden-hour">{totalVolunteersHosted.toLocaleString()}</span> volunteers hosted
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Right: Most Mentioned Themes */}
        {topThemes.length > 0 && (
          <div className="lg:text-right">
            <div className="flex items-center gap-2 mb-3 lg:justify-end">
              <Award className="w-4 h-4 text-sunset" />
              <span className="text-body-small font-semibold text-forest uppercase tracking-wide">
                Most Mentioned
              </span>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {topThemes.map((theme, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/80 text-rich-earth rounded-full text-body-small font-medium border border-rich-earth/20"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Summary - TripAdvisor Style */}
      <div className="pt-4 border-t border-warm-beige/40">
        <p className="text-body text-forest/80 text-center lg:text-left">
          <span className="font-semibold text-rich-earth">
            "{organizationName}"
          </span>
          {' '}consistently receives outstanding reviews from volunteers who praise the 
          <span className="font-medium text-sunset">
            {' '}hands-on conservation experience
          </span>
          {' '}and 
          <span className="font-medium text-sage-green">
            professional support
          </span>
          {' '}provided throughout their journey.
        </p>
      </div>
      
      {/* Trust Indicators */}
      <div className="flex items-center justify-center lg:justify-start gap-4 mt-4 pt-4 border-t border-warm-beige/30">
        <div className="flex items-center gap-2 text-caption text-sage-green">
          <div className="w-2 h-2 bg-sage-green rounded-full"></div>
          <span>All reviews verified</span>
        </div>
        <div className="flex items-center gap-2 text-caption text-rich-earth">
          <div className="w-2 h-2 bg-rich-earth rounded-full"></div>
          <span>Real volunteer experiences</span>
        </div>
      </div>
    </div>
  );
};

export default RatingOverview;