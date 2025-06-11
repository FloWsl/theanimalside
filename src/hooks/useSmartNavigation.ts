import { useState, useEffect, useMemo } from 'react';
import { OrganizationDetail } from '../types';
import { animalCategories } from '../data/animals';
import { TabId } from '../components/OrganizationDetail/TabNavigation';
import { navigationPerformanceMonitor } from '../utils/performance/navigationMetrics';

export type { TabId };

export interface NavigationRecommendation {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'educational' | 'comparison' | 'preparation' | 'validation';
  priority: number;
  reasoning?: string;
  isExternal?: boolean;
  metadata?: {
    emoji?: string;
    type?: 'animal' | 'location' | 'category';
  };
}

interface NavigationContext {
  organization: OrganizationDetail;
  currentTab: TabId;
  sessionData?: {
    viewedOrganizations: string[];
    timeOnPage: number;
    referrerUrl?: string;
  };
}

// Emoji helpers for visual navigation
const getAnimalEmoji = (animalType: string): string => {
  const animalMap: Record<string, string> = {
    'toucans': '🦜',
    'toucan': '🦜',
    'sloths': '🦥',
    'sloth': '🦥',
    'primates': '🐵',
    'primate': '🐵',
    'monkeys': '🐵',
    'monkey': '🐵',
    'elephants': '🐘',
    'elephant': '🐘',
    'lions': '🦁',
    'lion': '🦁',
    'tigers': '🐅',
    'tiger': '🐅',
    'sea turtles': '🐢',
    'turtle': '🐢',
    'turtles': '🐢',
    'orangutans': '🦧',
    'orangutan': '🦧',
    'koalas': '🐨',
    'koala': '🐨',
    'penguins': '🐧',
    'penguin': '🐧',
    'dolphins': '🐬',
    'dolphin': '🐬',
    'whales': '🐋',
    'whale': '🐋',
    'bears': '🐻',
    'bear': '🐻',
    'pandas': '🐼',
    'panda': '🐼'
  };
  
  const key = animalType.toLowerCase();
  return animalMap[key] || '🐾';
};

const getCountryEmoji = (country: string): string => {
  const countryMap: Record<string, string> = {
    'costa rica': '🇨🇷',
    'thailand': '🇹🇭',
    'south africa': '🇿🇦',
    'kenya': '🇰🇪',
    'tanzania': '🇹🇿',
    'indonesia': '🇮🇩',
    'australia': '🇦🇺',
    'brazil': '🇧🇷',
    'peru': '🇵🇪',
    'ecuador': '🇪🇨',
    'madagascar': '🇲🇬',
    'india': '🇮🇳',
    'sri lanka': '🇱🇰',
    'nepal': '🇳🇵',
    'cambodia': '🇰🇭',
    'vietnam': '🇻🇳',
    'laos': '🇱🇦'
  };
  
  return countryMap[country.toLowerCase()] || '🌍';
};

// Enhanced data-driven recommendations generator
const generateStaticRecommendations = (context: NavigationContext): NavigationRecommendation[] => {
  const { organization, currentTab } = context;
  const recommendations: NavigationRecommendation[] = [];

  // Extract rich data from organization
  const primaryAnimal = organization.animalTypes[0];
  const secondaryAnimals = organization.animalTypes.slice(1, 3);
  const totalAnimalsRescued = organization.statistics.animalsRescued;
  const yearsOperating = organization.statistics.yearsOperating;
  const regionSlug = organization.location.country.toLowerCase().replace(/\s+/g, '-');

  // 1. Similar animal type (SEO-friendly URL)
  if (primaryAnimal) {
    const animalSlug = primaryAnimal.animalType.toLowerCase().replace(/\s+/g, '-');
    recommendations.push({
      id: 'similar-animals',
      title: primaryAnimal.animalType,
      description: '',
      url: `/opportunities/${animalSlug}`,
      category: 'comparison',
      priority: 9,
      reasoning: 'Similar animal programs',
      metadata: {
        emoji: getAnimalEmoji(primaryAnimal.animalType),
        type: 'animal'
      }
    });
  }

  // 2. Regional opportunities (SEO-friendly URL)
  recommendations.push({
    id: 'regional-programs',
    title: organization.location.country,
    description: '',
    url: `/opportunities/${regionSlug}`,
    category: 'comparison',
    priority: 8,
    reasoning: 'Regional alternatives',
    metadata: {
      emoji: getCountryEmoji(organization.location.country),
      type: 'location'
    }
  });

  // 3. Secondary animal if available
  if (secondaryAnimals.length > 0) {
    const secondaryAnimal = secondaryAnimals[0];
    const animalSlug = secondaryAnimal.animalType.toLowerCase().replace(/\s+/g, '-');
    recommendations.push({
      id: 'secondary-animals',
      title: secondaryAnimal.animalType,
      description: '',
      url: `/opportunities/${animalSlug}`,
      category: 'comparison',
      priority: 7,
      reasoning: 'Alternative animal programs',
      metadata: {
        emoji: getAnimalEmoji(secondaryAnimal.animalType),
        type: 'animal'
      }
    });
  }

  // 4. General wildlife category
  recommendations.push({
    id: 'wildlife-programs',
    title: 'Wildlife',
    description: '',
    url: `/opportunities/wildlife`,
    category: 'comparison',
    priority: 6,
    reasoning: 'General wildlife programs',
    metadata: {
      emoji: '🦎',
      type: 'category'
    }
  });

  // 5. Tab-specific contextual recommendations
  const tabSpecific = getTabSpecificRecommendations(currentTab, organization);
  recommendations.push(...tabSpecific);

  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
};

