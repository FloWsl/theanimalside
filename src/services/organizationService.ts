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
   * Helper method to get organization UUID from slug
   * Used internally to convert slugs to UUIDs for database operations
   */
  private static async getOrganizationUUIDFromSlug(slug: string): Promise<string> {
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) handleSupabaseError(error);
    return data.id;
  }

  /**
   * Get organization details by slug for organization detail page
   * Used for: Organization detail page component
   */
  static async getOrganizationBySlug(slug: string): Promise<any> {
    try {
      // Get organization basic info
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (orgError) throw orgError;
      if (!organization) return null;

      // Get programs for this organization
      const { data: programs, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('status', 'active');

      if (programError) throw programError;

      // Transform to match legacy OrganizationDetail interface
      return {
        id: organization.slug,
        name: organization.name,
        slug: organization.slug,
        tagline: organization.tagline || 'Mission statement not provided',
        mission: organization.mission || 'Organization mission details not provided by the administrator.',
        logo: organization.logo,
        heroImage: organization.hero_image,
        website: organization.website,
        email: organization.email,
        phone: organization.phone,
        yearFounded: organization.year_founded || organization.establishment_year,
        verified: organization.verified,
        certifications: [],
        location: {
          country: organization.country,
          region: organization.region || organization.city || 'Region not specified',
          city: organization.city,
          address: organization.address,
          coordinates: organization.coordinates,
          timezone: organization.timezone || 'Local Time',
          nearestAirport: organization.nearest_airport || 'Airport information not provided'
        },
        programs: programs?.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          animalTypes: program.animal_types || [],
          isPrimary: program.is_primary || false,
          duration: {
            min: program.duration_min_weeks || 2,
            max: program.duration_max_weeks || 12
          },
          schedule: {
            daysPerWeek: program.days_per_week || 5,
            hoursPerDay: program.hours_per_day || 6,
            startTime: program.start_time || '08:00',
            endTime: program.end_time || '16:00',
            flexibility: program.schedule_flexibility || 'Schedule flexibility not specified'
          },
          typicalDay: program.typical_day || [
            'Daily schedule details not provided by organization'
          ],
          accomplishments: program.accomplishments || [],
          learningOutcomes: program.learning_outcomes || [],
          packingList: {
            essential: program.packing_essential || [],
            workGear: program.packing_work_gear || [],
            optional: program.packing_optional || []
          },
          requirements: program.requirements || ['Specific requirements not provided by organization'],
          included: program.included || [],
          notIncluded: program.not_included || [],
          cost: {
            amount: program.cost_amount || 0,
            currency: program.cost_currency || 'USD',
            period: program.cost_period || 'week',
            includes: program.included || ['Details of included items not provided by organization'],
            excludes: program.not_included || ['Details of excluded items not provided by organization']
          },
          costBreakdown: {
            programFee: program.cost_amount || 0,
            currency: program.cost_currency || 'USD',
            accommodation: 0,
            meals: 0,
            materials: 0,
            transport: 0
          }
        })) || [],
        animalTypes: programs?.length > 0 && programs[0].animal_types ? 
          programs[0].animal_types.map(type => ({ animalType: type })) : 
          [{ animalType: 'Wildlife' }],
        tags: [],
        socialMedia: {},
        gallery: {
          images: [] // No photos provided by organization
        },
        statistics: {
          animalsRescued: organization.total_volunteers_hosted || 0,
          yearsOperating: organization.establishment_year ? new Date().getFullYear() - organization.establishment_year : 0,
          volunteersHosted: organization.total_volunteers_hosted || 0,
          successStories: 0
        },
        ageRequirement: {
          min: 18,
          max: null
        },
        fitnessLevel: {
          level: 'not_specified',
          description: 'Fitness level requirements not provided by organization'
        },
        skillRequirements: {
          required: ['Skill requirements not specified by organization'],
          preferred: []
        },
        languages: ['Language requirements not specified by organization'],
        accommodation: {
          type: 'Accommodation details not provided by organization',
          amenities: ['Accommodation amenities not specified by organization'],
          rules: [],
          provided: true,
          description: 'Accommodation details not provided by organization'
        },
        mealPlan: {
          type: 'Three meals daily',
          details: []
        },
        meals: {
          provided: true,
          type: 'meal_details_not_provided',
          description: 'Meal details not provided by organization',
          dietaryOptions: ['Dietary options not specified by organization']
        },
        transportation: {
          airportPickup: true,
          localTransport: true,
          description: 'Transportation details not provided by organization'
        },
        internetAccess: {
          available: true,
          quality: 'Internet details not provided by organization',
          description: 'Internet access details not provided by organization'
        },
        climate: {
          type: 'Climate information not provided by organization',
          temperature: 'Temperature range not specified by organization',
          rainfall: 'Rainfall patterns not provided by organization',
          description: 'Climate details not provided by organization'
        },
        reviews: [], // Empty array for now
        testimonials: [], // No testimonials provided by organization 
        safetyInfo: {
          emergencyContact: organization.phone || '',
          medicalFacilities: [],
          safetyProtocols: []
        }
      };
    } catch (error) {
      console.error('Error fetching organization by slug:', error);
      return null;
    }
  }

  /**
   * Get complete overview data for a tab
   * Used for: OverviewTab component
   */
  static async getOverview(organizationSlug: string): Promise<OrganizationOverview> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
    const [organization, primaryProgram, featuredPhotos, statistics] = await Promise.all([
      this.getBasicInfo(organizationSlug), // This method already handles slugs
      this.getPrimaryProgram(organizationUUID),
      this.getFeaturedPhotos(organizationUUID),
      this.getStatistics(organizationUUID)
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
  static async getExperience(organizationSlug: string): Promise<OrganizationExperience> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select(`
        *,
        program_activities(*),
        program_schedule_items(*),
        program_learning_outcomes(*)
      `)
      .eq('organization_id', organizationUUID)
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
      .eq('organization_id', organizationUUID)
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
  static async getPractical(organizationSlug: string): Promise<OrganizationPractical> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
    const [
      accommodation,
      mealPlan,
      transportation,
      internetAccess,
      ageRequirement,
      skillRequirements,
      healthRequirements,
      languages,
      primaryProgram,
      programInclusions
    ] = await Promise.all([
      this.getAccommodation(organizationUUID),
      this.getMealPlan(organizationUUID),
      this.getTransportation(organizationUUID),
      this.getInternetAccess(organizationUUID),
      this.getAgeRequirement(organizationUUID),
      this.getSkillRequirements(organizationUUID),
      this.getHealthRequirements(organizationUUID),
      this.getLanguages(organizationUUID),
      this.getPrimaryProgram(organizationUUID),
      this.getProgramInclusions(organizationUUID)
    ]);

    return {
      accommodation: accommodation.accommodation,
      amenities: accommodation.amenities,
      accommodation_photos: accommodation.photos,
      meal_plan: mealPlan.mealPlan,
      dietary_options: mealPlan.dietaryOptions,
      transportation,
      internet_access: internetAccess,
      age_requirement: ageRequirement,
      skill_requirements: skillRequirements,
      health_requirements: healthRequirements,
      languages,
      primary_program: primaryProgram,
      program_inclusions: programInclusions
    };
  }

  /**
   * Get location data for a tab
   * Used for: LocationTab component
   */
  static async getLocation(organizationSlug: string): Promise<OrganizationLocation> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
    const [organization, transportation, activities, languages, primaryProgram] = await Promise.all([
      this.getBasicInfo(organizationSlug), // This method already handles slugs
      this.getTransportation(organizationUUID),
      this.getActivities(organizationUUID),
      this.getLanguages(organizationUUID),
      this.getPrimaryProgram(organizationUUID)
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
      activities,
      languages,
      primary_program: primaryProgram
    };
  }

  /**
   * Get stories data for a tab
   * Used for: StoriesTab component
   */
  static async getStories(organizationSlug: string, options: TestimonialFilters = {}): Promise<OrganizationStories> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
    const [testimonials, statistics, totalCount] = await Promise.all([
      this.getTestimonials(organizationUUID, { ...options, limit: options.limit || 20 }),
      this.getStatistics(organizationUUID),
      this.getTestimonialCount(organizationUUID)
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
  static async getEssentials(organizationSlug: string): Promise<OrganizationEssentials> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
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
      this.getBasicInfo(organizationSlug), // This method already handles slugs
      this.getPrimaryProgram(organizationUUID),
      this.getAccommodation(organizationUUID),
      this.getMealPlan(organizationUUID),
      this.getTransportation(organizationUUID),
      this.getInternetAccess(organizationUUID),
      this.getAgeRequirement(organizationUUID),
      this.getKeyRequirements(organizationUUID),
      this.getLanguages(organizationUUID)
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
  private static async getPrimaryProgram(organizationId: string): Promise<Program | null> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_primary', true)
      .eq('status', 'active')
      .single();

    // Handle case where no primary program exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - try to get first available program
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('programs')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('status', 'active')
          .limit(1)
          .single();
        
        if (fallbackError) {
          if (fallbackError.code === 'PGRST116') {
            // No programs at all - return null
            return null;
          }
          handleSupabaseError(fallbackError);
        }
        return fallbackData;
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no featured photos exist
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
    return data || [];
  }

  /**
   * Get accommodation with amenities and photos
   */
  private static async getAccommodation(organizationId: string) {
    const { data: accommodation, error: accError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    // Handle case where no accommodation data exists
    if (accError) {
      if (accError.code === 'PGRST116') {
        // No rows returned - return null accommodation
        return { accommodation: null, amenities: [], photos: [] };
      }
      handleSupabaseError(accError);
    }

    if (!accommodation) {
      return { accommodation: null, amenities: [], photos: [] };
    }

    const [amenitiesResult, photosResult] = await Promise.all([
      supabase
        .from('accommodation_amenities')
        .select('*')
        .eq('accommodation_id', accommodation.id)
        .order('order_index'),
      supabase
        .from('media_items')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('category', 'accommodation')
        .order('order_index')
    ]);

    // Handle amenities
    const { data: amenities, error: amenitiesError } = amenitiesResult;
    if (amenitiesError && amenitiesError.code !== 'PGRST116') {
      handleSupabaseError(amenitiesError);
    }

    // Handle photos
    const { data: photos, error: photosError } = photosResult;
    if (photosError && photosError.code !== 'PGRST116') {
      handleSupabaseError(photosError);
    }

    return { 
      accommodation, 
      amenities: amenities || [], 
      photos: photos || [] 
    };
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

    // Handle case where no meal plan data exists
    if (mealError) {
      if (mealError.code === 'PGRST116') {
        // No rows returned - return null meal plan
        return { mealPlan: null, dietaryOptions: [] };
      }
      handleSupabaseError(mealError);
    }

    if (!mealPlan) {
      return { mealPlan: null, dietaryOptions: [] };
    }

    const { data: dietaryOptions, error: dietaryError } = await supabase
      .from('dietary_options')
      .select('*')
      .eq('meal_plan_id', mealPlan.id)
      .order('order_index');

    // Handle case where no dietary options exist - this is normal
    if (dietaryError) {
      if (dietaryError.code === 'PGRST116') {
        // No rows returned - return empty dietary options array
        return { mealPlan, dietaryOptions: [] };
      }
      handleSupabaseError(dietaryError);
    }

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

    // Handle case where no transportation data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return null
        return null;
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no internet access data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return null
        return null;
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no age requirements data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return null
        return null;
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no skill requirements data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no key requirements data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no health requirements data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no languages data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no activities data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
    return data || [];
  }

  /**
   * Get program inclusions (support details)
   */
  private static async getProgramInclusions(organizationId: string) {
    const { data, error } = await supabase
      .from('program_inclusions')
      .select(`
        *,
        programs!inner(organization_id)
      `)
      .eq('programs.organization_id', organizationId)
      .order('order_index');

    // Handle case where no inclusions data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
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

    // Handle case where no statistics data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return null
        return null;
      }
      handleSupabaseError(error);
    }
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

  // ==================== PROGRAM-SPECIFIC CONTENT METHODS ====================

  /**
   * Get program-specific overview data
   * Used for: OverviewTab when specific program is selected
   */
  static async getProgramOverview(programId: string): Promise<OrganizationOverview> {
    // Get program-specific data
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select(`
        *,
        animal_types(*),
        program_activities(*),
        media_items(*)
      `)
      .eq('id', programId)
      .single();

    if (programError) handleSupabaseError(programError);

    // Get organization info for context
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', program.organization_id)
      .single();

    if (orgError) handleSupabaseError(orgError);

    return {
      organization,
      programs: [program], // Single program focus
      animal_types: program.animal_types || [],
      program_activities: program.program_activities || [],
      schedule_items: [] // Will be fetched separately if needed
    };
  }

  /**
   * Get program-specific experience data
   * Used for: ExperienceTab when specific program is selected
   */
  static async getProgramExperience(programId: string): Promise<OrganizationExperience> {
    const { data: program, error } = await supabase
      .from('programs')
      .select(`
        *,
        program_activities(*),
        program_schedule_items(*),
        program_inclusions(*),
        program_requirements(*)
      `)
      .eq('id', programId)
      .single();

    if (error) handleSupabaseError(error);

    return {
      programs: [program],
      animal_types: [], // Will be filled if needed
      program_activities: program.program_activities || [],
      schedule_items: program.program_schedule_items || []
    };
  }

  /**
   * Get program-specific practical data
   * Used for: PracticalTab when specific program is selected
   */
  static async getProgramPractical(programId: string): Promise<OrganizationPractical> {
    // Get program data
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single();

    if (programError) handleSupabaseError(programError);

    // Get organization-level practical info (accommodation, etc.)
    const organizationId = program.organization_id;
    
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
   * Get program-specific stories data
   * Used for: StoriesTab when specific program is selected
   */
  static async getProgramStories(programId: string, options: TestimonialFilters = {}): Promise<OrganizationStories> {
    // Get program-specific testimonials
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('program_id', programId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(options.limit || 4);

    if (testimonialsError) handleSupabaseError(testimonialsError);

    // Get organization statistics
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('organization_id')
      .eq('id', programId)
      .single();

    if (programError) handleSupabaseError(programError);

    const statistics = await this.getStatistics(program.organization_id);
    
    const totalCount = testimonials?.length || 0;

    return {
      testimonials: testimonials || [],
      statistics,
      total_testimonials: totalCount,
      has_more: false // Simple implementation for now
    };
  }

  // ==================== CONNECT TAB DATA ====================

  /**
   * Get connect data for a tab
   * Used for: ConnectTab component
   */
  static async getConnect(organizationSlug: string): Promise<any> {
    // Convert slug to UUID for database operations
    const organizationUUID = await this.getOrganizationUUIDFromSlug(organizationSlug);
    
    const [organization, applicationProcess, applicationSteps] = await Promise.all([
      this.getBasicInfo(organizationSlug), // This method already handles slugs
      this.getApplicationProcess(organizationUUID),
      this.getApplicationSteps(organizationUUID)
    ]);

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        email: organization.email,
        phone: organization.phone,
        website: organization.website
      },
      application_process: applicationProcess,
      application_steps: applicationSteps
    };
  }

  /**
   * Get application process information
   */
  private static async getApplicationProcess(organizationId: string) {
    const { data, error } = await supabase
      .from('application_processes')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    // Handle case where no application process data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return null
        return null;
      }
      handleSupabaseError(error);
    }
    return data;
  }

  /**
   * Get application steps
   */
  private static async getApplicationSteps(organizationId: string) {
    // First get the application process ID
    const applicationProcess = await this.getApplicationProcess(organizationId);
    
    if (!applicationProcess) {
      return [];
    }

    const { data, error } = await supabase
      .from('application_steps')
      .select('*')
      .eq('application_process_id', applicationProcess.id)
      .order('step_number');

    // Handle case where no application steps data exists
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - return empty array
        return [];
      }
      handleSupabaseError(error);
    }
    return data || [];
  }

  // ==================== CONTACT SUBMISSION ====================

  /**
   * Submit contact form
   */
  static async submitContactForm(data: {
    organizationSlug: string;
    programId?: string;
    name: string;
    email: string;
    country?: string;
    phone?: string;
    preferredProgram?: string;
    durationWeeks?: number;
    preferredStartDate?: string;
    message: string;
    source: 'questions' | 'application';
  }) {
    try {
      // Convert slug to UUID
      const organizationUUID = await this.getOrganizationUUIDFromSlug(data.organizationSlug);
      
      const { data: submission, error } = await supabase
        .from('contact_submissions')
        .insert({
          organization_id: organizationUUID,
          program_id: data.programId || null,
          name: data.name,
          email: data.email,
          country: data.country || null,
          phone: data.phone || null,
          preferred_program: data.preferredProgram || null,
          duration_weeks: data.durationWeeks || null,
          preferred_start_date: data.preferredStartDate || null,
          message: data.message,
          source: data.source,
          status: 'pending'
        })
        .select()
        .single();

      if (error) handleSupabaseError(error);
      return submission;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
}