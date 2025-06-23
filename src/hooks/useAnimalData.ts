/**
 * Animal Data Hook - Database Ready
 * 
 * Centralizes animal-specific data fetching for future database integration.
 * Currently uses static data but is structured for seamless Supabase migration.
 * 
 * Follows the same pattern as useCountryData for consistency.
 */

import React from 'react';
import { opportunities } from '../data/opportunities';
import { animalCategories } from '../data/animals';
import { getContentHub } from '../data/contentHubs';
import type { Opportunity, AnimalCategory } from '../types';
import type { ContentHubData } from '../data/contentHubs';

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
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching animal-specific data
 * 
 * @param animalSlug - Animal identifier (e.g., "lions", "sea-turtles")
 * @returns Animal data and loading states
 * 
 * Future: This will use React Query with Supabase:
 * - useQuery(['animal', animalSlug], () => supabase.from('animal_categories').select())
 * - useQuery(['opportunities', animalSlug], () => supabase.from('opportunities').select())
 * - useQuery(['content-hubs', animalSlug], () => supabase.from('content_hubs').select())
 */
export const useAnimalData = (animalSlug: string): AnimalDataResult => {
  // Future: Replace with React Query loading state
  const isLoading = false;
  const error = null;

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

  // Filter opportunities by animal type
  // Future: This will be a database query with proper indexing and JOIN operations
  const animalOpportunities = React.useMemo(() => {
    return opportunities.filter(opp => 
      opp.animalTypes.some(type => {
        const normalizedType = type.toLowerCase();
        const normalizedAnimal = animalName.toLowerCase();
        
        // Direct match
        if (normalizedType === normalizedAnimal) return true;
        
        // Improved partial matches for related terms  
        if (animalSlug === 'lions' && (normalizedType.includes('lion') || normalizedType.includes('big cat'))) return true;
        if (animalSlug === 'elephants' && normalizedType.includes('elephant')) return true;
        if (animalSlug === 'sea-turtles' && (normalizedType.includes('turtle') || normalizedType.includes('marine'))) return true;
        if (animalSlug === 'orangutans' && (normalizedType.includes('orangutan') || normalizedType.includes('primate'))) return true;
        if (animalSlug === 'primates' && normalizedType.includes('primate')) return true;
        if (animalSlug === 'marine' && normalizedType.includes('marine')) return true;
        if (animalSlug === 'big-cats' && (normalizedType.includes('lion') || normalizedType.includes('leopard') || normalizedType.includes('cheetah') || normalizedType.includes('cat'))) return true;
        
        return false;
      })
    );
  }, [animalSlug, animalName]);

  // Get content hub data for conservation information
  // Future: This will query content_hubs table with RLS policies
  const contentHub = React.useMemo(() => {
    return getContentHub(animalSlug);
  }, [animalSlug]);

  // Get unique countries where this animal type is found
  // Future: This will use a JOIN query across opportunities and countries tables
  const availableCountries = React.useMemo(() => {
    const countries = [...new Set(animalOpportunities.map(opp => opp.location.country))];
    
    const getCountryData = (country: string) => {
      const countryData: { [key: string]: { flag: string; image: string; color: string } } = {
        'Costa Rica': { 
          flag: '🇨🇷', 
          image: 'https://images.unsplash.com/photo-1502780402662-acc01917cf4b?w=1200&h=400&fit=crop&q=80',
          color: '#10B981' // Emerald green for rainforests
        },
        'Thailand': { 
          flag: '🇹🇭', 
          image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1200&h=400&fit=crop&q=80',
          color: '#F59E0B' // Warm golden for tropical temples
        },
        'South Africa': { 
          flag: '🇿🇦', 
          image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=400&fit=crop&q=80',
          color: '#DC2626' // Safari red for savannas
        },
        'Australia': { 
          flag: '🇦🇺', 
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&q=80',
          color: '#0EA5E9' // Ocean blue for coastal wildlife
        },
        'Kenya': { 
          flag: '🇰🇪', 
          image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&h=400&fit=crop&q=80',
          color: '#059669' // Safari green for Maasai Mara
        },
        'Indonesia': { 
          flag: '🇮🇩', 
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=400&fit=crop&q=80',
          color: '#7C3AED' // Tropical purple for rainforest depths
        },
        'Brazil': { 
          flag: '🇧🇷', 
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop&q=80',
          color: '#16A34A' // Amazon green
        },
        'Ecuador': { 
          flag: '🇪🇨', 
          image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&h=400&fit=crop&q=80',
          color: '#0284C7' // Galápagos blue
        },
        'Peru': { 
          flag: '🇵🇪', 
          image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=400&fit=crop&q=80',
          color: '#B45309' // Andean earth tones
        },
        'Tanzania': { 
          flag: '🇹🇿', 
          image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&h=400&fit=crop&q=80',
          color: '#DC2626' // Serengeti sunset
        },
        'India': { 
          flag: '🇮🇳', 
          image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&h=400&fit=crop&q=80',
          color: '#EA580C' // Tiger orange
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
        image: countryInfo.image, // Always use our curated placeholder images
        color: countryInfo.color
      };
    });
  }, [animalOpportunities]);

  return {
    animalName,
    animalCategory,
    opportunities: animalOpportunities,
    contentHub,
    availableCountries,
    isLoading,
    error
  };
};

/**
 * Database Migration Notes:
 * 
 * 1. Animal Categories Table:
 *    - id, name, slug, description, conservation_status, emoji, etc.
 * 
 * 2. Opportunities Table:
 *    - animal_category_ids (JSONB array for many-to-many)
 *    - animal_types (JSONB array - legacy compatibility)  
 *    - location (JSONB with country, city, coordinates)
 * 
 * 3. Content Hubs Table:
 *    - animal_category_id (foreign key)
 *    - conservation_content (JSONB)
 *    - cultural_context (JSONB)  
 *    - key_species (JSONB)
 * 
 * 4. Countries Table:
 *    - id, name, slug, flag_emoji, timezone, etc.
 * 
 * 5. Indexes:
 *    - opportunities.animal_category_ids (GIN index for JSONB)
 *    - opportunities.animal_types (GIN index for JSONB - legacy support)
 *    - content_hubs.animal_category_id
 *    - countries.slug
 * 
 * 6. RLS Policies:
 *    - Public read access for published content
 *    - Admin-only write access
 * 
 * 7. Query Optimization:
 *    - Materialized views for popular animal-country combinations
 *    - Cached aggregations for country counts and statistics
 */