// This function is no longer needed with the simplified approach
// Keeping it minimal for potential future use
const getLocationContext = (country: string) => {
  return {
    biodiversityScore: 75 // Default for any metadata needs
  };
};

const getTabSpecificRecommendations = (
  tab: TabId, 
  org: OrganizationDetail
): NavigationRecommendation[] => {
  const countrySlug = org.location.country.toLowerCase().replace(/\s+/g, '-');
  
  switch (tab) {
    case 'practical':
      return [{
        id: 'travel-guide',
        title: `Travel guide`,
        description: `Planning your trip to ${org.location.country}`,
        url: `/guides/${countrySlug}-travel`,
        category: 'preparation',
        priority: 5,
        reasoning: 'Practical tab users need travel information'
      }];
    
    case 'experience':
      return [{
        id: 'similar-experiences',
        title: `Similar experiences`,
        description: `Other volunteer stories`,
        url: `/stories/wildlife-volunteering`,
        category: 'validation',
        priority: 5,
        reasoning: 'Experience tab users want validation'
      }];
    
    case 'location':
      return [{
        id: 'area-guide',
        title: `About ${org.location.region}`,
        description: `Local area information`,
        url: `/guides/${countrySlug}-region`,
        category: 'educational',
        priority: 5,
        reasoning: 'Location tab users want regional context'
      }];
    
    case 'stories':
      return [{
        id: 'more-stories',
        title: `More volunteer stories`,
        description: `Experiences from other programs`,
        url: `/stories/volunteer-experiences`,
        category: 'validation',
        priority: 5,
        reasoning: 'Stories tab users want more testimonials'
      }];
    
    case 'connect':
      return [{
        id: 'application-tips',
        title: `Application tips`,
        description: `How to strengthen your application`,
        url: '/guides/application-guide',
        category: 'preparation',
        priority: 5,
        reasoning: 'Connect tab users need application guidance'
      }];
    
    default:
      return [];
  }
};

// Performance: Cache recommendations by organization ID and tab
const recommendationCache = new Map<string, { 
  recommendations: NavigationRecommendation[]; 
  timestamp: number; 
  expiresAt: number; 
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Prevent memory leaks

// Performance: Memoized cache key generation
const getCacheKey = (organizationId: string, currentTab: TabId): string => {
  return `${organizationId}-${currentTab}`;
};

// Performance: Cache cleanup to prevent memory leaks
const cleanupExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of recommendationCache.entries()) {
    if (value.expiresAt < now) {
      recommendationCache.delete(key);
    }
  }
  
  // If cache is still too large, remove oldest entries
  if (recommendationCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(recommendationCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, recommendationCache.size - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => recommendationCache.delete(key));
  }
};

export const useSmartNavigation = (context: NavigationContext) => {
  // Performance: Generate cache key once
  const cacheKey = useMemo(() => 
    getCacheKey(context.organization.id, context.currentTab), 
    [context.organization.id, context.currentTab]
  );

  // Performance: Generate static recommendations with caching (synchronous)
  const recommendations = useMemo(() => {
    try {
      const operationId = `recommendations-${cacheKey}`;
      navigationPerformanceMonitor.startTiming(operationId);
      
      // Check cache first
      const cached = recommendationCache.get(cacheKey);
      const now = Date.now();
      
      if (cached && cached.expiresAt > now) {
        navigationPerformanceMonitor.recordCacheHit(true);
        navigationPerformanceMonitor.endTiming(operationId);
        return cached.recommendations;
      }
      
      navigationPerformanceMonitor.recordCacheHit(false);
      
      // Generate new recommendations
      const freshRecommendations = generateStaticRecommendations(context);
      
      // Cache the results
      recommendationCache.set(cacheKey, {
        recommendations: freshRecommendations,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      });
      
      // Cleanup expired cache entries periodically
      if (Math.random() < 0.1) { // 10% chance to cleanup
        cleanupExpiredCache();
      }
      
      // SEO: Preload critical recommendation URLs for faster navigation
      requestIdleCallback(() => {
        freshRecommendations.slice(0, 2).forEach(rec => {
          if (rec.url.startsWith('/')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = rec.url;
            document.head.appendChild(link);
          }
        });
      });
      
      navigationPerformanceMonitor.endTiming(operationId);
      return freshRecommendations;
    } catch (err) {
      console.warn('Smart navigation error:', err);
      return [];
    }
  }, [context.organization.id, context.currentTab, cacheKey]);

  return { recommendations };
};