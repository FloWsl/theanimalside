/**
 * Combined Experience Service - Story 5 Database Integration
 * 
 * Handles specialized country+animal content delivery from database.
 * Provides normalized interface for CombinedPage.tsx consumption.
 */

import { supabase } from './supabase';
import type { 
  CombinedExperienceContent,
  RegionalThreat,
  SeasonalChallenge,
  RelatedExperience,
  SuccessMetric
} from '../data/combinedExperiences';

// Database response types matching schema
interface DatabaseCombinedExperience {
  id: string;
  slug: string;
  country_slug: string;
  animal_slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  
  // Related tables
  regional_threats: DatabaseRegionalThreat[];
  seasonal_challenges: DatabaseSeasonalChallenge[];
  unique_approaches: DatabaseUniqueApproach[];
  related_experiences: DatabaseRelatedExperience[];
  ecosystem_connections: DatabaseEcosystemConnection[];
}

interface DatabaseRegionalThreat {
  id: string;
  threat_name: string;
  impact_level: 'Critical' | 'High' | 'Moderate';
  description: string;
  volunteer_role: string;
  urgency_level: 'Critical' | 'High' | 'Moderate';
  local_context: string;
  display_order: number;
}

interface DatabaseSeasonalChallenge {
  id: string;
  season: string;
  challenge_description: string;
  volunteer_adaptation: string;
  months_active: string;
  intensity_level: 'Low' | 'Medium' | 'High';
  display_order: number;
}

interface DatabaseUniqueApproach {
  id: string;
  conservation_method: string;
  volunteer_integration: string;
  what_makes_it_special: string;
  local_partnerships: string[];
  comparison_points: string;
  success_metrics: DatabaseSuccessMetric[];
}

interface DatabaseSuccessMetric {
  id: string;
  metric_name: string;
  metric_value: string;
  context_description: string;
  measurement_period: string;
  verification_source: string;
  display_order: number;
}

interface DatabaseRelatedExperience {
  id: string;
  title: string;
  experience_type: 'same_country' | 'same_animal' | 'related_ecosystem';
  target_url: string;
  description: string;
  connection_reason: string;
  category: 'same_country_other_animals' | 'same_animal_other_countries' | 'related_conservation_work';
  featured: boolean;
  priority_score: number;
  display_order: number;
}

interface DatabaseEcosystemConnection {
  id: string;
  connection_description: string;
  ecosystem_type: string;
  educational_value: string;
  scientific_accuracy_verified: boolean;
  source_citation: string;
  display_order: number;
}

export class CombinedExperienceService {
  /**
   * Get combined experience by country and animal slugs
   * @param countrySlug - Country identifier (e.g., "costa-rica")
   * @param animalSlug - Animal identifier (e.g., "sea-turtles") 
   * @returns Combined experience content or null if not found
   */
  async getCombinedExperience(
    countrySlug: string, 
    animalSlug: string
  ): Promise<CombinedExperienceContent | null> {
    try {
      const { data, error } = await supabase
        .from('combined_experiences')
        .select(`
          *,
          regional_threats (*),
          seasonal_challenges (*),
          unique_approaches (
            *,
            success_metrics (*)
          ),
          related_experiences (*),
          ecosystem_connections (*)
        `)
        .eq('country_slug', countrySlug)
        .eq('animal_slug', animalSlug)
        .eq('status', 'published')
        .order('display_order', { referencedTable: 'regional_threats' })
        .order('display_order', { referencedTable: 'seasonal_challenges' })
        .order('display_order', { referencedTable: 'related_experiences' })
        .order('display_order', { referencedTable: 'ecosystem_connections' })
        .single();

      if (error) {
        console.error('Error fetching combined experience:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Transform database response to frontend interface
      return this.transformDatabaseResponse(data);
    } catch (error) {
      console.error('Combined experience service error:', error);
      return null;
    }
  }

  /**
   * Get all published combined experiences
   * @returns Array of combined experience content
   */
  async getAllCombinedExperiences(): Promise<CombinedExperienceContent[]> {
    try {
      const { data, error } = await supabase
        .from('combined_experiences')
        .select(`
          *,
          regional_threats (*),
          seasonal_challenges (*),
          unique_approaches (
            *,
            success_metrics (*)
          ),
          related_experiences (*),
          ecosystem_connections (*)
        `)
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all combined experiences:', error);
        return [];
      }

      return (data || []).map(item => this.transformDatabaseResponse(item));
    } catch (error) {
      console.error('Combined experiences service error:', error);
      return [];
    }
  }

  /**
   * Get combined experiences by country
   * @param countrySlug - Country identifier
   * @returns Array of combined experiences for the country
   */
  async getCombinedExperiencesByCountry(countrySlug: string): Promise<CombinedExperienceContent[]> {
    try {
      const { data, error } = await supabase
        .from('combined_experiences')
        .select(`
          *,
          regional_threats (*),
          seasonal_challenges (*),
          unique_approaches (
            *,
            success_metrics (*)
          ),
          related_experiences (*),
          ecosystem_connections (*)
        `)
        .eq('country_slug', countrySlug)
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching country combined experiences:', error);
        return [];
      }

      return (data || []).map(item => this.transformDatabaseResponse(item));
    } catch (error) {
      console.error('Country combined experiences service error:', error);
      return [];
    }
  }

