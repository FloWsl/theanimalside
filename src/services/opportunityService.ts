// 🗃️ Opportunity Service - Maps Programs to Opportunity-like interface
// Provides backward compatibility for opportunity-based listing pages

import { supabase, handleSupabaseError, getPaginationRange, type PaginationOptions } from './supabase';
import type { Organization, Program } from '../types/database';
import type { Opportunity } from '../types';

/**
 * Convert database image paths to appropriate URLs
 * Maps relative paths from database to actual image URLs
 */
function convertDatabaseImageToUrl(dbPath: string, primaryAnimalType?: string): string {
  // If it's already a full URL, return as-is
  if (dbPath.startsWith('http')) {
    return dbPath;
  }

  // Map animal types to appropriate Unsplash images
  const animalImageMap: Record<string, string> = {
    'Sea Turtles': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    'Marine Life': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
    'Elephants': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop',
    'Lions': 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&h=600&fit=crop',
    'Orangutans': 'https://images.unsplash.com/photo-1605306356426-bd8b8cf42046?w=800&h=600&fit=crop',
    'Primates': 'https://images.unsplash.com/photo-1605306356426-bd8b8cf42046?w=800&h=600&fit=crop',
    'Toucans': 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop',
    'Sloths': 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&h=600&fit=crop',
    'Big Cats': 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&h=600&fit=crop',
  };

  // Use animal-specific image if available
  if (primaryAnimalType && animalImageMap[primaryAnimalType]) {
    return animalImageMap[primaryAnimalType];
  }

  // Default wildlife image
  return 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop';
}

/**
 * Transform database Program + Organization into legacy Opportunity format
 * This maintains compatibility with existing opportunity-based components
 */
function transformProgramToOpportunity(program: Program & { 
  organization: Organization & {
    animal_types?: { animal_type: string }[];
    media_items?: { url: string, category: string }[];
    testimonials?: { rating: number }[];
    verified: boolean;
  };
  skill_requirements?: { skill: string }[];
}): Opportunity {
  // Extract animal types from the organization's animal_types
  const animalTypes = program.organization.animal_types?.map(at => at.animal_type) || [];
  
  // Calculate rating metrics from testimonials
  const testimonials = program.organization.testimonials || [];
  const reviewCount = testimonials.length;
  const avgRating = reviewCount > 0 
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / reviewCount
    : null;
  
  // Extract images from media items (hero and gallery categories)
  let images = program.organization.media_items?.filter(mi => mi.category === 'hero' || mi.category === 'gallery')
    .map(mi => convertDatabaseImageToUrl(mi.url, animalTypes[0])) || [];
  
  // Ensure at least one image is available
  if (images.length === 0) {
    images = [convertDatabaseImageToUrl('', animalTypes[0])];
  }
  
  // Extract requirements from skill requirements
  const requirements = program.skill_requirements?.map(sr => sr.skill) || [];
  
  // Default cost includes based on program type
  const defaultCostIncludes = program.cost_amount === 0 
    ? ['Accommodation', 'Meals', 'Training', 'Local transport']
    : ['Training', 'Support'];

  return {
    id: program.id,
    title: program.title,
    organization: program.organization.name,
    organizationSlug: program.organization.slug, // Add organization slug for routing
    location: {
      country: program.organization.country,
      city: program.organization.city,
      coordinates: program.organization.coordinates
    },
    animalTypes,
    duration: {
      min: program.duration_min_weeks,
      max: program.duration_max_weeks || null
    },
    description: program.description,
    requirements,
    cost: {
      amount: program.cost_amount,
      currency: program.cost_currency || 'USD',
      period: program.cost_period || 'week',
      includes: defaultCostIncludes
    },
    images,
    featured: program.organization.featured || false,
    datePosted: program.created_at,
    // Add organization metrics from database
    verified: program.organization.verified || false,
    rating: avgRating,
    reviewCount: reviewCount
  };
}

export class OpportunityService {
  /**
   * Get all active opportunities (programs) across organizations
   */
  static async getAllOpportunities(options: PaginationOptions = { page: 1, limit: 20 }): Promise<{
    data: Opportunity[];
    count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    const { from, to } = getPaginationRange(options.page, options.limit);

    const { data, error, count } = await supabase
      .from('programs')
      .select(`
        *,
        organization:organizations(*,
          animal_types(animal_type),
          media_items(url, category),
          testimonials(rating)
        )
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('organization.status', 'active')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);

    const opportunities = (data || []).map(transformProgramToOpportunity);

    return {
      data: opportunities,
      count: count || 0,
      page: options.page,
      limit: options.limit,
      has_more: (count || 0) > to + 1
    };
  }

  /**
   * Get opportunities by country
   */
  static async getOpportunitiesByCountry(country: string, options: PaginationOptions = { page: 1, limit: 20 }): Promise<{
    data: Opportunity[];
    count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    const { from, to } = getPaginationRange(options.page, options.limit);

    const { data, error, count } = await supabase
      .from('programs')
      .select(`
        *,
        organization:organizations(*,
          animal_types(animal_type),
          media_items(url, category),
          testimonials(rating)
        )
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('organization.status', 'active')
      .eq('organization.country', country)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);

    const opportunities = (data || []).map(transformProgramToOpportunity);

    return {
      data: opportunities,
      count: count || 0,
      page: options.page,
      limit: options.limit,
      has_more: (count || 0) > to + 1
    };
  }

