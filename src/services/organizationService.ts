// 🗃️ Organization Service - Main API for organization data
// Provides clean interface for all organization-related data operations

import { supabase, handleSupabaseError, getPaginationRange, type PaginationOptions } from './supabase';
import type {
  Organization,
  Program,
  AnimalType,
  MediaItem,
  Testimonial,
  OrganizationOverview,
  OrganizationExperience,
  OrganizationPractical,
  OrganizationLocation,
  OrganizationStories,
  OrganizationEssentials,
  PaginatedResponse,
  OrganizationFilters,
  TestimonialFilters,
  MediaFilters
} from '../types/database';

export class OrganizationService {
  // ==================== MAIN ORGANIZATION DATA ====================

  /**
   * Get basic organization information by slug
   * Used for: Page routing, SEO metadata, basic info display
   */
  static async getBasicInfo(slug: string): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Get complete overview data for a tab
   * Used for: OverviewTab component
   */
  static async getOverview(organizationId: string): Promise<OrganizationOverview> {
    const [organization, primaryProgram, featuredPhotos, statistics] = await Promise.all([
      this.getBasicInfo(organizationId),
      this.getPrimaryProgram(organizationId),
      this.getFeaturedPhotos(organizationId),
      this.getStatistics(organizationId)
    ]);

    return {
      organization,
      primary_program: primaryProgram,
      featured_photos: featuredPhotos,
      statistics
    };
  }

  /**
   * Get experience data for a tab
   * Used for: ExperienceTab component
   */
  static async getExperience(organizationId: string): Promise<OrganizationExperience> {
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select(`
        *,
        program_activities(*),
        program_schedule_items(*)
      `)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .order('is_primary', { ascending: false });

    if (programsError) handleSupabaseError(programsError);

    const { data: animalTypes, error: animalsError } = await supabase
      .from('animal_types')
      .select(`
        *,
        animal_species(*),
        animal_care_activities(*),
        animal_success_stories(*)
      `)
      .eq('organization_id', organizationId)
      .order('order_index');

    if (animalsError) handleSupabaseError(animalsError);

    // Flatten the data to match the expected interface
    const program_activities = programs.flatMap(p => p.program_activities || []);
    const schedule_items = programs.flatMap(p => p.program_schedule_items || []);

    return {
      programs,
      animal_types: animalTypes,
      program_activities,
      schedule_items
    };
  }

  /**
   * Get practical information for a tab
   * Used for: PracticalTab component, EssentialInfoSidebar
   */
  static async getPractical(organizationId: string): Promise<OrganizationPractical> {
    const [
      accommodation,
      mealPlan,
      transportation,
      internetAccess,
      ageRequirement,
      skillRequirements,
      healthRequirements,
      languages
    ] = await Promise.all([
      this.getAccommodation(organizationId),
      this.getMealPlan(organizationId),
      this.getTransportation(organizationId),
      this.getInternetAccess(organizationId),
      this.getAgeRequirement(organizationId),
      this.getSkillRequirements(organizationId),
      this.getHealthRequirements(organizationId),
      this.getLanguages(organizationId)
    ]);

    return {
      accommodation: accommodation.accommodation,
      amenities: accommodation.amenities,
      meal_plan: mealPlan.mealPlan,
      dietary_options: mealPlan.dietaryOptions,
      transportation,
      internet_access: internetAccess,
      age_requirement: ageRequirement,
      skill_requirements: skillRequirements,
      health_requirements: healthRequirements,
      languages
    };
  }

