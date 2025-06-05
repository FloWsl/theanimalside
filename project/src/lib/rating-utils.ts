// src/lib/rating-utils.ts
import { OrganizationTestimonial } from '../types';

/**
 * Calculate the average rating from an array of testimonials
 */
export const calculateAverageRating = (testimonials: OrganizationTestimonial[]): number => {
  if (testimonials.length === 0) return 0;
  
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  return Math.round((totalRating / testimonials.length) * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculate rating distribution (how many 5-star, 4-star, etc. reviews)
 */
export const calculateRatingDistribution = (testimonials: OrganizationTestimonial[]): Array<{
  stars: number;
  count: number;
  percentage: number;
}> => {
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = testimonials.filter(t => t.rating === stars).length;
    const percentage = testimonials.length > 0 ? Math.round((count / testimonials.length) * 100) : 0;
    return { stars, count, percentage };
  });
  
  return distribution;
};

/**
 * Calculate percentage of reviewers who would recommend (4+ star ratings)
 */
export const calculateRecommendationRate = (testimonials: OrganizationTestimonial[]): number => {
  if (testimonials.length === 0) return 0;
  
  const recommendingReviews = testimonials.filter(t => t.rating >= 4).length;
  return Math.round((recommendingReviews / testimonials.length) * 100);
};

/**
 * Get rating display text (e.g., \"Excellent\", \"Very Good\", etc.)
 */
export const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Average';
  if (rating >= 2.0) return 'Below Average';
  return 'Poor';
};

/**
 * Get rating color class based on score
 */
export const getRatingColorClass = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-green-500';
  if (rating >= 3.5) return 'text-yellow-500';
  if (rating >= 3.0) return 'text-orange-500';
  return 'text-red-500';
};

/**
 * Generate star rating array for display (filled, half-filled, empty)
 */
export const generateStarArray = (rating: number): Array<'full' | 'half' | 'empty'> => {
  const stars: Array<'full' | 'half' | 'empty'> = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push('half');
  }
  
  // Fill remaining with empty stars
  while (stars.length < 5) {
    stars.push('empty');
  }
  
  return stars;
};

/**
 * Generate star display objects for UI components
 */
export const generateStarDisplay = (rating: number): Array<{ type: 'full' | 'half' | 'empty' }> => {
  const stars = generateStarArray(rating);
  return stars.map(type => ({ type }));
};