  /**
   * Get opportunities by animal type
   * Note: This requires joining with animal_types table
   */
  static async getOpportunitiesByAnimal(animalType: string, options: PaginationOptions = { page: 1, limit: 20 }): Promise<{
    data: Opportunity[];
    count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    const { from, to } = getPaginationRange(options.page, options.limit);

    // First get programs that work with this animal type
    const { data, error, count } = await supabase
      .from('programs')
      .select(`
        *,
        organization:organizations(*),
        animal_types!inner(*)
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('organization.status', 'active')
      .ilike('animal_types.name', `%${animalType}%`)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);

    const opportunities = (data || []).map(transformProgramToOpportunity);

    return {
      data: opportunities,
      count: count || 0,
      page: options.page,
      limit: options.limit,
      has_more: (count || 0) > to + 1
    };
  }

  /**
   * Get opportunities by country and animal type
   */
  static async getOpportunitiesByCountryAndAnimal(
    country: string, 
    animalType: string, 
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<{
    data: Opportunity[];
    count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    const { from, to } = getPaginationRange(options.page, options.limit);

    const { data, error, count } = await supabase
      .from('programs')
      .select(`
        *,
        organization:organizations(*),
        animal_types!inner(*)
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('organization.status', 'active')
      .eq('organization.country', country)
      .ilike('animal_types.name', `%${animalType}%`)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error);

    const opportunities = (data || []).map(transformProgramToOpportunity);

    return {
      data: opportunities,
      count: count || 0,
      page: options.page,
      limit: options.limit,
      has_more: (count || 0) > to + 1
    };
  }

  /**
   * Search opportunities with flexible filters
   */
  static async searchOpportunities(filters: {
    country?: string;
    animalType?: string;
    featured?: boolean;
    search?: string;
  }, options: PaginationOptions = { page: 1, limit: 20 }): Promise<{
    data: Opportunity[];
    count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    const { from, to } = getPaginationRange(options.page, options.limit);

    let query = supabase
      .from('programs')
      .select(`
        *,
        organization:organizations(*,
          animal_types(animal_type),
          media_items(url, category),
          testimonials(rating)
        )
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('organization.status', 'active')
      .range(from, to);

    if (filters.country) {
      query = query.eq('organization.country', filters.country);
    }

    if (filters.featured) {
      query = query.eq('organization.featured', true);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    query = query.order('featured', { ascending: false })
                 .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) handleSupabaseError(error);

    let opportunities = (data || []).map(transformProgramToOpportunity);

    // Filter by animal type if specified (needs post-processing until we have better joins)
    if (filters.animalType) {
      // This is a simplified filter - in production we'd do this at the database level
      opportunities = opportunities.filter(opp => 
        opp.animalTypes.some(type => 
          type.toLowerCase().includes(filters.animalType!.toLowerCase())
        )
      );
    }

    return {
      data: opportunities,
      count: count || 0,
      page: options.page,
      limit: options.limit,
      has_more: (count || 0) > to + 1
    };
  }

  /**
   * Get opportunities with V2 filters support
   * Used for: V2 opportunities page with multi-select filters
   */
  static async getOpportunitiesV2(filters: {
    locations?: string[]; // Multi-select countries/cities
    animalTypes?: string[]; // Multi-select animal types
    costRange?: 'free' | 'under-500' | 'under-1000' | 'any';
    durationMin?: number;
    durationMax?: number;
    searchTerm?: string;
  }, options: PaginationOptions = { page: 1, limit: 100 }): Promise<{
    data: Opportunity[];
    count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }> {
    const { from, to } = getPaginationRange(options.page, options.limit);

    let query = supabase
      .from('programs')
      .select(`
        *,
        organization:organizations(*,
          animal_types(animal_type),
          media_items(url, category),
          testimonials(rating)
        )
      `, { count: 'exact' })
      .eq('status', 'active')
      .eq('organization.status', 'active')
      .range(from, to);

    // Multi-location filtering
    if (filters.locations && filters.locations.length > 0) {
      query = query.or(
        filters.locations.map(location => 
          `organization.country.ilike.%${location}%,organization.city.ilike.%${location}%`
        ).join(',')
      );
    }

    // Cost range filtering
    if (filters.costRange) {
      switch (filters.costRange) {
        case 'free':
          query = query.eq('cost_amount', 0);
          break;
        case 'under-500':
          query = query.or('cost_amount.eq.0,cost_amount.lte.500');
          break;
        case 'under-1000':
          query = query.or('cost_amount.eq.0,cost_amount.lte.1000');
          break;
        default:
          // 'any' - no filtering
          break;
      }
    }

    // Duration filtering
    if (filters.durationMin !== undefined) {
      query = query.gte('duration_min_weeks', filters.durationMin);
    }
    if (filters.durationMax !== undefined) {
      query = query.or(`duration_max_weeks.lte.${filters.durationMax},duration_max_weeks.is.null`);
    }

    // Search term filtering
    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,organization.name.ilike.%${filters.searchTerm}%`);
    }

    query = query.order('cost_amount', { ascending: true, nullsFirst: true }) // Free first
                 .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) handleSupabaseError(error);

    let opportunities = (data || []).map(transformProgramToOpportunity);

    // Client-side animal type filtering (until we optimize database joins)
    if (filters.animalTypes && filters.animalTypes.length > 0) {
      opportunities = opportunities.filter(opp => 
        filters.animalTypes!.some(filterType => 
          opp.animalTypes.some(oppType => 
            oppType.toLowerCase().includes(filterType.toLowerCase())
          )
        )
      );
    }

    return {
      data: opportunities,
      count: count || 0,
      page: options.page,
      limit: options.limit,
      has_more: (count || 0) > to + 1
    };
  }
}