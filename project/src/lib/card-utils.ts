// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\lib\card-utils.ts

import type { Opportunity } from '@/types';

/**
 * Shared utilities for card components
 * 
 * Centralized formatting and utility functions for
 * consistent behavior across all card variants.
 */

// Motion preferences
export const getReducedMotionPreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Duration formatting
export const formatDuration = (duration: { min: number; max: number | null }): string => {
  return duration.max ? `${duration.min}-${duration.max} weeks` : `${duration.min}+ weeks`;
};

// Cost formatting
export const formatCost = (cost: { 
  amount: number | null; 
  currency: string; 
  period: string 
}): string => {
  if (!cost.amount) return 'Ask us';
  return `${cost.currency}${cost.amount.toLocaleString()}`;
};

// Number formatting for large values
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

// Generate opportunity URL for navigation
export const generateOpportunityURL = (
  filterType: 'animal' | 'location' | 'duration' | 'all',
  value: string
): string => {
  const baseURL = '/opportunities';
  
  switch (filterType) {
    case 'animal':
      return `${baseURL}?animal=${encodeURIComponent(value.toLowerCase().replace(/\s+/g, '-'))}`;
    case 'location':
      return `${baseURL}?location=${encodeURIComponent(value)}`;
    case 'duration':
      return `${baseURL}?duration=${encodeURIComponent(value)}`;
    case 'all':
    default:
      return baseURL;
  }
};

// Card variant configurations
export interface CardVariantConfig {
  height: string;
  padding: string;
  titleSize: string;
  metadataSize: string;
  imageScale: string;
}

export const getCardVariantConfig = (variant: 'default' | 'compact' | 'featured' | 'minimal'): CardVariantConfig => {
  switch (variant) {
    case 'compact':
      return {
        height: 'h-80',
        padding: 'p-4',
        titleSize: 'text-lg sm:text-xl',
        metadataSize: 'text-xs',
        imageScale: 'scale-105'
      };
    case 'featured':
      return {
        height: 'h-[32rem] sm:h-[36rem]',
        padding: 'p-8',
        titleSize: 'text-3xl sm:text-4xl',
        metadataSize: 'text-base',
        imageScale: 'scale-110'
      };
    case 'minimal':
      return {
        height: 'h-64',
        padding: 'p-3',
        titleSize: 'text-base sm:text-lg',
        metadataSize: 'text-xs',
        imageScale: 'scale-100'
      };
    default:
      return {
        height: 'h-96 sm:h-[28rem]',
        padding: 'p-6',
        titleSize: 'text-2xl sm:text-3xl',
        metadataSize: 'text-sm',
        imageScale: 'scale-110'
      };
  }
};

// Animation variants for cards
export const getCardAnimationVariants = (index: number, prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } }
    };
  }

  return {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.05 // Staggered animation
      }
    }
  };
};

// Accessibility helpers
export const getCardAriaLabel = (opportunity: Opportunity): string => {
  return `Explore ${opportunity.title} conservation opportunity in ${opportunity.location.country}. ${opportunity.animalTypes.join(', ')} project lasting ${formatDuration(opportunity.duration)}.`;
};

export const getCardId = (opportunity: Opportunity): string => {
  return `opportunity-card-${opportunity.id}`;
};

export const getCardDetailsId = (opportunity: Opportunity): string => {
  return `opportunity-details-${opportunity.id}`;
};

// Image optimization
export const getOptimizedImageUrl = (
  originalUrl: string, 
  width: number = 600, 
  height: number = 400,
  quality: number = 80
): string => {
  // For now, return the original URL
  // In a production app, you might use a service like Cloudinary or similar
  return originalUrl;
};

// Card state management
export interface CardState {
  isActive: boolean;
  isHovered: boolean;
  isExplored: boolean;
  isFocused: boolean;
}

export const getCardStateClasses = (state: CardState): string => {
  const classes = ['transition-all duration-300 ease-out'];
  
  if (state.isActive || state.isHovered || state.isFocused) {
    classes.push('shadow-2xl ring-2 ring-rich-earth/20');
  } else {
    classes.push('shadow-lg');
  }
  
  if (state.isExplored) {
    classes.push('ring-2 ring-sage-green/30');
  }
  
  classes.push('hover:shadow-xl');
  
  return classes.join(' ');
};

// Opportunity filtering and sorting
export const filterOpportunities = (
  opportunities: Opportunity[],
  filters: {
    animalTypes?: string[];
    location?: string;
    durationMin?: number;
    durationMax?: number;
    costMax?: number;
  }
): Opportunity[] => {
  return opportunities.filter(opportunity => {
    // Animal type filter
    if (filters.animalTypes && filters.animalTypes.length > 0) {
      const hasMatchingAnimal = filters.animalTypes.some(type => 
        opportunity.animalTypes.some(opType => 
          opType.toLowerCase().includes(type.toLowerCase())
        )
      );
      if (!hasMatchingAnimal) return false;
    }
    
    // Location filter
    if (filters.location) {
      const locationMatch = 
        opportunity.location.country.toLowerCase().includes(filters.location.toLowerCase()) ||
        opportunity.location.city.toLowerCase().includes(filters.location.toLowerCase());
      if (!locationMatch) return false;
    }
    
    // Duration filters
    if (filters.durationMin && opportunity.duration.min < filters.durationMin) {
      return false;
    }
    
    if (filters.durationMax && opportunity.duration.max && opportunity.duration.max > filters.durationMax) {
      return false;
    }
    
    // Cost filter
    if (filters.costMax && opportunity.cost.amount && opportunity.cost.amount > filters.costMax) {
      return false;
    }
    
    return true;
  });
};

export const sortOpportunities = (
  opportunities: Opportunity[],
  sortBy: 'featured' | 'duration' | 'cost' | 'location' | 'recent'
): Opportunity[] => {
  return [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return b.featured ? 1 : -1;
      case 'duration':
        return a.duration.min - b.duration.min;
      case 'cost':
        const aCost = a.cost.amount || 0;
        const bCost = b.cost.amount || 0;
        return aCost - bCost;
      case 'location':
        return a.location.country.localeCompare(b.location.country);
      case 'recent':
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      default:
        return 0;
    }
  });
};