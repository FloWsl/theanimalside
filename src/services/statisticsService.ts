// 📊 Statistics Service - Dynamic data from Supabase with caching
// Provides real-time statistics with React Query caching strategies

import { supabase, handleSupabaseError } from './supabase';

// ==================== INTERFACES ====================

export interface AnimalStatistics {
  animal_type: string;
  organizations_count: number;
  countries_count: number;
  total_volunteers: number;
  total_projects: number;
  trending: boolean;
}

export interface CountryStatistics {
  country: string;
  total_organizations: number;
  animal_types_count: number;
  total_volunteers: number;
  total_programs: number;
  animal_types: string[];
}

export interface GlobalStatistics {
  total_organizations: number;
  total_countries: number;
  total_animal_types: number;
  total_volunteers_hosted: number;
}

export interface CombinedStatistics {
  animal_type: string;
  country: string;
  organizations_count: number;
  total_volunteers: number;
  total_programs: number;
  avg_years_operating: number;
}

// ==================== STATISTICS SERVICE ====================

export class StatisticsService {
  
  /**
   * Get real-time animal type statistics
   * Uses materialized view for performance with live fallback
   */
  static async getAnimalStatistics(useCache: boolean = true): Promise<AnimalStatistics[]> {
    const tableName = useCache ? 'animal_stats_materialized' : 'animal_type_stats_live';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('total_volunteers', { ascending: false });

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get statistics for a specific animal type
   */
  static async getAnimalStatistic(animalType: string): Promise<AnimalStatistics | null> {
    const { data, error } = await supabase
      .from('animal_type_stats_live')
      .select('*')
      .eq('animal_type', animalType)
      .single();

    if (error && error.code !== 'PGRST116') handleSupabaseError(error);
    return data || null;
  }

  /**
   * Get real-time country statistics
   */
  static async getCountryStatistics(useCache: boolean = true): Promise<CountryStatistics[]> {
    const tableName = useCache ? 'country_stats_materialized' : 'country_stats_live';
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('total_volunteers', { ascending: false });

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get statistics for a specific country
   */
  static async getCountryStatistic(country: string): Promise<CountryStatistics | null> {
    const { data, error } = await supabase
      .from('country_stats_live')
      .select('*')
      .eq('country', country)
      .single();

    if (error && error.code !== 'PGRST116') handleSupabaseError(error);
    return data || null;
  }

  /**
   * Get global statistics
   */
  static async getGlobalStatistics(): Promise<GlobalStatistics> {
    const { data, error } = await supabase
      .from('global_stats_live')
      .select('metric_name, metric_value');

    if (error) handleSupabaseError(error);

    // Convert array to object
    const stats = (data || []).reduce((acc, item) => {
      acc[item.metric_name] = item.metric_value;
      return acc;
    }, {} as any);

    return {
      total_organizations: stats.total_organizations || 0,
      total_countries: stats.total_countries || 0, 
      total_animal_types: stats.total_animal_types || 0,
      total_volunteers_hosted: stats.total_volunteers_hosted || 0
    };
  }

  /**
   * Get combined animal-country statistics
   */
  static async getCombinedStatistics(
    animalType?: string, 
    country?: string
  ): Promise<CombinedStatistics[]> {
    let query = supabase
      .from('animal_country_stats_live')
      .select('*');

    if (animalType) {
      query = query.eq('animal_type', animalType);
    }

    if (country) {
      query = query.eq('country', country);
    }

    const { data, error } = await query.order('total_volunteers', { ascending: false });

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get specific animal-country combination statistics
   */
  static async getAnimalCountryStatistic(
    animalType: string, 
    country: string
  ): Promise<CombinedStatistics | null> {
    const { data, error } = await supabase
      .from('animal_country_stats_live')
      .select('*')
      .eq('animal_type', animalType)
      .eq('country', country)
      .single();

    if (error && error.code !== 'PGRST116') handleSupabaseError(error);
    return data || null;
  }

  /**
   * Refresh materialized view cache
   * Should be called periodically (e.g., every 10 minutes)
   */
  static async refreshStatisticsCache(): Promise<void> {
    const { error } = await supabase.rpc('refresh_statistics_cache');
    if (error) handleSupabaseError(error);
  }

  /**
   * Get cache freshness info
   */
  static async getCacheInfo() {
    const { data, error } = await supabase
      .from('animal_type_statistics')
      .select('last_updated')
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') handleSupabaseError(error);
    
    return {
      last_updated: data?.last_updated || null,
      is_stale: data?.last_updated ? 
        (Date.now() - new Date(data.last_updated).getTime()) > 10 * 60 * 1000 : 
        true
    };
  }
}

/**
 * React Query Integration Notes:
 * 
 * - Animal/Country stats: 5-minute cache (frequently viewed)
 * - Global stats: 10-minute cache (less frequent changes)
 * - Combined stats: 5-minute cache (search-heavy)
 * - Cache refresh: Background refresh every 10 minutes
 * 
 * Query Keys:
 * - ['statistics', 'animals'] - All animal statistics
 * - ['statistics', 'animals', animalType] - Specific animal
 * - ['statistics', 'countries'] - All country statistics  
 * - ['statistics', 'countries', country] - Specific country
 * - ['statistics', 'global'] - Global statistics
 * - ['statistics', 'combined', animalType, country] - Combined stats
 */