  /**
   * Get location data for a tab
   * Used for: LocationTab component
   */
  static async getLocation(organizationId: string): Promise<OrganizationLocation> {
    const [organization, transportation, activities] = await Promise.all([
      this.getBasicInfo(organizationId),
      this.getTransportation(organizationId),
      this.getActivities(organizationId)
    ]);

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        country: organization.country,
        region: organization.region,
        city: organization.city,
        coordinates: organization.coordinates,
        timezone: organization.timezone,
        nearest_airport: organization.nearest_airport
      },
      transportation,
      activities
    };
  }

  /**
   * Get stories data for a tab
   * Used for: StoriesTab component
   */
  static async getStories(organizationId: string, options: TestimonialFilters = {}): Promise<OrganizationStories> {
    const [testimonials, statistics, totalCount] = await Promise.all([
      this.getTestimonials(organizationId, { ...options, limit: options.limit || 4 }),
      this.getStatistics(organizationId),
      this.getTestimonialCount(organizationId)
    ]);

    return {
      testimonials: testimonials.data,
      statistics,
      total_testimonials: totalCount,
      average_rating: statistics.average_rating || 0
    };
  }

  /**
   * Get essential info for sidebar
   * Used for: EssentialInfoSidebar component
   */
  static async getEssentials(organizationId: string): Promise<OrganizationEssentials> {
    const [
      organization,
      primaryProgram,
      accommodation,
      mealPlan,
      transportation,
      internetAccess,
      ageRequirement,
      keyRequirements,
      languages
    ] = await Promise.all([
      this.getBasicInfo(organizationId),
      this.getPrimaryProgram(organizationId),
      this.getAccommodation(organizationId),
      this.getMealPlan(organizationId),
      this.getTransportation(organizationId),
      this.getInternetAccess(organizationId),
      this.getAgeRequirement(organizationId),
      this.getKeyRequirements(organizationId),
      this.getLanguages(organizationId)
    ]);

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        email: organization.email,
        phone: organization.phone,
        website: organization.website
      },
      primary_program: primaryProgram,
      accommodation: accommodation.accommodation,
      meal_plan: mealPlan.mealPlan,
      transportation,
      internet_access: internetAccess,
      age_requirement: ageRequirement,
      key_requirements: keyRequirements,
      languages
    };
  }

  // ==================== SPECIALIZED DATA FETCHERS ====================

  /**
   * Get primary program (replaces programs[0] assumption)
   */
  private static async getPrimaryProgram(organizationId: string): Promise<Program> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_primary', true)
      .eq('status', 'active')
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Get featured photos for hero sections
   */
  private static async getFeaturedPhotos(organizationId: string, limit: number = 6): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('featured', true)
      .eq('item_type', 'image')
      .order('order_index')
      .limit(limit);

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get accommodation with amenities
   */
  private static async getAccommodation(organizationId: string) {
    const { data: accommodation, error: accError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (accError) handleSupabaseError(accError);

    const { data: amenities, error: amenitiesError } = await supabase
      .from('accommodation_amenities')
      .select('*')
      .eq('accommodation_id', accommodation.id)
      .order('order_index');

    if (amenitiesError) handleSupabaseError(amenitiesError);

    return { accommodation, amenities: amenities || [] };
  }

  /**
   * Get meal plan with dietary options
   */
  private static async getMealPlan(organizationId: string) {
    const { data: mealPlan, error: mealError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (mealError) handleSupabaseError(mealError);

    const { data: dietaryOptions, error: dietaryError } = await supabase
      .from('dietary_options')
      .select('*')
      .eq('meal_plan_id', mealPlan.id)
      .order('order_index');

    if (dietaryError) handleSupabaseError(dietaryError);

    return { mealPlan, dietaryOptions: dietaryOptions || [] };
  }

  /**
   * Get transportation info
   */
  private static async getTransportation(organizationId: string) {
    const { data, error } = await supabase
      .from('transportation')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Get internet access info
   */
  private static async getInternetAccess(organizationId: string) {
    const { data, error } = await supabase
      .from('internet_access')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Get age requirements
   */
  private static async getAgeRequirement(organizationId: string) {
    const { data, error } = await supabase
      .from('age_requirements')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Get all skill requirements
   */
  private static async getSkillRequirements(organizationId: string) {
    const { data, error } = await supabase
      .from('skill_requirements')
      .select('*')
      .eq('organization_id', organizationId)
      .order('order_index');

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get only required skill requirements (for sidebar)
   */
  private static async getKeyRequirements(organizationId: string) {
    const { data, error } = await supabase
      .from('skill_requirements')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('requirement_type', 'required')
      .order('order_index')
      .limit(3);

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get health requirements
   */
  private static async getHealthRequirements(organizationId: string) {
    const { data, error } = await supabase
      .from('health_requirements')
      .select('*')
      .eq('organization_id', organizationId)
      .order('order_index');

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get supported languages
   */
  private static async getLanguages(organizationId: string) {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('organization_id', organizationId)
      .order('order_index');

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get program activities
   */
  private static async getActivities(organizationId: string) {
    const { data, error } = await supabase
      .from('program_activities')
      .select(`
        *,
        programs!inner(organization_id)
      `)
      .eq('programs.organization_id', organizationId)
      .order('order_index');

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get organization statistics
   */
  private static async getStatistics(organizationId: string) {
    const { data, error } = await supabase
      .from('organization_statistics')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  // ==================== TESTIMONIALS & REVIEWS ====================

  /**
   * Get paginated testimonials
   */
  static async getTestimonials(
    organizationId: string, 
    filters: TestimonialFilters = {}
  ): Promise<PaginatedResponse<Testimonial>> {
    const { page = 1, limit = 10 } = filters;
    const { from, to } = getPaginationRange(page, limit);

    let query = supabase
      .from('testimonials')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .eq('moderation_status', 'approved')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (filters.min_rating) {
      query = query.gte('rating', filters.min_rating);
    }

    if (filters.verified_only) {
      query = query.eq('verified', true);
    }

    if (filters.featured_only) {
      query = query.eq('featured', true);
    }

    if (filters.program_id) {
      query = query.eq('program_id', filters.program_id);
    }

    const { data, error, count } = await query;

    if (error) handleSupabaseError(error);

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
      has_more: (count || 0) > to + 1
    };
  }

  /**
   * Get total testimonial count
   */
  private static async getTestimonialCount(organizationId: string): Promise<number> {
    const { count, error } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('moderation_status', 'approved');

    if (error) handleSupabaseError(error);
    return count || 0;
  }

  // ==================== MEDIA & PHOTOS ====================

  /**
   * Get media items with filtering
   */
  static async getMedia(
    organizationId: string,
    filters: MediaFilters = {}
  ): Promise<PaginatedResponse<MediaItem>> {
    const { page = 1, limit = 20 } = filters;
    const { from, to } = getPaginationRange(page, limit);

    let query = supabase
      .from('media_items')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .range(from, to)
      .order('order_index');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }

    if (filters.featured_only) {
      query = query.eq('featured', true);
    }

    const { data, error, count } = await query;

    if (error) handleSupabaseError(error);

    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
      has_more: (count || 0) > to + 1
    };
  }

  // ==================== SEARCH & FILTERING ====================

  /**
   * Search organizations with filters
   */
  static async searchOrganizations(
    filters: OrganizationFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 12 }
  ): Promise<PaginatedResponse<Organization>> {
    const { from, to } = getPaginationRange(pagination.page, pagination.limit);

    let query = supabase
      .from('organization_overview')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .range(from, to)
      .order('featured', { ascending: false })
      .order('name');

    if (filters.country) {
      query = query.eq('country', filters.country);
    }

    if (filters.region) {
      query = query.eq('region', filters.region);
    }

    if (filters.verified_only) {
      query = query.eq('verified', true);
    }

    if (filters.featured_only) {
      query = query.eq('featured', true);
    }

    const { data, error, count } = await query;

    if (error) handleSupabaseError(error);

    return {
      data: data || [],
      count: count || 0,
      page: pagination.page,
      limit: pagination.limit,
      has_more: (count || 0) > to + 1
    };
  }
}