  /**
   * Transform database response to frontend interface
   * @param data - Database response
   * @returns Frontend-compatible combined experience content
   */
  private transformDatabaseResponse(data: DatabaseCombinedExperience): CombinedExperienceContent {
    // Transform regional threats
    const primaryThreats: RegionalThreat[] = data.regional_threats
      .sort((a, b) => a.display_order - b.display_order)
      .map(threat => ({
        threat: threat.threat_name,
        impact_level: threat.impact_level,
        description: threat.description,
        volunteer_role: threat.volunteer_role
      }));

    // Transform seasonal challenges
    const seasonalChallenges: SeasonalChallenge[] = data.seasonal_challenges
      .sort((a, b) => a.display_order - b.display_order)
      .map(challenge => ({
        season: challenge.season,
        challenge: challenge.challenge_description,
        volunteer_adaptation: challenge.volunteer_adaptation
      }));

    // Transform unique approach
    const uniqueApproach = data.unique_approaches[0];
    const successMetrics: SuccessMetric[] = uniqueApproach?.success_metrics
      ?.sort((a, b) => a.display_order - b.display_order)
      ?.map(metric => ({
        metric: metric.metric_name,
        value: metric.metric_value,
        context: metric.context_description
      })) || [];

    // Transform related experiences by category
    const relatedExperiences = data.related_experiences
      .sort((a, b) => a.display_order - b.display_order);

    const sameCountryOtherAnimals: RelatedExperience[] = relatedExperiences
      .filter(exp => exp.category === 'same_country_other_animals')
      .map(exp => ({
        title: exp.title,
        type: exp.experience_type,
        url: exp.target_url,
        description: exp.description,
        connection_reason: exp.connection_reason
      }));

    const sameAnimalOtherCountries: RelatedExperience[] = relatedExperiences
      .filter(exp => exp.category === 'same_animal_other_countries')
      .map(exp => ({
        title: exp.title,
        type: exp.experience_type,
        url: exp.target_url,
        description: exp.description,
        connection_reason: exp.connection_reason
      }));

    const relatedConservationWork: RelatedExperience[] = relatedExperiences
      .filter(exp => exp.category === 'related_conservation_work')
      .map(exp => ({
        title: exp.title,
        type: exp.experience_type,
        url: exp.target_url,
        description: exp.description,
        connection_reason: exp.connection_reason
      }));

    // Transform ecosystem connections
    const ecosystemConnections: string[] = data.ecosystem_connections
      .sort((a, b) => a.display_order - b.display_order)
      .map(connection => connection.connection_description);

    // Determine conservation urgency from threats
    const urgencyLevels = data.regional_threats.map(t => t.urgency_level);
    const conservationUrgency = urgencyLevels.includes('Critical') ? 'Critical' :
                               urgencyLevels.includes('High') ? 'High' : 'Moderate';

    return {
      id: data.slug,
      country: data.country_slug,
      animal: data.animal_slug,
      status: data.status,
      
      regionalThreats: {
        primary_threats: primaryThreats,
        seasonal_challenges: seasonalChallenges,
        local_context: data.description || '',
        conservation_urgency: conservationUrgency as 'Critical' | 'High' | 'Moderate'
      },
      
      uniqueApproach: {
        conservation_method: uniqueApproach?.conservation_method || '',
        volunteer_integration: uniqueApproach?.volunteer_integration || '',
        local_partnerships: uniqueApproach?.local_partnerships || [],
        success_metrics: successMetrics,
        what_makes_it_special: uniqueApproach?.what_makes_it_special || ''
      },
      
      complementaryExperiences: {
        same_country_other_animals: sameCountryOtherAnimals,
        same_animal_other_countries: sameAnimalOtherCountries,
        related_conservation_work: relatedConservationWork,
        ecosystem_connections: ecosystemConnections
      }
    };
  }

  /**
   * Check if a combined experience exists
   * @param countrySlug - Country identifier
   * @param animalSlug - Animal identifier
   * @returns Boolean indicating existence
   */
  async combinedExperienceExists(countrySlug: string, animalSlug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('combined_experiences')
        .select('id')
        .eq('country_slug', countrySlug)
        .eq('animal_slug', animalSlug)
        .eq('status', 'published')
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get combined experience metadata for SEO
   * @param countrySlug - Country identifier
   * @param animalSlug - Animal identifier
   * @returns SEO metadata or null
   */
  async getCombinedExperienceMetadata(countrySlug: string, animalSlug: string) {
    try {
      const { data, error } = await supabase
        .from('combined_experiences')
        .select('title, description, meta_title, meta_description, slug')
        .eq('country_slug', countrySlug)
        .eq('animal_slug', animalSlug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return null;
      }

      return {
        title: data.meta_title || data.title,
        description: data.meta_description || data.description,
        slug: data.slug
      };
    } catch (error) {
      console.error('Error fetching combined experience metadata:', error);
      return null;
    }
  }
}

// Export singleton instance
export const combinedExperienceService = new CombinedExperienceService();