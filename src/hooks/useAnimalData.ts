/**
 * Animal Data Hook - Database Integration
 * 
 * Centralizes animal-specific data fetching using Supabase database.
 * Follows the same pattern as useCountryData for consistency.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrganizationService } from '../services/organizationService';
import { animalCategories } from '../data/animals';
import { getContentHub } from '../data/contentHubs';
import { useAnimalStatistic } from './useStatistics';
import type { Organization } from '../types/database';
import type { AnimalCategory } from '../types';
import type { ContentHubData } from '../data/contentHubs';
import type { Opportunity } from '../types';

interface AnimalDataResult {
  animalName: string;
  animalCategory: AnimalCategory | undefined;
  opportunities: Opportunity[];
  contentHub: ContentHubData | undefined;
  availableCountries: Array<{
    name: string;
    slug: string;
    count: number;
    flag: string;
    image?: string;
    color: string;
  }>;
  statistics: {
    projects: number;
    volunteers: number;
    countries: number;
    trending: boolean;
  };
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching animal-specific data from database
 * 
 * @param animalSlug - Animal identifier (e.g., "lions", "sea-turtles")
 * @returns Animal data and loading states
 * 
 * Uses React Query with Supabase for data fetching and caching
 */
export const useAnimalData = (animalSlug: string): AnimalDataResult => {

  // Find animal category data
  const animalCategory = React.useMemo(() => {
    return animalCategories.find(animal => 
      animal.id === animalSlug ||
      animal.name.toLowerCase().replace(' ', '-') === animalSlug
    );
  }, [animalSlug]);

  // Get formatted animal name
  const animalName = React.useMemo(() => {
    if (animalCategory) {
      return animalCategory.name;
    }
    
    const animalMap: Record<string, string> = {
      'lions': 'Lions',
      'elephants': 'Elephants', 
      'sea-turtles': 'Sea Turtles',
      'orangutans': 'Orangutans',
      'koalas': 'Koalas',
      'tigers': 'Tigers',
      'pandas': 'Giant Pandas',
      'rhinos': 'Rhinos',
      'whales': 'Whales',
      'dolphins': 'Dolphins',
      'primates': 'Primates',
      'marine': 'Marine Life',
      'birds': 'Birds',
      'reptiles': 'Reptiles',
      'big-cats': 'Big Cats'
    };
    
    return animalMap[animalSlug] || animalSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }, [animalSlug, animalCategory]);

  // Get dynamic statistics from database
  const { data: animalStats, isLoading: statsLoading, error: statsError } = useAnimalStatistic(animalName);

  // Query organizations from database with animal filtering
  const { data: organizationsResponse, isLoading, error: queryError } = useQuery({
    queryKey: ['animal-organizations', animalSlug],
    queryFn: () => OrganizationService.searchOrganizations({ animal_types: [animalName] }, { page: 1, limit: 50 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!animalSlug && !!animalName,
  });

  // Convert organizations to opportunity format (already filtered by animal type from database)
  const animalOpportunities = React.useMemo(() => {
    const organizations = organizationsResponse?.data || [];
    
    // Organizations are already filtered by animal type in the database query
    // No additional filtering needed here
    const relevantOrganizations = organizations;
    
    // Convert to opportunity format for UI compatibility
    return relevantOrganizations.map(org => ({
      id: org.id,
      title: org.name,
      organization: org.name,
      description: org.tagline || org.mission || `${animalName} conservation program`,
      location: { 
        country: org.country, 
        city: org.city || '', 
        region: org.region || '' 
      },
      images: [org.hero_image || '/images/default-wildlife.jpg'],
      animalTypes: [animalName], // Use current animal as type
      duration: { min: 2, max: 12 },
      cost: { amount: null, currency: 'USD', period: 'total' },
      featured: org.featured || false,
      datePosted: org.created_at || new Date().toISOString(),
      slug: org.slug,
      tags: [animalName]
    }));
  }, [organizationsResponse, animalName, animalSlug]);

  // Get content hub data for conservation information
  // Future: This will query content_hubs table with RLS policies
  const contentHub = React.useMemo(() => {
    return getContentHub(animalSlug);
  }, [animalSlug]);

  // Get unique countries where this animal type is found from database data
  const availableCountries = React.useMemo(() => {
    const countries = [...new Set(animalOpportunities.map(opp => opp.location.country))];
    
    const getCountryData = (country: string) => {
      const countryData: { [key: string]: { flag: string; image: string; color: string } } = {
        'Costa Rica': { 
          flag: '🇨🇷', 
          image: 'https://images.unsplash.com/photo-1502780402662-acc01917cf4b?w=1200&h=400&fit=crop&q=80',
          color: '#10B981'
        },
        'Thailand': { 
          flag: '🇹🇭', 
          image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1200&h=400&fit=crop&q=80',
          color: '#F59E0B'
        },
        'South Africa': { 
          flag: '🇿🇦', 
          image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=400&fit=crop&q=80',
          color: '#DC2626'
        },
        'Australia': { 
          flag: '🇦🇺', 
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&q=80',
          color: '#0EA5E9'
        },
        'Kenya': { 
          flag: '🇰🇪', 
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=400&fit=crop&q=80',
          color: '#059669'
        },
        'Indonesia': { 
          flag: '🇮🇩', 
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=400&fit=crop&q=80',
          color: '#7C3AED'
        },
        'Brazil': { 
          flag: '🇧🇷', 
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop&q=80',
          color: '#16A34A'
        },
        'Ecuador': { 
          flag: '🇪🇨', 
          image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&h=400&fit=crop&q=80',
          color: '#0284C7'
        },
        'Peru': { 
          flag: '🇵🇪', 
          image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=400&fit=crop&q=80',
          color: '#B45309'
        },
        'Tanzania': { 
          flag: '🇹🇿', 
          image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&h=400&fit=crop&q=80',
          color: '#DC2626'
        },
        'India': { 
          flag: '🇮🇳', 
          image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&h=400&fit=crop&q=80',
          color: '#EA580C'
        }
      };
      return countryData[country] || { 
        flag: '🌍', 
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop&q=80',
        color: '#6B7280'
      };
    };

    return countries.map(country => {
      const countryInfo = getCountryData(country);
      return {
        name: country,
        slug: country.toLowerCase().replace(' ', '-'),
        count: animalOpportunities.filter(opp => opp.location.country === country).length,
        flag: countryInfo.flag,
        image: countryInfo.image,
        color: countryInfo.color
      };
    });
  }, [animalOpportunities]);

  // Create dynamic statistics object
  const statistics = React.useMemo(() => {
    return {
      projects: animalStats?.total_projects || 0,
      volunteers: animalStats?.total_volunteers || 0,
      countries: animalStats?.countries_count || 0,
      trending: animalStats?.trending || false
    };
  }, [animalStats]);

  return {
    animalName,
    animalCategory,
    opportunities: animalOpportunities,
    contentHub,
    availableCountries,
    statistics,
    isLoading: isLoading || statsLoading,
    error: queryError ? String(queryError) : (statsError ? String(statsError) : null)
  };
};

/**
 * Database Integration Status: ✅ COMPLETED
 * 
 * This hook now uses:
 * - React Query for data fetching and caching (10-minute staleTime)
 * - OrganizationService for database queries
 * - Organization to Opportunity adapter pattern for UI compatibility
 * - Proper loading and error states
 * 
 * Future Enhancements:
 * 1. Add animal_categories relationship to organizations table
 * 2. Implement proper animal filtering based on organization specializations
 * 3. Add animal-specific statistics from database
 * 4. Optimize queries with animal-specific indexes
 * 
 * Current Behavior:
 * - Fetches all organizations from database
 * - Converts to opportunity format for UI compatibility
 * - Uses static animal category data for navigation and metadata
 * - Maintains backward compatibility with existing components
 */